'use strict'

var Observable = require('vigour-js/lib/observable')

// var pkg = require('../package.json').vigour

var shared = require('./shared')

// const FAKELOGIN = {
//   connectionStatus: 'connected',
//   token: 'TOKEN_X',
//   userId: 'USERID_X'
// }

module.exports = new Observable({
  inject: shared,
  platform: 'mock',
  define: {
    init (appId) {
      var fb = this
      // start doing lazy stuff

      // get initial/current login state
      setTimeout(() => {
        fb.set({
          connectionStatus: 'unknown'
        })
      })
      // in case of logged in set would look like
      // fb.set({
      //   connectionStatus: 'connected',
      //   token: 'TOKEN_X',
      //   userId: 'USERID_X'
      // })

      // at some point set ready true
      fb.ready.val = true
    },
    _login (callback) {
      var fb = this
      if (fb.token.val) { // already have a token > silent success
        return callback && callback(null)
      }
      fb._isLoading('login')
      // go do actual login
      setTimeout(() => {
        // --------------------------------- succes:
        var err = null
        // get response, format it like
        var response = {
          connectionStatus: 'connected',
          token: 'TOKEN_X',
          userId: 'USERID_X'
        }
        // apply set
        fb.set(response)

        // --------------------------------- fail / error:
        // e.g. user cancelled login flow
        // var err = 'login failed'

        // callback if exists
        if (callback) {
          callback(err, response)
        }
      })
    },
    _logout (callback) {
      var fb = this
      if (!fb.token.val) { // already have no token > silent success
        return callback && callback(null)
      }
      fb._isNotLoading('login')
      fb.set({
        login: false,
        token: false,
        userId: false,
        connectionStatus: 'unknown'
      })

      // do actual logout here
      setTimeout(() => {
        if (callback) {
          callback(null, fb.val)
        }
      })
    },
    _share (shared, callback) {
      var fb = this

      fb._isLoading('share')

      // do actual share
      setTimeout(() => {
        fb._isNotLoading('share')
        // if not logged in, and the act of sharing logs the user in, the
        // module should catch that, and update the login info:
        if (!fb.token.val) {
          fb.set({
            connectionStatus: 'connected',
            token: 'TOKEN_X',
            userId: 'USERID_X'
          })
        }
        if (callback) {
          var err = null
          // cancelling the flow is an error
          // err = 'share cancelled'
          var response // dont care
          callback(err, response)
        }
      })
    }
  }
})
