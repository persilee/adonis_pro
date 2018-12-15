'use strict'

const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Database = use('Database')
const moment = require('moment')

class LikedController {
	async liked ({ params, auth }) {

		if (auth.user) {
			const userId = await Database.select('user_id').from('post_user').where('post_id', params.postId).first()
			if (!userId) {
				await Database.table('post_user').insert({
					post_id: params.postId,
					user_id: params.userId,
					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        await Post.query().where('id', params.postId).increment('likes', 1)
			} else if (userId && userId.user_id != auth.user.id) {
				await Database.table('post_user').insert({
					post_id: params.postId,
					user_id: params.userId,
					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        await Post.query().where('id', params.postId).increment('likes', 1)
			}
		}
	}

	async likePosts ({ view, response, request, auth, params }) {
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

    const total_reads = await Post.query().where('user_id', params.id).getSum('reads')

    const total_likes = await Post.query().where('user_id', params.id).getSum('likes')

    const total_post = await Post.query().where('user_id', params.id).getCount()


    const user = await User.find(params.id)
    await user.load('profile')

    const total_liked = await user.likes().orderBy('updated_at', 'desc').with('user').getCount()

    const _posts = await user.likes().orderBy('updated_at', 'desc').with('user').paginate(page, perPage)
    const posts = _posts.toJSON()

    if (auth.user && params.id == auth.user.id) {
      posts.data.forEach(function (post, p) {
        post.liked = 'liked'
      })
    }

    let followed = ''
    if (auth.user) {
      const follows = await Database.raw(
        'select users.email,users.username,users.id,a.created_at,a.is_read,a.user_id from adonis.users , (SELECT follows.user_id, follows.created_at,follows.is_read FROM adonis.follows where follows.follow_id = ?) as a where a.user_id = users.id',
        [auth.user.id]
      )

      follows[0].forEach(function (follow, f) {
        if (follow.id == params.id) {
          followed = 'followed'
        }
      })
    }

    const followers = await Database.raw(
      'select count(*) as followers from adonis.users , (SELECT follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.user_id = ?) as a where a.follow_id = users.id order by a.created_at and a.is_read <> 1',
      [params.id]
    )

    const followedNum = await Database.raw(
      'select count(*) as followed from adonis.users , (SELECT follows.user_id, follows.created_at,follows.is_read FROM adonis.follows where follows.follow_id = ?) as a where a.user_id = users.id',
      [params.id]
    )

    const total_follower = followers[0][0].followers
    const total_followed = followedNum[0][0].followed

		return view.render('user.liked.index', {
			...posts,
			user: user.toJSON(),
			total_reads,
			total_likes,
      total_post,
      total_liked,
      total_follower,
      total_followed,
			userId,
      email,
      followed
		})
	}
}

module.exports = LikedController
