'use strict'
var Observable = require('vigour-js/lib/observable')

var agent = require('vigour-ua')(navigator.userAgent)
var env = global.env
var target = env && env.target

if (target === 'android' || target === 'ios') {
  module.exports = require('./native')
} else if (agent.browser) {
  module.exports = require('./web')
} else {
  module.exports = new Observable(false)
}