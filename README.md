# Active Intelligence — Continuous Agentic Learning Loop

Strategy and an interactive prototype for the **Active Intelligence** initiative: a marketing-AI architecture where **scoring models ground the language model**, so every recommendation traces to measured performance across three semantic context layers rather than a generic web best-practice.

## Live prototype

The prototype is a self-contained static site (no build step, no dependencies) under [`prototype/`](prototype/). The root `index.html` redirects to it.

| Screen | File | What it shows |
|---|---|---|
| Home | `prototype/index.html` | Proactive campaigns surfaced from telemetry, each grounded by semantic-layer scores ("Why this?") |
| Review & launch | `prototype/builder.html` | A grounded campaign pre-filled (goal, cohort, channel mix, creative) with the reasoning panel beside it |
| Active Intelligence report | `prototype/reports.html` | Freeform AI overview drilling into the Content / Campaign / Individual layers with model evidence |
| Automate for me | `prototype/automations.html` | An agent-drafted retention journey where every node ties to a layer score |
| About | `prototype/about.html` | Overview, the architecture diagram, and links to the strategy docs |

On first visit a **guided product tour** auto-starts, walking through what's new on each page ("Step x of y", Next/Back/Skip) — it carries you from the home feed into Reports, the Builder, and Automations. Replay it anytime with the **"✨ What's new"** pill (bottom-left).

Use the **role switch** (top-right: Marketing Mgr / Executive / Analyst) and the **notification bell** — both re-frame the experience per audience, and the choice persists across pages.

## Publish on GitHub Pages

1. Push this directory to a GitHub repository.
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch **`main`** and folder **`/ (root)`**, then **Save**.
5. After a minute, your site is live at `https://<your-username>.github.io/<repo-name>/` — the root redirects into the prototype.

> Serving from the repo root (not `/docs`) lets the About page link to the strategy documents that live alongside this README.

To preview locally: `python3 -m http.server` from this directory, then open `http://localhost:8000`.

## Strategy documents

- `Active_Intelligence_Strategic_Blueprint_v2.docx` — the full memo (semantic layers, cross-layer inferencing, the hybrid LLM×ML "scores ground the LLM" thesis, tenant→industry→global modeling, phased rollout).
- `Active_Intelligence_Architecture.png` / `.svg` — the revised block diagram.
- `active_intelligence_flywheel.html` — an earlier single-screen Flywheel loop walkthrough.

## File tree

```
.
├── index.html                  # redirect → prototype/
├── README.md
├── Active_Intelligence_Strategic_Blueprint_v2.docx
├── Active_Intelligence_Architecture.png / .svg
├── active_intelligence_flywheel.html
└── prototype/
    ├── index.html              # Home
    ├── reports.html            # Active Intelligence report
    ├── builder.html            # Review & launch
    ├── automations.html        # Automate for me
    ├── about.html              # Overview
    └── assets/
        ├── app.css             # shared styles
        ├── shell.js            # nav rail, topbar, role switch, notifications
        ├── tour.js             # cross-page first-run product tour
        ├── data.js             # shared data model
        └── architecture.png
```

## A note on the data

Scores, lifts, cohort sizes, and dollar figures are **illustrative** — crafted to make the grounding story legible, not produced by a live model. The prototype demonstrates the *shape* of the experience: proactive, explained, and grounded.
