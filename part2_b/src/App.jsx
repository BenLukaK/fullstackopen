import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({filterText, filterHandler}) => {
  return (
    <div>
      filter shown with <input value={filterText} onChange={filterHandler} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input value={props.newName} onChange={props.onNameChange} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, deleteHandler}) => {
  return (
    <div>
      {persons.map(person => <Person key={person.id} person={person} deleteHandler={() => deleteHandler(person.id)} />)}
    </div>
  )
}

const Person = ({person, deleteHandler}) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={deleteHandler}>delete</button>
    </div>
  )
}

const Notification = ({message}) => {
  const infoStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  return (
    <div style={infoStyle}>
      {message}
    </div>
  )
}

 

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSelect, setNameSelect] = useState('')
  const [infoMsg, setInforMsg] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const nameChangeHandler = (e) => {
    setNewName(e.target.value)
  }

  const numberChangeHandler = (e) => {
    setNewNumber(e.target.value)
  }

  const nameSelectHandler = (e) => {
    setNameSelect(e.target.value)
  }

  const showNotification = (msg, duration) => {
    setInforMsg(msg)
    setTimeout(() => {
      setInforMsg(null)
    }, duration)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(nameSelect.toLowerCase()))

  const addPersonHandler = (e) => {
    e.preventDefault()
    const nameExists = persons.some(person => person.name === newName)
    if (!nameExists) {
      const newObj = {name: newName, number: newNumber}

      personService
        .create(newObj)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Added ${newPerson.name}`, 4000)
        })
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const oldPerson = persons.find(p => p.name === newName)
        const newObj = {name: newName, number: newNumber}

        personService
          .update(oldPerson.id, newObj)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id === oldPerson.id ? updatedPerson : person))
            setNewName('')
            setNewNumber('')
            showNotification(`Updated phone number for ${updatedPerson.name}`, 4000)
          })
      }
    }
  }

  const deleteHandler = id => {
    const deletedPerson = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${deletedPerson.name}?`)) {
      personService
        .remove(id)
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMsg} />
      <Filter filterText={nameSelect} filterHandler={nameSelectHandler} />
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} onNameChange={nameChangeHandler} onNumberChange={numberChangeHandler} onSubmit={addPersonHandler} />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} deleteHandler={deleteHandler} />
    </div>
  )
}

export default App