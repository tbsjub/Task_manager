const express = require('express');
const { getTasks, getTasksByID, CreateTask, updateTask, deleteTask } = require('../controllers/taskManagerControllers');

//router object
const router = express.Router();

//get all tasks
router.get('/getall', getTasks);

//getTasks by id
router.get('/tasks/:id', getTasksByID);

//create Tasks
router.post('/create', CreateTask);

//update tasks
router.put('/update/:id', updateTask);

//deleting a task
router.delete('/delete/:id', deleteTask);

module.exports = router;