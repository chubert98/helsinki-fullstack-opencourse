const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.title} {props.exercises}</p>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part title={props.parts[0].title} exercises={props.parts[0].exercises} />
      <Part title={props.parts[1].title} exercises={props.parts[1].exercises} />
      <Part title={props.parts[2].title} exercises={props.parts[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {part: 1, title: 'Fundamentals of React', exercises: 10},
    {part: 2, title: 'Using props to pass data', exercises: 7},
    {part: 3, title: 'State of a component', exercises: 14},
  ]

  return (
    <>
      <Header course={course} />
      <Content parts={parts} />
      <Total total={parts[0].exercises+parts[1].exercises+parts[2].exercises}/>
    </>
  )
}

export default App
