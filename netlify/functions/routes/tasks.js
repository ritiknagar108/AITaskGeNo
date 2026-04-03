const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, getStats } = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getTasks);
router.post('/', auth, createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.get('/stats', auth, getStats);

module.exports = router;