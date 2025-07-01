import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState({type: 'success',content: null})

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = (props) => {
    return (
      <div>
        {props.message.content === null
          ? ""
          : <div className={props.message.type}><p>{props.message.content}</p></div>}
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({ type: 'error', content: 'wrong username or password' })
      setTimeout(() => {
        setMessage({ type: 'success', content: null })
      }, 5000)
    }
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setMessage({
          type: 'success',
          content: `a new blog ${newTitle} by ${newAuthor} added`
        })
        setTimeout(() => {
          setMessage({ type: 'success', content: null })
        }, 5000)
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  if (user == null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message}/>
        <form onSubmit={handleLogin}>
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

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message}/>
      <p>{user.name} logged in<button onClick={() => logOut()}>logout</button></p>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="Title">Title:</label>
          <input
            type="text"
            id="Title"
            name="Title"
            value={newTitle}
            onChange={ ({ target }) => setNewTitle(target.value) }
            required
          />
        </div>
        <div>
          <label htmlFor="Author">Author:</label>
          <input
            type="text"
            id="Author"
            name="Author"
            value={newAuthor}
            onChange={ ({ target }) => setNewAuthor(target.value) }
            required
          />
        </div>
        <div>
          <label htmlFor="Url">Url:</label>
          <input
            type="text"
            id="Url"
            name="Url"
            value={newUrl}
            onChange={ ({ target }) => setNewUrl(target.value) }
            required
          />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default App
