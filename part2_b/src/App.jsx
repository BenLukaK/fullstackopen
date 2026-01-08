import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const nameChangeHandler = (e) => {
    setNewName(e.target.value)
  }

  const addNameHandler = (e) => {
    e.preventDefault()
    const nameExists = persons.some(person => person.name === newName)
    if (!nameExists) {
      const newNameObj = {name: newName}
      setPersons(persons.concat(newNameObj))
      setNewName("")
    } else {
      alert(`${newName} is already added to phonebook`)
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNameHandler}>
        <div>
          name: <input value={newName} onChange={nameChangeHandler} />
          <div>debug: {newName}</div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <div>{person.name}</div>)}
    </div>
  )
}

export default App