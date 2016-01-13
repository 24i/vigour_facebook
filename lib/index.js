'use strict'
var Plugin = require('vigour-wrapper/lib/plugin')
var Config = require('vigour-config')
var config = new Config().facebook

var pluginObj = {
  status: 'unknown',
  shared: false,
  user: {
    token: false,
    val: false,
    id: false,
    on: {
      data: {
        condition (data, done) {
          if (this.val === true) {
            this._platform.emit('login', done)
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
    config && config.serialize()
  ]
} else {
  pluginObj.inject = require('./platform')
}

module.exports = new Plugin(pluginObj)
