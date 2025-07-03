import { useState } from "react"
import loginService from '../services/login'

const LoginForm = ({ handleLogin, messageDisplay }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const logIn = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      handleLogin(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      messageDisplay({ type: 'error', content: 'wrong username or password' })
    }
  }

  return (
    <div>
      <form onSubmit={logIn}>
        <div>
          <label htmlFor="Username">Username:</label>
          <input
            type="text"
            id="Username"
            name="Username"
            value={username}
            onChange={ ({ target }) => setUsername(target.value) }
            required
          />
        </div>
        <div>
          <label htmlFor="Password">Password:</label>
          <input
            type="password"
            id="Password"
            name="Password"
            value={password}
            onChange={ ({ target }) => setPassword(target.value) }
            required
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
