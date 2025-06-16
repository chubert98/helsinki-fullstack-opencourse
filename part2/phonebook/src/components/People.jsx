const People = ({ people, filter }) => {
  return (
    <div>
      {filter === ''
        ? people.map((person)=> <p key={person.name}>{person.name} {person.number}</p>)
        : people.filter((person) => String(person.name).toLowerCase().includes(String(filter).toLowerCase())).map((person)=> <p key={person.name}>{person.name} {person.number}</p>)
      }
    </div>
  )
}

export default People
