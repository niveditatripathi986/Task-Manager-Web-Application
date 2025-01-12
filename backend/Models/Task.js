const mongoose = require('mongoose');

// Task model schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Task', taskSchema);
