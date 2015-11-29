'use strict'
var Platform = require('vigour-wrapper/lib/plugin/platform')

module.exports = new Platform({
  inject: require('vigour-wrapper/lib/bridge/inject'),
  on: {
    init: {
      facebook () {
        this.send('init', this.appID, (e, res) => {
          this.handleResponse(res)
          this.ready.val = true
        })
      }
    },
    login: {
      facebook () {
        this.send('login', {}, (e, res) => {
          this.set(res)
        })
      }
    },
    logout: {
      facebook () {
        this.send('logout', {}, () => this.handleResponse())
      }
    },
    share: {
      facebook (data) {
        this.send('share', {}, () => {
          this.shared.val = data
        })
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
