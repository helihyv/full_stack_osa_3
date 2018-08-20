const mongoose = require('mongoose')
const url = 'mongodb://fstack:SENSUROITU@ds125402.mlab.com:25402/fsopl'
mongoose.connect(url,{ useNewUrlParser: true })
.catch(error => {
  console.log(error)
})

const personSchema = new mongoose.Schema ({
  name: String,
  number: String
})

personSchema.statics.formatPerson = function (person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const  Person = mongoose.model('Person', personSchema)

module.exports = Person
