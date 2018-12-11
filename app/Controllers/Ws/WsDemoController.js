'use strict'

const Event = use('Event')
const Activity = use('App/models/Activity')
const Message = use('App/models/Message')
class WsDemoController {
	constructor ({ socket, request, auth }) {
		this.socket = socket
		this.request = request
		this.user = auth.user
			? { username: auth.user.username, email: auth.user.email, user_id: auth.user.id }
			: { username: 'Anonymous', email: Math.random().toString(16).substr(2), user_id: '' }
		// presence.track(socket, socket.currentUser.id, {})
	}

	async onMessage (message) {
		const { username } = this.user
		const { content, email } = message

		// console.log(...this.socket.channel.subscriptions.get('demo'))

		this.socket.broadcastToAll('message', {
			username,
			email,
			content
    })

    await Message.create({ username, content, email, user_id: this.user.id  })

	}

	async onClose () {
		const activityUser = await Activity.findByOrFail('username', this.user.username)

		if (activityUser) {
			await Activity.query().where('username', this.user.username).delete()
      Event.emit('activity.leaveRoom', activityUser)
		}
	}
}

module.exports = WsDemoController
