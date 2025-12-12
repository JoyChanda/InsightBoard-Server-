# 🖥️ InsightBoard Server

## admin-panel_URL: https://insight-board-client.vercel.app/admin-access

## 📌 Project Overview

**InsightBoard Server** is the backend for the InsightBoard application — a complete order and production tracking system.  
It is built with **Node.js, Express, MongoDB, and Mongoose**, and provides RESTful APIs for authentication, product management, order tracking, user management, and analytics.  
This backend works in tandem with the InsightBoard client (frontend) to provide a full-stack solution.

---

## 🔗 Live API / Base URL

> Currently for local development:

```
http://localhost:5000/api
```

> Replace with deployed server URL when hosted on production.

---

## ⚙️ Key Features

- **Authentication & Authorization**
  - JWT-based cookie authentication
  - Role-based access control (Admin, Manager, Buyer)
- **Products**
  - CRUD operations
  - Pagination support
  - Manager-only product creation
- **Orders**
  - Create new orders
  - Fetch user-specific orders
  - Cancel/Update flow
- **Tracking**
  - Order timeline updates
  - Status tracking
- **User Management**
  - Admin can list users, change roles, suspend accounts
- **Analytics (Optional)**
  - Admin endpoint for products/orders/users summary
- **Security**
  - Input sanitization and validation
  - Password hashing with bcrypt
- **Middleware**
  - JWT cookie auth
  - Role-based route checks
  - Error handling
- **CORS & Cookie Configuration**
  - Configured for frontend communication
- **Responsive & Maintainable API Structure**
  - Controllers, routes, models, middleware separation

---

## 📦 Tech Stack & NPM Packages Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication & Security:** bcryptjs, jsonwebtoken, cookie-parser
- **Environment Variables:** dotenv
- **Middleware & Utilities:** express-validator, cors, nodemon (dev)

Example of main npm packages:

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser cors express-validator
npm install -D nodemon
```

---

## 🚀 Running the Server Locally

1. **Clone the repo:**

   ```bash
   git clone <repo-url>
   cd insightboard-server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   ```ini
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   CLIENT_URL=https://your-frontend-url.com
   NODE_ENV=development
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   Server should be running at `http://localhost:5000`.

---

## 🔐 API Endpoints

### Auth

| Method | Endpoint             | Description       | Access |
| ------ | -------------------- | ----------------- | ------ |
| POST   | `/api/auth/register` | Register new user | Public |
| POST   | `/api/auth/login`    | Login user        | Public |
| POST   | `/api/auth/logout`   | Logout user       | Public |

### Products

| Method | Endpoint            | Description        | Access  |
| ------ | ------------------- | ------------------ | ------- |
| GET    | `/api/products`     | Get all products   | Public  |
| GET    | `/api/products/:id` | Get single product | Public  |
| POST   | `/api/products`     | Create product     | Manager |
| PATCH  | `/api/products/:id` | Update product     | Manager |
| DELETE | `/api/products/:id` | Delete product     | Manager |

### Orders

| Method | Endpoint          | Description       | Access |
| ------ | ----------------- | ----------------- | ------ |
| GET    | `/api/orders`     | Get user's orders | Auth   |
| POST   | `/api/orders`     | Create new order  | Auth   |
| PATCH  | `/api/orders/:id` | Update order      | Auth   |

### Tracking

| Method | Endpoint                   | Description         | Access        |
| ------ | -------------------------- | ------------------- | ------------- |
| GET    | `/api/orders/:id/tracking` | Get order timeline  | Auth          |
| POST   | `/api/orders/:id/tracking` | Add tracking update | Admin/Manager |

### Users (Admin)

| Method | Endpoint                 | Description      | Access |
| ------ | ------------------------ | ---------------- | ------ |
| GET    | `/api/users`             | List all users   | Admin  |
| PATCH  | `/api/users/:id/role`    | Change user role | Admin  |
| PATCH  | `/api/users/:id/suspend` | Suspend user     | Admin  |

### Analytics (Admin)

| Method | Endpoint         | Description              | Access |
| ------ | ---------------- | ------------------------ | ------ |
| GET    | `/api/analytics` | Get 30-day summary stats | Admin  |

---

## 👤 Author

**Joy Chanda**

---
