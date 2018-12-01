'use strict'

class UpdatePassword {
	get rules () {
		const user = this.ctx.auth.user

		return {
      old_password: `required|hashVerified:${user.password}`,
      new_password: 'required|min:6|max:30|confirmed'
		}
	}

	get validateAll () {
		return true
	}

	get messages () {
		return {
      'old_password.required': 'Password can\'t be blank',
      'old_password.hashVerified': 'Password is invalid',
      'new_password.required': 'New password can\'t be blank',
      'new_password.min': 'New password is too short (minimum is 6 characters)',
      'new_password.max': 'New password is too long (maximum is 30 characters)',
      'new_password.confirmed': 'New Password confirmation doesn\'t match',
		}
	}

	async fails (errorMessages) {
		const { session, response } = this.ctx

		session.withErrors(errorMessages).flashAll()

		return response.redirect('back')
	}
}

module.exports = UpdatePassword
