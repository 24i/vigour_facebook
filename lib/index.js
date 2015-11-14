var ua = require('vigour-ua')
var Plugin = require('vigour-wrapper/lib/bridge/Plugin')

var nativeAPI = require('./native')
var webAPI = require('./web')

var myPlatform
if (ua.os === 'Android' || ua.os === 'iOS') {
  myPlatform = nativeAPI
} else if (ua.browser) {
  myPlatform = webAPI
} else { // incompatible
  myPlatform = {
    val: false
  }
}

module.exports = new Plugin({
  key: 'Facebook',
  token: false,
  inject: myPlatform
})
