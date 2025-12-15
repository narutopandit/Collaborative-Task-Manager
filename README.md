# Collaborative Task Manager

A modern, full-stack web application for collaborative task management with real-time notifications, role-based permissions, and a beautiful responsive UI.

Live demo: https://collaborative-task-manager-ten.vercel.app

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Local Development Setup](#-local-development-setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Configuration](#-configuration)
- [Database Models](#-database-models)
- [Real-time Features](#-real-time-features)
- [Permission System](#-permission-system)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality
- **Task Management**: Create, read, update, and delete tasks with comprehensive details
- **Email-based Assignment**: Assign tasks to team members using email addresses
- **Real-time Notifications**: Instant socket.io-powered notifications for task updates
- **Dual Notifications**: Separate notifications for task creators and assignees
- **Persistent Notifications Panel**: View notification history and dismiss as needed

### User Management
- **JWT Authentication**: Secure token-based authentication with cookie storage
- **User Registration**: Create new user accounts with email verification
- **User Login**: Secure login with session management
- **Profile Management**: Update user profile information (name, email)
- **Password Management**: Secure password handling with hashing

### Task Features
- **Task Status Tracking**: Track tasks across multiple states (To Do, In Progress, Completed)
- **Priority Levels**: Set task priority (Low, Medium, High, Urgent)
- **Due Dates**: Assign and track task deadlines with visual indicators
- **Audit Logging**: Track all task modifications and user actions
- **Dashboard Stats**: Real-time dashboard showing task statistics

### Permissions & Security
- **Role-based Permissions**:
  - **Task Creator**: Can edit all task fields, delete tasks, and manage assignments
  - **Task Assignee**: Can only update task status
- **Authorization Middleware**: Secure API endpoints with JWT verification
- **CORS Protection**: Configured for production environments
- **Secure Cookie Storage**: HttpOnly cookies for token storage

### UI/UX
- **Responsive Design**: Mobile-first, fully responsive interface
- **Modern Dashboard**: Stats cards, sidebar navigation, welcome message
- **Modal-based Forms**: Clean task creation and editing experience
- **Real-time Updates**: Live task updates across connected clients
- **Form Validation**: Client-side validation with Zod schema validation
- **Task Filtering**: Filter and search tasks by status and other criteria

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library with hooks |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Lightning-fast build tool |
| **React Router 6** | Client-side routing |
| **React Query** | Server state management |
| **TailwindCSS** | Utility-first CSS framework |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **Socket.io Client** | Real-time communication |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework |
| **TypeScript** | Type-safe backend |
| **Node.js 18** | Runtime environment |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **Socket.io** | Real-time events |
| **JWT** | Authentication tokens |
| **cookie-parser** | Cookie management |
| **CORS** | Cross-origin resource sharing |

### DevOps & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy & static serving |
| **MongoDB 6** | Database container |

## 📋 Prerequisites

### Option 1: Docker (Recommended)
- **Docker**: v20.10 or higher
- **Docker Compose**: v2.0 or higher

### Option 2: Local Development
- **Node.js**: v18 or higher
- **npm** or **yarn**: v8 or higher
- **MongoDB**: v6 or higher (running locally or remote)
- **Git**: for version control

## 📦 Installation

### Quick Start with Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd Collaborative-Task-Manager

# Start all services (MongoDB, Backend, Frontend)
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# MongoDB: localhost:27017
```

The Docker Compose setup includes:
- **MongoDB 6**: Pre-configured with authentication
- **Node.js Backend**: API server on port 4000
- **Nginx Frontend**: React app served on port 3000 with SPA routing

### Local Development Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd Collaborative-Task-Manager
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key_here
PORT=4000
NODE_ENV=development
EOF

# Start MongoDB (ensure it's running)
# Option A: Using Docker
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:6

# Option B: Using local MongoDB installation
mongod

# Build TypeScript
npm run build

# Run development server
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
EOF

# Start development server
npm run dev
```

Access the app at `http://localhost:5173`

## 🏗 Project Structure

```
Collaborative-Task-Manager/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server setup & Socket.io
│   │   ├── controllers/
│   │   │   ├── auth/
│   │   │   │   └── controller.ts # Auth endpoints
│   │   │   └── task/
│   │   │       └── controller.ts # Task endpoints
│   │   ├── services/
│   │   │   ├── auth/
│   │   │   │   └── service.ts    # Auth business logic
│   │   │   └── task/
│   │   │       └── service.ts    # Task business logic & permissions
│   │   ├── models/
│   │   │   ├── user/
│   │   │   ├── task/
│   │   │   ├── notification/
│   │   │   └── auditLog/
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   └── task/
│   │   ├── middleware/
│   │   │   └── auth/
│   │   │       └── middleware.ts # JWT verification
│   │   ├── dto/                  # Data transfer objects
│   │   └── sockets/
│   │       └── index.ts          # Socket.io event handlers
│   ├── config/
│   │   └── db.ts                 # MongoDB connection
│   ├── Dockerfile                # Multi-stage Docker build
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx              # React entry point
│   │   ├── App.tsx               # Root component
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── components/
│   │   │   ├── CreateTaskModal.tsx
│   │   │   ├── UpdateTaskModal.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── TaskSkeleton.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   └── useTasks.ts
│   │   ├── api/
│   │   │   ├── axios.ts          # Axios configuration
│   │   │   ├── auth.api.ts
│   │   │   └── task.api.ts
│   │   ├── socket/
│   │   │   └── socket.ts         # Socket.io client setup
│   │   └── assets/
│   ├── public/
│   ├── Dockerfile                # Multi-stage Docker build
│   ├── nginx.conf                # Nginx reverse proxy config
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml            # Multi-container orchestration
└── README.md
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response: 201 Created
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe"
}

Response: 200 OK
{
  "user": {
    "id": "user_id",
    "name": "Jane Doe",
    "email": "john@example.com"
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response: 200 OK
```

### Task Endpoints

#### Create Task
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete Project Report",
  "description": "Finalize and submit the Q4 report",
  "priority": "HIGH",
  "dueDate": "2025-12-31",
  "assignedTo": "assignee@example.com"
}

Response: 201 Created
{
  "task": {
    "id": "task_id",
    "title": "Complete Project Report",
    "description": "Finalize and submit the Q4 report",
    "status": "TO_DO",
    "priority": "HIGH",
    "dueDate": "2025-12-31",
    "createdBy": "creator_id",
    "assignedTo": "assignee_id",
    "createdAt": "2025-12-15T10:00:00Z",
    "updatedAt": "2025-12-15T10:00:00Z"
  }
}
```

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer {token}

Response: 200 OK
{
  "tasks": [
    {
      "id": "task_id",
      "title": "Task Title",
      "status": "TO_DO",
      "priority": "HIGH",
      ...
    }
  ]
}
```

#### Get Task by ID
```http
GET /api/tasks/:taskId
Authorization: Bearer {token}

Response: 200 OK
{
  "task": { ... }
}
```

#### Update Task
```http
PUT /api/tasks/:taskId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "dueDate": "2026-01-15"
}

Response: 200 OK
{
  "task": { ... }
}
```

#### Delete Task
```http
DELETE /api/tasks/:taskId
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Task deleted successfully"
}
```

#### Get Task Statistics
```http
GET /api/tasks/stats/summary
Authorization: Bearer {token}

Response: 200 OK
{
  "totalTasks": 10,
  "completedTasks": 3,
  "inProgressTasks": 4,
  "toDoTasks": 3,
  "overdueTasks": 1
}
```

## 💻 Usage Guide

### Creating Your First Task

1. **Log In**: Navigate to `http://localhost:3000` and log in with your credentials
2. **Create Task**: Click "Create Task" button in the dashboard
3. **Fill Details**:
   - Title: Task name
   - Description: Task details
   - Priority: Low, Medium, High, or Urgent
   - Due Date: Select deadline
   - Assign To: Enter assignee's email
4. **Submit**: Click "Create" to save the task

### Managing Tasks

- **Edit Task**: Click the edit icon (creator only)
- **Update Status**: Click status dropdown (assignee can update)
- **Delete Task**: Click delete icon (creator only)
- **View Details**: Click task card for full information

### Real-time Notifications

- **Toast Notifications**: Appear at bottom right for immediate updates
- **Notification Panel**: Click bell icon to view all notifications
- **Dismiss**: Mark notifications as read or delete

### Profile Management

1. Click your avatar in the top-right corner
2. Select "Edit Profile"
3. Update your name
4. Click "Save Changes"

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
# MongoDB Configuration
MONGO_URI=mongodb://admin:password@mongodb:27017/taskmanager?authSource=admin

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=4000
NODE_ENV=production
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

### Docker Environment Variables

Update `docker-compose.yml` for production:

```yaml
services:
  backend:
    environment:
      - MONGO_URI=mongodb://admin:secure_password@mongodb:27017/taskmanager?authSource=admin
      - JWT_SECRET=your_production_secret_key
      - NODE_ENV=production
```

## 🗄️ Database Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: Enum ['TO_DO', 'IN_PROGRESS', 'COMPLETED'],
  priority: Enum ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
  dueDate: Date,
  createdBy: ObjectId (User reference),
  assignedTo: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (User reference),
  taskId: ObjectId (Task reference),
  message: String,
  type: Enum ['TASK_ASSIGNED', 'TASK_UPDATED', 'TASK_COMPLETED'],
  read: Boolean,
  createdAt: Date
}
```

### Audit Log Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (User reference),
  taskId: ObjectId (Task reference),
  action: String,
  changes: Object,
  timestamp: Date
}
```

## 🔄 Real-time Features

### Socket.io Events

#### Task Updates
```javascript
// Task created
socket.on('taskCreated', (task) => {
  // Update UI with new task
})

// Task updated
socket.on('taskUpdated', (task) => {
  // Update UI with modified task
})

// Task deleted
socket.on('taskDeleted', (taskId) => {
  // Remove task from UI
})
```

#### Notifications
```javascript
// New notification
socket.on('notification', (notification) => {
  // Display notification toast
})

// Notification read
socket.on('notificationRead', (notificationId) => {
  // Update notification status
})
```

## 🔐 Permission System

### Task Creator Permissions
- ✅ Edit task title, description, priority, due date
- ✅ Delete task
- ✅ Change task assignee
- ✅ View all task details

### Task Assignee Permissions
- ✅ Update task status (To Do → In Progress → Completed)
- ❌ Cannot edit task details
- ❌ Cannot delete task
- ❌ Cannot reassign task

### Access Control Flow
```
Request → AuthMiddleware (JWT Verification)
       → TaskService (Permission Check)
       → Action (Create/Read/Update/Delete)
```

## 🐛 Troubleshooting

### Docker Issues

#### Container won't start
```bash
# View container logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Rebuild containers
docker-compose down
docker-compose up --build
```

#### Port conflicts
```bash
# Check if ports are in use
netstat -ano | findstr ":3000"
netstat -ano | findstr ":4000"

# Use different ports in docker-compose.yml
```

### Socket.io Connection Issues

#### CORS errors
- Ensure frontend URL is in backend CORS configuration
- Check `backend/src/index.ts` Socket.io cors settings
- Verify `frontend/nginx.conf` proxy settings

#### Connection timeouts
```bash
# Check backend logs
docker-compose logs backend

# Verify connectivity between containers
docker-compose exec frontend ping backend
```

### Authentication Issues

#### Token expired
- User needs to log in again
- Token refresh mechanism (implement if needed)

#### 401 Unauthorized
- Verify JWT token in cookies
- Check token expiration
- Ensure correct Authorization header

### MongoDB Connection Issues

#### Connection refused
```bash
# Check MongoDB container status
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Verify connection string in .env
```

#### Authentication failed
```bash
# Verify MongoDB credentials in docker-compose.yml
# Default: admin:password
```

## 🚀 Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB Atlas URL
heroku config:set MONGO_URI=your_mongodb_atlas_url

# Deploy
git push heroku main
```

### AWS Deployment

1. **EC2 Instance**: Launch Ubuntu instance
2. **Install Docker**: Follow Docker installation guide
3. **Clone Repository**: `git clone ...`
4. **Configure Env**: Update `.env` with production values
5. **Build & Run**: `docker-compose up -d`
6. **Setup SSL**: Use Let's Encrypt + Nginx

### Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Update MongoDB credentials
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL
- [ ] Setup automated backups for MongoDB
- [ ] Configure logging and monitoring
- [ ] Setup CI/CD pipeline
- [ ] Configure firewall rules
- [ ] Setup health checks and auto-restart

## 📝 Environment Setup for Production

```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# MongoDB Atlas Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure code passes linting

### Code Style

- Use ESLint for JavaScript/TypeScript
- Format with Prettier
- Follow existing naming conventions
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues and questions:
- Create an [Issue](https://github.com/yourusername/Collaborative-Task-Manager/issues)
- Check [Discussions](https://github.com/yourusername/Collaborative-Task-Manager/discussions)
- Review [Documentation](https://github.com/yourusername/Collaborative-Task-Manager/wiki)

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [React](https://react.dev/) - UI library
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.io](https://socket.io/) - Real-time communication
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Docker](https://www.docker.com/) - Containerization

---

**Built with ❤️ using MERN Stack**

**Last Updated**: December 15, 2025
