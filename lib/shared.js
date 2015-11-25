'use strict'

var Config = require('vigour-js/lib/config')

var pkg = require('../package.json')
// console.log('MODULE NAME', pkg.name)

module.exports = {
  key: pkg.name,
  token: false,
  connectionStatus: 'unknown',
  on: {
    new () {
      var fb = this
      var config = new Config()
      // console.log('CONFIG', config.plain())
      if (config && config.facebook) {
        let setFromConf = {}
        config.facebook.each((val, key) => {
          if (!fb[key]) {
            setFromConf[key] = val.plain()
          }
        })
        // console.log('FROM APP CONFIG', setFromConf)
        fb.set(setFromConf)
      }
      if (!(fb.appId && fb.appId.val)) {
        throw new Error('Facebook needs an appId')
      }
      fb.init()
    }
  }
}
