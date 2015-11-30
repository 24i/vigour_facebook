'use strict'
var pkg = require('../../package.json')
exports.platform = {
  inject: require('vigour-wrapper/lib/bridge/inject')(pkg.name),
  on: {
    init: {
      facebook () {
        this.send('init', this.appID, (e, res) => {
          this.parent.set({
            ready: true,
            status: res.connectionStatus || 'unknown',
            user: {
              token: res.token || false,
              id: res.userId || false
            }
          })
        })
      }
    },
    login: {
      facebook (done) {
        this.send('login', {}, (e, res) => {
          this.parent.set({
            status: res.connectionStatus || 'unknown',
            user: {
              token: res.token || false,
              id: res.userId || false
            }
          })
          done()
        })
      }
    },
    logout: {
      facebook (done) {
        this.send('logout', {}, (e, res) => {
          this.parent.set({
            status: 'unknown',
            user: {
              token: false,
              id: false
            }
          })
          done()
        })
      }
    },
    share: {
      facebook (obj) {
        this.send('share', obj.data, (err, res) => {
          if (err) {
            obj.done(true)
          } else {
            obj.done()
          }
        })
      }
    }
  }
}
