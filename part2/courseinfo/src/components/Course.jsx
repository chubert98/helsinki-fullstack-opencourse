const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  )
}

const Content = ({parts}) => {
  return (
    parts.map((part)=> (<Part key={part.id} part={part}/>))
  )
}

const Part = ({part}) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Total = ({ sum }) => {
  return (
    <p><strong>total of {sum} exercises</strong></p>
  )
}

const Course = ({ course }) => {
  const sum = course.parts.reduce((sum, part)=> {
    console.log('hello', sum, part.exercises)
    return sum + part.exercises
  }, 0)

  return (
    <div>
      <Header course={course}/>
      <Content parts={course.parts} />
      <Total sum={sum}/>
    </div>
  )
}

export default Course
