const Person = require('./models/person.js')

const express = require('express')
const app = express()

const cors =require('cors')
app.use(cors())

app.use(express.static('build'))

const bodyParser = require('body-parser')

app.use(bodyParser.json())

const morgan = require('morgan')

morgan.token(
  'body',
  function (request, response) {
    return JSON.stringify(request.body)
  }
)

app
  .use(morgan(
    ':method :url :body :status :res[content-length] - :response-time ms'
  ))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.formatPerson))
    })
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.estimatedDocumentCount()
    .then(n => {
      console.log(n)
      response.send(`<p>puhelinluettelossa ${n} henkilön tiedot</p>
          <p>${date}</p>`)
    })
    .catch(error => {
      console.log(error)
    })




})

app.get('/api/persons/:id', (request, response) => {
  Person
     .findById(request.params.id)
     .then(person => {
       if (person) {
         response.json(Person.formatPerson(person))
       } else {
         response.status(404).end()
       }
     })
     .catch(error => {
       console.log(error)
       response.status(400).send({ error: 'malformatted id'})
     })
 })

app.delete('/api/persons/:id',(request,response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({error: 'malformatted id'})
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  let error = ''

  if (body.name === undefined) {

    error = 'name field missing'
  }

  else if (body.name.length === 0) {
    error = 'no name provided'
  }

  if (body.number === undefined) {
      error = error.length > 0 ?
      error.concat(', number field missing') :
      error = 'number field missing'
  }

  else if (body.number.length === 0)
    error = error.length > 0 ?
      error.concat(', no phone number provided') :
      error = 'no phone number provided'

  if (error.length > 0)
    {
      return response.status(400).json({error: {error}})
    }


  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.json(Person.formatPerson(savedPerson))
    })
    .catch(error => {
      console.log(error)
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  let error = ''

  if (body.name === undefined) {

    error = 'name field missing'
  }

  else if (body.name.length === 0) {
    error = 'no name provided'
  }

  if (body.number === undefined) {
      error = error.length > 0 ?
      error.concat(', number field missing') :
      error = 'number field missing'
  }

  else if (body.number.length === 0)
    error = error.length > 0 ?
      error.concat(', no phone number provided') :
      error = 'no phone number provided'

  if (error.length > 0)
    {
      return response.status(400).json({error: {error}})
    }

  const person =
  {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
      .then(updatedPerson => {
        if (updatedPerson) {
          response.json(Person.formatPerson(updatedPerson))
        } else {
            response.status(404).end()
          }
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({error: 'malformatted id' })
      })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
