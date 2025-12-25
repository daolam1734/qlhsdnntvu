# QLHS_DNN_TVU

Hệ thống quản lý hồ sơ đi nước ngoài của viên chức Trường Đại học Trà Vinh.

A full-stack application with NestJS backend, React frontend, and PostgreSQL database.

## Project Structure

- `backend/` - NestJS server with TypeORM, JWT auth, RBAC
- `frontend/` - React application with routing and auth
- `database/` - PostgreSQL setup scripts

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm

## Setup Instructions

### 1. Database Setup

1. Install PostgreSQL.
2. Create database and user.
3. Run:

   ```bash
   psql -U postgres -c "CREATE DATABASE qlhs_dnn_tvu;"
   psql -U postgres -d qlhs_dnn_tvu -f database/init.sql
   ```

4. Set environment variables in backend/.env:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=qlhs_dnn_tvu
   JWT_SECRET=your_secret
   ```

### 2. Backend Setup

1. cd backend
2. npm install
3. npm run start:dev

Server runs on http://localhost:3000

### 3. Frontend Setup

1. cd frontend
2. npm install
3. npm run dev

Frontend runs on http://localhost:5173

## Features

- User authentication with JWT
- RBAC for party/non-party members
- CRUD for records (application, decision, invitation, report)
- File uploads
- UI blocks unauthorized actions
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000`.

### 3. Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies (already done if created with Vite):

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## API Endpoints

- `GET /` - Welcome message
- `GET /api/test` - Test API endpoint

## Environment Variables

Create a `.env` file in the `backend` directory for sensitive data:

```
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=qlhs_dnn_tvu
DB_PORT=5432
PORT=3000
```

## Running the Full Application

1. Start the database.
2. Start the backend server.
3. Start the frontend development server.
4. Open `http://localhost:5173` in your browser.

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

### Backend

Ensure environment variables are set, then:

```bash
cd backend
npm start
```

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test thoroughly.
5. Submit a pull request.