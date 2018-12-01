'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post')

class Own {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, params, auth, session, response }, next, args) {
    const entityType = args[0]
    let entity = {}

    if (entityType === 'post') {
      entity = await Post.find(params.id)
    }

    const own = entity.user_id === auth.user.id

    if (!own && auth.user.id != 2) {
      session.flash({
        type: 'danger',
        message: 'You have no permission to do this.'
      })

      await session.commit()

      return response.redirect('back')
    }

    await next()
  }
}

module.exports = Own
