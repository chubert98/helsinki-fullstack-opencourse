import React from 'react'
import './country-card.css'

const CountryCard = (props) => {
  return (
    <div>
      <h3><strong className='country-name'>{props.content.data.name.common}</strong> ({props.content.data.name.official})</h3>
      <p>Capital: {props.content.data.capital}</p>
      <p>Area: {props.content.data.area}m²</p>
      <h1>Languages</h1>
      <ul>
        {Object.values(props.content.data.languages).map((language)=> <li key={language}>{language}</li>)}
      </ul>
      <div><img className="country-flag" src={props.content.data.flags.svg} alt={props.content.data.flags.alt} /></div>
    </div>
  )
}

export default CountryCard
