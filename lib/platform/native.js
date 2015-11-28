'use strict'
var Platform = require('vigour-wrapper/lib/plugin/platform')

module.exports = new Platform({
  inject: require('vigour-wrapper/lib/bridge/inject'),
  on: {
    init: {
      facebook (data) {
        this.send('init', this.appID, (err, res) => {
          if (!err) {
            this.set(res)
          }
          this.ready.val = true
        })
      }
    },
    login: {
      facebook (data) {
        this.send('login', {}, (err, res) => {
          if (err) {
            this.emit('error', err)
          } else {
            this.set(res)
          }
        })
      }
    },
    logout: {
      facebook (data) {
        this.send('logout', {}, () => {
          this.parent.set({
            status: 'unknown',
            token: false,
            id: false
          })
        })
      }
    },
    share: {
      facebook (data) {
        
      }
    }
  },
  define: {
    handleResponse (res) {
      if (res) {
        this.parent.set({
          status: res.connectionStatus,
          token: res.token,
          id: res.userId
        })
      } else {
        this.parent.set({
          status: 'unknown',
          token: false,
          id: false
        })
      }
    }
  }
})
