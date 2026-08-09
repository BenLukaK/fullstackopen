import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title: '', author: '', url: ''})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notice, setNotice] = useState(null)

  const showNotification = (message, type, duration) => {
    setNotice({message, type})
    setTimeout(() => {
      setNotice(null)
    }, duration)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const logInUser = await loginService.login({username, password})
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(logInUser)
      ) 
      blogService.setToken(logInUser.token)
      setUser(logInUser)
      setUsername('')
      setPassword('')
      showNotification(`Logged in: ${logInUser.username}`, "success", 3000)
    } catch {
      showNotification('Wrong username or password', "error", 5000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const returnedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(returnedBlog))
    showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, "success", 3000)
    setNewBlog({title: '', author: '', url: ''})
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNewBlog({title: '', author: '', url: ''})
    blogService.setToken(null)
    showNotification(`Logged out`, "success", 3000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title:
          <input
            type="text"
            value={newBlog.title}
            onChange={({ target }) => setNewBlog({...newBlog, title: target.value})}
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type="text"
            value={newBlog.author}
            onChange={({ target }) => setNewBlog({...newBlog, author: target.value})}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            value={newBlog.url}
            onChange={({ target }) => setNewBlog({...newBlog, url: target.value})}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )


  return (
    <div>
      <h2>blogs</h2>
      <Notification notice={notice} />

      <h2>Log in to application</h2>
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={logoutHandler}>logout</button>
          </p>
          <br />
          <h2>Create New</h2>
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App