if (process.argv.length === 3) {  //1 parametri, puhelinnumero puuttuu
  console.log('VIRHE: puhelinnumero puuttuu.')
  return
}

const mongoose = require('mongoose')
const url = 'mongodb://fstack:SENSUROITU@ds125402.mlab.com:25402/fsopl'
mongoose.connect(url,{ useNewUrlParser: true })
  .catch(error => {
    console.log(`VIRHE: Tietokantaan yhdistäminen epäonnistui: ${error}`)
    })

const  Person = mongoose.model('Person', {
  name: String,
  number: String
})


if (process.argv.length < 3) { //Ei parametereja, näytä kaikki

  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
    .catch(error => {
      console.log(`VIRHE: puhelinluettelon hakeminen epäonnistui: ${error}`)
      mongoose.connection.close()
    })
}



else { //Vähintään 2 parametria, mahdolliset ylimääräiset jätetään huomiotta
       //Lisätään nimi ja numero tietokantaan
  name = process.argv[2]
  number = process.argv[3]

  const person = new Person({
    name: name,
    number: number
  })

  person.save()
  .then(response => {
    console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)
    mongoose.connection.close()
  })
  .catch(error => {
    console.log(`VIRHE: henkilön lisääminen luetteloon epäonnistui`)
    mongoose.connection.close()
  })



}
