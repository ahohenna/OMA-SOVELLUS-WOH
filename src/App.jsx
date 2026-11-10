import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import Tasks from './pages/Tasks.jsx'
import Calendar from './pages/Calendar.jsx'
import Progress from './pages/Progress.jsx'

function App() {
  return (
    <BrowserRouter>
      <nav className="d-flex justify-content-center gap-2 p-3">
        <Link className="btn btn-outline-primary rounded-pill" to="/tasks">
          Tasks
        </Link>
        <Link className="btn btn-outline-primary rounded-pill" to="/calendar">
          Calendar
        </Link>
        <Link className="btn btn-outline-primary rounded-pill" to="/progress">
          Progress
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App