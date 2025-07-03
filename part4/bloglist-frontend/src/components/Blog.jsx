import { useState } from "react"

const Blog = ({ blog, addLike, deleteBlog }) => {
  const [blogVisibility, setBlogVisibility] = useState('view')
  const loggedUser = JSON.parse(window.localStorage.getItem('loggedBloglistUser'))

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = (event) => {

    if (blogVisibility === 'view') setBlogVisibility('hide')
    if (blogVisibility === 'hide') setBlogVisibility('view')
  }

  const newLike = async (event) => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes + 1,
      url: blog.url,
      user: blog.user.id
    }

    await addLike(blog.id, blogObject)
  }

  const removeBlog = async (blog) => {
    if(confirm(`Remove blog ${blog.title} by ${blog.author}?`)) await deleteBlog(blog.id)
  }

  return (
    <div style={blogStyle}>
      <p>Title: {blog.title} | Author: {blog.author}
        <button onClick={() => toggleVisibility()}>{blogVisibility}</button>
      </p>
      <div style={blogVisibility === 'view' ? {display:'none'} : {display:'block'}}>
        <p>{blog.url}</p>
        <p>likes {blog.likes}<button onClick={() => newLike()}>like</button></p>
        <p>{blog.user.name}</p>
        { loggedUser && loggedUser.name === blog.user.name ? <button onClick={() => removeBlog(blog)} >remove</button> : null }
      </div>
    </div>
  )
}

export default Blog
