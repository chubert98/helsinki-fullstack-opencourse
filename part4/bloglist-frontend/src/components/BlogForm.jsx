import { useState } from "react";

const BlogForm = ({ addBlog, messageDisplay }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const newBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    }

    const result = await addBlog(blogObject)
    if (result !== "failed") {
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    }
  }

  return (
    <div>
      <form onSubmit={newBlog}>
        <div>
          <label htmlFor="Title">Title:</label>
          <input
            type="text"
            id="Title"
            name="Title"
            value={newTitle}
            onChange={ (event) => setNewTitle(event.target.value) }
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
            onChange={ (event) => setNewAuthor(event.target.value) }
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
            onChange={ (event) => setNewUrl(event.target.value) }
            required
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
