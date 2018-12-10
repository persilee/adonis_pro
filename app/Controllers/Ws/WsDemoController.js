'use strict'

class WsDemoController {
	constructor ({ socket, request, auth }) {
		this.socket = socket
		this.request = request
		this.user = auth.user || { username: 'Anonymous' }
		// presence.track(socket, socket.currentUser.id, {})
	}

	onMessage (message) {
		const { username } = this.user
		const { content, email } = message

		// console.log(...this.socket.channel.subscriptions.get('demo'))

		this.socket.broadcastToAll('message', {
			username,
			email,
			content
		})
	}
}

module.exports = WsDemoController
