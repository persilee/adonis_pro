'use strict'

const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Database = use('Database')
const moment = require('moment')

class NotificationController {

  async followNotice ({ auth, view }) {
    const followers = await Database.raw(
      'select users.email,users.username,users.id,a.created_at,a.is_read,a.follow_id from adonis.users , (SELECT follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.user_id = ?) as a where a.follow_id = users.id order by a.created_at desc limit 50',
      [auth.user.id]
    )

    await Database.raw(
      `update adonis.follows set follows.is_read = 1 where follows.follow_id in (select a.follow_id from adonis.users , (SELECT follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.user_id = ${auth.user.id} and follows.is_read = 0) as a where a.follow_id = users.id order by a.created_at and a.is_read <> 1)`
    )

    return view.render('user.notification.follower', { followers: followers[0] })
  }

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

    const followers = await Database.raw(
      'select count(*) as followers from adonis.users , (SELECT follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.user_id = ? and follows.is_read = 0) as a where a.follow_id = users.id order by a.created_at and a.is_read <> 1',
      [auth.user.id]
    )

    return view.render('user.notification.show', { notices: notices[0], followersNum: followers[0][0].followers })
	}

	async noticesNum ({ params }) {
		const notices = await Database.raw(
			' select count(*) as notices from adonis.users , (select posts.title, a.user_id,a.created_at,a.is_read from adonis.posts,(SELECT post_user.post_id, post_user.user_id, post_user.created_at, post_user.is_read FROM adonis.post_user where post_user.post_id in (SELECT posts.id FROM adonis.posts where user_id = ?)) as a where posts.id = a.post_id) as b where b.user_id = users.id and b.is_read <> 1 and b.user_id <> ?',
			[ params.id, params.id ]
    )

    const followers = await Database.raw(
      'select count(*) as followers from adonis.users , (SELECT follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.user_id = ? and follows.is_read = 0) as a where a.follow_id = users.id order by a.created_at and a.is_read <> 1',
      [params.id]
    )

    return { notices: notices[0][0].notices + followers[0][0].followers}
	}

	async system ({ view, auth }) {
    const notices = []

    const followers = await Database.raw(
      'select count(*) as followers from adonis.users , (SELECT follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.user_id = ? and follows.is_read = 0) as a where a.follow_id = users.id order by a.created_at and a.is_read <> 1',
      [auth.user.id]
    )

    return view.render('user.notification.system', { notices: notices, followersNum: followers[0][0].followers })
	}

	async follow ({ auth, params, response }) {
		if (auth.user && params.followId != 0) {
			const userId = await Database.select('user_id').from('follows').where('follow_id', params.followId).first()
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
