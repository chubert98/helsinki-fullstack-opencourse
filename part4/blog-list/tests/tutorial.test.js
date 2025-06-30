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
