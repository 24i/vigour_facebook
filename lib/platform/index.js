'use strict'
var ua = require('vigour-ua/navigator')

if (ua.webview === 'cordova') {
  module.exports = require('./native')
} else if (ua.browser) {
  module.exports = require('./web')
} else {
  module.exports = require('./mock')
}
