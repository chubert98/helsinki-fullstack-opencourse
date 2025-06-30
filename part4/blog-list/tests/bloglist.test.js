const assert = require('node:assert')
const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.initialBlogs)
})

describe('when there is initially blogs saved', () => {
  test('blogs are returned as JSON', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, listHelper.initialBlogs.length)
  })

  test('blogs have correct id attribute', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body.map(blog => blog.hasOwnProperty('id'))
    assert.strictEqual(blogs.every(value => value === true), true)
  })

  describe('adding a new blog', () => {
    test('succeeds with valid data', async () => {
      const response = await api.get('/api/blogs')
      const blogsAtStart = response.body
      const user = await User.findOne({})
      const newBlog = listHelper.newBlog
      newBlog.user = user.id

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await listHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const contents = blogsAtEnd.map(n => n.title)
      assert(contents.includes('test adding blog'))
    })

    test('fails with status code 400 if likes attribute is missing', async () => {
      const newBlog = listHelper.newBlog
      delete newBlog.likes

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('fails with status code 400 if title or url attributes are missing', async () => {
      let newBlog = listHelper.newBlog
      delete newBlog.title

      let result = []
      let response = await api
        .post('/api/blogs')
        .send(newBlog)

      result.push(response.status)

      newBlog = listHelper.newBlog
      delete newBlog.url

      response = await api
        .post('/api/blogs')
        .send(newBlog)
      result.push(response.status)

      assert.deepStrictEqual(result, [ 400, 400 ])
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await listHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await listHelper.blogsInDb()

      const contents = blogsAtEnd.map(n => n.title)
      assert(!contents.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length - 1)
    })
  })

  describe('update of existing blog', () => {
    test('succeeds updating valid id with valid data', async () => {
      const blogsAtStart = await listHelper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      blogToUpdate.title = 'new updated title'

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const nonExistingId = await listHelper.nonExistingId()


      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send(listHelper.newBlog)
        .expect(404)
    })

    test('fails with status code 400 if data is invalid', async () => {
      const blogsAtStart = await listHelper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      delete blogToUpdate.title
      blogToUpdate.likes = 20

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(400)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('senha124', 10)
    const user = new User({ username: 'teste', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(listHelper.newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code and message if username is too short', async () => {
    const usersAtStart = await listHelper.usersInDb()
    const newUser = listHelper.newUser
    newUser.username = 'te'

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert(result.body.error.includes('is shorter than the minimum allowed length '))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code and message if password is too short', async () => {
    const usersAtStart = await listHelper.usersInDb()
    const newUser = listHelper.newUser
    newUser.password = 'se'

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert(result.body.error.includes('is shorter than the minimum allowed length '))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
