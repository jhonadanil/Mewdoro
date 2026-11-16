import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Note } from '../types'
import NoteCard from '../components/NoteCard'

const initialNotes: Note[] = [
  {
    id: 'demo',
    title: 'Nota de ejemplo',
    content: 'Esta es una nota de prueba. Puedes editarla o eliminarla.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const addNote = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim() && !content.trim()) return

    const now = new Date().toISOString()
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    }

    setNotes((current) => [newNote, ...current])
    setTitle('')
    setContent('')
  }

  const deleteNote = (id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id))
  }

  return (
    <section className="page">
      <h2 className="page__title">Mis notas</h2>

      <form className="note-form" onSubmit={addNote}>
        <input
          className="input"
          type="text"
          placeholder="Título de la nota"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <textarea
          className="input input--area"
          placeholder="Escribe algo..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
        />
        <button type="submit" className="btn btn--primary">
          Agregar nota
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="page__text">Todavía no tienes notas.</p>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      )}
    </section>
  )
}
