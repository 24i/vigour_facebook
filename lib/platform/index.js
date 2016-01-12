'use strict'
var env = require('vigour-env')
env = env.serialize()

if (env.isNative.val) {
  module.exports = require('./native')
} else if (env.isWeb.val) {
  module.exports = require('./web')
} else {
  module.exports = require('./mock')
}
