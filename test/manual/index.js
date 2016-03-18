'use strict'
require('gaston-tester')
var tests = require('../tests')
describe('Facebook', function () {
  this.timeout(25000)
  this.bail(true)
  tests()
})
