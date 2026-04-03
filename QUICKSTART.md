# AI Task Generator - Quick Start Guide

## Prerequisites
- Node.js v20+
- MongoDB Atlas account with connection string
- npm/yarn

## Setup Instructions

### 1. Environment Configuration

**Backend (.env file):**
```
MONGO_URI=mongodb+srv://ritiknagar255:ritiknagar255@clustertechnotes.314ua.mongodb.net/?appName=Clustertechnotes
JWT_SECRET=your-secret-key-here
PORT=5000
```

**Frontend (.env if needed):**
```
VITE_API_URL=http://localhost:5000
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
✓ Backend runs on http://localhost:5000

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
✓ Frontend runs on http://localhost:5178 (or next available port)

## Available Features

### Authentication
- **Register:** Create new user account (name, email, password)
- **Login:** Authenticate with email/password
- **Profile:** View/update user profile
- **Password Change:** Update account password

### Task Management
- **Create Tasks:** Manually add tasks with title, description, status, priority
- **View Tasks:** List all personal tasks with filtering
- **Update Tasks:** Modify task details
- **Delete Tasks:** Remove completed/unwanted tasks
- **Task Search:** Find tasks by title

### AI-Powered Features
- **Generate Tasks:** Create tasks based on goal/difficulty/duration
- **Available Difficulties:** Easy, Medium, Hard
- **Auto Task Creation:** AI generates 5 related subtasks

### Analytics & Insights
- **Dashboard:** View task statistics and overview
- **Completion Rate:** Track task completion percentage
- **Task Distribution:** View tasks by status and priority
- **Productivity Insights:** Get recommendations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/password` - Update password (protected)

### Tasks
- `GET /api/tasks` - Get all user tasks (protected)
- `POST /api/tasks` - Create new task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `GET /api/tasks/stats` - Get task statistics (protected)

### AI
- `POST /api/ai/generate-tasks` - Generate AI tasks (protected)

## Project Structure

```
AI tasks Creator/
├── backend/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Authentication
│   ├── services/          # AI service
│   ├── server.js          # Main server
│   └── .env               # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── context/       # React context (Auth)
    │   ├── services/      # API client
    │   ├── App.jsx        # Router
    │   └── App.css        # Styles
    └── .env               # Frontend config
```

## Common Tasks

### Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn TypeScript",
    "description": "Master TypeScript fundamentals",
    "status": "pending",
    "priority": "high"
  }'
```

### Generate AI Tasks
```bash
curl -X POST http://localhost:5000/api/ai/generate-tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Build a web app",
    "difficulty": "medium",
    "duration": 7
  }'
```

### Get All Tasks
```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### MongoDB Connection Failed
- Verify MONGO_URI in .env
- Ensure MongoDB Atlas cluster allows your IP
- Check internet connection

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify VITE_API_URL is correct

### Port Already in Use
- Frontend: Automatically tries 5173-5178
- Backend: Change PORT in .env

## Production Deployment

### Backend (Heroku/Railway Example)
```bash
# Set environment variables on platform
npm install --production
npm run dev
```

### Frontend (Vercel/Netlify Example)
```bash
npm run build
# Deploy dist/ folder
```

## Features Implemented ✅
- ✅ User Authentication (JWT)
- ✅ Task CRUD Operations
- ✅ AI Task Generation (Mock)
- ✅ Dashboard with Stats
- ✅ Analytics Page
- ✅ Profile Management
- ✅ Responsive Design
- ✅ Modern UI
- ✅ Error Handling
- ✅ Loading States

## Contact & Support
For issues or questions, check the test results in TEST_RESULTS.md
