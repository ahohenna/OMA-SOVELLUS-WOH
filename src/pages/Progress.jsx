import { useEffect, useState } from 'react'
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
    <main>
      <h1>Progress</h1>
            {quoteError && <p role="alert">Mietelausetta ei voitu ladata: {quoteError}</p>}
      {!quote && !quoteError && <p>Ladataan mietelausetta...</p>}
      {quote && (
        <blockquote>
          <p>“{quote.quote}”</p>
          {quote.author && <cite>— {quote.author}</cite>}
        </blockquote>
      )}
      <p>Tasks completed: {completedTasks} / {totalTasks}</p>
      <p>Progress: {percent}%</p>
      <p>Current streak: {streak} days</p>
    </main>
  )
}