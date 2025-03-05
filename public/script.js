const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

const backendUrl = 'http://localhost:3000';

// Fetch all tasks on page load
fetch(`${backendUrl}/tasks`)
  .then(response => response.json())
  .then(tasks => {
    tasks.forEach(task => addTaskToDOM(task));
  })
  .catch(error => console.error('Error fetching tasks:', error));

// Add a new task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
  
    const response = await fetch(`${backendUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });
  
    if (response.ok) {
      const task = await response.json();
      addTaskToDOM(task);
      taskForm.reset();
    } else {
      console.error('Failed to add task');
    }
  });

// Add a task to the DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.setAttribute('data-id', task.id); // Add data-id attribute
  li.innerHTML = `
    <strong>${task.title}</strong>
    <p>${task.description}</p>
    <button onclick="deleteTask('${task.id}')">Delete</button>
  `;
  taskList.appendChild(li);
}

// Delete a task
async function deleteTask(taskId) {
  try {
    const response = await fetch(`${backendUrl}/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the task from the DOM
      const li = document.querySelector(`li[data-id="${taskId}"]`);
      if (li) li.remove();
    } else {
      console.error('Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}
