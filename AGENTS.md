## Project
[Smart Itinerary Planner] — [A travel planner with just a few clicks].

## Stack
- Languages: Python + TypeScript
- Frameworks: FastAPI (backend) + React.js 19 (frontend)
- Database: SQLite 
- Key libraries (frontend): Chakra UI, Tailwind CSS, Zod + React-hook-form, Jest
- Key libraries (backend): OpenAI
- Deployable on local machines and Vercel

## Structure
```
project/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── itineraries.py
│   │   │   │   ├── plans_generation.py
│   │   │   │   └── exports.py
│   │   │   └── dependencies.py
│   │   ├── models/
│   │   │   ├── schemas.py
│   │   │   └── db.py
│   │   ├── services/
│   │   │   ├── openai_service.py
│   │   │   └── export_service.py
│   │   └── db/
│   │       └── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── forms/
│   │   │   │   └── TravelInputForm.tsx
│   │   │   ├── displays/
│   │   │   │   ├── ItineraryDisplay.tsx
│   │   │   │   └── PlansList.tsx
│   │   │   └── shared/
│   │   │       ├── ExportButton.tsx
│   │   │       └── LoadingIndicator.tsx
│   │   ├── hooks/
│   │   │   ├── useItineraries.ts
│   │   │   ├── usePlan.ts
│   │   │   └── usePlanGeneration.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── SavedPlans.tsx
│   │   │   └── EditPlan.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```
---

## Commands
- Create new project: `npm create vite@latest itinerary-planner -- --template react-ts`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Verification
After every change, run in this order:
1. `npx tsc --noEmit` — fix type errors
2. `npm test` — fix failing tests
3. `npx prettier . --write` — format project code
3. `npm run lint` — fix lint errors
4. `npm run build` — confirm it builds

## Conventions
- Use Chakra UI components — do not install any other UI libraries
- Write tests for each frontend component with Jest — do not use any other test frameworks
- Write tests for each backend function with PyTest — do not use any other test frameworks

## Don't
- Don't use `any` — use `unknown` and narrow the type
- Don't skip error handling — always show user feedback
- Don't hardcode the following variables: [model, api_url]  — they live in .env
