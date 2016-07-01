'use strict'
var pkg = require('../../package.json')
var injection = require('vigour-wrapper-bridge/lib/plugin/injection')(pkg.name)

console.log('[facebook][native]')

exports._platform = {
  inject: injection,
  on: {
    init: {
      facebook () {
        // called when facebook is used
        // should get connectionStatus
        // and set user.token and user.id
        setTimeout((err, res) => { // async call to FB plugin
          if (err) {
            console.error('facebook init error', err)
          }
          this.parent.set({
            ready: true, // show that init has happened
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
        // called on login attempt
        setTimeout((err, res) => { // async call to FB plugin
          if (err) {
            // error: bad
            console.error('facebook login error', err)
            done(true)
          } else {
            // update user info
            this.parent.set({
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
    logout: {
      facebook (done) {
        // called on login attempt
        setTimeout((err, res) => { // async call to FB plugin
          if (err) {
            // error: bad
            console.error('facebook logout error', err)
            done(true)
          } else {
            // update user info
            this.parent.set({
              status: 'unknown',
              user: {
                token: false,
                id: false
              }
            })
          }
        })
      }
    },
    share: {
      facebook (obj) {
        // called on share attempt
        var url = obj.data
        console.log('SHARE', url, 'from', obj)
        setTimeout((err, res) => { // async call to FB plugin
          if (err) {
            // error: bad
            console.error('facebook share error', err)
            obj.done(true)
          } else {
            obj.done()
          }
        })
      }
    }
  }
}
