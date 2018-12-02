'use strict'

class WsDemoController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }
}

module.exports = WsDemoController
