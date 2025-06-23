import { useState, useEffect } from 'react'
import peopleService from './services/people'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import People from './components/People'

const App = () => {
  const [people, setPeople] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState({type: 'success',content: null})

  useEffect(() => {
    peopleService
      .getAll()
      .then(initialPeople => {
        setPeople(initialPeople)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    let alreadyExists = people.map((person) => person.name).includes(newName)
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (alreadyExists) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        let existingPerson = people.find((person) => person.name === newName)

        peopleService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setMessage({type: 'success',content:`Updated ${returnedPerson.name}`})
            setTimeout(() => {
              setMessage({type: 'success',content:null})
            }, 3000)
            setPeople(people.map((person) => returnedPerson.id === person.id ? returnedPerson : person))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessage({type: 'error',content:`Information of ${existingPerson.name} has already been removed from server`})
            setTimeout(() => {
              setMessage({type: 'success',content:null})
            }, 3000)
          })
      }
    }
    else {

      peopleService
        .create(personObject)
        .then(returnedPerson => {
          setMessage({type: 'success',content:`Added ${returnedPerson.name}`})
          setTimeout(() => {
            setMessage({type: 'success',content:null})
          }, 3000)
          setPeople(people.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setMessage({type: 'error', content: "Valores inválidos"})
          setTimeout(() => {
            setMessage({type: 'success',content:null})
          }, 5000)
        })
    }
  }

  const deletePerson = (person) => {
    if(confirm(`Delete ${person.name}?`)){
      peopleService
        .deleteFromDB(person.id)
        .then(result => {
          setMessage({type: 'success',content:`Deleted ${person.name}`})
          setTimeout(() => {
            setMessage({type: 'success',content:null})
          }, 3000)
          setPeople(people.filter((x) => x.id !== person.id))
        })
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
      <Filter value={filter} handler={handleFilterChange} message={message}/>
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
      <People people={people} filter={filter} onClick={deletePerson} />
    </div>
  )
}

export default App
