import { useState, useEffect } from 'react'
import axios from 'axios'

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

const Persons = ({persons}) => {
  return (
    <div>
      {persons.map(person => <Person key={person.id} person={person} />)}
    </div>
  )
}

const Person = ({person}) => {
  return <div>{person.name} {person.number}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSelect, setNameSelect] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log(response)
        setPersons(response.data)
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

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(nameSelect.toLowerCase()))

  const addPersonHandler = (e) => {
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
      <Filter filterText={nameSelect} filterHandler={nameSelectHandler} />
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} onNameChange={nameChangeHandler} onNumberChange={numberChangeHandler} onSubmit={addPersonHandler} />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App