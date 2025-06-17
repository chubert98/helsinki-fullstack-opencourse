import React from 'react'

const SearchBar = (props) => {
  return (
    <div>
      <form onSubmit={props.onSubmit}>
        <label  htmlFor="search-input">find countries</label>
        <input id='search-input' name='search-input' type="text" value={props.search} onChange={props.handler}/>
      </form>
    </div>
  )
}

export default SearchBar
