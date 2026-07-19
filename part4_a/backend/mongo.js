const mongoose = require('mongoose')
const Blog = require('./models/blog')


const url = `mongodb+srv://fullstackopen:Gp3656868@fullstackopen.tkqbvde.mongodb.net/testBlogApp?appName=fullstackopen`


mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })


if (process.argv.length === 2) {
  // node mongo.js <password>  —  list all entries
  Blog.find({}).then(results => {
    console.log('Blogs:')
    results.forEach(blog => {
      console.log(`${blog.title} ${blog.author} ${blog.url} ${blog.likes}`)
    })
    mongoose.connection.close()
  }).catch(error => {
    console.log('Error fetching blogs:', error.message)
    mongoose.connection.close()
  })
} else if (process.argv.length === 6) {
  // node mongo.js <title> <author> <url> <likes>  —  add a new entry
  const blog = new Blog({
    title: process.argv[2],
    author: process.argv[3],
    url: process.argv[4],
    number: Number(process.argv[5])
  })

  blog.save().then(result => {
    console.log(`Added ${result.author} title ${result.title} url ${result.url} to blogs`)
    mongoose.connection.close()
  }).catch(error => {
    console.log('Error saving blog:', error.message)
    mongoose.connection.close()
  })
}
