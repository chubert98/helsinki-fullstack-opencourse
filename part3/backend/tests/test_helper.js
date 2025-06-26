const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
    userId: '685d82c9fd9055499f228759'
  },
  {
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
    userId: '685d82c9fd9055499f228759'
  },
  {
    content: 'tests',
    important: true,
    userId: '685d82c9fd9055499f228759'
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', userId: '685d82c9fd9055499f228759' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const testUser = {
  username: 'chubert',
  password: 'senha124'
}

module.exports = { initialNotes, nonExistingId, notesInDb, usersInDb, testUser }
