'use strict'

var ua = require('vigour-ua')
var agent = ua(navigator.userAgent)

var Observable = require('vigour-js/lib/observable')

// TODO: fix these checks!
var myPlatform
if (agent.platform === 'android' || agent.platform === 'ios') { // native
  console.log('platform: wrapped')
  myPlatform = require('./wrapped')
} else if (agent.browser) { // web
  console.log('platform: web')
  myPlatform = require('./web')
} else { // incompatible
  console.log('platform: incompatible')
  myPlatform = new Observable({
    val: false
  })
}

module.exports = myPlatform
