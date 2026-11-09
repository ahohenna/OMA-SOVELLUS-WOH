import { useEffect, useState } from 'react'
import './Tasks.css'

export default function Tasks() {
  const [taskName, setTaskName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [sticker, setSticker] = useState('')
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
  {
    id: crypto.randomUUID(),
    name,
    completed: false,
    dueDate,
    sticker,
    stickerX: 10,
    stickerY: 15,
},
])
setTaskName('')
setDueDate('')
setSticker('')
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
    <main className="tasks-page">
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
        <fieldset>
            <legend>Choose a sticker</legend>
            <label>
                <input
                type="radio"
                name="sticker"
                value=""
                checked={sticker === ''}
                onChange={(event) => setSticker(event.target.value)}
            />
            No sticker
        </label>
        <label>
            <input
            type="radio"
            name="sticker"
            value="/stickers/Star.svg"
            checked={sticker === '/stickers/Star.svg'}
            onChange={(event) => setSticker(event.target.value)}
        />
        <img src="/stickers/Star.svg" alt="Star sticker" width="64" height="64" />
        </label>
    </fieldset>
        
  



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
      <div className="sticker-layer">
  {tasks
    .filter((task) => task.sticker)
    .map((task) => (
      <img
        key={task.id}
        src={task.sticker}
        alt="Task sticker"
        style={{
          left: `${task.stickerX}%`,
          top: `${task.stickerY}%`,
        }}
      />
    ))}
</div>
    </main>
  )
}