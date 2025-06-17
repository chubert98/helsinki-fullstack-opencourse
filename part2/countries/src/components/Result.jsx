import React from 'react'

const Result = (props) => {
  return (
    <div>
      {props.value === ''
        ? <p>no search</p>
        : <p>{props.value}</p>
        }
    </div>
  )
}

export default Result
