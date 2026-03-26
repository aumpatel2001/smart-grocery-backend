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
4. Open `http://localhost:5173`.

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
