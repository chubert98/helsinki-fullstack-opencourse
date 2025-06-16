const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>name: <input value={props.values[0]} onChange={props.handlers.name} required/></div>
      <div>number: <input value={props.values[1]} onChange={props.handlers.number} required/></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

export default PersonForm
