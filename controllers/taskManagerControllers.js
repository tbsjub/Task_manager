
const { v4: uuidv4 } = require('uuid');
const taskId = uuidv4(); // Generates a unique UUID

//get all tasks as list
const mysqlPool = require("../config/db")

const getTasks = async (req,res) => {
    try{
        const [ rows ] = await mysqlPool.query('SELECT * FROM tasks')
        if(rows.length == 0)
        {
            return res.status(404).send({
                success: false,
                message:'No task found'
            })
        }

        res.status(200).send({
            success:true,
            message:'All tasks found',
            length: rows.length,
            data: rows,
        })
    }
    catch(error){
        console.log(error)
        res.send(500).send({
            success:false,
            message: 'Error in getTasks API',
            error: error.message,
        })
    }
}

const getTasksByID = async (req, res) => {
    try{
        const taskID = req.params.id
        if (!taskID)
        {
            return res.status(404).send({
                success: false,
                message: 'Provide a valid id',
            })
        }

        const data = await mysqlPool.query(`SELECT * FROM task_manager WHERE id=?`, [taskID]);

        if(!data)
        {
            return res.status(404).send({
                success: false,
                message: 'no task with given id'
            })
        }
        res.status(200).send({
            success:true,
            taksDetails: data[0],
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'error finding task by id',
            error: error.message,
        })
    }
}


// CREATE TASK
const CreateTask = async (req,res) => {
    try 
    {
        const { title, description } = req.body;
        if (!title || !description )
        {
            return req.status(500).send({
                success: false,
                message: 'please provide all the fields'
            })
        }

        const data = await mysqlPool.query(`INSERT INTO tasks (id, title, description) VALUES (?, ?, ?)` ,[taskId, title, description ]);

        if(!data)
        {
            return res.status(404).send({
                success: false,
                message: "unable adding the task",
                error: error.message
            })
        }

        res.status(200).send({
            success: true,
            message: "successfully added the task",
            data: data,
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'could not create the task',
            error: error.message,
        })
    }
}

//update a task
const updateTask = async (req, res) => 
    {
        try{
            const taskID = req.params.id
            if(!taskID)
            {
                return res.status(404).send({
                    success:false,
                    message: "invalid id or provide id",
                    error: error.message
                })
            }

            const {title, description, completed} = req.body
            const data = await mysqlPool.query(`UPDATE tasks set title = ?, description = ?, completed = ? WHERE id = ?`, [title, description, completed, taskID])

            if(!data)
            {
                return res.status(500).send({
                    success:false,
                    message:"error in updating"
                })
            }

            return res.status(200).send({
                success:true,
                message:"Successfully updated"
    
            })
        }
        catch(error)
        {
            console.log(error);
            res.status(500).send({
                success:false,
                message:"Problem in update API",
                error: error.message
            })
        }
    }

    //Delete a task
    const deleteTask = async (req, res) => {
        try{
            const taskId = req.params.id;
            if (!taskId)
            {
                return res.status(404).send({
                    success:false,
                    message:"Provide a valid id"
                })
            }

            const data = await mysqlPool.query(`DELETE FROM tasks WHERE id = ?`, taskId)
            if (!data)
            {
                return res.status(500).send({
                    success:false,
                    message:"couldn't delete the task"
                })
            }

            return res.status(200).send({
                success:true,
                message:"successfully deleted",
            })

        }
        catch(error)
        {
            console.log(error);
            res.status(500).send({
                success:false,
                message:"Problem in the delete API",
                error: error.message
            })
        }
    }

module.exports = { getTasks, getTasksByID, CreateTask, updateTask, deleteTask }