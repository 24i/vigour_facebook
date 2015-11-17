'use strict'

var ua = require('vigour-ua')
var agent = ua(navigator.userAgent)

var Observable = require('vigour-js/lib/observable')

// TODO: fix these checks!
var myPlatform
if (agent.os === 'Android' || ua.os === 'iOS') { // native
  myPlatform = require('./native')
} else if (agent.browser) { // web
  myPlatform = require('./web')
} else { // incompatible
  myPlatform = new Observable({
    val: false
  })
}

module.exports = myPlatform
