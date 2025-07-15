const router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const Person = require('../models/person')

router.post('/reset/notes', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

router.post('/reset/people', async (request, response) => {
  await Person.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
