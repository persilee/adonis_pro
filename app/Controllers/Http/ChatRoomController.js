'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with chatrooms
 */
class ChatRoomController {
	constructor () {
		this.activityUsers = [
			{ username: 'Anonymous', email: Math.random().toString(16).substr(2), status: 'not' },
      { username: 'Anonymous', email: Math.random().toString(16).substr(2), status: 'not' },
      { username: 'Anonymous', email: Math.random().toString(16).substr(2), status: 'not' }
		]
  }

	/**
   * Show a list of all chatrooms.
   * GET chatrooms
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async index ({ request, response, view, auth }) {
		let user = auth.user || { username: 'Anonymous', email: Math.random().toString(16).substr(2), status: 'not' }

		if (user.username !== 'Anonymous' && !user.email) {
			user.email = user.username
    }

    let userList = this.activityUsers

    userList.splice(userList.length, 0, user)
    console.log(this.activityUsers)
		return view.render('ws.ws', { user, userList: this.activityUsers })
	}

	/**
   * Render a form to be used for creating a new chatroom.
   * GET chatrooms/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async create ({ request, response, view }) {}

	/**
   * Create/save a new chatroom.
   * POST chatrooms
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async store ({ request, response }) {}

	/**
   * Display a single chatroom.
   * GET chatrooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async show ({ params, request, response, view }) {}

	/**
   * Render a form to update an existing chatroom.
   * GET chatrooms/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async edit ({ params, request, response, view }) {}

	/**
   * Update chatroom details.
   * PUT or PATCH chatrooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async update ({ params, request, response }) {}

	/**
   * Delete a chatroom with id.
   * DELETE chatrooms/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async destroy ({ params, request, response }) {}
}

module.exports = ChatRoomController
