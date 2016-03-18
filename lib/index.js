'use strict'
var Plugin = require('vigour-wrapper-bridge/lib/plugin')
var env = require('vigour-env')
var pkg = require('vigour-package')
var config = pkg.facebook
env = env.serialize()

var pluginObj = {
  status: false,
  shared: false,
  user: {
    token: false,
    val: false,
    id: false,
    on: {
      data: {
        condition (data, done) {
          var user = this
          var status = user.parent.status
          if (user.val === true) {
            if (user.parent.status.val) {
              user._platform.emit('login', function (err, res) {
                // console.log('[facebook] login callback 1', arguments)
                if (err) {
                  // console.error('yes error set user false for next try')
                  user.set(void 0, false)
                }
                done.apply(this, arguments)
              })
            } else {
              if (env.isNative.val) {
                status.once('data', function () {
                  if (status.val === 'connected') {
                    done()
                  } else {
                    user._platform.emit('login', function (err, res) {
                      // console.log('[facebook] login callback 2!', arguments)
                      if (err) {
                        // console.error('yes error set user false for next try')
                        user.set(void 0, false)
                      }
                      done.apply(this, arguments)
                    })
                  }
                })
              } else {
                // console.log('do dat emit')
                user._platform.emit('login', function (err, res) {
                  // console.log('[facebook] login callback 3', arguments)
                  if (err) {
                    // console.error('yes error set user false for next try')
                    user.set(void 0, false)
                  }
                  done.apply(this, arguments)
                })
              }
            }
          } else {
            user._platform.emit('logout', done)
          }
          user.parent.share.set(0, false)
        },
        val: function () {}
      }
    }
  },
  on: {
    value: {
      facebook (data) {
        if (data === true) {
          this._platform.emit('init', data)
        }
      }
    }
  },
  share: {
    val: false,
    on: {
      data: {
        condition (data, done) {
          data = this.val // fix cause data is undefined
          this._platform.emit('share', {data, done})
        },
        val: function () {}
      }
    }
  }
}

if (config) {
  pluginObj.inject = [
    require('./platform'),
    config
  ]
} else {
  pluginObj.inject = require('./platform')
}

module.exports = new Plugin(pluginObj)
