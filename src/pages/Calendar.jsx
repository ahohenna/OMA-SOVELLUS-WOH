export default function Calendar() {
  const savedTasks = localStorage.getItem('tasks')
  const tasks = savedTasks ? JSON.parse(savedTasks) : []

  const scheduledTasks = tasks
    .filter((task) => task.dueDate)
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate))

  return (
    <main>
      <h1>Calendar</h1>

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