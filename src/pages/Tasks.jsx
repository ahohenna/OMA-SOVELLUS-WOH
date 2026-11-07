import { useEffect, useState } from 'react'

export default function Tasks() {
  const [taskName, setTaskName] = useState('')
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
  { id: crypto.randomUUID(), name, completed: false },
])
setTaskName('')
  }

  function toggleTask(taskId) {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
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