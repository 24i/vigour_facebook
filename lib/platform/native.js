'use strict'
var pkg = require('../../package.json')
var injection = require('vigour-wrapper-bridge/lib/plugin/injection')(pkg.name)
const appId = process.env.SBS_FBID || 1558522661117391

exports._platform = {
  inject: injection,
  on: {
    init: {
      facebook () {
        global.FB = this.parent
        this.send('init', appId, (err, res) => {
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
        console.log('SHARE', url, 'from', obj)
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
