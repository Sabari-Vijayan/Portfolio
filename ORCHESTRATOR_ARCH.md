# Portfolio AI: Dual-LLM Orchestrator Architecture

This document outlines the decision-making architecture for the Portfolio Intelligence chat system.

## 1. Overview
The system uses a **Router-Generator** pattern to provide accurate, context-aware responses while maintaining high performance. This replaces simple keyword-based (regex) routing with semantic understanding.

## 2. The Workflow

### Step 1: The Router (Semantic Decision)
- **Model:** `gemini-2.5-flash-lite` (JSON Mode)
- **Input:** User's raw query.
- **Task:** Analyze the query and output a structured JSON object.
- **Output Schema:**
  ```json
  {
    "needs": ["bio", "experience", "projects", "blogs"], 
    "githubFetch": ["repo1", "repo2"]
  }
  ```

### Step 2: Data Aggregation (Context Building)
The system dynamically builds the AI's "short-term memory" based on the Router's decision:
- **Static Contexts:** Loads `bio.ts`, `experience.ts`, `projects.ts`, or `blogs.ts` as requested.
- **Real-time Fetch:** If repositories are identified (e.g., "HSAV", "TinyGoose"), the system concurrently calls the GitHub API for each to get current stars, forks, and activity.

### Step 3: The Generator (Response Generation)
- **Model:** `gemini-2.5-flash-lite` (Streaming Mode)
- **Input:** Aggregated context + User query.
- **Task:** Formulate a professional, friendly, and conversational response based *strictly* on the provided data. It avoids blunt redirections and weaves links naturally into the conversation.

## 3. Comparison with Legacy System

| Feature | Legacy (Regex) | Orchestrator (Dual-LLM v2) |
| :--- | :--- | :--- |
| **Routing** | Brittle keyword matching | Semantic intent understanding |
| **Accuracy** | Misses synonyms/complex intent | High; understands context |
| **Data Fetch** | Scans all repos for name match | Specifically targets multiple requested repos concurrently |
| **Tone** | Robotic / Blunt | Conversational & Friendly |
| **Redirection** | Hardcoded page links | Context-aware, natural mentions |

## 4. Maintenance
To add a new data source (e.g., "Publications"):
1. Create `api/data/publications.ts`.
2. Update the `routerPrompt` in `api/chat.ts` to include "publications" as an available context.
3. Add the conditional load logic in `api/chat.ts`.
