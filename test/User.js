process.env.NODE_ENV = 'test'

import mongoose from 'mongoose'
import chai from 'chai'
import chaiHttp from 'chai-http'
import User from '../src/models/User.js'
import server from '../server.js'

const should = chai.should()
chai.use(chaiHttp)

describe('User', () => {
  beforeEach((done) => {
    User.deleteMany({ name: 'Test Chai' })
    done()
  })
  const user = (email) => {
    return {
      name: 'Test Chai',
      email: email ?? 'test@chai.com',
      password: 'testChai'
    }
  }
  describe('Signup User', () => {
    it('should create a new user', (done) => {
      chai.request(server)
        .post('/register')
        .send(user())
        .end((_, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
        })
        done()
      })
      it('should not create user duplicate email', (done) => {
        chai.request(server)
        .post('/register')
        .send(user())
        .end((_, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
        })
      done()
    })
  })
  describe('Login User', () => {
    it('Should login a user with correct credentials', (done) => {
      chai.request(server)
        .post('/login')
        .send({
          email: 'test@chai.com',
          password: 'testChai'
        }).end((_, res) => {
          res.should.have.status(200)
        })
      done()
    })
  })
})
