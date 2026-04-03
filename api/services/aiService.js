const axios = require('axios');
const chrono = require('chrono-node');

/**
 * Generate structured tasks from natural language input using AI
 * @param {string} userText - Natural language input from user
 * @returns {Array} Array of task objects with all required fields
 */
const generateTasksWithAI = async (userText) => {
  try {
    if (!userText || userText.trim().length === 0) {
      return [];
    }

    const aiResponse = await callAI(userText);
    const cleanedResponse = cleanJSONResponse(aiResponse);
    const parsedTasks = parseAIResponse(cleanedResponse);
    
    // Normalize dates and validate structure
    const normalizedTasks = normalizeTasks(parsedTasks, userText);
    
    return normalizedTasks;
  } catch (err) {
    console.error('AI Service Error:', err.message);
    // Return empty array instead of crashing
    return [];
  }
};

/**
 * Call AI API (OpenAI, DeepSeek, or Gemini)
 * Supports multiple AI providers via environment variable
 */
const callAI = async (userText) => {
  const provider = process.env.AI_PROVIDER || 'openai';
  
  const systemPrompt = `You are a task extraction AI. Convert natural language input into structured tasks.

RULES:
1. Extract EVERY actionable item
2. Break complex goals into smaller tasks
3. Return ONLY valid JSON, no explanations or markdown code blocks
4. Use this exact structure:
{
  "tasks": [
    {
      "title": "Task name",
      "description": "Brief description",
      "deadline": "YYYY-MM-DD or null",
      "priority": "High|Medium|Low",
      "category": "Study|Work|Project|Health|Personal",
      "recurring": "Daily|Weekly|Monthly|None",
      "subtasks": []
    }
  ]
}

LOGIC:
- Deadline: Extract dates, use YYYY-MM-DD format
- Priority: High if deadline < 3 days or marked urgent, Medium for important, Low for optional
- Category: Infer from context
- Recurring: Detect "daily", "weekly", "monthly" patterns
- Subtasks: Break down complex tasks`;

  let response;

  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    response = await callOpenAI(userText, systemPrompt);
  } else if (provider === 'deepseek' && process.env.DEEPSEEK_API_KEY) {
    response = await callDeepSeek(userText, systemPrompt);
  } else if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
    response = await callGemini(userText, systemPrompt);
  } else {
    // Fallback logic in case no provider is configured
    console.warn('No AI provider configured, using fallback task generation');
    return generateFallbackResponse(userText);
  }

  return response;
};

/**
 * Fallback local parser for small testable set when AI provider is not configured
 */
const generateFallbackResponse = (userText) => {
  const cleaned = userText.trim();
  const sentences = cleaned.split(/[\.\n]/).map(s => s.trim()).filter(Boolean);
  const tasks = sentences.map(sentence => {
    // derive title from sentence
    const title = sentence;

    // detect possible deadline (first date-like phrase)
    const parsed = chrono.parse(sentence);
    const deadline = parsed.length > 0 ? parsed[0].start.date() : null;

    // detect recurring keywords
    let recurring = 'None';
    const sentenceLower = sentence.toLowerCase();
    if (sentenceLower.includes('daily') || sentenceLower.includes('every day')) recurring = 'Daily';
    else if (sentenceLower.includes('weekly') || sentenceLower.includes('every week')) recurring = 'Weekly';
    else if (sentenceLower.includes('monthly') || sentenceLower.includes('every month')) recurring = 'Monthly';

    // detect category
    let category = 'Personal';
    if (/study|exam|prepare|learn/.test(sentenceLower)) category = 'Study';
    else if (/project|work|meeting|deliverable|deadline/.test(sentenceLower)) category = 'Work';
    else if (/health|gym|run|diet|fitness/.test(sentenceLower)) category = 'Health';

    // detect urgent
    let priority = 'Medium';
    if (sentenceLower.includes('urgent') || sentenceLower.includes('asap')) priority = 'High';
    else if (sentenceLower.includes('optional') || sentenceLower.includes('if possible')) priority = 'Low';

    return {
      title,
      description: sentence,
      deadline: deadline ? `${deadline.getFullYear()}-${String(deadline.getMonth() + 1).padStart(2, '0')}-${String(deadline.getDate()).padStart(2, '0')}` : null,
      priority,
      category,
      recurring,
      subtasks: []
    };
  });

  return JSON.stringify({ tasks });
};

