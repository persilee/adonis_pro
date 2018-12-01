'use strict'

const Verification = use('App/Models/Verification')
const moment = use('moment')
const Mail = use('Mail')
const Env = use('Env')

class VerificationController {
	async verify ({ params, auth, session, response }) {
		const { token } = params
		const verification = await Verification.findByOrFail('token', token)
		const user = await verification.user().fetch()
		if (moment() > moment(verification.create_at).add(3, 'days')) {
			session.flash({
				type    : 'danger',
				message : 'Verification expired, please resend email verification.'
			})
			await verification.delete()

			return response.route('users.show', { id: user.id })
		}
		user.is_verified = true
		await user.save()

		try {
			await auth.check()
		} catch (error) {
			await auth.login(user)
		}

		await verification.delete()

		session.flash({
			type    : 'success',
			message : 'Successfully verified your email.'
		})

		return response.route('users.show', { id: user.id })
	}

	async resend ({ response, request, auth, session }) {
		const user = auth.user
		await user.verification().delete()

		const verification = await user.generateVerification()

		await Mail.send(
			'email.verification',
			{
				appURL: Env.get('APP_URL'),
				verification,
				user
			},
			(message) => {
				message.to(user.email).from(Env.get('SITE_MAIL')).subject(`Please verify your email ${user.email}.`)
			}
		)

		session.flash({
			type    : 'success',
			message : `We sent a verification email to ${user.email}.`
		})

		return response.redirect('back')
	}
}

module.exports = VerificationController
