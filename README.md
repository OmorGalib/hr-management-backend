# HR Management System Backend API

A complete HR Management System built with Node.js, TypeScript, Express, and PostgreSQL. This RESTful API provides authentication, employee management, attendance tracking, and reporting features.

## ✨ Features

- 🔐 **JWT Authentication** - Secure HR user login
- 👥 **Employee Management** - Full CRUD operations with photo upload
- 📅 **Attendance Tracking** - Daily check-ins with upsert capability
- 📊 **Reporting** - Monthly attendance reports with late arrival calculation
- 🔍 **Advanced Filtering** - Search, pagination, and filtering
- 🗑️ **Soft Delete** - Employees can be restored if needed
- 📁 **File Upload** - Employee photos with Multer
- ✅ **Input Validation** - Comprehensive validation with Joi
- 🛡️ **Security** - Helmet, CORS, environment variables
- 📝 **TypeScript** - Full type safety throughout
- 🧪 **Testing Ready** - Comprehensive HTML tester included

## 🛠️ Technology Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Query Builder**: Knex.js
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **File Upload**: Multer
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd hr-management-backend

npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use any text editor

# Login to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE hr_management;

# Create user (if needed)
CREATE USER hr_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hr_management TO hr_user;

# Exit
\q

# Run migrations
npm run migrate:up

# Seed initial data
npm run seed:run

# Development mode
npm run dev

# Production mode
npm run build
npm start

# use demo login
"email": "admin@hr.com",
"password": "admin123"

# for Manual Testing with cURL

curl -X GET "http://localhost:3000/health"

# First login and save token
TOKEN=$(curl -s -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hr.com","password":"admin123"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

# Then use the token to access employees
curl -X GET "http://localhost:3000/employees" \
  -H "Authorization: Bearer $TOKEN"