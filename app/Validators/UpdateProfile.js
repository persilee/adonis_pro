'use strict'

class UpdateProfile {
	get rules () {
		const user = this.ctx.auth.user

		return {
			username : `required|unique:users,username,id,${user.id}`,
			email    : `required|unique:users,email,id,${user.id}`,
			github   : `unique:profiles,github,user_id,${user.id}`
		}
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'username.required': 'Username can\'t be blank',
      'username.unique': 'Username is already taken',
      'email.required': 'Email can\'t be blank',
      'email.email': 'Email is invalid',
      'email.unique': 'Email is already taken',
      'github.unique': 'Github account is used by someone else'
    }
  }

  async fails (errorMessages) {
    const { session, response } = this.ctx

    session.withErrors(errorMessages).flashAll()

    return response.redirect('back')
  }
}

module.exports = UpdateProfile
