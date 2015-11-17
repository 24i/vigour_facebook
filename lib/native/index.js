'use strict'
var Plugin = require('vigour-wrapper/lib/bridge/Plugin')

module.exports = new Plugin({
  key: 'Facebook',
  token: false,
  define: {
    login (callback) {
      console.log('ok login called')
      var facebook = this
      facebook.send('login', function loginResponse (err, token) {
        if (err) {
          facebook.emit('error', err)
        } else {
          facebook.token.val = token
        }
        callback(err, token)
      })
    },
    share (shared, callback) {
      this.send('share', shared, callback)
    }
  },
  on: {
    new: {
      newFacebook () {
        this.bridge.send('Facebook', 'init')
      }
    }
  }
}).Constructor
