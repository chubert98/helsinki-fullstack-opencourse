import { useState } from "react"
import loginService from '../services/login'

const LoginForm = ({ logIn, errorDisplay }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      logIn(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      errorDisplay('Wrong credentials')
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={() => setUsername(event.target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={() => setPassword(event.target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
    </div>
  )
}

export default LoginForm
