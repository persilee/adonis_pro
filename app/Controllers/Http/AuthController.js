'use strict'

const Event = use('Event')
class AuthController {
  async logout ({ auth, response }) {
    await auth.logout()

    return response.redirect('back')
  }

  async login ({ view, auth, response, request, session }) {
    const { redirect } = request.get()

    if (redirect) {
      session.put('redirectUrl', redirect)
    }

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

    Event.emit('user.login', user)

    const redirectUrl = session.get('redirectUrl')

    if (redirectUrl) {
      session.forget('redirectUrl')
      return response.redirect(redirectUrl)
    }

    return response.route('UserController.show', { id: user.id })
  }
}

module.exports = AuthController
