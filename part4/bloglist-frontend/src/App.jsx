import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({type: 'success',content: null})
  const blogFormRef = useRef()

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

  const messageDisplay = (message) => {
    setMessage({ type: message.type, content: message.content })
    setTimeout(() => {
      setMessage({ type: 'success', content: null })
    }, 5000)
  }

  const handleLogin = async (userObject) => {
    blogService.setToken(userObject.token)
    setUser(userObject)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      messageDisplay({
        type: 'success',
        content: `a new blog ${blogObject.title} by ${blogObject.author} added`
      })
      const finalBlog = await blogService.getById(returnedBlog.id)
      setBlogs(blogs.concat(finalBlog))
      blogFormRef.current.toggleVisibility()
    } catch (e) {
      console.log(e)
      messageDisplay({ type: 'error', content: e.response.data.error })
      return "failed"
    }
  }

  const addLike = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? { ...blog, likes: returnedBlog.likes} : blog))
    } catch (e) {
      console.log(e)
      messageDisplay({ type: 'error', content: e.response.data.error })
    }
  }

  const deleteBlog = async id => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (e) {
      messageDisplay({ type: 'error', content: e.response.data.error })
    }
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const blogForm = () => {
    return (
      <Toggable buttonLabel="new blog" ref={blogFormRef} >
        <BlogForm addBlog={addBlog} messageDisplay={messageDisplay} />
      </Toggable>
    )
  }

  const loginForm = () => {
    return (
      <Toggable buttonLabel="login" >
        <LoginForm handleLogin={handleLogin} messageDisplay={messageDisplay} />
      </Toggable>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message}/>

      { !user
        ? loginForm()
        : <div>
            <p>{user.name} logged-in<button onClick={logOut}>logout</button></p>
            {blogForm()}
          </div>
      }
      <div>
        <h3>Blog list</h3>
        { blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              addLike={addLike}
              deleteBlog={deleteBlog}
            />
          )
        }
      </div>

    </div>
  )
}

export default App
