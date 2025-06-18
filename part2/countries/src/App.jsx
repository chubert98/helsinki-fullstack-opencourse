import React from 'react'
import './app.css'
import { useState } from 'react'
import searchService from './services/countries'
import SearchBar from './components/SearchBar'
import Result from './components/Result'
import { useEffect } from 'react'

const App = () => {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState({'result':null,'content':null})
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    searchService
      .searchAll()
      .then(allCountries => {
        setCountries(allCountries.map((country) => country.name.common))
      })
  }, [])

  if(!countries){
    return null
  }

  const defineSearch = (event) => {
    event.preventDefault()
    if (search != ''){
      let matchCountries = countries.filter((country) =>
        country.toLowerCase().includes(search.toLowerCase())).sort()
      searchCountry(matchCountries)
    }
  }

  const searchCountry = (matchCountries) => {
    if (matchCountries.length === 0) {
      setSearchResult({'result':'none','content':null})
    }
    else if (matchCountries.length === 1){
      searchService
      .searchBy(matchCountries[0])
      .then(data => {
        setSearchResult({'result':'single','content':{data}})
      })
    }
    else if (matchCountries.length > 10){
      setSearchResult({'result':'too-many','content':null})
    }
    else {
      setSearchResult({'result':'multiple','content':matchCountries})
    }
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <SearchBar value={search} handler={handleSearchChange} onSubmit={defineSearch} />
      <Result result={searchResult.result} content={searchResult.content} handlers={{searchCountry, setSearch}}/>
    </div>
  )
}

export default App
