const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('request-body', (request, response) => JSON.stringify(request.body) )
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-25235235"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "040-12345555"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "040-456547"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find( person => person.id === id)

    if(person === undefined) {
        response.status(404).end()
    } else {
        response.json(person)
    }
})

const generateId = () => Math.floor(Math.random() * 100)
const nameExist = name => persons.find( person => person.name === name )

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).send({
            error: "Name property is missing"
        })
    }

    if (!body.number) {
        return response.status(400).send({
            error: "Number property is missing"
        })
    }
    
    if ( nameExist(body.name) ) {
        return response.status(400).send({
            error: "Name already exist"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = [...persons, person]

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find( person => person.id === id)

    if (person === undefined) {
        response.status(404).end()
    } else {
        persons = persons.filter( person => person.id !== id)
        response.status(204).end()
    }
})

app.get('/info', (request, response) => {
    const date = new Date()

    const info = 
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${date}</p>
        `
    
    response.send(info)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`)
})