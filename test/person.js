const mongoose = require('mongoose')

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const serverPromise = require('../server')

const Person = mongoose.model('Person')

const appUrl = 'http://localhost:3000'
const apiUrl = `${appUrl}/api`

chai.use(chaiHttp)

describe('/person endpoints', () => {
  let httpServer

  before(async () => {
    httpServer = await serverPromise
  })

  beforeEach((done) => { // Before each test we empty the database
    Person.deleteMany({}, (err) => {
      done()          
    })
  })

  // Test the GET route
  describe('GET /person', () => {
    it('it should GET all the people', (done) => {
      chai.request(apiUrl)
        .get('/person')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })
  })

  // Test the POST route
  describe('POST /person', () => {
    it('it should not POST a person without name field', (done) => {
      let person = {
        email: 'dtargaryen@westeros.com'
      }
      chai.request(apiUrl)
        .post('/person')
        .send(person)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should not POST a person without email field', (done) => {
      let person = {
        name: 'Dany Targaryen',
      }
      chai.request(apiUrl)
        .post('/person')
        .send(person)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          done()
        })
    })

    it('it should POST a person with only name and email', (done) => {
      let person = {
        name: 'Dany Targaryen',
        email: 'dtargaryen@westeros.com'
      }
      chai.request(apiUrl)
        .post('/person')
        .send(person)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id')
          res.body.should.have.property('name')
          res.body.should.have.property('email')
          done()
        })
    })

    it('it should POST a person with all fields present', (done) => {
      let person = {
        name: 'Jon Snow',
        email: 'jsnow@westeros.com',
        birthday: '1985-09-06T07:00:00.000Z',
        zipCode: '91505'
      }
      chai.request(apiUrl)
        .post('/person')
        .send(person)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id')
          res.body.should.have.property('name')
          res.body.should.have.property('email')
          res.body.should.have.property('birthday')
          res.body.should.have.property('zipCode')
          done()
        })
    })
  })

  // Test the GET by ID route
  describe('GET /person/:id', () => {
    it('it should GET a person by the given id', (done) => {
      let person = new Person({ name: 'Eleanor Rigby', email: 'ringo@beatles.com'})
      person.save((err, person) => {
        chai.request(apiUrl)
          .get(`/person/${person.id}`)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('name')
            res.body.should.have.property('email')
            res.body.should.have.property('_id').eql(person.id)
            done()
          })
      })
    })
  })

  // Test the DELETE route
  describe('DELETE /person/:id', () => {
    it('it should DELETE a person by the given id', (done) => {
      let person = new Person({ name: 'Jon Snow', email: 'jsnow@westeros.com'})
      person.save((err, person) => {
        chai.request(apiUrl)
          .delete(`/person/${person.id}`)
          .end((err, res) => {
            res.should.have.status(204)
            res.body.should.be.a('object')
            done()
          })
      })
    })
  })

  after((done) => { // After all tests we empty the database
    Person.deleteMany({}, (err) => {
      done()          
    })
  })
})