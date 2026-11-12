import { useEffect, useState } from 'react'
import './Tasks.css'

const stickerFiles = [
  'big_star.svg',
  'boot.svg',
  'no_idea.svg',
  'sad_heart.svg',
  'sparkle.svg',
  'yeehaw.svg',
  'star_og.svg',
]

const stickerDescriptions = {
  'big_star.svg': 'Big star sticker',
  'boot.svg': 'Cowboy boot sticker',
  'no_idea.svg': 'I do not know text sticker',
  'sad_heart.svg': 'Sad heart sticker',
  'sparkle.svg': 'Sparkly sticker',
  'yeehaw.svg': 'Yeehaw text sticker',
  'star_og.svg': 'Happy star sticker',
}

const stickerPath = (file) => `${import.meta.env.BASE_URL}stickers/${file}`

export default function Tasks() {
  const [taskName, setTaskName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [sticker, setSticker] = useState('')
  const [placedStickers, setPlacedStickers] = useState(() => {
    const savedStickers = localStorage.getItem('placedStickers')
    return savedStickers
      ? JSON.parse(savedStickers).map((placedSticker) => ({
          ...placedSticker,
          src: placedSticker.src.startsWith('/stickers/')
            ? stickerPath(placedSticker.src.slice('/stickers/'.length))
            : placedSticker.src,
        }))
      : []
  })
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('placedStickers', JSON.stringify(placedStickers))
  }, [placedStickers])

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

  function removeSticker(event) {
    event.preventDefault()
    event.stopPropagation()

    const stickerId = event.dataTransfer.getData('text/plain')

    setPlacedStickers((current) =>
      current.filter((sticker) => sticker.id !== stickerId)
    )
  }

  function dropSticker(event) {
    event.preventDefault()

    const src = event.dataTransfer.getData('text/plain')
    if (!stickerFiles.some((file) => src === stickerPath(file))) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x =
    (Math.max(
      0,
      Math.min(bounds.width - 64, event.clientX - bounds.left - 32)
  ) /
  bounds.width) *
  100

const y =
  (Math.max(
    0,
    Math.min(bounds.height - 64, event.clientY - bounds.top - 32)
  ) /
    bounds.height) *
  100
  

    setPlacedStickers((current) => [
      ...current,
      { id: crypto.randomUUID(), src, x, y },
    ])
  }


  return (
    <main
      className="tasks-page"
      onDragOver={(event) => event.preventDefault()}
      onDrop={dropSticker}
    >
      <h1>Tasks</h1>

      <form onSubmit={addTask} className="w-75 mx-auto">
        <div className="row g-3">
  <div className="col-md-6">
    <label htmlFor="task-name">New task</label>
    <input
      id="task-name"
      className="form-control"
      maxLength={30}
      value={taskName}
      onChange={(event) => setTaskName(event.target.value)}
      placeholder="Write a task"
    />
  </div>

  <div className="col-md-6">
    <label htmlFor="task-due-date">Due date</label>
    <input
      id="task-due-date"
      className="form-control"
      type="date"
      value={dueDate}
      onChange={(event) => setDueDate(event.target.value)}
    />
  </div>
</div>
        <button type="submit" className="btn btn-primary rounded-pill mt-3 mb-4">
          Add
        </button>
      </form>
      <section className="sticker-picker mb-5">
        <h2 className="w-100">Decorate your page with stickers</h2>
        {stickerFiles.map((file) => {
          const src = stickerPath(file)
          return (
            <img
              key={file}
              src={src}
              alt={stickerDescriptions[file]}
              draggable="true"
              onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', src)
              }}
            />
          )
        })}

      </section>

      <ul className="list-group w-75 mx-auto">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center mb-2 rounded bg-primary-subtle"
          >
            <label className="flex-grow-1 text-center">
              <input
              type="checkbox"
                className="form-check-input me-2"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              {task.name}
              {task.dueDate && <span> — Due: {task.dueDate}</span>}
            </label>
            <button
              type="button"
              className="btn btn-danger rounded-pill"
              aria-label={`Delete task: ${task.name}`}
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div
        className="sticker-trash"
        onDragOver={(event) => event.preventDefault()}
        onDrop={removeSticker}
      >
        Drop a sticker here to remove it
      </div>




      <div className="sticker-layer">
        {placedStickers.map((placedSticker) => (
          <img
            key={placedSticker.id}
            src={placedSticker.src}
            alt="Placed sticker"
            draggable="true"
            onDragStart={(event) =>
              event.dataTransfer.setData('text/plain', placedSticker.id)
            }
            style={{
              left: `${placedSticker.x}%`,
              top: `${placedSticker.y}%`,
            }}
          />
        ))}

      </div>
    </main>
  )
}