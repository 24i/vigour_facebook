'use strict'

var nativeAPI = {
  define: {
    login (callback) {
      var facebook = this
      facebook.send('login', function loginResponse (err, token) {
        if(err) {
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
}

module.exports = nativeAPI
