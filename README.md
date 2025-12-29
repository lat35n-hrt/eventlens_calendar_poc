# eventlens_calendar_poc

## Frontend versions

- Node.js: 22.12.0 (via nvm)
- npm: 10.9.0

(Optional)
- `frontend/.nvmrc` contains the Node.js version for easy switching.


## How to run E2E (Playwright)

E2E = "End-to-End" testing.
It verifies the full user flow in a real browser (UI interactions → API calls → rendered results).

### Prerequisites (Frontend)
- Node.js: 22.12.0
- npm: 10.9.0

If you use nvm:
```bash
cd frontend
nvm use
node -v
npm -v
```

1) Start backend (FastAPI)
From the project root:

```bash
source .venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

(Optional) Seed DB (if needed):

```bash
sqlite3 data/eventlens.db < app/db/schema.sql
sqlite3 data/eventlens.db < data/seeds/seed.sql
```

2) Start frontend (Vite)
In another terminal:

```bash
cd frontend
npm install
npm run dev
```

3) Run E2E tests (Playwright)
In another terminal (or reuse the frontend terminal):

```bash
cd frontend
nvm use
npm run test:e2e
```

View the HTML report
```bash
cd frontend
npx playwright show-report
```



![Playwright Report](docs/playwright_e2e_report.png)