import { useState } from 'react'

export default function Tasks() {
  const [taskName, setTaskName] = useState('')
  const [tasks, setTasks] = useState([])

  function addTask(event) {
    event.preventDefault()
    const name = taskName.trim()
    if (!name) return

    setTasks((currentTasks) => [...currentTasks, name])
    setTaskName('')
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
        {tasks.map((task, index) => (
          <li key={`${task}-${index}`}>{task}</li>
        ))}
      </ul>
    </>
  )
}