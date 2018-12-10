'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use('Helpers')
const File = use('App/Models/File')
const Drive = use('Drive')
const Route = use('Route')

/**
 * Resourceful controller for interacting with files
 */
class FileController {
	async download ({ params, response }) {
		const file = await File.find(params.id)
		const filePath = `${Helpers.publicPath('uploads')}/${file.file_name}`

		return response.attachment(filePath, file.client_name)
	}
	/**
   * Show a list of all files.
   * GET files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async index ({ request, response, view }) {
		// const _files = await File.all()
		// const files = _files.toJSON()

		const page = request.input('page')
		const perPage = 30

		const files = await File.query()
			.orderBy('created_at', 'desc')
			.with('user', (builder) => {
				builder.select('id', 'username', 'email')
			})
			.paginate(page, perPage)

		return view.render('file.index', { ...files.toJSON() })
	}

	/**
   * Render a form to be used for creating a new file.
   * GET files/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async create ({ request, response, view }) {
		return view.render('file.create')
	}

	/**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async store ({ request, response, session, auth }) {
		const file = request.file('file', {
			types : [ 'image', 'video' ],
			size  : '100mb'
		})

		if (!file) {
			session.flash({
				type    : 'warning',
				message : 'You have not selected the file, please select.'
			})

			return response.redirect('back')
		}

		console.log(file)

		const fileName = `${new Date().getTime()}.${file.subtype}`

		await file.move(Helpers.publicPath('uploads'), {
			name : fileName
		})

		if (!file.moved()) {
			const error = file.error()

			session.flash({
				type    : 'warning',
				message : `<small>${error.clientName}</small>: ${error.message}`
			})

			return response.redirect('back')
		}

		await File.create({
			client_name : file.clientName,
			file_name   : fileName,
			type        : file.type,
			subtype     : file.subtype,
			size        : file.size,
			user_id     : auth.user.toJSON().id
		})

		session.flash({
			type    : 'success',
			message : `<small>${file.clientName}</small>: Successfully uploaded.`
		})

		return response.redirect('back')
	}

	/**
   * Display a single file.
   * GET files/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async show ({ params, auth, response, view }) {
		const file = await File.find(params.id)
		const user = await file.user().fetch()
		let userId = ''
		if (auth.user) {
			userId = auth.user.toJSON().id
		}

		return view.render('file.show', { file: file.toJSON(), user: user.toJSON(), userId })
	}

	/**
   * Render a form to update an existing file.
   * GET files/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async edit ({ params, request, response, view }) {
		const file = await File.find(params.id)

		return view.render('file.edit', { file })
	}

	/**
   * Update file details.
   * PUT or PATCH files/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async update ({ params, request, response, session }) {
		const fileData = await File.find(params.id)
		const { client_name, file_name } = request.all()

		if (file_name !== fileData.file_name) {
			try {
				const basePath = Helpers.publicPath('uploads')
				const originalFilePath = `${basePath}/${fileData.file_name}`
				const filePath = `${basePath}/${file_name}`
				await Drive.move(originalFilePath, filePath)
			} catch (error) {
				session.flash({
					type    : 'warning',
					message : error.message
				})
				return response.redirect('back')
			}
		}

		fileData.merge({ client_name, file_name })
		await fileData.save()

		session.flash({
			type    : 'success',
			message : 'Successfully updated.'
		})

		return response.redirect('back')
	}

	/**
   * Delete a file with id.
   * DELETE files/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async destroy ({ params, request, response, session }) {
		try {
			const fileData = await File.findOrFail(params.id)
			const filePath = `${Helpers.publicPath('uploads')}/${fileData.file_name}`
			await Drive.delete(filePath)
			await fileData.delete()

			session.flash({
				type    : 'success',
				message : `<small>${fileData.client_name}:</small> successfully deleted.`
			})

			return response.redirect(Route.url('files.index'))
		} catch (error) {
			session.flash({
				type    : 'warning',
				message : error.message
			})

			return response.redirect('back')
		}
	}
}

module.exports = FileController
