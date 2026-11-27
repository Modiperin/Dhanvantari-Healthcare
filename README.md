# Dhanvantari Healthcare

Dhanvantari Healthcare is a healthcare information system (HIS) for hospital administration and outpatient care. The React web application supports staff workflows from patient registration and appointment scheduling through consultation, pharmacy, and payment. The Express API handles application data and runs scheduled notification jobs.

## Features

| Area | Workflows |
| --- | --- |
| Hospital administration | Hospital onboarding, departments, staff, roles, profiles, and service pricing |
| Staff scheduling | Weekly rosters and breaks |
| Patient management | Patient registration, patient dashboards, and visit history |
| Appointments and outpatient care | Scheduling and rescheduling, outpatient department (OPD) workflows, vitals, consultations, prescriptions, and lab requests |
| Pharmacy and billing | Pharmacy inventory, billing, invoices, payment logs, and settlements |
| Notifications | Scheduled appointment and follow-up reminders, with email and WhatsApp integrations |

## Technology and repository layout

The frontend uses React 19, Vite, React Router, Redux Toolkit, Ant Design, and Tailwind CSS. The backend uses Node.js, Express 5, and TypeScript compiled with Babel. MongoDB stores application records, and the API connects to Redis at startup. The code also integrates with AWS S3 and a separately configured socket service.

```text
Frontend/
  public/                      Static assets
  src/
    components/                Shared UI components
    features/                  Pages and components grouped by workflow
    layouts/                   Shared page layouts
    routes/                    Navigation and protected routes
    services/                  HTTP, session, and socket helpers
    slices/ and store/         Redux state and store configuration
Backend/
  scripts/                     Development and production entry points
  src/
    config/                    Database and integration configuration
    db/                        MongoDB and Redis clients and queries
    services/rest/             Express entry point, routes, and controllers
    services/notifications/    Scheduled notification jobs
    utils/                     Shared helpers and integration code
  docker-compose.yml           Local Redis service
```

See the [frontend README](Frontend/README.md) and [backend README](Backend/README.md) for component-level context. The commands below follow the scripts in the current package manifests.

## Run locally

### 1. Install prerequisites

- Node.js 22 or later and npm
- A running MongoDB instance and a database name for development
- A running Redis instance, or Docker with Compose to start one

From the repository root, use the bundled Compose file if you need Redis. MongoDB is configured separately.

```powershell
docker compose -f Backend/docker-compose.yml up -d redis
```

### 2. Configure the backend

Create or update `Backend/.env`. Replace the placeholder values with local development values.

```dotenv
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=dhanvantari_healthcare
ELASTI_CACHE_URL=localhost
ELASTI_CACHE_PORT=6379
JWT_SECRET=replace-with-a-random-local-signing-secret
ENCRYPTION_KEY=replace-with-a-32-byte-key
HEALTHCARE_API_KEY=replace-with-a-local-api-key
FRONTEND_URL=http://localhost:5173
```

Use a 32-byte value for `ENCRYPTION_KEY`. Use an isolated development database and test data because the REST process starts scheduled notification jobs along with the API.

| Integration | Backend settings |
| --- | --- |
| Email | `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` |
| WhatsApp | `WHATSAPP_API_VERSION`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_SECRET_KEY` |
| AWS S3 | `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `AWS_REGION` |
| Socket service | `SOCKET_API_URL`, `SOCKET_API_KEY` |

Configure the integration credentials required by the workflows you plan to exercise. Keep backend credentials in the local environment or your deployment's secret store.

### 3. Configure the frontend

Create or update `Frontend/.env`.

```dotenv
VITE_API_URL=http://localhost:3000
VITE_WEB_APP_URL=http://localhost:5173
VITE_SOCKET_URL=http://localhost:8000
VITE_HEALTHCARE_API_KEY=replace-with-a-local-api-key
```

Set `VITE_HEALTHCARE_API_KEY` to the same local value as `HEALTHCARE_API_KEY` to use API-key-protected lookup routes. Point `VITE_SOCKET_URL` to the socket service available in your environment if you need real-time functionality. `VITE_CHATBOT_API_URL` selects the chatbot service when working on that feature.

Vite exposes `VITE_*` values to the browser. Use only values intended for client-side use. Set the local API URL explicitly because the frontend otherwise falls back to a hosted API.

### 4. Start both applications

Open two terminals at the repository root. In the first, start the backend.

```powershell
cd Backend
npm ci
npm run start2
```

`start2` runs Nodemon and Babel directly, which works from PowerShell. The backend's `npm run dev` script uses `sh`.

In the second terminal, start the frontend.

```powershell
cd Frontend
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), or use the URL printed by Vite. Check that the API responds from another terminal.

```powershell
Invoke-RestMethod http://localhost:3000/
```

The root endpoint returns a JSON welcome message and API version. Check the backend console for MongoDB and Redis connection messages before using database-backed workflows.

## REST API

The route registry is in [Backend/src/services/rest/routes/index.ts](Backend/src/services/rest/routes/index.ts). Each router defines its HTTP methods, paths, and middleware.

| Area | Route prefixes |
| --- | --- |
| Authentication and administration | `/auth`, `/hospital`, `/department`, `/staff`, `/profile`, `/roaster`, `/pricing` |
| Patient care | `/patient`, `/visit`, `/opd`, `/vital`, `/appointment`, `/consultation` |
| Operations | `/payment`, `/pharmacy`, `/dashboard`, `/aws`, `/feature-req` |

The diagnosis, medicine, lab test, and symptom search routes use the `x-api-key` header. Check the corresponding route and middleware when working on authentication or permissions.

## Build and check

Run each command from the directory shown.

| Directory | Command | Result |
| --- | --- | --- |
| `Frontend/` | `npm run lint` | Runs ESLint |
| `Frontend/` | `npm run build` | Builds static assets into `dist/` |
| `Frontend/` | `npm start` | Previews the frontend build locally |
| `Backend/` | `npx tsc --noEmit` | Checks TypeScript without emitting files |
| `Backend/` | `npm run lint` | Runs TypeScript and applies ESLint fixes |
| `Backend/` | `npm run compile` | Compiles source files into `build/` |
| `Backend/` | `npm start` | Runs the compiled backend |

For frontend hosting, build with the target environment values and configure the host to serve `index.html` for client-side routes. Review outbound TLS settings before deploying the backend. The existing production launcher disables certificate verification for Node.js connections.

## Troubleshooting

- **API requests go to a hosted server.** Check `Frontend/.env` for `VITE_API_URL` and restart Vite after editing it.
- **MongoDB connection fails.** Check that MongoDB is running and that `MONGO_URI` and `MONGO_DB_NAME` refer to the intended development instance and database.
- **Redis connection fails.** Check `docker compose -f Backend/docker-compose.yml ps` and confirm the host and port match `ELASTI_CACHE_URL` and `ELASTI_CACHE_PORT`.
- **A lookup request returns an authorization error.** Check that the frontend key matches the backend key and that Vite was restarted after any environment changes.
- **A real-time feature fails to connect.** Verify the socket service is reachable and that the frontend and backend socket URLs point to it.
