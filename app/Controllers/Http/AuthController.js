'use strict'

const { validateAll } = use('Validator')

class AuthController {
  async login ({ view }) {
    return view.render('auth.login')
  }

  async auth ({ request, response, auth, session }) {
    const rules = {
      username: 'required',
      password: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      session.withErrors(validation.messages())
        .flashAll()

       return response.redirect('back')
    }

    const { username, password } = request.all()

    await auth.attempt(username, password)

    const user = await auth.getUser()

    return response.route('UserController.show', { id: user.id })
  }
}

module.exports = AuthController
