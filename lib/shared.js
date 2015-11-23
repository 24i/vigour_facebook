'use strict'

var Config = require('vigour-js/lib/config')

module.exports = {
  key: 'vigour-facebook',
  token: false,
  connectionStatus: 'unknown',
  on: {
    new () {
      var fb = this
      var config = new Config()
      console.log('CONFIG', config.plain())
      if (config && config.facebook) {
        let setFromConf = {}
        config.facebook.each((val, key) => {
          if (!fb[key]) {
            setFromConf[key] = val.plain()
          }
        })
        fb.set(setFromConf)
      }
      if (!fb.appId && fb.appId.val) {
        throw new Error('Facebook: needs an appId')
      }
      fb.init()
    }
  }
}
