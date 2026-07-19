const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test.only('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})


test.only('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})


test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert(titles.includes('Inception'))
})


test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Kung Fu",
    author: "Xingchi Zhou",
    url: "www.kungfu.com",
    likes: 34546,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const authors = blogsAtEnd.map(b => b.author)

  assert(authors.includes('Xingchi Zhou'))
})


test('blog without title is not added', async () => {
  const newBlog = {
    author: "Fan Guo",
    url: "www.planetearth.com",
    likes: 7657454,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]


  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})


test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(b => b.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})


test('the unique identifier property is named id', async () => {
  const blogs = await helper.blogsInDb()

  blogs.forEach(blog => {
    assert(blog.id !== undefined)
  })
})


test('Missing likes property defaults to 0', async () => {
  const newBlog = {
    title: 'Saving Private Ryan',
    author: 'Tom Hanks',
    url: 'www.savingprivateryan.com',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)

  const blogsAtEnd = await helper.blogsInDb()
  const savedBlog = blogsAtEnd.find(b => b.title === 'Saving Private Ryan')
  assert.strictEqual(savedBlog.likes, 0)
})


test('Missing title property causes 400 Bad Request', async () => {
  const newBlog = {
    author: 'Zack Schnider',
    url: 'www.supermanvsbatman.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})


test('Missing url property causes 400 Bad Request', async () => {
  const newBlog = {
    title: 'Superman vs Batman',
    author: 'Zack Schnider',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})


after(async () => {
    await mongoose.connection.close()
})