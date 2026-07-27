const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog
      .findById(request.params.id)
      .populate('user', {username: 1, name: 1})

    if (blog) {
          response.json(blog)
      } else {
          response.status(404).end()
      }
})


blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author, 
    url: body.url,
    likes: body.likes ?? 0,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user 

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  user.blogs = user.blogs.filter(b => b._id.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
    const {title, author, url, likes} = request.body

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    blog.likes = likes

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
})

module.exports = blogsRouter