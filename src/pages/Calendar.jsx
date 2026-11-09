import { useState } from 'react'
import './Calendar.css'
export default function Calendar() {
  const [displayedMonth, setDisplayedMonth] = useState(() => new Date())
  const savedTasks = localStorage.getItem('tasks')
  const tasks = savedTasks ? JSON.parse(savedTasks) : []

  const scheduledTasks = tasks
    .filter((task) => task.dueDate)
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
  
  const year = displayedMonth.getFullYear()
  const month = displayedMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const mondayOffset = (firstDay.getDay() + 6) % 7
  const calendarDays = Array.from({ length: 42 }, (_, index) =>
  new Date(year, month, index - mondayOffset + 1)
)

function formatDate(date) {
  const monthNumber = String(date.getMonth() + 1).padStart(2, '0')
  const dayNumber = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${monthNumber}-${dayNumber}`
}

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

<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: '4px',
  }}
>
  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
    <strong key={day}>{day}</strong>
  ))}
  {calendarDays.map((day) => (
  <div
    key={formatDate(day)}
    style={{
      minHeight: '50px',
      padding: '6px',
      border: '1px solid #ccc',
      opacity: day.getMonth() === month ? 1 : 0.45,
    }}
  >
    <strong>{day.getDate()}</strong>
    {scheduledTasks
    .filter((task) => task.dueDate === formatDate(day))
    .map((task) => (
    <div className="calendar-task" key={task.id}>{task.name}</div>
  ))}
  </div>
))}

</div>

</main>
  )
}