'use strict'
var pkg = require('../../package.json')

exports.platform = {
  inject: require('vigour-wrapper/lib/bridge/inject')(pkg.name),
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
        this.send('login', {}, (e, res) => this.handleResponse(res))
      }
    },
    logout: {
      facebook () {
        this.send('logout', {}, () => this.handleResponse())
      }
    },
    share: {
      facebook (data) {
        this.send('share', {}, () => this.shared.val = data)
      }
    }
  },
  define: {
    handleResponse (res) {
      var plugin = this.parent
      if (res) {
        plugin.set({
          status: res.connectionStatus || 'unknown',
          user: {
            token: res.token || false,
            id: res.userId || false
          }
        })
      } else {
        plugin.set({
          status: 'unknown',
          user: {
            token: false,
            id: false
          }
        })
      }
    }
  }
}