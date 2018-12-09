'use strict'

const md5 = require('js-md5')

class WsDemoController {
	constructor ({ socket, request, auth }) {
		this.socket = socket
		this.request = request
    this.user = auth.user || { username: 'Anonymous' }
	}

	onMessage (message) {
    const { username } = this.user
    const { content, email } = message

		this.socket.broadcastToAll('message', {
      username,
      email,
			content
		})
	}

	joinRoom (room) {
		console.log('room', room)
		console.log('coon', this.socket.connection)
		const user = this.socket.currentUser
		this.socket.getChannel('demo').topic('demo').broadcast('new:user', {
			user
		})
	}

	leaveRoom (room) {}
}

module.exports = WsDemoController
