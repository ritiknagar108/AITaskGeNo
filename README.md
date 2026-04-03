# 🚀 AI Task Generator - Full-Stack MERN Application

A production-ready MERN (MongoDB, Express, React, Node.js) application for intelligent task management with AI-powered task generation, user authentication, and comprehensive analytics.

## ⚡ Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5178
```

**That's it!** The application is now running with full authentication and AI features.

## 🎯 Features

### 🔐 Authentication
- User registration with email
- Secure JWT-based authentication (7-day tokens)
- Password hashing with bcryptjs
- Protected private routes
- Automatic token refresh

### 📝 Task Management
- Create tasks with title, description, status, priority
- View all personal tasks in real-time
- Update task details
- Delete completed tasks
- Task filtering by status and priority
- Search tasks by title

### 🤖 AI Task Generation
- Generate tasks from natural language goals
- Difficulty levels: Easy, Medium, Hard
- Duration-based task planning
- Auto-generates 5 related subtasks
- Mock AI service (easily swappable with OpenAI)

### 📊 Analytics & Dashboard
- Real-time task statistics
- Completion rate tracking
- Task distribution by status
- Priority-based insights
- Productivity recommendations
- Recent tasks overview

### 👤 User Profile
- View account information
- Change password securely
- Manage user preferences
- Logout functionality

## 🏗️ Architecture

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend Stack
- **React 18** - UI library
- **Vite** - Build tool (lightning-fast)
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

### Database Models

**User Schema:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

**Task Schema:**
```javascript
{
  title: String,
  description: String,
  status: String (pending/completed/in-progress),
  priority: String (low/medium/high),
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## 📡 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/profile         - Get user profile (protected)
PUT    /api/auth/password        - Update password (protected)
```

### Task Endpoints
```
GET    /api/tasks                - Get all tasks (protected)
POST   /api/tasks                - Create new task (protected)
PUT    /api/tasks/:id            - Update task (protected)
DELETE /api/tasks/:id            - Delete task (protected)
GET    /api/tasks/stats          - Get task stats (protected)
```

### AI Endpoints
```
POST   /api/ai/generate-tasks    - Generate AI tasks (protected)
```

## 🔧 Environment Configuration

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 🎨 UI Pages & Components

### Pages
1. **Login** - User authentication page
2. **Register** - New user registration
3. **Dashboard** - Main overview with stats
4. **Generate Task** - AI task generation interface
5. **Tasks** - Full task management page
6. **Analytics** - Detailed analytics and insights
7. **Profile** - User profile and settings

### Components
- **Navbar** - Navigation with conditional routing
- **TaskCard** - Reusable task display component
- **Loader** - Loading spinner
- **PrivateRoute** - Protected route wrapper

## ✅ Testing Status

All features have been tested and verified working:

- ✅ User registration and JWT token generation
- ✅ Task creation and retrieval from MongoDB
- ✅ Task CRUD operations
- ✅ AI task generation with 5 subtasks
- ✅ Authentication middleware
- ✅ Frontend build compilation
- ✅ Database connections
- ✅ Error handling and validation

See [TEST_RESULTS.md](TEST_RESULTS.md) for detailed test results.

## 🚀 Production Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables on platform
2. Push code to repository
3. Platform auto-deploys on git push
4. MongoDB Atlas connection works globally

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set API URL to production backend
4. Enable CORS on backend for domain

## 🔄 To Integrate Real AI (OpenAI/DeepSeek)

Update `backend/services/aiService.js`:

```javascript
const { Configuration, OpenAIApi } = require("openai");

const generateTasksWithAI = async (goal, difficulty, duration) => {
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  }));

  const prompt = `Generate 5 tasks for: ${goal} (${difficulty} level, ${duration} days)`;
  
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });

  // Parse response and create tasks
};
```

## 📚 File Structure

```
AI tasks Creator/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── taskController.js    # Task logic
│   │   └── aiController.js      # AI logic
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── tasks.js             # Task endpoints
│   │   └── ai.js                # AI endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── services/
│   │   └── aiService.js         # AI task generation
│   ├── server.js                # Main server
│   ├── .env                     # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── Loader.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── GenerateTask.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── Analytics.jsx
    │   │   └── Profile.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Auth state management
    │   ├── services/
    │   │   └── api.js            # Axios instance
    │   ├── App.jsx               # Router setup
    │   ├── App.css               # App styles
    │   └── index.css             # Global styles
    ├── .env
    └── package.json
```

## 🐛 Troubleshooting

### Backend Won't Start
- Check MongoDB URI in .env
- Ensure port 5000 is available
- Verify all dependencies installed: `npm install`

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check if API URL in .env is correct
- Clear browser cache and localStorage

### MongoDB Connection Issues
- Verify IP in MongoDB Atlas whitelist
- Check MONGO_URI syntax
- Ensure database not full/quota exceeded

### Tasks Not Appearing
- Ensure user is logged in (token in headers)
- Check browser console for errors
- Verify tasks are saved to correct userId

## 📞 Support

For issues or questions:
1. Check TEST_RESULTS.md for verification
2. Review QUICKSTART.md for setup help
3. Verify all environment variables are set
4. Check backend/frontend console for error messages

## 📄 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Detailed setup guide
- [TEST_RESULTS.md](TEST_RESULTS.md) - Complete test verification
- [copilot-instructions.md](.github/copilot-instructions.md) - AI setup

## 🎓 Learning Resources

This project demonstrates:
- Full MERN stack development
- JWT authentication
- RESTful API design
- React Context API for state management
- MongoDB database design
- Responsive UI with modern CSS
- Error handling best practices

## 📜 License

This project is open source and available for educational purposes.

---

**Status:** ✅ Production Ready
**Last Updated:** April 2, 2026
**Servers Running:** Backend (5000) + Frontend (5178)
