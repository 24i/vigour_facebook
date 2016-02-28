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
          var status = this.parent.status
          if (this.val === true) {
            if (this.parent.status.val) {
              this._platform.emit('login', done)
            } else {
              if (env.isNative.val) {
                status.once('data', function () {
                  if (status.val === 'connected') {
                    done()
                  } else {
                    this._platform.emit('login', done)
                  }
                })
              } else {
                this._platform.emit('login', done)
              }
            }
          } else {
            this._platform.emit('logout', done)
          }
          this.parent.share.set(0, false)
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
