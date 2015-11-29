'use strict'
var Plugin = require('vigour-wrapper/lib/plugin')


module.exports = new Plugin({
  // TODO get appID from config
  inject: require('./platform'),
  appID: { useVal: '1523998237921394' },
  status: 'unknown',
  shared: false,
  init: {
    val: false,
    on: {
      data: {
        condition (data, next, event) {
          console.error('INIT')
          next()
        }
      }
    }
  },
  user: {
    token: false,
    val: false,
    id: false,
    on: {
      value: {
        facebook (data, event) {
          this.plugin.set(data, event)
          if (!this.val) {
            this.plugin.set({
              shared: false,
              share: false
            }, false)
          }
        }
      }
    }
  },
  // login: {
  //   val: false,
  //   on: {
  //     data: {
  //       facebook (data, event) {
  //         this.plugin.set(data, event)
  //         if (!this.val) {
  //           this.plugin.set({
  //             shared: false,
  //             share: false
  //           }, false)
  //         }
  //       }
  //     }
  //   }
  // },
  share: {
    val: false,
    on: {
      data: {
        facebook (data, event) {
          this.plugin.shared.val = data
        }
      }
    }
  }
})
