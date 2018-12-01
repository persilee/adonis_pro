'use strict'

class AuthController {
  async logout ({ auth, response }) {
    await auth.logout()

    return response.redirect('back')
  }

  async login ({ view, auth, response }) {
    try {
      await auth.check()
    } catch (error) {
      return view.render('auth.login')
    }

    return response.redirect('back')
  }

  async auth ({ request, response, auth, session }) {
    const { username, password } = request.all()

    await auth.attempt(username, password)

    const user = await auth.getUser()

    return response.route('UserController.show', { id: user.id })
  }
}

module.exports = AuthController
