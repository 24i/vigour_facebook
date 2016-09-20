'use strict'

const get = require('lodash.get')
const request = require('./request')

exports.api = {
  facebook: {
    define: {
      getUser: (token) => {
        token = token.replace(/^fb-/, '')
        return request(this, {
          path: '/me?fields=name,email,picture,token_for_business&access_token=' + token
        }).then(res => {
          const data = res.data
          return {
            id: data.id,
            name: data.name,
            email: data.email,
            avatar: get(data, 'picture.data.url', null)
          }
        })
      }
    }
  }
}
