# README

# AlliedGeHealthcare Platform UI

A modern, modular React frontend for a healthcare platform. Built with Vite, React, Redux Toolkit, Ant Design, Tailwind CSS, and a feature-sliced architecture for scalability.

---

## Quick Start

```bash
# 1) Install dependencies
npm install / yarn

# 2) Copy environment example and edit values
cp .env.example .env
# then open .env and fill in required keys (see Environment Variables)

# 3) Run the app
yarn dev        # starts Vite dev server on [http://localhost:5173](http://localhost:5173)

# 4) Build for production
yarn build      # outputs to dist/

# 5) Preview production build
yarn preview    # serves dist/ locally
```

> Package manager is up to you. Commands shown with pnpm but npm or yarn work similarly.

---

## Tech Stack

- React + Vite
- Redux Toolkit for state management (slices under src/slices)
- React Router (routes under src/routes)
- Ant Design components + custom wrappers
- Tailwind CSS for utility-first styling
- [Socket.io](http://Socket.io) client (realtime events)

---

## Project Structure

The app uses a feature-sliced approach: reusable UI in src/components, domain features in src/features, and shared utilities in src/utils.

```
alliedgehelthcare-platform-ui
├─ public/                # Static assets
├─ src/
│  ├─ assets/             # Fonts, images, svgs
│  ├─ components/         # Reusable UI building blocks
│  ├─ config/             # App-level configuration (e.g., breadcrumbs)
│  ├─ features/           # Feature modules (admin, OPD, patient, payment, etc.)
│  ├─ hooks/              # Custom React hooks
│  ├─ layouts/            # Page layout components
│  ├─ lib/                # Low-level utilities and integrations
│  ├─ routes/             # Routing setup
│  ├─ services/           # API, cookies, session, socket
│  ├─ slices/             # Redux Toolkit slices
│  ├─ store/              # Redux store configuration
│  ├─ styles/             # Global or library-specific styles
│  └─ utils/              # Shared helpers, config, schemas, roles, etc.
├─ index.html             # HTML entry
├─ tailwind.config.js     # Tailwind config
├─ vite.config.js         # Vite config
├─ tsconfig*.json         # TS configs
└─ eslint.config.js       # Linting rules
```

A detailed file-by-file map is kept below in the "Detailed Folder Reference" section.

---

## Environment Variables

Create a .env file in the project root. Typical variables you may need:

```bash
VITE_SOCKET_URL="http://localhost:8000"
VITE_API_URL="http://localhost:3000"
VITE_HEALTHCARE_API_KEY="xxxxxx"
VITE_CHATBOT_API_URL="http://35.207.236.139:8080"
VITE_CHATBOT_TOKEN="xxxxxx"
```

- Variables must be prefixed with VITE\_ to be exposed to the client.
- Do not commit real secrets. Use .env and add .env to .gitignore.

---

## Scripts

Add or use the following scripts in package.json as applicable:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "start": "vite preview"
  }
}
```

---

## Routing

- Route config lives in src/routes/index.jsx
- Protected routes via src/routes/ProtectedRoute.jsx
- Layout composition via src/layouts/\*

Navigation helpers are in src/routes/helper and src/hooks/useNavigateTo.jsx.

---

## State Management

- Redux store at src/store/index.js
- Feature slices under src/slices: appointmentSlice, patientSlice, paymentSlice, OPD slices, etc.
- Cross-slice helpers in src/slices/helper
- Extra reducers for onboarding flow in hospitalOnboardingExtraReducer.js

Guidelines:

- Keep API side-effects in thunks or services/callAPI.js
- Keep UI-only state in components when possible; store global or shared state in slices

---

## Styling

- Tailwind utilities throughout components
- Ant Design with light customization; extra CSS like styles/ant.tooltip.css
- Global styles in src/index.css

Tip: Use component-level classes and avoid deep global overrides.

---

## API Layer and Realtime

- HTTP utility: src/services/callAPI.js
- Session and cookies: src/services/sessionStorage.js, src/services/cookies.js
- Socket client: src/services/socket.js with helpers under utils/socketMessages
- Global API response handling via hooks/useApiResponseHandler.js

Error handling utilities live under utils/error.js. Toast helpers under utils/toastMessage.js.

---

## Authentication and Authorization

- Auth pages in src/features/auth/pages/login.jsx
- UI components in src/features/auth/components
- Permission checks with hooks/usePermission.js and utils/roles.js
- ProtectedLayout.jsx and ProtectedRoute.jsx guard authenticated areas

---

## Forms and Validation

- Validation schemas per feature under src/features//validations
- Central schemas registry in utils/schemas.js
- Common form components in src/components (inputs, selectors, date pickers)

Pattern:

- Compose forms from CommonInput, CommonSelect, DatePicker, etc.
- Show FieldError for validation messages

---

## UX Components Library

A rich set of shared components exists under src/components, including:

- Buttons, modals, dropdowns, loaders and skeletons
- Table and chart components
- OPD, patient, pharmacy and payment specific UIs
- Wrappers around Ant Design pickers and selectors

Prefer reusing these to keep UX consistent.

---

## Feature Modules Overview

- administration: users, roles, departments, pricing, profiles
- ai-chat: chat modal and loading states
- appointment: create, list, reschedule
- dashboard: onboarding flows, admin dashboards, steppers
- OPD: clinical flows, vitals, prescriptions, labs
- patient-register: registration forms and lists
- patientDashboard: patient details, payments, prescriptions, trends
- payment: invoices, logs, settlements
- pharmacy: inventory and billing UIs
- roaster: weekly scheduling and breaks

Each feature follows a consistent structure of components, pages, helper, validations, and loader.

---

## Coding Standards

- Use functional components and hooks
- Keep files small and focused; colocate by feature
- Prefer absolute imports with Vite aliases if configured
- Lint before commit and ensure typecheck passes

Example ESLint workflow:

```bash
yarn lint
```

---

## Troubleshooting

- Blank page: check console for route or chunk load errors
- 401/403 responses: verify auth cookie and VITE_API_BASE_URL
- Socket not connecting: verify VITE_SOCKET_URL and CORS settings
- Styles missing: ensure Tailwind config is loaded and index.css imported once in main.jsx

---

## Detailed Folder Reference

Below is a curated reference of notable files and their purpose. Use this as a quick index when navigating the codebase.

- src/App.jsx: Root app shell and routing mount
- src/assets/fonts/\*: Custom fonts and CSS
- src/components/\*: Shared UI primitives and composites
- src/components/table/\*: Table grid, headers, rows and loaders
- src/components/chart/\*: Line and pie charts
- src/features//pages/\*: Page-level components per feature
- src/features//components/\*: Feature-scoped building blocks
- src/hooks/\*: Reusable hooks like useDebounce, useSocket
- src/routes/index.jsx: Router configuration
- src/services/\*: API, storage and socket helpers
- src/slices/\*: Redux domain slices
- src/store/index.js: Store configuration
- src/utils/\*: Common helpers, roles, schemas, dates, CSV, icons

---

## Contributing

1. Create a branch from development

2. Keep commits atomic and descriptive

3. Run lint and build locally

4. Open a PR with a concise description and screenshots if UI changes

---

## License

Private project. All rights reserved.
