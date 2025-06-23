import DeleteButton from "./DeleteButton"

const People = ({ people, filter, onClick }) => {
  return (
    <div>
      {filter === ''
        ? (
          people.map((person) => <p key={person.name}>{person.name} {person.number}<DeleteButton onClick={onClick} person={person} text="delete"/></p>))
        : people.filter((person) => String(person.name).toLowerCase().includes(String(filter).toLowerCase())).map((person)=> <p key={person.name}>{person.name} {person.number}<DeleteButton onClick={onClick} person={person} text="delete"/></p>)
      }
    </div>
  )
}

export default People
