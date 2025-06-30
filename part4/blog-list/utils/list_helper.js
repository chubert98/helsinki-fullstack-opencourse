const _ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: "6862d3d2b9cb3bb5027a359e",
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: "6862d3d2b9cb3bb5027a359e",
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: "6862d3d2b9cb3bb5027a359e",
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    user: "6862d3d2b9cb3bb5027a359e",
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    user: "6862d3d2b9cb3bb5027a359e",
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    user: "6862d3d2b9cb3bb5027a359e",
    __v: 0
  }
]

const newBlog = {
  title: 'test adding blog',
  author: 'Carlos Hubert',
  url: 'carloshubert.com/test-adding-blog',
  likes: 0,
  user: "6862d3d2b9cb3bb5027a359e",
}

const newUser = {
  username: 'teste',
  name: 'teste',
  password: 'senha124'
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'a', author: 'a', url: 'a', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let total = 0
  blogs.forEach(blog => {
    total += blog.likes
  });
  return blogs.length === 0 ? 0 : blogs.length === 1 ? blogs[0].likes : total
}

const favoriteBlog = (blogs) => {
  let favorite = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
  return favorite
}

const mostBlogs = (blogs) => {
  let authors = _.mapValues(_.groupBy(blogs,'author'), _.size)
  let mostauthor = _.maxBy(Object.keys(authors), key => authors[key])
  let most = { author: mostauthor, blogs: authors[mostauthor]}
  return most
}

const mostLikes = (blogs) => {
  let authors = _.mapValues(_.groupBy(blogs,'author'), (group) => _.reduce(group, (sum, item) => sum + item.likes, 0))
  let mostauthor = _.maxBy(Object.keys(authors), key => authors[key])
  let most = { author: mostauthor, blogs: authors[mostauthor]}
  return most
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const testUser = {
  username: 'teste',
  password: 'senha124'
}

module.exports = { initialBlogs, newBlog, newUser, nonExistingId, dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, blogsInDb, usersInDb, testUser }
