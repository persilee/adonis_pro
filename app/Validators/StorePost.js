'use strict'

class StorePost {
	get rules () {
		return {
			title   : 'required',
			content : 'required|min:3'
		}
	}

	get validateAll () {
		return true
	}

	get messages () {
		return {
			'title.required'   : "Title can't be blank",
			'content.required' : "Content can't be blank",
			'content.min'      : 'Content is too short (minimum is 3 characters)'
		}
	}

	async fails (errorMessages) {
		const { session, response } = this.ctx

		session.withErrors(errorMessages).flashAll()

		return response.redirect('back')
	}
}

module.exports = StorePost
