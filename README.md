# Blog API - NestJS & MongoDB Backend Implementation

[![NestJS](https://img.shields.io/badge/NestJS-v10-red.svg)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7-green.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue.svg)](https://www.typescriptlang.org/)

A robust REST API built with NestJS and MongoDB for a modern blog application. Features include authentication, user management, posts, and comments.

## ⚡️ Key Features

🔐 **Authentication**
- JWT based auth with refresh tokens
- Secure password hashing
- Protected routes with Guards

👤 **User Management**
- User registration and login
- Profile management
- Secure password updates

📝 **Blog Posts**
- CRUD operations
- Pagination & filtering
- Tags system

💬 **Comments**
- Nested comments
- Author tracking
- Real-time updates

## 🛠 Tech Stack

**Core:**
```
NestJS     - Progressive Node.js framework
MongoDB    - NoSQL database
Mongoose   - MongoDB object modeling
TypeScript - Type safety and better DX
```

**Authentication:**
```
@nestjs/jwt      - JWT implementation
@nestjs/passport - Authentication
bcrypt          - Password hashing
```

**Validation:**
```
class-validator   - Input validation
class-transformer - Object transformation
```

## 🚀 Quick Start

1. **Clone and Install**
```bash
git clone https://github.com/yasin-erkan/Blog-API---NestJS-MongoDB-Backend-Implementation.git
cd api
npm install
```

2. **Set Environment Variables**
```env
MONGODB_URI=mongodb://localhost:27017/blog_app
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

3. **Run the API**
```bash
npm run start:dev
```

## 📝 API Endpoints

### Auth
```
POST   /auth/register   Register new user
POST   /auth/login      Login
POST   /auth/refresh    Refresh token
POST   /auth/logout     Logout
```

### Users
```
GET    /user/me         Get profile
PATCH  /user/me         Update profile
```

### Posts
```
GET    /posts           List all posts
GET    /posts/:id       Get single post
POST   /posts           Create post
PATCH  /posts/:id       Update post
DELETE /posts/:id       Delete post
```

### Comments
```
GET    /posts/:id/comments    List comments
POST   /posts/:id/comments    Add comment
DELETE /comments/:id          Delete comment
```

## 📦 Project Structure

```
src/
├── auth/           # Authentication
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── user/           # User management
│   ├── dto/
│   └── schema/
├── post/           # Blog posts
│   ├── dto/
│   └── schema/
└── comment/        # Comments
    ├── dto/
    └── schema/
```

## 🔒 Security Features

- JWT based authentication
- Refresh token rotation
- Password hashing with bcrypt
- Request validation
- MongoDB injection protection
- Rate limiting
- CORS enabled

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 Documentation

Full API documentation is available in the Postman collection included in the repository.

## 📜 License

This project is licensed under the MIT License.