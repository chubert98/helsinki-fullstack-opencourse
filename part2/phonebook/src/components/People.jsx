const People = ({ people, filter, onClick }) => {
  return (
    <div>
      {filter === ''
        ? (
          people.map((person) => <p key={person.name}>{person.name} {person.number}<button onClick={()=>onClick(person)}>delete</button></p>))
        : people.filter((person) => String(person.name).toLowerCase().includes(String(filter).toLowerCase())).map((person)=> <p key={person.name}>{person.name} {person.number}<button onClick={()=>onClick(person)}>delete</button></p>)
      }
    </div>
  )
}

export default People
