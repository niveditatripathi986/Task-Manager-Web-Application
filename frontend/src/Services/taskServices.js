import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

// Get all tasks
export const getTasks = async (token) =>
    await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Create a new task
export const createTask = async (task, token) =>
    await axios.post(API_URL, task, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Update a task
export const updateTask = async (id, updatedTask, token) =>
    await axios.put(`${API_URL}/${id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
    });

// Delete a task
export const deleteTask = async (id, token) =>
    await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
