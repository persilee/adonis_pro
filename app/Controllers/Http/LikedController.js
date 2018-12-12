'use strict'

const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Database = use('Database')
const moment = require('moment')

class LikedController {
	async liked ({ params, auth }) {
		await Database.table('post_user').insert({
			post_id: params.post,
			user_id: params.user,
			created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
			updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
		})
	}

	async show ({ view, response, request, auth, params }) {
		let page = request.input('page')
		let perPage = 10
		let userId = ''
		let email = ''
		if (auth.user) {
			userId = auth.user.toJSON().id
			email = auth.user.email
			if (!email) {
				email = auth.user.username
			}
		}

		const total_reads = await Post.query().where('user_id', auth.user.id).getSum('reads')

		const total_likes = await Post.query().where('user_id', auth.user.id).getSum('likes')

    const total_post = await Post.query().where('user_id', auth.user.id).getCount()

		const user = await User.find(auth.user.id)
		await user.load('profile')

		const posts = await user.likes().orderBy('updated_at', 'desc').with('user').paginate(page, perPage)

		console.log({ user: user.toJSON() })

		return view.render('post.liked.index', {
			...posts.toJSON(),
			user: user.toJSON(),
			total_reads,
			total_likes,
			total_post,
			userId,
			email
		})
	}
}

module.exports = LikedController
