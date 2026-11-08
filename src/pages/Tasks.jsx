import { useEffect, useState } from 'react'

export default function Tasks() {
  const [taskName, setTaskName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem('tasks')
  return savedTasks ? JSON.parse(savedTasks) : []
})

useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}, [tasks])

  function addTask(event) {
    event.preventDefault()
    const name = taskName.trim()
    if (!name) return

    setTasks((currentTasks) => [
  ...currentTasks,
  { id: crypto.randomUUID(), name, completed: false, dueDate },
])
setTaskName('')
setDueDate('')
  }

function toggleTask(taskId) {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            completedAt: task.completed
              ? null
              : new Date().toISOString(),
          }
        : task
    )
  )
}

function deleteTask(taskId) {
  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.id !== taskId)
  )
}



  return (
    <>
      <h1>Tasks</h1>

      <form onSubmit={addTask}>
        <label htmlFor="task-name">New task</label>
        <input
          id="task-name"
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
          placeholder="Write a task"
        />
        <label htmlFor="task-due-date">Due date</label>
        <input
        id="task-due-date"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {tasks.map((task) => (
  <li key={task.id}>
    <label>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
      />
      {task.name}
      {task.dueDate && <span> — Due: {task.dueDate}</span>}
    </label>
    <button type="button" onClick={() => deleteTask(task.id)}>
        Delete
        </button>
  </li>
))}
      </ul>
    </>
  )
}