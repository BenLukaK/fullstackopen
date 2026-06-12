const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen:${password}@fullstackopen.tkqbvde.mongodb.net/personApp?appName=fullstackopen`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // node mongo.js <password>  —  list all entries
  Person.find({}).then(results => {
    console.log('phonebook:')
    results.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  }).catch(error => {
    console.log('Error fetching phonebook:', error.message)
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // node mongo.js <password> <name> <number>  —  add a new entry
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  }).catch(error => {
    console.log('Error saving person:', error.message)
    mongoose.connection.close()
  })
} else {
  console.log('Usage:')
  console.log('  node mongo.js <password>                     — list all entries')
  console.log('  node mongo.js <password> <name> <number>     — add a new entry')
  mongoose.connection.close()
}