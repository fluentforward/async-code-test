var chai = require('chai'),
    proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    co = require('co'),
    should = chai.should()

chai.use(sinonChai)

describe('api client', function() {

  it('should make an API request using callbacks', function(done) {
    var requestStub = sinon.stub()

    requestStub.onCall(0).callsArgWith(1, null, null, '[{"title": "first post", "userId": 1}]')
      .onCall(1).callsArgWith(1, null, null, '{"name": "alice"}')

    var client = proxyquire('../src/index', {
      request: requestStub
    })

    client.fetchWithCallback(function(err, data) {
      try {
        requestStub.should.have.been.calledWith('http://jsonplaceholder.typicode.com/posts')
        requestStub.should.have.been.calledWith('http://jsonplaceholder.typicode.com/users/1')

        data.should.eql({
          name: 'alice',
          post: 'first post'
        })
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should make an API request using promises', function() {
    var requestPromiseStub = sinon.stub()

    requestPromiseStub.onCall(0).returns(Promise.resolve('[{"title": "first post", "userId": 1}]'))
      .onCall(1).returns(Promise.resolve('{"name": "alice"}'))

    var client = proxyquire('../src/index', {
      'request-promise': requestPromiseStub
    })

    return client.fetchWithPromise().then(function(res) {
      requestPromiseStub.should.have.been.calledWith('http://jsonplaceholder.typicode.com/posts')
      requestPromiseStub.should.have.been.calledWith('http://jsonplaceholder.typicode.com/users/1')

      res.should.eql({
        name: 'alice',
        post: 'first post'
      })
    })
  })

  it('should make an API request using generators and co', function() {
    var requestPromiseStub = sinon.stub()

    requestPromiseStub.onCall(0).returns(Promise.resolve('[{"title": "first post", "userId": 1}]'))
      .onCall(1).returns(Promise.resolve('{"name": "alice"}'))

    var client = proxyquire('../src/index', {
      'request-promise': requestPromiseStub
    })

    return co(function*() {
      var res = yield client.fetchWithGenerator()
      requestPromiseStub.should.have.been.calledWith('http://jsonplaceholder.typicode.com/posts')
      requestPromiseStub.should.have.been.calledWith('http://jsonplaceholder.typicode.com/users/1')

      res.should.eql({
        name: 'alice',
        post: 'first post'
      })
    })
  })

})