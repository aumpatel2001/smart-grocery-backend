# Smart Grocery Backend + Frontend

Full-stack grocery tracker with: auth, item expiry management, shopping list, dashboard stats.

## Backend setup

1. cd `smart-grocery-backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set values (DB + JWT_SECRET).
4. Run migrations:
   - MySQL CLI: `mysql -u $DB_USER -p -h $DB_HOST -P $DB_PORT $DB_NAME < schema.sql`
5. Start server: `npm run dev`
6. Health check: `GET http://localhost:5001/`.

## Frontend setup

1. cd `smart-grocery-backend/client`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:5173`

The Vite dev server now proxies `/api` to `http://localhost:5001`, so the frontend works with the backend during local development.

## Deploying on Render

To deploy both frontend and backend from one Render service:

1. Connect your GitHub repo to Render and create a new Web Service.
2. Set the root directory to the repo root (`/`).
3. Use build command: `npm install && npm run build`
4. Use start command: `npm start`
5. Add the required environment variables for your database and `JWT_SECRET`.

This configuration builds the React app into `client/dist` and serves it from the Express backend at the same domain.

## Render manifest

A Render service manifest is included at `render.yaml`. It defines a single web service that:

- builds the app with `npm install && npm run build`
- starts the backend with `npm start`
- serves both the API and static frontend from one domain

Set the required environment variables in the Render dashboard or replace the empty values in `render.yaml`.

## API endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/groceries`
- `POST /api/groceries`
- `PUT /api/groceries/:id`
- `PATCH /api/groceries/:id/consume`
- `PATCH /api/groceries/:id/expire`
- `DELETE /api/groceries/:id`
- `GET /api/shopping-list`
- `POST /api/shopping-list`
- `PUT /api/shopping-list/:id`
- `PATCH /api/shopping-list/:id/purchased`
- `DELETE /api/shopping-list/:id`
- `GET /api/dashboard`

## Environment variables

Backend `.env`:

```
PORT=5001
DB_HOST=...
DB_PORT=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
JWT_SECRET=...
```

Frontend .env (optional):

```
VITE_API_BASE=http://localhost:5001/api
```

## Test and submission checklist
- [x] `schema.sql` includes `users`, `grocery_items`, `shopping_list_items`
- [x] backend CRUD and auth routes working
- [x] JWT middleware in place
- [x] frontend includes login/register/grocery/shopping/dashboard
- [x] no `http://localhost:5001` hardcodes in app logic (only via config)
- [x] README contains run instructions
- [x] `npm run dev` works for both backend + frontend

## Notes
- Remove secrets from git and use secure vault for production.
- Add test suite (Jest/supertest) before final grading for reliability.
