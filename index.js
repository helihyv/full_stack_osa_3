const express = require('express')
const app = express()
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

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2
  },
  {
    name: 'Arto Järvinen',
    number: '040-123456',
    id: 3
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p>
    <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id',(request,response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 10000000) + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  let error = ''

  if (body.name === undefined) {

    error = 'name field missing'
  }

  else if (body.name.length === 0) {
    error = 'no name provided'
  }

  else if (persons.some((person => {
    return person.name === body.name
  })))
  {
    error = 'name must be unique'
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



  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
