const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} year{props.age>1?"s":""} old</p>
    </div>
  )
}

const Footer = () => {
  return (
    <div>
      greeting app created by <a href="https://github.com/mluukkai">mluukkai</a>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 20
  const friends = [
    {name: 'Maya',age: 24},
    {name: 'Peter',age: 30}
  ]
  return (
    <>
      <h1>Greetings</h1>
      <Hello name='George' age={26+10}/>
      <Hello name={name} age={age} />
      <Hello name={friends[0].name} age={friends[0].age} />
      <Hello name={friends[1].name} age={friends[1].age} />
      <Footer />
    </>
  )
}

export default App
