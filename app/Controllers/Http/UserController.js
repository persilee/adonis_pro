'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */

const Database = use('Database')
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Event = use('Event')

class UserController {
	/**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async index ({ request, response, view }) {}

	/**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async create ({ request, response, view }) {
		return view.render('user.create')
	}

	/**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async store ({ request, response, auth }) {
		const newUser = request.only([ 'username', 'password', 'email' ])
    const user = await User.create(newUser)
    Event.emit('user.store', user)
    await auth.login(user)
		return response.redirect(`/users/${user.id}`)
	}

	/**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view, auth }) {
		const pageNumber = request.input('page', 1)
    const pageSize = 10

		const user = await User.find(params.id)
    await user.load('profile')

    let _posts = await user.posts().orderBy('updated_at', 'desc').with('user').paginate(pageNumber, pageSize)

    const total_liked = await user.likes().orderBy('updated_at', 'desc').with('user').getCount()
    const posts = _posts.toJSON()
    let followed = ''
    if (auth.user){
      const ownUser = await User.find(auth.user.id)
      const likes = await ownUser.likes().fetch()
      const likeList = likes.toJSON()
      posts.data.forEach(function (post, p) {
        likeList.forEach(function (liked, l) {
          if (post.id == liked.id) {
            posts.data[p].liked = 'liked'
          }
        })
      })

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

    const total_reads = await Post.query()
      .where('user_id', params.id)
      .getSum('reads')

    const total_likes = await Post.query()
      .where('user_id', params.id)
      .getSum('likes')

    return view.render('user.show', {
      user: user.toJSON(),
      ...posts,
      total_reads,
      total_likes,
      total_liked,
      total_follower,
      total_followed,
      followed
    })
	}

	/**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async edit ({ params, request, response, view }) {}

	/**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async update ({ params, request, response }) {}

	/**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {}
}

module.exports = UserController
