# FullStack Intern Coding Challenge - Solution

This repository contains a complete role-based **Store Rating Platform** implementation.

## Tech Stack

- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Frontend: React (Vite)

## Implemented Roles

1. System Administrator
2. Normal User
3. Store Owner

## Core Features Covered

- Single login system for all roles (`/api/auth/login`)
- Normal user signup (`/api/auth/signup`)
- Role-based authorization (Admin/User/Owner routes)
- Password update for logged-in users
- Store ratings from 1 to 5 with update support
- Admin dashboard:
  - Total users
  - Total stores
  - Total ratings
- Admin management:
  - Add users (Admin/User/Owner)
  - Add stores
  - List/filter/sort users
  - List/filter/sort stores
  - View user details (owner rating included for store owners)
- Normal user dashboard:
  - Search stores by name/address
  - View overall rating + own rating
  - Submit/modify rating
- Store owner dashboard:
  - View users who rated their store
  - View average rating
- Form validations as specified:
  - Name: 20-60
  - Address: max 400
  - Password: 8-16, uppercase + special character
  - Email: valid format
- Sorting supported across table views

## Project Structure

```text
backend/   # Express + MongoDB API
frontend/  # React application
```

## Setup Instructions

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Optional admin seed:

```bash
npm run seed:admin
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`  
Backend default URL: `http://localhost:5000`

## Main API Endpoints

- Auth:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `PATCH /api/auth/password`
- Admin:
  - `GET /api/admin/dashboard`
  - `POST /api/admin/users`
  - `GET /api/admin/users`
  - `GET /api/admin/users/:userId`
  - `POST /api/admin/stores`
  - `GET /api/admin/stores`
- Normal User:
  - `GET /api/user/stores`
  - `POST /api/user/stores/:storeId/rating`
- Store Owner:
  - `GET /api/owner/dashboard`

## Notes

- Authentication uses JWT Bearer tokens.
- Ratings are unique per `(user, store)` pair and updated on re-submit.
- Mongo schema design follows indexing and role constraints for scalable lookups.
"# rolix" 
