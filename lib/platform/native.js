'use strict'
var pkg = require('../../package.json')
exports.platform = {
  inject: require('vigour-wrapper/lib/bridge/inject')(pkg.name),
  on: {
    init: {
      facebook () {
        this.send('init', this.appID, (err, res) => {
          if (!err) {
            this.parent.set({
              ready: true,
              status: res.connectionStatus || 'unknown',
              user: {
                token: res.token || false,
                id: res.userId || false
              }
            })
          }
        })
      }
    },
    login: {
      facebook (done) {
        this.send('login', {}, (err, res) => {
          if (!err) {
            this.parent.set({
              status: res.connectionStatus || 'unknown',
              user: {
                token: res.token || false,
                id: res.userId || false
              }
            })
            done()
          } else {
            done(true)
          }
        })
      }
    },
    logout: {
      facebook (done) {
        this.send('logout', {}, (err, res) => {
          if (!err) {
            this.parent.set({
              status: 'unknown',
              user: {
                token: false,
                id: false
              }
            })
            done()
          } else {
            done(true)
          }
        })
      }
    },
    share: {
      facebook (obj) {
        var url = obj.data
        this.send('share', {url}, (err, res) => {
          if (!err) {
            obj.done()
          } else {
            obj.done(true)
          }
        })
      }
    }
  }
}
