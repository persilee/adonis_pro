'use strict'

const md5 = require('js-md5')

class WsDemoController {
  constructor ({ socket, request, auth }) {
    this.socket = socket
    this.request = request
    this.user = auth.user || { username: 'Anonymous' }
  }

  onMessage (message) {
    const { username, email } = this.user
    const { content } = message

    this.socket.broadcastToAll('message', {
      username,
      email: md5(email),
      content
    })
  }
}

module.exports = WsDemoController
