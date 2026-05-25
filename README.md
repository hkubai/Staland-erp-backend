# Staland ERP Backend

A production-ready Enterprise Resource Planning system for land management built with Node.js, Express, and PostgreSQL.

## Features

- ✅ JWT Authentication with RBAC (Admin & Staff roles)
- ✅ User Management
- ✅ Client Management with Document Storage
- ✅ Project Management with GIS Coordinates
- ✅ Invoicing & Receipt Management
- ✅ Expense Tracking
- ✅ Land Survey Records
- ✅ Type-Safe with TypeScript
- ✅ PostgreSQL with Prisma ORM
- ✅ Input Validation
- ✅ Error Handling
- ✅ CORS Support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Authentication**: JWT
- **Password Hashing**: bcryptjs

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/hkubai/Staland-erp-backend.git
cd Staland-erp-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```
DATABASE_URL=postgresql://user:password@localhost:5432/staland_erp
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Setup database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed
```

### 5. Start development server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Project Structure

```
src/
├── config/              # Configuration files
├── middleware/          # Express middleware
├── modules/             # Feature modules
│   ├── auth/
│   ├── users/
│   ├── clients/
│   ├── projects/
│   ├── invoices/
│   └── ...
├── utils/               # Utility functions
├── prisma/              # Database schema
└── app.ts              # Express setup
```

## API Documentation

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Users (Admin only)
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Clients
```
GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id
```

### Projects
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

## Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@staland.com",
    "password": "SecurePass123!",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@staland.com",
    "password": "SecurePass123!"
  }'
```

### Get Protected Resource (Clients)
```bash
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Migrations

```bash
# Create a new migration
npm run prisma:migrate

# View database in Prisma Studio
npm run prisma:studio
```

## Testing

```bash
npm test
```

## Deployment

### Build for production
```bash
npm run build
```

### Start production server
```bash
NODE_ENV=production npm start
```

## Environment Variables

See `.env.example` for all available configuration options.

## Security

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens are signed and verified
- CORS is configured for secure cross-origin requests
- Input validation on all endpoints
- Role-based access control (RBAC)

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
