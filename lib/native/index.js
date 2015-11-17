'use strict'
var Plugin = require('vigour-wrapper/lib/bridge/Plugin')

module.exports = new Plugin({
  key: 'Facebook',
  token: false,
  on: {
    new () {
      var fb = this
      var appId = fb.appId && fb.appId.val
      if (!appId) {
        throw new Error('Facebook: needs an appId')
      }
      fb.send('init', appId)
    },
    loginState (response) {
      this.loginResponse(response)
    }
  },
  define: {
    login (callback) {
      var fb = this
      fb.send('login', function loginResponse (err, response) {
        if (err) {
          fb.emit('error', err)
        } else {
          fb.loginResponse(response)
        }
        if (callback) {
          callback(err, response)
        }
      })
    },
    loginResponse (response) {
      var fb = this
      var setobj = {
        connectionStatus: response.status
      }
      if (response.status === 'connected') {
        var auth = response.authResponse
        setobj.token = auth.accessToken
        setobj.userID = auth.userID
        // setobj.signedRequest: auth.signedRequest
      }
      fb.set(setobj)
    },
    logout (callback) {
      var fb = this
      fb.set({
        token: false,
        userID: false,
        connectionStatus: 'unknown'
      })
      fb.send('logout', callback)
    },
    share (shared, callback) {
      this.send('share', shared, callback)
    }
  }
}).Constructor
