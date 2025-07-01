import { useState, useEffect, useRef } from "react"
import Note from "./components/Note"
import noteService from './services/notes'
import Notification from "./components/Notification"
import Footer from "./components/Footer"
import LoginForm from "./components/LoginForm"
import Toggable from "./components/Toggable"
import NoteForm from "./components/NoteForm"

const App = () => {
  const [notes, setNotes] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  if (!notes) {
    return null
  }

  const errorDisplay = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(error => {
        errorDisplay(`Note ${note.content} was already removed from server`)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
      .catch(error => {
        errorDisplay('invalid note')
      })
  }

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important)

  const handleLogin = (userObject) => {
    noteService.setToken(userObject.token)
    setUser(userObject)
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const noteForm = () => {
    return (
      <Toggable buttonLabel="new note" ref={noteFormRef} >
        <NoteForm createNote={addNote} />
      </Toggable>
    )
  }

  const loginForm = () => {
    return (
      <Toggable buttonLabel="login">
        <LoginForm logIn={handleLogin} errorDisplay={errorDisplay} />
      </Toggable>
    )
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>

      { !user
        ? loginForm()
        : <div>
            <p>{user.name} logged-in<button onClick={logOut}>logout</button></p>
            {noteForm()}
        </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>

      <Footer />
    </div>
  )
}

export default App
