'use strict'

const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Database = use('Database')
const moment = require('moment')

class NotificationController {
	async show ({ auth, view }) {
		const notices = await Database.raw(
			' select users.id as user_id,users.username,users.email,b.title,b.created_at,b.is_read,b.id as post_id from adonis.users , (select posts.id,posts.title, a.user_id,a.created_at,a.is_read from adonis.posts,(SELECT post_user.post_id, post_user.user_id, post_user.created_at, post_user.is_read FROM adonis.post_user where post_user.post_id in (SELECT posts.id FROM adonis.posts where user_id = ?)) as a where posts.id = a.post_id) as b where b.user_id = users.id and b.user_id <> ? order by b.created_at desc limit 50',
			[ auth.user.id, auth.user.id ]
		)

		await Database.raw(
			` update adonis.post_user set post_user.is_read = 1 where post_user.user_id in (select b.user_id from adonis.users , (select posts.title, a.user_id,a.created_at,a.is_read from adonis.posts,(SELECT post_user.post_id, post_user.user_id, post_user.created_at, post_user.is_read FROM adonis.post_user where post_user.post_id in (SELECT posts.id FROM adonis.posts where user_id = ${auth
				.user.id})) as a where posts.id = a.post_id) as b where b.user_id = users.id and b.user_id <> ${auth
				.user.id})`
		)

		return view.render('user.notification.show', { notices: notices[0] })
	}

	async noticesNum ({ params }) {
		const notices = await Database.raw(
			' select count(*) as notices from adonis.users , (select posts.title, a.user_id,a.created_at,a.is_read from adonis.posts,(SELECT post_user.post_id, post_user.user_id, post_user.created_at, post_user.is_read FROM adonis.post_user where post_user.post_id in (SELECT posts.id FROM adonis.posts where user_id = ?)) as a where posts.id = a.post_id) as b where b.user_id = users.id and b.is_read <> 1 and b.user_id <> ?',
			[ params.id, params.id ]
		)

		return { notices: notices[0][0].notices }
	}

	async system ({ view }) {
		const notices = []

		return view.render('user.notification.system', { notices: notices })
	}

	async follow ({ auth, params, response }) {
		if (auth.user && params.followId != 0) {
			const userId = await Database.select('user_id').from('follows').where('user_id', params.userId).first()
			if (userId) {
				await Database.table('follows').where('user_id', userId.user_id).delete()
				return { message: 'success', type: 'delete' }
			} else {
				await Database.table('follows').insert({
					follow_id: params.followId,
					user_id: params.userId,
					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
				})

				return { message: 'success', type: 'insert' }
			}
		}

		return 'login'
	}
}

module.exports = NotificationController
