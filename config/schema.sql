-- Create the database
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY,       -- UUID for unique task IDs
    title VARCHAR(255) NOT NULL,      -- Task title
    description TEXT,                 -- Task description
    completed BOOLEAN DEFAULT FALSE,  -- Task completion status
);

-- Optional: Add an index for faster lookups
CREATE INDEX idx_tasks_completed ON tasks (completed);