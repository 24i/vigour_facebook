'use strict'
var ua = require('vigour-ua/navigator')
console.log(ua.webview)
if (ua.browser || ua.webview === 'cordova') {
  module.exports = require('./web')
} else {
  module.exports = require('./mock')
}
