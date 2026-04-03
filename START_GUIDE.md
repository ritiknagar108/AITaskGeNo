# 🚀 AI Task Generator - START HERE

## How to Use Your Application Right Now

Your **AI Task Generator MERN application is ready to use immediately**. Both servers are running.

### Option 1: Open in Browser (Recommended)

1. **Go to:** http://localhost:5178
2. **Click:** "Sign Up" button
3. **Enter:**
   - Full Name: Your name
   - Email: Any email (e.g., user@example.com)
   - Password: Any password
4. **Click:** "Register"
5. **Now you can:**
   - Create tasks manually
   - Generate AI tasks by goal
   - View your task statistics
   - Check analytics
   - Update your profile

### Option 2: Use API Directly (Advanced)

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "user@test.com",
    "password": "password123"
  }'
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn TypeScript",
    "description": "Master TypeScript basics",
    "status": "pending",
    "priority": "high"
  }'
```

**Get All Tasks:**
```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Generate AI Tasks:**
```bash
curl -X POST http://localhost:5000/api/ai/generate-tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Build a web app with React",
    "difficulty": "medium",
    "duration": 7
  }'
```

---

## ✨ Key Features to Try

1. **Dashboard** - View your task statistics
2. **Generate Task** - Let AI create tasks for you
3. **Tasks** - Manage all your tasks
4. **Analytics** - See your productivity insights
5. **Profile** - Update your password

---

## 🔑 Access URLs

- **Frontend:** http://localhost:5178
- **Backend API:** http://localhost:5000
- **API Docs:** Check [README.md](README.md)

---

## 📱 What's Running

- ✅ Backend Server (Express.js)
- ✅ Frontend Application (React)
- ✅ MongoDB Database (Atlas)
- ✅ All APIs working
- ✅ All pages loaded

---

## 🛑 Stop the Servers

**Backend:**
```bash
# Press Ctrl+C in backend terminal
```

**Frontend:**
```bash
# Press Ctrl+C in frontend terminal
```

---

## ❓ Troubleshooting

**Can't access http://localhost:5178?**
- Port might be different (check terminal - it shows actual port)
- Try: http://localhost:5173, :5174, :5175, :5176, :5177, :5178, :5179...

**Getting authentication errors?**
- Clear browser cache (Ctrl+Shift+Del)
- Try incognito/private window

**Backend connection failed?**
- Restart backend: `npm run dev` in backend folder
- Check internet connection for MongoDB

---

**You're all set! Open http://localhost:5178 and start using your app!** 🎉
