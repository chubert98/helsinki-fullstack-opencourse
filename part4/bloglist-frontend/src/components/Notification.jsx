const Notification = (props) => {
  return (
    <div>
      {props.message.content === null
        ? ""
        : <div className={props.message.type}><p>{props.message.content}</p></div>}
    </div>
  )
}

export default Notification
