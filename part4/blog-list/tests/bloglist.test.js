const assert = require('node:assert')
const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.initialBlogs)
})

const listWithZeroBlogs = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

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

      await api
        .post('/api/blogs')
        .send(listHelper.newBlog)
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

describe('tutorial tests', () => {
  test('dummy returns one', () => {
    const result = listHelper.dummy(listWithZeroBlogs)
    assert.strictEqual(result, 1)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithZeroBlogs)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculate right', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test('of the most likes', async () => {
    const favorite = {
      id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    }

    const response = await api.get('/api/blogs')
    const blogs = response.body
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, favorite)
  })

  test('has the most blogs', async () => {
    const most = {
      author: "Robert C. Martin",
      blogs: 3
    }
    const response = await api.get('/api/blogs')
    const blogs = response.body
    result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, most)
  })

  test('has the most likes', async () => {
    const most = {
      author: "Edsger W. Dijkstra",
      blogs: 17
    }
    const response = await api.get('/api/blogs')
    const blogs = response.body
    result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, most)
  })
})

after(async () => {
  await mongoose.connection.close()
})
