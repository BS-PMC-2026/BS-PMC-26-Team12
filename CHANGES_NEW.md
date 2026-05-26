# Azure Deployment Prep — Changes

## Change 1 — Production static file serving (`server/app.js`)

Added `const path = require('path')` at the top.

After all API routes, added a production-only block that serves the compiled React
frontend and falls back to `index.html` for client-side routing:

```js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

> Note: The user-requested target was `server/server.js`, but the Express app
> (CORS, middleware, routes) lives in `server/app.js`, so the change was applied
> there — the correct file.

---

## Change 2 — Dynamic CORS origin (`server/app.js`)

Replaced the hardcoded `origin: 'http://localhost:5173'` with an env-var-driven
list so the Azure domain can be added without touching code:

```js
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
```

Set `CORS_ORIGIN=https://your-azure-app.azurewebsites.net` in the Azure App
Service environment variables (comma-separated for multiple origins).

---

## Change 3 — Root `package.json` for Azure Web App

Created `/package.json` at the repo root. Azure App Service (Node) looks for a
root-level `package.json` and runs `npm run build` then `npm start`:

```json
{
  "name": "peppers-market",
  "version": "1.0.0",
  "scripts": {
    "build": "cd client && npm install && npm run build",
    "start": "cd server && npm install && node server.js"
  }
}
```
