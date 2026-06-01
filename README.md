# Hadinarim — Pepper Farm Platform

A full-stack web application for managing a pepper farm's store, guided tours, and pepper encyclopedia. Built for BS-PMC-2026 Team 12.

---

## Features

### Visitor
- Browse and search the pepper encyclopedia with heat-level filtering
- Shop for farm products with a fully featured cart (selective checkout, stock enforcement)
- Book guided farm tours with a payment flow
- View order history and booking history

### Guide
- Authenticated guide dashboard
- Report and track issues

### Admin
- Manage and approve guide registrations
- Manage the product store (add, edit, remove products)
- View and update order statuses
- View and manage tour bookings and issue reports

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (7-day expiry), bcrypt |
| Deployment | Azure App Service + MongoDB Atlas |
| CI/CD | GitHub Actions |

---

## Project Structure

```
├── client/               # React + Vite frontend
│   └── src/
│       ├── api/          # Axios API wrappers
│       ├── components/   # Shared components (Navbar, etc.)
│       ├── context/      # AuthContext
│       └── pages/        # All page components
├── server/               # Express backend
│   ├── controllers/      # Route handler logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── middleware/        # Auth middleware
│   └── seed.js           # Database seeder
├── .github/workflows/    # CI and Azure deploy pipelines
└── package.json          # Root build/start scripts for Azure
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 22+
- MongoDB running locally on port 27017

### 1. Clone the repo
```bash
git clone https://github.com/BS-PMC-2026/BS-PMC-26-Team12.git
cd BS-PMC-26-Team12
```

### 2. Set up the server
```bash
cd server
npm install
```

Create `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/peppers
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Seed the database
```bash
npm run seed
```
This creates the admin account and sample peppers/tours.

### 4. Set up the client
```bash
cd ../client
npm install
```

### 5. Run both servers

**Backend** (from `server/`):
```bash
npm run dev
```

**Frontend** (from `client/`):
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

## Default Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@peppers.com | admin123 |

---

## API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/visitor/register` | Public | Register a visitor |
| POST | `/api/auth/visitor/login` | Public | Visitor login |
| POST | `/api/auth/guide/register` | Public | Register a guide |
| POST | `/api/auth/guide/login` | Public | Guide login |
| POST | `/api/auth/admin/login` | Public | Admin login |
| GET | `/api/peppers` | Public | List/search peppers |
| GET | `/api/peppers/:id` | Public | Pepper detail |
| GET | `/api/products` | Public | List products |
| GET/POST | `/api/cart` | Visitor | View/update cart |
| POST | `/api/orders` | Visitor | Checkout (selective) |
| GET | `/api/orders/my` | Visitor | Order history |
| GET | `/api/orders` | Admin | All orders |
| PATCH | `/api/orders/:id` | Admin | Update order status |
| GET | `/api/tours` | Public | List tours |
| POST | `/api/tour-orders` | Visitor | Book a tour |
| GET | `/api/tour-orders/my` | Visitor | My bookings |
| GET | `/api/guides` | Admin | List guides |
| PATCH | `/api/guides/:id` | Admin | Approve/reject guide |

---

## Running Tests

```bash
cd server

# All tests
npm test

# With coverage
npm run test:coverage

# Integration tests only
npx jest --testPathPatterns="integration" --runInBand
```

Coverage threshold is enforced at **70%** across branches, functions, lines, and statements.

---

## Deployment

The app is deployed on **Azure App Service** (`Hadinarim-SCE`) with **MongoDB Atlas**.

Every push to `main` triggers the GitHub Actions pipeline which:
1. Installs server and client dependencies
2. Builds the React frontend (`client/dist/`)
3. Deploys to Azure via publish profile

Required GitHub secrets:
- `PAT_TOKEN` — GitHub PAT with `repo` + `workflow` scope (used for checkout)
- `AZURE_WEBAPP_PUBLISH_PROFILE` — Azure publish profile XML

In Azure, set these environment variables:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — JWT signing secret
- `NODE_ENV=production`
- `CORS_ORIGIN` — Your Azure app URL (e.g. `https://hadinarim-sce.azurewebsites.net`)
