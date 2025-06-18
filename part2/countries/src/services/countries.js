import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const searchAll = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(response => response.data)
}

const searchBy = (search) => {
  const request = axios.get(`${baseUrl}/name/${search}`)
  return request.then(response => response.data)
}

export default { searchAll, searchBy }
