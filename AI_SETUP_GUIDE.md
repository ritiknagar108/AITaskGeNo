# 🧠 AI Task Generation - Complete Setup Guide

## 📋 Overview

This guide will help you set up and configure the AI-powered task generation feature in your MERN application.

---

## 🔧 Installation

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

New packages added:
- **axios**: HTTP client for AI API calls
- **chrono-node**: Smart date parsing library

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory and add:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-tasks-db

# JWT
JWT_SECRET=your_jwt_secret_here

# AI Provider Configuration
AI_PROVIDER=openai
# Options: "openai", "deepseek", "gemini"
```

---

## 🚀 AI Provider Setup

Choose ONE of the following AI providers:

### Option 1: OpenAI (Recommended for beginners)

1. **Get API Key:**
   - Visit https://platform.openai.com/api-keys
   - Create a new API key
   - Store it securely

2. **Add to .env:**
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
   OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4 for better results
   ```

3. **Pricing:**
   - GPT-3.5-turbo: ~$0.002 per 1K tokens
   - GPT-4: ~$0.03 per 1K tokens

---

### Option 2: DeepSeek (Cost-effective alternative)

1. **Get API Key:**
   - Visit https://platform.deepseek.com/api
   - Create a new API key

2. **Add to .env:**
   ```env
   AI_PROVIDER=deepseek
   DEEPSEEK_API_KEY=sk_xxxxxxxxxxxxxxx
   DEEPSEEK_MODEL=deepseek-chat
   ```

3. **Pricing:**
   - Much cheaper than OpenAI (~$0.0001 per 1K tokens)

---

### Option 3: Google Gemini (Free tier available)

1. **Get API Key:**
   - Visit https://ai.google.dev/
   - Create a new API key

2. **Add to .env:**
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Pricing:**
   - Free tier: 60 requests/minute
   - Generous free quota for testing

---

## 📱 API Endpoint

### Generate Tasks from Natural Language

