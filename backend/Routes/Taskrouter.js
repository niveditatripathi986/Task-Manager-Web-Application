const express = require('express');
const router = express.Router();
const Task = require('../Models/Task');
const authMiddleware = require('../Middleware/auth');

// Protect all task routes
router.use(authMiddleware);

// Create a Task
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const task = new Task({
            title,
            description,
            user: req.user.id,
        });

        const savedTask = await task.save();
        res.status(201).json(savedTask); // Return the created task
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
