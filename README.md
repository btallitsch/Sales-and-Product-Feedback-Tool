# FeedbackBridge — Sales ↔ Product Intelligence

A structured internal platform that captures raw customer feedback from sales interactions and transforms it into actionable, data-driven product insights.

## Features

- **Feedback Capture** — Standardized log of customer pain points with deal context, urgency, frequency, and revenue impact
- **Overview Dashboard** — KPI metrics, charts (bar, pie, area), and opportunity cluster table with Recharts
- **Insights** — Auto-clustered feedback patterns by category, with revenue aggregation and progress tracking
- **Product Board** — Kanban-style feature tracker (Backlog → Planned → In Progress → Shipped) linked to feedback signals

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **Recharts** for data visualization
- **Lucide React** for icons
- **localStorage** for client-side persistence (swap for Firebase/Supabase as needed)
- No external UI library — fully custom component system

## Project Structure

```
src/
├── types/          — All TypeScript interfaces and union types
├── services/       — Storage (localStorage) + seed data
├── utils/          — Formatters, metrics computation, clustering, filter/sort
├── hooks/          — useFeedback, useFeatures (state + CRUD logic)
├── components/
│   ├── layout/     — Sidebar, TopBar
│   ├── shared/     — Badge, Button, MetricCard, Modal, EmptyState
│   └── feedback/   — FeedbackForm, FeedbackTable, FilterBar
└── pages/          — DashboardPage, CapturePage, InsightsPage, BoardPage
```

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

No environment variables required for the default localStorage setup.

To connect Firebase, add `VITE_FIREBASE_*` variables to a `.env.local` file and replace the `src/services/storage.ts` layer with Firestore calls.

## Demo Data

On first load, 15 realistic feedback items and 5 feature requests are seeded automatically. Use the **Reset to demo data** button in the sidebar footer to restore the seed data at any time.
