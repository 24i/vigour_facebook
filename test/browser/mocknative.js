'use strict'

var Plugin = require('vigour-wrapper/lib/bridge/plugin')

var devBridge = require('../../dev/bridge')
var shared = require('../../lib/shared')
var FacebookNative = require('../../lib/native')

describe('Mock Native', function () {
  var facebook
  // fire ready
  // login
  // share
  // it('should be able to create a plugin instance', function () {
    console.error('!')
    facebook = new FacebookNative()
    console.error('watwatwat', facebook.send)
  // })
  //
  // describe('API', function () {
  //   it('should be able to log in', function (done) {
  //     facebook.login(function (err, token) {
  //       if (err) {
  //         throw err
  //       }
  //       console.log('got token!', token)
  //       console.log('facebook.token', facebook.token && facebook.token.val)
  //       done()
  //     })
  //   })
  //
  //   it('should be able to share', function (done) {
  //     facebook.login(function (err, token) {
  //       if (err) {
  //         throw err
  //       }
  //       console.log('got token!', token)
  //       console.log('facebook.token', facebook.token && facebook.token.val)
  //       done()
  //     })
  //   })
  // })
})
