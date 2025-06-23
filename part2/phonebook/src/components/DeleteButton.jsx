import React from 'react'

const DeleteButton = (props) => {
  const handleClick = (event) => {
    event.preventDefault()
    props.onClick(props.person)
  }

  return (
    <button onClick={handleClick}>{props.text}</button>
  )
}

export default DeleteButton
