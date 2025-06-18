import React from 'react'
import './result.css'
import CountryCard from './CountryCard'

const Result = (props) => {
  if (props.result === null || props.result === 'none'){
    return (
      <div>
        <p>no results</p>
      </div>
    )
  }

  if (props.result === 'too-many'){
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  if (props.result === 'single'){
    return (
      <CountryCard content={props.content}/>
    )
  }

  if (props.result === 'multiple'){
    return (
      <div>
        {props.content.map((name) =>
          <p className='country-list' key={name}>{name}
            <button onClick={()=> {
              document.getElementById('search-input').value = name
              props.handlers.setSearch(name)
              props.handlers.searchCountry([name])
              }}>
              Show
            </button>
          </p>)}
      </div>
    )
  }
}

export default Result
