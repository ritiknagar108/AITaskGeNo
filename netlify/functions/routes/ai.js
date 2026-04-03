const express = require('express');
const { generateTasks, generateTasksLegacy } = require('../controllers/aiController');
const auth = require('../middleware/auth');

const router = express.Router();

// New natural language endpoint
router.post('/generate-tasks', auth, generateTasks);

// Legacy endpoint for backward compatibility
router.post('/generate-tasks-legacy', auth, generateTasksLegacy);

module.exports = router;