'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Activity = use('App/models/Activity')
const Event = use('Event')
const Message = use('App/models/Message')
class ChatRoomController {
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
		let user = auth.user
			? { username: auth.user.username, email: auth.user.email, user_id: auth.user.id }
			: { username: 'Anonymous', email: Math.random().toString(16).substr(2), user_id: '' }

		if (user.username !== 'Anonymous' && !user.email) {
			user.email = user.username
		}
		const userList = await Activity.all()

		if (user.username != 'Anonymous') {
			setTimeout(() => {
				Activity.create(user)
				Event.emit('activity.joinRoom', user)
			}, 500)
    }


    const messages = await Message.query().paginate(1,10)

		return view.render('ws.ws', { user, userList: userList.toJSON(), messages: messages.rows })
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
	async show ({ params, request, response, view }) {

    let user = { username: 'Anonymous', email: Math.random().toString(16).substr(2), activity_id: params.id }

		setTimeout(() => {
			Activity.create(user)
			Event.emit('activity.joinRoom', user)
    }, 500)

    return 'success'
	}

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
