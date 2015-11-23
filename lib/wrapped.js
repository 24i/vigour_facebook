'use strict'
var Plugin = require('vigour-wrapper/lib/bridge/plugin')

var shared = require('./shared')

module.exports = new Plugin({
  inject: shared,
  platform: 'wrapped',
  define: {
    init () {
      var fb = this
      var appId = fb.appId && fb.appId.val
      if (!appId) {
        throw new Error('Facebook: needs an appId')
      }
      console.log('Plugin new! go send init!', fb.send, fb.bridge)
      fb.send('init', appId)
    },
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
      shared = { urlString: shared }
      this.send('share', shared, callback)
    }
  }
}).Constructor
