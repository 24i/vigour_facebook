'use strict'
var Plugin = require('vigour-wrapper/lib/plugin')

module.exports = new Plugin({
  // TODO get appID from config
  inject: require('./platform'),
  appID: {
    useVal: '1523998237921394'
  },
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
        }
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
        }
      }
    }
  }
})
