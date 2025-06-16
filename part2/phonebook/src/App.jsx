import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import People from './components/People'

const App = () => {
  const [people, setPeople] = useState([
    { name: 'Arto Hellas', number: '040-1234567', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    let alreadyExists = people.map((person) => person.name).includes(newName)
    const personObject = {
      name: newName,
      number: newNumber,
      id: (people.length + 1)
    }

    if (alreadyExists) {
      let message = `${newName} is already added to phonebook`
      alert(message)
    }
    else {
      setPeople(people.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} handler={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        values={[newName,newNumber]}
        handlers={{
          name: handleNameChange,
          number: handleNumberChange,
        }}
      />
      <h3>Numbers</h3>
      <People people={people} filter={filter} />
    </div>
  )
}

export default App
