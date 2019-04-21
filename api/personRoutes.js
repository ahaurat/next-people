const mongoose = require('mongoose')

const Person = mongoose.model('Person')

module.exports = server => {
  
  // Get all the people
  server.get('/api/person', async (req, res) => {
    try {
      const people = await Person.find()
      return res.json(people)
    }
    catch (e) {
      console.error(e)
      return res.status(500).json({message: 'Error fetching people'})
    }
  })

  // Create a person
  server.post('/api/person', async (req, res) => {
    const { name, email, birthday, zipCode } = req.body

    // Treat name and email as required fields
    if (!name || !email) {
      return res.status(400).json({message: 'name and email are required'})
    }

    try {
      const person = new Person({name, email, birthday, zipCode})
      const savedPerson = await person.save()
      return res.json(savedPerson)
    }
    catch (e) {
      console.error(e)
      return res.status(500).json({message: 'Error creating new person'})
    }
  })

  // Delete a person with the given id
  server.delete('/api/person/:id', async (req, res) => {
    const { id } = req.params

    try {
      const person = await Person.findByIdAndDelete(id)
      // 204 if deleted or 404 if not found
      return res.status(person ? 204 : 404).send()
    }
    catch (e) {
      console.error(e)
      return res.status(500).json({message: `Error deleting person with id ${id}`})
    }
  })

  // Get the person with the given id
  server.get('/api/person/:id', async (req, res) => {
    const { id } = req.params

    try {
      const person = await Person.findById(id)
      return res.json(person)
    }
    catch (e) {
      console.error(e)
      return res.status(500).json({message: `Error fetching person with id ${id}`})
    }
  })
}