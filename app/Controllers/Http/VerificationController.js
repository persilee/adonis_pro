'use strict'

const Verification = use('App/Models/Verification')

class VerificationController {
  async verify ({ params, auth, session, response }) {
    const { token } = params

    console.log(token)
    const verification = await Verification.findByOrFail('token', token)
    console.log(verification)

    const user = await verification.user().fetch()
    console.log(user)


    user.is_verified = true
    await user.save()

    try {
      await auth.check()
    } catch (error) {
      await auth.login(user)
    }

    await verification.delete()

    session.flash({
      type: 'success',
      message: 'Successfully verified your email.'
    })

    return response.route('users.show', { id: user.id })
  }
}

module.exports = VerificationController
