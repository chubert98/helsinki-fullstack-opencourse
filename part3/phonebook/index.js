const express = require('express')
const morgan = require('morgan')
const app = express()

let people = require('./db.json')

app.use(express.json())
morgan.token('body', (req) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send("<h1>Welcome to Phonebook API</h1>")
})

app.get('/api/people', (request, response) => {
  response.send(people)
})

app.get('/api/people/:id', (request, response) => {
  const id = request.params.id
  const person = people.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const total = people.length
  const date = new Date
  const answer = `<p>Phonebook has info for ${total} people</p><p>${date}</p>`
  response.send(String(answer))
})

const generateId = () => {
  let found = false
  let newId = 0
  do {
    newId = Math.floor(Math.random()*100)
    found = !Boolean(people.find(person => person.id === newId))
  } while(!found)
  return String(newId)
}

const checkNames = (name) => {
  return Boolean(people.find(person => person.name === name))
}

app.post('/api/people', (request, response) => {
  const body = request.body
  if (!body.name) response.status(404).json({error: 'name missing'})
  if (!body.number) response.status(404).json({error: 'number missing'})
  if (checkNames(body.name)) response.status(404).json({error: 'name must be unique'})
  else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
    people = people.concat(person)
    response.json(person)
  }
})

app.delete('/api/people/:id', (request, response) => {
  const id = request.params.id
  const person = people.find((person) => person.id === id)

  if (person) {
    people = people.filter(person => person.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
