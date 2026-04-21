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
    "needs": ["bio", "experience", "projects"], 
    "githubFetch": "repo_name_or_null"
  }
  ```

### Step 2: Data Aggregation (Context Building)
The system dynamically builds the AI's "short-term memory" based on the Router's decision:
- **Static Contexts:** Loads `bio.ts`, `experience.ts`, or `projects.ts` as requested.
- **Real-time Fetch:** If a specific repo is identified (e.g., "SmartPlace"), the system calls the GitHub API to get current stars, forks, and activity.

### Step 3: The Generator (Response Generation)
- **Model:** `gemini-2.5-flash-lite` (Streaming Mode)
- **Input:** Aggregated context + User query.
- **Task:** Formulate a professional response based *strictly* on the provided data.

## 3. Comparison with Legacy System

| Feature | Legacy (Regex) | Orchestrator (Dual-LLM) |
| :--- | :--- | :--- |
| **Routing** | Brittle keyword matching | Semantic intent understanding |
| **Accuracy** | Misses synonyms/complex intent | High; understands context |
| **Maintenance** | Manual regex updates needed | Just update the Router's prompt |
| **Data Fetch** | Scans all repos for name match | Specifically targets requested repo |

## 4. Maintenance
To add a new data source (e.g., "Publications"):
1. Create `api/data/publications.ts`.
2. Update the `routerPrompt` in `api/chat.ts` to include "publications" as an available context.
3. Add the conditional load logic in `api/chat.ts`.
