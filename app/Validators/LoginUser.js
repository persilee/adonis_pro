'use strict'

class LoginUser {
  get rules () {
    return {
      username: 'required',
      password: 'required'
    }
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'username.required': 'Username can\'t be blank',
      'password.required': 'Password can\'t be blank',
    }
  }

  async fails (errorMessages) {
    const { session, response } = this.ctx

    session
      .withErrors(errorMessages)
      .flashAll()

    return response.redirect('back')
  }
}

module.exports = LoginUser
