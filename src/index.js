"use strict";

/**
 In this example, we will show a callback based approach to making
 API calls, in addition to a a promise based approach and
 a generator based approach using 'co'

 Each function will perform the same action of fetching
 a list of 'posts' from an API, and then for the first
 post, will fetch details of the user that created that post
 in a seperate API call.

 The function will then return the name of the user and
 title of the post
*/

// Firstly, purely callback based using the request library
exports.fetchWithCallback = function(cb) {
  var request = require('request')

  request('http://jsonplaceholder.typicode.com/posts', function(err, res, body1) {
    if (err) return cb(err)
    var posts = JSON.parse(body1),
        userId = posts[0].userId
    request('http://jsonplaceholder.typicode.com/users/'+userId, function(err, res, body2) {
      if (err) return cb(err)
      var user = JSON.parse(body2)
      return cb(null, {
        name: user.name,
        post: posts[0].title
      })
    })
  })
}

// Next, using a 'promisified' version of request
exports.fetchWithPromise = function(cb) {
  var request = require('request-promise')
  return request('http://jsonplaceholder.typicode.com/posts')
    .then(function(body1) {
      var posts = JSON.parse(body1),
          userId = posts[0].userId
      return request('http://jsonplaceholder.typicode.com/users/' + userId)
        .then(function(body2) {
          var user = JSON.parse(body2)
          return {
            name: user.name,
            post: posts[0].title
          }
        })
    })
}

// Finally using generators alongside a promisified version of request
exports.fetchWithGenerator = function*() {
  var request = require('request-promise'),
      body1 = yield request('http://jsonplaceholder.typicode.com/posts'),
      posts = JSON.parse(body1),
      userId = posts[0].userId,
      body2 = yield request('http://jsonplaceholder.typicode.com/users/' + userId),
      user = JSON.parse(body2)
  return {
    name: user.name,
    post: posts[0].title
  }
}
