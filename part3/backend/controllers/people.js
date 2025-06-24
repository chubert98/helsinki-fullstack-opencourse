const peopleRouter = require('express').Router()
const Person = require('../models/person')

peopleRouter.get('/', (request, response, next) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
    .catch(error => next(error))
})

peopleRouter.get('/:id', (request, response, next) => {
  if (request.params.id === 'info') {
    Person.find({})
      .then(people => {
        const total = people.length
        const date = new Date
        const answer = `<p>Phonebook has info for ${total} people</p><p>${date}</p>`
        response.send(String(answer))
      })
      .catch(error => next(error))
  } else {
    Person.findById(request.params.id)
      .then(person => {
        response.json(person)
      })
      .catch(error => next(error))
  }
})

peopleRouter.post('/', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      next(error)
    })
})

peopleRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

peopleRouter.put('/:id', (request, response, next) => {
  const body = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.number = body.number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

module.exports = peopleRouter
