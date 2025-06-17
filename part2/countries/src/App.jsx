import React from 'react'
import { useState } from 'react'
import searchService from './services/countries'
import SearchBar from './components/SearchBar'
import Result from './components/Result'
import { useEffect } from 'react'

const App = () => {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState({'result':null,'content':null})
  const [countries, setCountries] = useState(null)

  /*
    if == 0 setSearchResult({'failed',null})
    if == 1 setSearchResult({'single',[result]})
    if > 1 setSearchResult({'multiple',[result]})
  */

  useEffect(() => {
    searchService
      .searchAll()
      .then(allCountries => {
        setCountries(allCountries.map((country) => country.name))
      })
  }, [])

  if(!countries){
    return null
  }

  const searchCountry = (event) => {
    event.preventDefault()
    if (search != ''){
      let matchCountries = countries.filter((country) =>
        country.common.toLowerCase().includes(search.toLowerCase()) || country.official.toLowerCase().includes(search.toLowerCase))

      if (matchCountries.length === 1){
        searchService
        .searchBy(matchCountries[0].common)
        .then(data => {
          console.log(data)
        })
      }

    }
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <p>debug: {search}</p>
      <SearchBar value={search} handler={handleSearchChange} onSubmit={searchCountry} />
      <Result value={search} />
    </div>
  )
}

export default App
