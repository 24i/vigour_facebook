'use strict'

module.exports = exports = {}

exports.start = function () {
  if (this.opts.vigour && this.opts.vigour.facebook && this.opts.vigour.facebook.appId) {
    log.info('- configuring facebook -')

    var fbAppId = this.opts.vigour.facebook.appId
    console.log('App ID', fbAppId)
    if (this.platform === 'android') {
      if (!this.strings) {
        this.strings = {}
      }
      if (!this.strings['facebook_app_id']) {
        this.strings['facebook_app_id'] = fbAppId
      }
    } else if (this.platform === 'ios') {
      // TODO
    }
  } else {
    log.error('No `vigour.facebook.appId`', "can't configure facebook!")
  }
}
