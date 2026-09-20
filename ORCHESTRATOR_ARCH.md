# Portfolio AI: Jev-Powered Orchestrator Architecture

This document outlines the decision-making architecture for the Portfolio Intelligence chat system. The current design is **Jev Router → Gemini Generator** — a typed decision model fronts a generative model. It replaces the previous Gemini JSON-mode router.

## 1. Overview

```
User Query → [Jev Decisions] → Context Build → GitHub Live Fetch → [Gemini Generator Stream] → NDJSON Response
                │  via OpenRouter              │                    │ via Google AI
                │  ~typesafe/jev-latest        │                    │ gemini-3.5-flash-lite
                └─ fallback Gemini JSON ───────┘
```

*   **Pattern:** **Router-Generator**. The router is *narrow and typed* (classification only); the generator is *open-ended* (natural language). Code owns the workflow.
*   **Why Jev:** `~typesafe/jev-latest` (served by OpenRouter, `@openrouter/sdk` `alpha.decisions.create`) answers **narrow, typed questions** about a `state` with calibrated probabilities/scores — no fragile `JSON.parse`, no free-form LLM output, faster/cheaper than a full Gemini call for routing.

## 2. What Jev Is

Jev is a **Typesafe Decisions** model. You give it:

```ts
import { OpenRouter } from "@openrouter/sdk";
const openrouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

const decision = await openrouter.alpha.decisions.create({
  decisionsRequest: {
    model: "~typesafe/jev-latest",
    state: "Help! My payouts have been failing for 3 days.", // here: trimmed user query
    questions: {
      is_urgent: {
        type: "noul",                                         // 0 (no) → 1 (yes) probability
        instructions: "Does this message convey urgency?",
        criteria: { true: "Explicitly time-sensitive", false: "No urgency" }
      },
      department: {
        type: "choice",                                       // single selection + probabilities
        instructions: "Which team should handle this?",
        criteria: { billing: "Payments, ...", technical: "Bugs, ..." }
      },
      frustration: {
        type: "score",                                        // ordered score + distribution
        instructions: "How frustrated is the customer?",
        criteria: ["Calm", "Frustrated", "Very angry"]
      }
    }
  }
});
// decision.answers.is_urgent.noul, decision.answers.department.choice, etc.
```

**In this project `api/chat.ts:62-180` `buildJevQuestions()`, `state` = `trimmedQuery` (≤2000 chars).**

### Question Types

| Type | When used | What it returns (`decision.answers[q]`) |
| :--- | :--- | :--- |
| `noul` | Binary yes/no — context routing, repo detection, guards | `{ type:"noul", noul: 0.0–1.0 }` probability that `true` criteria holds |
| `score` | Ordered intensity — frustration, complexity | `{ type:"score", score: 0..N-1, probabilities:{0:0.8,…}, confidence }` |
| `choice` | (Not used for routing here; available) | `{ type:"choice", choice:"key", probabilities:{billing:0.7,…} }` |

Every question has `instructions` (plain string) + `criteria` (`true`/`false` for `noul`, array of labels for `score`, key→description for `choice`). Jev is **fuzzy/semantic** by instruction — e.g., repo questions count typos/partial names/descriptions.

### What Jev Produces

`decision` (`DecisionsResponse`):

```ts
{
  id: "…",
  model: "~typesafe/jev-latest",
  provider: "…",
  usage: { inputTokens, outputTokens, cost },
  answers: {
    needs_bio: { type:"noul", noul: 0.97 },
    needs_projects: { type:"noul", noul: 0.12 },
    repo_tinkerfetch: { type:"noul", noul: 0.89 },
    is_urgent: { type:"noul", noul: 0.04 },
    frustration: { type:"score", score: 0, probabilities:{0:1,1:0,2:0} },
    complexity: { type:"score", score: 0.78, … },
    // … 16 questions total
  }
}
```

We map this to our internal shape `api/chat.ts:51-66`:

```ts
type RouterDecision = { needs: string[]; githubFetch: string[]; }
type JevSignals = {
  is_off_topic_noul?, is_greeting_noul?, is_urgent_noul?, is_followup_noul?,
  frustration_score?, frustration_probs?, complexity_score?, repo_nouls?
}
```

## 3. The Workflow

### Step 1: The Router — Jev Decisions (`api/chat.ts:285-480`)

**Questions asked (16 total — `buildJevQuestions()`):**

**Context routing (multi-label `noul`, threshold `NEEDS_THRESHOLD=0.55`):**

| Key | Fires when query is about… |
| :--- | :--- |
| `needs_bio` | Identity, role, tech stack, philosophy, location (`tell me about yourself`, `stack`, `skills`) |
| `needs_experience` | Education, B.Tech, RIT Kottayam, TinkerHub, Campus Lead, timeline |
| `needs_projects` | Projects, repos, builds, GitHub, `what did you build` |
| `needs_blogs` | Blogs, Medium, articles, tutorials, writing |

