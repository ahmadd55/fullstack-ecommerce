# Full-Stack E-Commerce Platform

A complete e-commerce application with a customer-facing storefront and a role-protected admin dashboard.

Customers can browse products by category, view image galleries, manage a cart and wishlist, and place orders. Admins get a separate dashboard for managing the catalog, orders and customers, with sales analytics.

**Storefront** — product catalog with pagination, database-driven category navigation, product detail with image gallery, cart, wishlist, checkout with Cash on Delivery, JWT authentication.

**Admin dashboard** — sales analytics, product CRUD with multi-image upload and CSV bulk import, category and subcategory management, order status workflow, customer management with lifetime value.

## Tech Stack

React 19 · Vite 8 · React Router 7 · Tailwind CSS 4 · Recharts — Node.js · Express 5 · Sequelize 6 · PostgreSQL · JWT

## Prerequisites

- Node.js 20.19+ or 22.12+
- PostgreSQL 14+, running locally

## Getting Started

### 1. Clone and create the database

```bash
git clone <your-repository-url>
cd fullstack-ecommerce
createdb ecommerce
```

The app does not create the database for you.

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [`.env.example`](../backend/.env.example)):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET_KEY=replace_this_with_a_long_random_string
```

Run migrations, seed the default accounts, and start the server:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

- Storefront: **http://localhost:5173**
- Admin dashboard: **http://localhost:5173/admin/login**

### 4. Sign in

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gmail.com` | `admin123` |
| Customer | `user@gmail.com` | `user123` |

Change these before deploying anywhere public.

> **The ports are fixed.** The frontend calls `http://localhost:3000/api` (hardcoded in `frontend/src/api/axios.js`) and the backend only allows requests from `http://localhost:5173` (`backend/src/middlewares/cors.middleware.js`). If you change either port, update both files.

## Environment Variables

All variables live in `backend/.env`. The frontend needs none.

| Variable | Description |
| --- | --- |
| `PORT` | Express port. Keep at `3000` unless you also update the frontend API URL. |
| `DB_HOST` / `DB_PORT` | PostgreSQL host and port |
| `DB_NAME` | Database name (must already exist) |
| `DB_USER` / `DB_PASSWORD` | PostgreSQL credentials |
| `JWT_SECRET_KEY` | Secret used to sign and verify tokens. Use a long random string. |

## Scripts

**Backend** — `npm run dev` (nodemon) · `npm start` · `npx sequelize-cli db:migrate` · `npx sequelize-cli db:seed:all`

**Frontend** — `npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

## Troubleshooting

**`database "ecommerce" does not exist`** — run `createdb ecommerce` first.

**`password authentication failed`** — check `DB_USER` and `DB_PASSWORD`, and that PostgreSQL is running.

**Every API request fails with a CORS error** — Vite is running on a port other than 5173 because 5173 was busy. Free the port, or add your actual origin to `allowedOrigins` in `backend/src/middlewares/cors.middleware.js`.

**Dashboard redirects back to `/admin/login`** — sign in through `/admin/login`, not `/login`, so the admin role is stored.

**Product images are broken** — uploads are stored on disk in `backend/public/uploads/`, which is gitignored. Images uploaded on another machine are not in the repository.
