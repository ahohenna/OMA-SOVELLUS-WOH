import { useState } from 'react'
export default function Calendar() {
  const [displayedMonth, setDisplayedMonth] = useState(() => new Date())
  const savedTasks = localStorage.getItem('tasks')
  const tasks = savedTasks ? JSON.parse(savedTasks) : []

  const scheduledTasks = tasks
    .filter((task) => task.dueDate)
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate))

  return (
    <main>
      <h1>Calendar</h1>
      <button
  type="button"
  onClick={() =>
    setDisplayedMonth(
      new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1)
    )
  }
>
  Previous
</button>

<strong>
  {displayedMonth.toLocaleDateString('en', {
    month: 'long',
    year: 'numeric',
  })}
</strong>

<button
  type="button"
  onClick={() =>
    setDisplayedMonth(
      new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1)
    )
  }
>
  Next
</button>

      {scheduledTasks.length === 0 ? (
        <p>No tasks with due dates yet.</p>
      ) : (
        <ul>
          {scheduledTasks.map((task) => (
            <li key={task.id}>
              <strong>
                {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString()}
              </strong>
              {' — '}
              {task.name}
              {task.completed && ' (Completed)'}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}