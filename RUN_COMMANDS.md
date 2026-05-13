# Project Execution Guide

This document lists the commands required to run the various services of the **SMS Hub** application.

## 1. Backend (Laravel API)
The backend handles the core logic, database management, and triggers notifications.

```bash
cd backend
php artisan serve
```
*Default URL: http://localhost:8000*

## 2. Notification Service (Node.js + Socket.io)
The notification service handles real-time alerts and communication between the backend and frontend.

```bash
cd notification
npm start
```
*Default Port: 3001*

## 3. Frontend (React + Vite)
The user interface for managing users, resellers, and dashboard activities.

```bash
cd frontend
npm run dev
```
*Default URL: http://localhost:5173*

---

### Prerequisites
- **PHP 8.2+** & **Composer** (for Backend)
- **Node.js 18+** & **npm** (for Frontend and Notification)
- **MySQL/MariaDB** (Ensure the `test_ai` database exists as per `.env`)

### Troubleshooting
- If profile images are not showing, ensure the storage link is created:
  ```bash
  cd backend
  php artisan storage:link
  ```
- Ensure all services are running simultaneously for full functionality (especially real-time notifications).