/**
 * Call OpenAI API
 */
const callOpenAI = async (userText, systemPrompt) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText }
      ],
      temperature: 0.7,
      top_p: 0.9
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  return response.data.choices[0]?.message?.content || '{"tasks": []}';
};

/**
 * Call DeepSeek API
 */
const callDeepSeek = async (userText, systemPrompt) => {
  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText }
      ],
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  return response.data.choices[0]?.message?.content || '{"tasks": []}';
};

/**
 * Call Google Gemini API
 */
const callGemini = async (userText, systemPrompt) => {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\nUser input: ${userText}` }
          ]
        }
      ]
    },
    {
      timeout: 30000
    }
  );

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{"tasks": []}';
};

/**
 * Remove markdown code blocks and clean JSON response
 */
const cleanJSONResponse = (response) => {
  if (!response) return '{"tasks": []}';
  
  // Remove markdown code blocks
  let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Try to extract JSON if wrapped in text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  return cleaned;
};

/**
 * Safely parse AI response as JSON
 */
const parseAIResponse = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks && Array.isArray(data.tasks)) {
      return data.tasks;
    }
    return [];
  } catch (err) {
    console.error('Failed to parse AI response:', err.message);
    return [];
  }
};

/**
 * Normalize and validate task structure
 */
const normalizeTasks = (tasks, contextText) => {
  return tasks
    .filter(task => task && task.title) // Remove invalid entries
    .map((task, index) => ({
      title: String(task.title || '').trim() || `Task ${index + 1}`,
      description: String(task.description || '').trim() || task.title,
      deadline: normalizeDate(task.deadline, contextText) || null,
      priority: validatePriority(task.priority, task.deadline),
      category: validateCategory(task.category),
      recurring: validateRecurring(task.recurring),
      subtasks: Array.isArray(task.subtasks) ? task.subtasks.filter(s => s).map(s => String(s)) : []
    }));
};

/**
 * Normalize date strings to YYYY-MM-DD format
 */
const normalizeDate = (dateValue, contextText) => {
  if (!dateValue && !contextText) return null;

  let dateStr = String(dateValue || '').trim();
  
  // Already in correct format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  try {
    // Use chrono-node for smart date parsing
    const fullText = dateStr || contextText;
    const results = chrono.parse(fullText);
    
    if (results && results.length > 0) {
      const date = results[0].start.date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (err) {
    console.warn('Date parsing failed:', err.message);
  }

  return null;
};

/**
 * Validate and fix priority based on deadline
 */
const validatePriority = (priority, deadline) => {
  const validPriorities = ['High', 'Medium', 'Low'];
  const priorityStr = String(priority || 'Medium').trim();
  
  // Fix capitalization
  const corrected = priorityStr.charAt(0).toUpperCase() + priorityStr.slice(1).toLowerCase();
  
  if (!validPriorities.includes(corrected)) {
    // Auto-assign High if deadline is soon
    if (deadline) {
      const daysUntil = Math.floor((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntil < 3 && daysUntil >= 0) return 'High';
    }
    return 'Medium';
  }

  return corrected;
};

/**
 * Validate category
 */
const validateCategory = (category) => {
  const validCategories = ['Study', 'Work', 'Project', 'Health', 'Personal'];
  const categoryStr = String(category || 'Personal').trim();
  
  const corrected = validCategories.find(cat => 
    cat.toLowerCase() === categoryStr.toLowerCase()
  ) || 'Personal';

  return corrected;
};

/**
 * Validate recurring pattern
 */
const validateRecurring = (recurring) => {
  const validRecurring = ['Daily', 'Weekly', 'Monthly', 'None'];
  const recurringStr = String(recurring || 'None').trim();
  
  const corrected = validRecurring.find(rec => 
    rec.toLowerCase() === recurringStr.toLowerCase()
  ) || 'None';

  return corrected;
};

module.exports = { generateTasksWithAI };