import { useEffect, useState } from 'react'
import './Progress.css'
export default function Progress() {
  const [quote, setQuote] = useState(null)
  const [quoteError, setQuoteError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadQuote() {
      try {
        const response = await fetch('https://dummyjson.com/quotes/random')

        if (!response.ok) {
          throw new Error('API-pyyntö epäonnistui')
        }

        const quoteData = await response.json()

        if (!quoteData.quote) {
          throw new Error('API-vastauksesta puuttuu mietelause')
        }

        if (!ignore) setQuote(quoteData)
      } catch (error) {
        if (!ignore) {
          setQuoteError(
            error instanceof Error ? error.message : 'Tuntematon virhe'
          )
        }
      }
    }

    loadQuote()

    return () => {
      ignore = true
    }
  }, [])


  const savedTasks = localStorage.getItem('tasks')
  const tasks = savedTasks ? JSON.parse(savedTasks) : []

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const percent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  const completedDays = new Set(
    tasks
      .filter((task) => task.completed && task.completedAt)
      .map((task) => {
        const date = new Date(task.completedAt)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${date.getFullYear()}-${month}-${day}`
      })
  )

  function dateKey(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${date.getFullYear()}-${month}-${day}`
  }

  const streakDate = new Date()
  if (!completedDays.has(dateKey(streakDate))) {
    streakDate.setDate(streakDate.getDate() - 1)
  }

  let streak = 0
  while (completedDays.has(dateKey(streakDate))) {
    streak += 1
    streakDate.setDate(streakDate.getDate() - 1)
  }

  return (
    <main className="container py-4">
      <h1>Progress</h1>
      {quoteError && <p role="alert">Mietelausetta ei voitu ladata: {quoteError}</p>}
      {!quote && !quoteError && <p>Ladataan mietelausetta...</p>}
      {quote && (
        <div className="card mb-3 bg-primary-subtle">
          <blockquote className="card-body">
            <p>“{quote.quote}”</p>
            {quote.author && <cite>— {quote.author}</cite>}
          </blockquote>
        </div>
      )}
      <div className="row g-3">
        <div className="col-md-6 order-2">
          <div className="card h-100 bg-primary-subtle">
            <div className="card-body">
              <h2 className="card-title">Tasks completed</h2>
              <p>{completedTasks} / {totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 order-3">
          <div className="card h-100 bg-primary-subtle">
            <div className="card-body">
              <h2 className="card-title">Progress</h2>
              <p>{percent}%</p>
              <div
                className="progress"
                role="progressbar"
                aria-label="Task completion"
                aria-valuenow={percent}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 order-1">
          <div className="card h-100 bg-primary-subtle">
            <div className="card-body">
              <div className="streak-stars" aria-hidden="true">
                <img src="/stickers/big_star.svg" alt="" className="streak-star streak-star-small" />
                <img src="/stickers/big_star.svg" alt="" className="streak-star streak-star-large" />
                <img src="/stickers/big_star.svg" alt="" className="streak-star streak-star-small streak-star-right" />
              </div><h2 className="card-title">Current streak</h2><p className="display-1 mb-0">{streak}</p>
              <p className="fs-4">days</p>
            </div>
          </div>
        </div></div>
    </main>
  )
}