# Staland ERP Backend

A comprehensive Enterprise Resource Planning (ERP) system backend built with Express.js, TypeScript, and Prisma for managing land development projects, clients, invoices, and expenses.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Authentication](#authentication)

## Features

### Core Modules

1. **Authentication Module**
   - User registration and login
   - JWT token generation and verification
   - Secure password hashing
   - Protected routes with role-based access control

2. **User Management**
   - Create, read, update, and delete users
   - Admin-only operations
   - User role management (ADMIN, STAFF)
   - Pagination support

3. **Client Management**
   - Manage client information (name, email, phone, address)
   - Store KRA PIN and ID numbers
   - Document upload URLs (ID copies, KRA PIN, title deeds)
   - Search and filter clients
   - Pagination with search capability

4. **Project Management**
   - Create and manage land development projects
   - Link projects to clients
   - Track project status (PENDING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED)
   - Store location data with GPS coordinates
   - Budget tracking
   - Project timeline management

5. **Invoice & Financial Management**
   - Generate invoices with unique invoice numbers
   - Automatic tax calculation
   - Track invoice status (DRAFT, ISSUED, SENT, PAID, OVERDUE, CANCELLED)
   - Record payments and receipts
   - Support for multiple payment methods (M-Pesa, Bank Transfer, Cash, Cheque)
   - M-Pesa integration ready

6. **Expense Tracking**
   - Record project expenses by category (Labor, Materials, Equipment, Transport, Utilities)
   - Track expense status (DRAFT, SUBMITTED, APPROVED, REJECTED)
   - Attach receipt URLs for proof
   - Categorized expense reporting
   - Project budget vs. actual spending summary

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Custom validators
- **CORS**: Enabled for cross-origin requests

## Project Structure

```
src/
├── config/
│   ├── database.ts       # Prisma client setup
│   └── env.ts           # Environment variables
├── middleware/
│   ├── auth.ts          # JWT verification and role-based access
│   ├── errorHandler.ts  # Global error handling
│   └── logger.ts        # Request logging
├── modules/
│   ├── auth/            # Authentication module
│   ├── users/           # User management
│   ├── clients/         # Client management
│   ├── projects/        # Project management
│   ├── invoices/        # Invoice management
│   └── expenses/        # Expense tracking
├── utils/
│   ├── errors.ts        # Custom error classes
│   ├── jwt.ts           # JWT utilities
│   ├── password.ts      # Password hashing utilities
│   ├── pagination.ts    # Pagination helpers
│   ├── response.ts      # Standard response format
│   └── validators.ts    # Input validation
├── app.ts              # Express app setup
└── index.ts            # Server entry point
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hkubai/Staland-erp-backend.git
   cd Staland-erp-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

## Configuration

1. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Server
   PORT=3000
   NODE_ENV=development

   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/staland_erp

   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h

   # CORS
   CORS_ORIGIN=http://localhost:3000

   # M-Pesa Configuration (Optional)
   MPESA_API_KEY=your_mpesa_api_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   ```

2. **Database Setup**
   ```bash
   # Run migrations
   npx prisma migrate dev

   # Seed data (optional)
   npx prisma db seed
   ```

## Running the Server

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Production Build**
   ```bash
   npm run build
   npm start
   ```

3. **Check Server Health**
   ```bash
   curl http://localhost:3000/health
   ```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout user (protected)

### Users (`/api/users`) - Admin Only

- `GET /` - Get all users with pagination
- `POST /` - Create new user
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user

### Clients (`/api/clients`) - Authenticated

- `GET /` - Get all clients (with pagination and search)
- `POST /` - Create new client
- `GET /:id` - Get client by ID
- `PUT /:id` - Update client
- `DELETE /:id` - Delete client

### Projects (`/api/projects`) - Authenticated

- `GET /` - Get all projects (with filtering and pagination)
- `POST /` - Create new project
- `GET /:id` - Get project by ID
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project

### Invoices (`/api/invoices`) - Authenticated

- `GET /` - Get all invoices (with filtering and pagination)
- `POST /` - Create new invoice
- `GET /:id` - Get invoice by ID
- `PUT /:id` - Update invoice
- `POST /:invoiceId/payment` - Record payment for invoice

### Expenses (`/api/expenses`) - Authenticated

- `GET /` - Get all expenses (with filtering and pagination)
- `POST /` - Create new expense
- `GET /:id` - Get expense by ID
- `PUT /:id` - Update expense
- `DELETE /:id` - Delete expense
- `GET /project/:projectId/summary` - Get project expenses summary

## Database Schema

The system uses the following main entities:

- **User**: System users with roles (ADMIN, STAFF)
- **Client**: Land development clients with contact and document information
- **Project**: Land development projects linked to clients
- **Invoice**: Invoices for project work with payment tracking
- **Receipt**: Payment records for invoices
- **Expense**: Project expenses categorized and tracked

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "statusCode": 400
}
```

### Custom Error Types

- `BadRequestError` (400) - Invalid request data
- `UnauthorizedError` (401) - Authentication required
- `ForbiddenError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Duplicate resource

## Authentication

### JWT Token

Tokens are issued on successful login and contain:
- User ID
- Email
- Role (ADMIN/STAFF)

### Protected Routes

Include the token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access

- **ADMIN**: Full access to user management and all features
- **STAFF**: Access to clients, projects, invoices, and expenses

## Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the GitHub repository.
