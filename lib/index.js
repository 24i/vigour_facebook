'use strict'
var Plugin = require('vigour-wrapper/lib/plugin')

module.exports = new Plugin({
  // TODO get appID from config
  inject: require('./platform'),
  appID: { useVal: '1523998237921394' },
  status: 'unknown',
  shared: false,
  user: {
    token: false,
    val: false,
    id: false,
    on: {
      value: {
        facebook (data, event) {
          var val = this.val
          if (val === true) {
            this.platform.emit('login', data, event)
          } else if (val === false) {
            this.platform.emit('logout', data, event)
          }
        }
      }
    }
  },
  on: {
    value: {
      facebook (data, event) {
        if (this.val === true) {
          this.platform.emit('init', data, event)
        }
      }
    }
  },
  share: {
    val: false,
    on: {
      data: {
        facebook (data, event) {
          if (this.val) {
            this.platform.emit('share', data, event)
          }
        }
      }
    }
  }
})
