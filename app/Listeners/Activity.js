'use strict'

const Ws = use('Ws')
const md5 = require('js-md5')

const Activity = (exports = module.exports = {})

Activity.method = async () => {}

Activity.leave = async (user) => {
	const email = user.email ? user.email : user.username
	const activityId = user.activity_id ? user.activity_id.replace(/\./g, '-') : ''
	if (Ws.getChannel('demo').topic('demo')) {
		Ws.getChannel('demo').topic('demo').broadcast('message', {
			type: 'leave',
			username: user.username,
			email: md5(email),
			id: user.username == 'Anonymous' ? user.id : user.user_id,
			activityId: user.activity_id ? activityId : '',
			content: '<small class="text-muted">just leave room.</small>'
		})
	}
}

Activity.join = async (user) => {
	const email = user.email ? user.email : user.username
	const activityId = user.activity_id ? user.activity_id.replace(/\./g, '-') : ''

	if (Ws.getChannel('demo').topic('demo')) {
		Ws.getChannel('demo').topic('demo').broadcast('message', {
			type: 'join',
			username: user.username,
			email: md5(email),
			id: user.username == 'Anonymous' ? user.id : user.user_id,
			activityId: user.activity_id ? activityId : '',
			content: '<small class="text-muted">just join room.</small>'
		})
	}
}
