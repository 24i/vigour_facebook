'use strict'
var Plugin = require('vigour-wrapper/lib/plugin')
var Config = require('vigour-config')
var config = new Config().facebook

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
              console.log('[facebook] status is not yet known.. just wait..')
              status.once('data', function () {
                console.log('[facebook] STATUS SET!')
                if (status.val === 'connected') {
                  console.log('[facebook] connected yay!')
                  done()
                } else {
                  console.log('[facebook] not yet connected do login emit')
                  this._platform.emit('login', done)
                }
              })
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
