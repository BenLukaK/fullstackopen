const Blog = require('../models/blog')


const initialBlogs = [
  {
    title: "Paw Patrol",
    author: "Kenson",
    url: "www.pawpatrol.com",
    likes: 1287,
  },
  {
    title: "Inception",
    author: "Noland",
    url: "www.inception.com",
    likes: 4356,
  },
  {
    title: "Band of Brothers",
    author: "Hanks",
    url: "www.bob.com",
    likes: 89990,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: 'willremovethissoon',
    url: 'www.removethis.com',
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}