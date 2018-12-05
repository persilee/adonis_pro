'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */

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
	async store ({ request, response }) {
		const newUser = request.only([ 'username', 'password', 'email' ])
    const user = await User.create(newUser)
    Event.emit('user.store', user)

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
	async show ({ params, request, response, view }) {
		const pageNumber = request.input('page', 1)
    const pageSize = 10

		const user = await User.find(params.id)
    await user.load('profile')

    const posts = await user.posts().orderBy('updated_at', 'desc').with('user').paginate(pageNumber, pageSize)

    const total_reads = await Post.query()
      .where('user_id', params.id)
      .getSum('reads')

    const total_likes = await Post.query()
      .where('user_id', params.id)
      .getSum('likes')

    return view.render('user.show', {
      user: user.toJSON(),
      ...posts.toJSON(),
      total_reads: total_reads,
      total_likes: total_likes
    })
		// const { username, email } = user.toJSON()
		// const profile = await user.profile()
		//   .select('github')
		//   .fetch()

		// const posts = await user.posts()
		//   .select('title', 'content')
		//   .fetch()

		// return {
		//   username,
		//   email,
		//   profile,
		//   posts
		// }
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
