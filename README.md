# Marketplace

## Start on a fresh clone

Requirements: Node.js/npm, the .NET 10 SDK, and SQL Server LocalDB (`MSSQLLocalDB`). The connection string is in `backend/appsettings.json`.

1. Open a terminal in `Marketplace/frontent`.
2. Install frontend packages: `npm install` (first time only).
3. Start everything: `npm run dev:full`.
4. Wait until Vite prints `http://localhost:5173`, then open that address.
5. Keep the terminal running while using the app. Press Ctrl+C to stop the API and frontend.

The startup command runs the API, waits for `http://localhost:5079/api/health`, then starts Vite. The API applies migrations and seeds an empty database at startup; Vite proxies `/api` requests to it.

Admin login: `admin@marketplace.test` / `Admin123!`.