→ `needs.push(key)` if `noul > 0.55`. If a repo is detected, `projects` is auto-added even if its `noul` is just under threshold.

**Guards / scope (`noul`):**

| Key | Purpose | Threshold side-effect |
| :--- | :--- | :--- |
| `is_off_topic` | Unrelated generic topics (weather, math…) vs portfolio | `>0.80` injects `CLASSIFIER FLAG: OFF-TOPIC` into system prompt; still answers by steering back |
| `is_greeting` | Bare `hi/thanks` without information need | `>0.75` adds `greeting` tone guidance (brief, warm) |
| `is_followup` | Vague `tell me more / and?` | `>0.65` adds follow-up guidance (infer/clarify) |

**Affect / tone steering (`noul` + `score`) — not used for routing, only for generator prompt:**

| Key | Type | Levels |
| :--- | :--- | :--- |
| `is_urgent` | `noul` | `>0.70` → “Lead with direct answer FIRST, concise” |
| `frustration` | `score` | `0 Calm` / `1 Mildly frustrated` / `2 Very angry` → `≥1.5` empathetic + solution-oriented |
| `complexity` | `score` | `0 Simple lookup` / `1 Multi-part list` / `2 Deep synthesis` → `≥1.5` headings/bullets, `0` brief |

**Per-repo fuzzy detection (`noul`, `REPO_THRESHOLD=0.60`):** One `noul` per key in `repoMapping` (`src/data/projects.ts:4-15` — 10 repos). Key `repo_<sanitized>` e.g., `repo_tinkerfetch`, `repo_cartinder`. Instructions include repo description and explicit fuzzy hint:

> `Does query semantically refer to "tinkerfetch" (terminal-based TinkerHub themed system info…)? Be FUZZY: count typos, partial names, synonyms, descriptions (e.g., "terminal fetch tool" → tinkerfetch, "car swipe app" → cartinder, "exam cheating detector" → neurobots-hackathon-2026).`

→ `githubFetch.push(key)` if `noul > 0.60`. `repo_nouls` retained for debug.

**Decision logic:**

```ts
const hasAnySignal = needs.length>0 || githubFetch.length>0 || max(needs_nouls)>0.35;
if (hasAnySignal) routerDecision={needs, githubFetch}, jevUsed=true
else throw "Jev low confidence" → fallback Gemini JSON
```

`jevDebug` payload (when `DEBUG_JEV=true`) captures `rawAnswers`, `compactAnswers`, `jevSignals`, `routerDecision`, `hasAnySignal`, `maxNeed`, `timingMs`, `usage`, `provider` — streamed to client as `debug` field.

**Fallback — Gemini JSON (`api/chat.ts:187-216`, `449-479`):** If `OPENROUTER_API_KEY` missing, Jev throws, or low confidence, we call:

```ts
genAI.getGenerativeModel({ model:"gemini-3.5-flash-lite", generationConfig:{responseMimeType:"application/json"} })
```

with prompt `Available Contexts: bio/experience/projects/blogs` + `Available Repositories: ${Object.keys(repoMapping).join(", ")}` → `{"needs":[…],"githubFetch":[…]} → `JSON.parse`. Final fallback if that also fails: `{needs:["bio"], githubFetch:[]}`. `routerSource: "jev" | "gemini-fallback"` and `jevUsed` flag are logged/streamed.

### Step 2: Data Aggregation (Context Building) (`api/chat.ts:491-533`)

Based on `routerDecision`:

- **Static contexts:** `if (needs.includes("bio")) relevantContext+=bioData` etc. (`src/data/bio.ts`, `experience.ts`, `projects.ts:projectsData`, `blogs.ts:blogsData`). Fallback to `bioData` if empty.
- **Real-time fetch:** `validRepos = githubFetch.filter(k=>repoMapping[k.toLowerCase()])` → `Promise.all(getGithubInfo)` → `https://api.github.com/repos/${slug}` (unauthenticated, 60/hr) → appended as `REAL-TIME GITHUB DATA FOR ${repo}:\n${JSON.stringify(info)}`. Each repo’s stars/forks/updated_at/description/language are injected so generator can say `According to live data, X stars`.

### Step 3: The Generator (Response Generation) (`api/chat.ts:535-603`)

- **Model:** `gemini-3.5-flash-lite` (streaming, via `GoogleGenerativeAI`, `generateContentStream()`).
- **Input:** `systemPrompt + "\n\nUser Question: " + trimmedQuery`. System prompt includes:
  - Persona: professional digital representative for Sabari, friendly/conversational, integrates `[/portfolio]`/`[/experience]` links naturally, scope-restricted (off-topic → steer back).
  - `CONVERSATIONAL STATE`: `Router: Jev | needs:[…] | urgency/frustration/complexity` or `Router: Gemini fallback`.
  - `affectGuidance` derived from Jev signals (urgent/frustrated/complex/greeting/followup).
  - `KNOWLEDGE CONTEXT`: `relevantContext` + `githubDetails`.
  - Instructions: use context/live data, explain why/how.
