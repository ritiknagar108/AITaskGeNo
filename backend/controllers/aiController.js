const Task = require('../models/Task');
const { generateTasksWithAI } = require('../services/aiService');

/**
 * Generate tasks from natural language input
 * POST /api/ai/generate-tasks
 */
exports.generateTasks = async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: 'Please provide text describing your tasks or goals',
        tasks: []
      });
    }

    // Generate tasks using AI service
    const generatedTasks = await generateTasksWithAI(text);

    // If no tasks generated, return empty response
    if (!generatedTasks || generatedTasks.length === 0) {
      return res.json({
        message: 'Could not extract tasks from your input. Try with more specific descriptions.',
        tasks: []
      });
    }

    // Prepare tasks for database storage
    const tasksToSave = generatedTasks.map(task => ({
      title: task.title,
      description: task.description,
      priority: task.priority.toLowerCase(),
      category: task.category.toLowerCase(),
      deadline: task.deadline ? new Date(task.deadline) : null,
      recurring: task.recurring.toLowerCase(),
      subtasks: task.subtasks || [],
      status: 'pending',
      userId: req.userId
    }));

    // Save to MongoDB
    const savedTasks = await Task.insertMany(tasksToSave);

    res.json({
      message: `✅ Generated ${savedTasks.length} task(s) successfully`,
      tasks: savedTasks
    });

  } catch (err) {
    console.error('Error generating tasks:', err);
    
    // Return safe error response without crashing
    res.status(500).json({
      message: 'Error processing your request. Please try again.',
      tasks: [],
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Legacy endpoint for backward compatibility
 */
exports.generateTasksLegacy = async (req, res) => {
  try {
    const { goal, difficulty, duration } = req.body;

    if (!goal || !difficulty || !duration) {
      return res.status(400).json({
        message: 'Goal, difficulty, and duration are required'
      });
    }

    // Convert legacy input to natural language format
    const naturalText = `I want to learn ${goal}. Difficulty: ${difficulty}. Duration: ${duration} days. Please break this into actionable tasks.`;
    
    // Use the new AI generation system
    const generatedTasks = await generateTasksWithAI(naturalText);

    if (!generatedTasks || generatedTasks.length === 0) {
      return res.json({
        message: 'Could not generate tasks',
        tasks: []
      });
    }

    const tasksToSave = generatedTasks.map(task => ({
      title: task.title,
      description: `Generated for goal: ${goal}`,
      priority: task.priority.toLowerCase(),
      category: task.category.toLowerCase(),
      deadline: task.deadline ? new Date(task.deadline) : null,
      recurring: task.recurring.toLowerCase(),
      subtasks: task.subtasks || [],
      status: 'pending',
      userId: req.userId
    }));

    const savedTasks = await Task.insertMany(tasksToSave);

    res.json({
      message: `Generated ${savedTasks.length} tasks successfully`,
      tasks: savedTasks
    });

  } catch (err) {
    console.error('Error in legacy endpoint:', err);
    res.status(500).json({
      message: 'Error generating tasks: ' + err.message
    });
  }
};