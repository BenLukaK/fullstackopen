const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)


describe('when there is initially some blogs saved', () => {
  let testUserId
  let testToken

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({ username: 'testuser', passwordHash })
    const savedUser = await user.save()
    testUserId = savedUser._id.toString()

    const userForToken = {username: savedUser.username, id: savedUser._id}
    testToken = jwt.sign(userForToken, process.env.SECRET)

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog({
        ...blog, 
        user: testUserId
      }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(e => e.title)
    assert(titles.includes('Inception'))
  })

  test('the unique identifier property is named id', async () => {
    const blogs = await helper.blogsInDb()

    blogs.forEach(blog => {
      assert(blog.id !== undefined)
    })
  })


  describe('Viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })


  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: "Kung Fu",
        author: "Xingchi Zhou",
        url: "www.kungfu.com",
        likes: 34546,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const authors = blogsAtEnd.map(b => b.author)
      assert(authors.includes('Xingchi Zhou'))
    })

    test('fails with status code 401 if token missing', async () => {
      const newBlog = {
        author: "Kungfu Football",
        url: "www.kungfufootball.com",
        likes: 4354567,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if title missing', async () => {
      const newBlog = {
        author: "Fan Guo",
        url: "www.planetearth.com",
        likes: 7657454,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testToken}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })


    test('fails with status code 400 if url missing', async () => {
      const newBlog = {
        title: 'Superman vs Batman',
        author: 'Zack Schnider',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testToken}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('Missing likes property defaults to 0', async () => {
      const newBlog = {
        title: 'Saving Private Ryan',
        author: 'Tom Hanks',
        url: 'www.savingprivateryan.com',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${testToken}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)

      const blogsAtEnd = await helper.blogsInDb()
      const savedBlog = blogsAtEnd.find(b => b.title === 'Saving Private Ryan')
      assert.strictEqual(savedBlog.likes, 0)
    })
  })


  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })


  describe('updates of a blog', () => {
    test('likes field of blog can be updated', async () => {
      const blogs = await helper.blogsInDb()
      const blogToUpdate = blogs[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 4365,
      }

      const response = await api 
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 4365)
    })
  })


})



describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'Salainen134',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })


  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'Salainen123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with too short username', async () => {
    const newUser = {
      username: 'be',
      name: 'Ben',
      password: 'Secret123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('shorter than the minimum allowed length'))
  })

  test('creation fails with too short password', async () => {
    const newUser = {
      username: 'ben',
      name: 'Ben',
      password: 'pw',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('password must be at least 3 characters long'))
  })
})



after(async () => {
    await mongoose.connection.close()
})