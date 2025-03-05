import express from 'express';
import mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import cors from 'cors';




dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());  // Enable CORS for all routes

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify the pool for async/await support
const promisePool = pool.promise();

// POST /tasks - Create a new task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const taskId = uuidv4();
  const query = `
    INSERT INTO tasks (id, title, description)
    VALUES (?, ?, ?)
  `;

  try {
    await promisePool.query(query, [taskId, title, description]);
    res.status(201).json({ id: taskId, title, description, completed: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// GET /tasks - Fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const [tasks] = await promisePool.query('SELECT * FROM tasks');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// GET /tasks/:id - Fetch a single task by ID
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const [task] = await promisePool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (task.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
});

// PUT /tasks/:id - Update a task by ID
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { title, description, completed } = req.body;

  try {
    const [task] = await promisePool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (task.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updateQuery = `
      UPDATE tasks
      SET title = ?, description = ?, completed = ?
      WHERE id = ?
    `;
    const updatedTitle = title || task[0].title;
    const updatedDescription = description || task[0].description;
    const updatedCompleted = completed !== undefined ? completed : task[0].completed;

    await promisePool.query(updateQuery, [updatedTitle, updatedDescription, updatedCompleted, taskId]);
    res.json({ id: taskId, title: updatedTitle, description: updatedDescription, completed: updatedCompleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// DELETE /tasks/:id - Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const [result] = await promisePool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});