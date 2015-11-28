'use strict'
var Plugin = require('vigour-wrapper/lib/plugin')

module.exports = new Plugin({
  // TODO get appID from config
  appID: { useVal: '1523998237921394' },
  platform: require('./platform'),
  shared: false,
  status: false,
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