- **Output:** `ReadableStream` NDJSON (`application/x-ndjson`): first line `{source:"GITHUB"|"AI", router:"jev"|"gemini-fallback", debug?:{…}}`, subsequent `{text: chunk}`. Frontend (`src/pages/About.tsx:15-135` `HashRouter`, NDJSON parser, word-by-word typewriter 25ms/word, source indicator dot blue=GITHUB green=AI) renders it.

## 4. Comparison

| Feature | Legacy (Regex) | Dual-LLM v2 (Gemini JSON) | Current (Jev v3) |
| :--- | :--- | :--- | :--- |
| **Router** | Keyword regex | `gemini-2.5-flash-lite` JSON | `~typesafe/jev-latest` typed decisions (OpenRouter) |
| **Accuracy** | Brittle, misses synonyms | Semantic JSON (fragile parse) | Typed `noul/score` with calibrated probs, fuzzy by instruction |
| **Cost/Latency** | N/A | Gemini call for routing (~400-800ms) | Jev call smaller/faster (~80-150ms) + no JSON parse |
| **Signals** | Needs only | Needs + githubFetch | Needs + githubFetch + off_topic/greeting/followup + urgency/frustration/complexity (tone steering) |
| **Repo detection** | Scan all names | Gemini picks from list | Per-repo `noul` fuzzy (typos/partial/descriptions auto) |
| **Fallback** | None | None | Gemini JSON fallback if Jev skips/fails/low-confidence; bio fallback if both fail |
| **Observability** | None | None | `DEBUG_JEV` verbose logs (server terminal + browser console + first NDJSON `debug`); `router` field |

## 5. Maintenance

### Adding a new data source (e.g., "Publications")
1. Create `src/data/publications.ts` exporting `publicationsData` (and list if needed).
2. In `api/chat.ts:68-163` `buildJevQuestions()`: add `needs_publications: {type:"noul", instructions:"Does query ask about publications…", criteria:{true:"…", false:"…"}}`.
3. In `api/chat.ts:355-364` add `if (n_pub > NEEDS_THRESHOLD) needs.push("publications")`.
4. In `api/chat.ts:491-498` add `if (needs.includes("publications")) relevantContext+=publicationsData`.
5. No change to GitHub fetch logic.

### Adding a new repo
- Add entry to `repoMapping`/`projectList` in `src/data/projects.ts` (auto-generated by `.github/workflows/update-projects.yml`). `buildJevQuestions()` loops `Object.keys(repoMapping)` — repo `noul` is generated dynamically, so no manual question needed. Optionally add a richer `repoDescriptions[key]` hint in `api/chat.ts:70-81` for better fuzzy matching.

### Tuning thresholds
- `api/chat.ts:299-302`:
  - `NEEDS_THRESHOLD=0.55` — lower → more recall (more context), higher → more precision.
  - `REPO_THRESHOLD=0.60` — lower catches paraphrases (`car swipe app`) but may false-trigger on generic `portfolio`.
  - `OFF_TOPIC_THRESHOLD=0.80` — high to avoid mis-flagging portfolio greetings.
  - Low-confidence guard `maxNeed>0.35` — if all `needs` below this, fallback to Gemini rather than empty.
- Watch `vercel dev` logs: `[JEV] raw answers` + `[JEV] compact view` + `[JEV] → DECISION` + `vercel logs` in prod. Adjust after ~20 queries.

### Env / Deployment
- **Required:** `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) — Vercel Dashboard → Env Vars; also `OPENROUTER_API_KEY` for Jev. Local dev: mirror both in `.env` (gitignored, `/.gitignore` ` .env`/` .env*.local`), or `vercel env pull .env.local`.
- Local dev: `vercel dev` (runs `api/chat.ts` Edge) + frontend `import.meta.env.DEV ? '/api/chat' : 'https://portfolio-liard-alpha-anenqdv7wr.vercel.app/api/chat'` (`src/pages/About.tsx:5-6`). If `OPENROUTER_API_KEY` missing, router logs `⊘ No OPENROUTER_API_KEY → skipping Jev` and uses Gemini fallback.

### Debug mode — remove before prod
- `api/chat.ts:12-16` `DEBUG_JEV=true`: when true, server prints `━━━━━━━━━━ [JEV DEBUG]` blocks + `raw answers/compact/DECISION/repo_nouls/final routing` to terminal (local) / Vercel Logs (prod), and injects `debug:{jev, jevSignals, routerDecision, …}` into first NDJSON chunk. `About.tsx:15-135` logs that `debug` to browser console (`[JEV] router:…`, `routerDecision`, `jevSignals`, `full jev payload`). In production set `DEBUG_JEV=false` or delete the `DEBUG_JEV` blocks and the `if (data.debug)` block in `About.tsx`, then `vercel`/`npm run deploy`.
