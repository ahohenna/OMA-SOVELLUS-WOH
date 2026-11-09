import { useEffect, useState } from 'react'
export default function Progress() {
    const [quote, setQuote] = useState(null)
  const [quoteError, setQuoteError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadQuote() {
      try {
        const response = await fetch(
          'https://cdn.jsdelivr.net/gh/GomezMig03/MotivationalAPI/en.json'
        )

        if (!response.ok) {
          throw new Error('API-pyyntö epäonnistui')
        }

        const quotes = await response.json()

        if (!Array.isArray(quotes) || quotes.length === 0) {
          throw new Error('API ei palauttanut mietelauseita')
        }

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

        if (!randomQuote.phrase) {
          throw new Error('Mietelause puuttuu API-vastauksesta')
        }

        if (!ignore) setQuote(randomQuote)
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
          <p>“{quote.phrase}”</p>
          {quote.author && <cite>— {quote.author}</cite>}
        </blockquote>
      )}
      <p>Tasks completed: {completedTasks} / {totalTasks}</p>
      <p>Progress: {percent}%</p>
      <p>Current streak: {streak} days</p>
    </main>
  )
}