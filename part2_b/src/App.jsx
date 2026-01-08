import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSelect, setNameSelect] = useState('')

  const nameChangeHandler = (e) => {
    setNewName(e.target.value)
  }

  const numberChangeHandler = (e) => {
    setNewNumber(e.target.value)
  }

  const nameSelectHandler = (e) => {
    setNameSelect(e.target.value)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(nameSelect.toLowerCase()))

  const addNameHandler = (e) => {
    e.preventDefault()
    const nameExists = persons.some(person => person.name === newName)
    if (!nameExists) {
      const newNameObj = {name: newName, number: newNumber}
      setPersons(persons.concat(newNameObj))
      setNewName('')
      setNewNumber('')
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={nameSelect} onChange={nameSelectHandler} />
      </div>
      <h2>Add a new</h2>
      <form onSubmit={addNameHandler}>
        <div>
          name: <input value={newName} onChange={nameChangeHandler} />
        </div>
        <div>
          number: <input value={newNumber} onChange={numberChangeHandler} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPersons.map(person => <div>{person.name} {person.number}</div>)}
    </div>
  )
}

export default App