'use strict'

var pkg = require('../package.json')
var defaults = pkg.vigour

module.exports = {
  key: pkg.name,
  appId: false,
  token: false,
  connectionStatus: false,
  inject: defaults
}
