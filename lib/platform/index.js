'use strict'
var env = require('vigour-env')
env = env.serialize()

if (env.isNative) {
  module.exports = require('./native')
} else if (env.isWeb) {
  module.exports = require('./web')
} else {
  module.exports = require('./mock')
}
