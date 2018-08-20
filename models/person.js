const mongoose = require('mongoose')
const url = 'mongodb://fstack:SENSUROITU@ds125402.mlab.com:25402/fsopl'
mongoose.connect(url,{ useNewUrlParser: true })
.catch(error => {
  console.log(error)
})

const  Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person
