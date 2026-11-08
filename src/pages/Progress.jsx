export default function Progress() {
  const savedTasks = localStorage.getItem('tasks')
  const tasks = savedTasks ? JSON.parse(savedTasks) : []

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const percent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return (
    <main>
      <h1>Progress</h1>
      <p>Tasks completed: {completedTasks} / {totalTasks}</p>
      <p>Progress: {percent}%</p>
    </main>
  )
}