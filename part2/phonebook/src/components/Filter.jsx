import './filter.css'

const Filter = (props) => {
  return (
    <div>
      {props.message.content === null
        ? ""
        : <div className={props.message.type}><p>{props.message.content}</p></div>}
      <div>filter shown with: <input value={props.value} onChange={props.handler} required/></div>
    </div>
  )
}

export default Filter