**Endpoint:** `POST /api/ai/generate-tasks`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "text": "I have GATE exam on Feb 15, need to complete CN by Feb 1, practice daily"
}
```

**Response:**
```json
{
  "message": "✅ Generated 4 task(s) successfully",
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete CN syllabus",
      "description": "Finish Computer Networks before exam",
      "deadline": "2026-02-01T00:00:00.000Z",
      "priority": "high",
      "category": "study",
      "recurring": "none",
      "subtasks": ["Revise topics", "Solve PYQs"],
      "status": "pending",
      "userId": "507f1f77bcf86cd799439012",
      "createdAt": "2026-04-02T10:30:00.000Z",
      "updatedAt": "2026-04-02T10:30:00.000Z"
    }
  ]
}
```

---

## 💡 Input Examples

### Example 1: Study Goal with Deadline
```
"I have GATE exam on February 15, need to complete Computer Networks and Data Structures by February 1, practice daily for 3 hours"
```

**Generates:**
- Study CN and DS with High priority
- Deadline: 2026-02-01
- Recurring: Daily practice

---

### Example 2: Project with Multiple Goals
```
"Launch website by next month, design landing page, setup backend API, integrate payment gateway, test everything"
```

**Generates:**
- 4-5 specific tasks
- Category: Project/Work
- Proper priority distribution
- Subtasks for complex items

---

### Example 3: Health & Fitness
```
"Lose 10kg in 3 months, gym 4 times a week, run daily, improve diet"
```

**Generates:**
- Weekly gym sessions
- Daily running
- Diet improvement task
- Category: Health
- Medium to High priority

---

## ✅ Field Descriptions

### Priority Levels
- **High**: Urgent or has deadline < 3 days
- **Medium**: Important but flexible timeline
- **Low**: Optional or long-term goal

### Categories
- **Study**: Academic learning
- **Work**: Job-related tasks
- **Project**: Personal/professional projects
- **Health**: Fitness, wellness
- **Personal**: Other personal goals

### Recurring Options
- **Daily**: Every day
- **Weekly**: Every week
- **Monthly**: Every month
- **None**: One-time task

### Status Values
- **pending**: Not started
- **in-progress**: Currently working on it
- **completed**: Finished

---

## 🛠️ Frontend Usage

The new `GenerateTask.jsx` component provides:

1. **Natural Language Input:**
   - Large textarea for user input
   - Helper hint showing example format

2. **Task Display:**
   - Priority badges with color coding
   - Deadline formatting (Today, Tomorrow, relative dates)
   - Category badges with emojis
   - Subtasks visualization
   - Recurring pattern display

3. **Task Selection:**
   - Click tasks to select them
   - Checkbox indication
   - Visual feedback

---

## 📊 Success Metrics

Your implementation is working when:

✅ User enters natural language text
✅ System extracts multiple tasks
✅ Deadlines are parsed correctly (Feb 15 → 2026-02-15)
✅ Priority is auto-assigned based on urgency
✅ Categories are correctly inferred
✅ Recurring patterns are detected
✅ Subtasks are generated for complex goals
✅ Tasks are saved to MongoDB
✅ Frontend displays all fields properly

---

## 🐛 Troubleshooting

### Error: "No AI provider configured"
**Solution:** Add API key and provider name to .env file

### Error: "Failed to parse AI response"
**Solution:** 
- Check API connectivity
- Verify API keys are valid
- Try with a different AI provider
- System will fallback to empty task list

### Error: "Date parsing failed"
**Solution:**
- Use clear date formats (Feb 15, 2026-02-15)
- Specify year if ambiguous
- System stores as `null` if date can't be parsed

### Tasks saved but not showing up
**Solution:**
- Check MongoDB connection in .env
- Verify JWT token is passed correctly
- Check browser console for errors

---

## 🚀 Optimization Tips

### 1. Improve AI Response Quality
```javascript
// Use more specific prompts for your domain
const systemPrompt = `You are a task extraction AI for ${DOMAIN}...`;
```

### 2. Cache Frequent Requests
```javascript
// Implement Redis caching for repeated inputs
const cachedResponse = await redis.get(userText);
```

### 3. Batch Processing
```javascript
// Process multiple inputs in parallel
const tasks = await Promise.all(texts.map(generateTasksWithAI));
```

### 4. Add Confidence Scoring
```json
{
  "tasks": [...],
  "confidence": 0.95
}
```

---

## 📚 Advanced Features

### Feature 1: Smart Date Parsing
Already implemented using `chrono-node`:
- Natural dates: "tomorrow", "next Monday"
- Relative dates: "in 3 days"
- Formatted dates: "Feb 15, 2026"

### Feature 2: Priority Override Logic
```javascript
if (deadline && daysUntil < 3) {
  priority = 'High'; // Auto-upgrade to High
}
```

### Feature 3: Task Deduplication
```javascript
const uniqueTasks = [...new Set(tasks.map(t => t.title))];
```

### Feature 4: Error Recovery
- Returns empty `tasks: []` instead of crashing
- System gracefully handles invalid AI responses

---

## 🔒 Security Considerations

1. **API Key Protection:**
   - Never commit .env to git
   - Use environment variables only
   - Rotate keys regularly

2. **Rate Limiting:**
   - Add rate limiter to `/api/ai/generate-tasks`
   - Prevent abuse of AI API calls

3. **Input Validation:**
   - Limit text length (max 5000 chars)
   - Sanitize user input

4. **JWT Verification:**
   - All requests require valid token
   - Backend validates ownership

---

## 📞 Support

If you encounter issues:

1. Check the error message in browser console
2. Review .env configuration
3. Verify MongoDB connection
4. Test with a different AI provider
5. Check API provider status page

---

## 🎉 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` with API key
3. ✅ Start backend: `npm run dev`
4. ✅ Start frontend: `npm run dev`
5. ✅ Test with natural language input

**Your AI task generator is ready! 🚀**
