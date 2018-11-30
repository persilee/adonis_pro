'use strict'

const Post = use('App/Models/Post')
const Mail = use('Mail')

class ShareController {
  async email ({ auth, params, request, response, session }) {
    const user = await auth.getUser()

    switch (params.type) {
      case 'post':
        const post = await Post.find(params.id)
        const author = await post.user().fetch()

        await Mail.raw(`<div><h1>${ post.title }</h1>${ post.content }</div>`, (message) => {
          message.to(user.email)
            .from('dev-demo@lishaoy.net')
            .subject(`《${ post.title }》 - ${ author.username }`)
        })
        break;

      default:
        break;
    }

    session.flash({
      type: 'success',
      message: 'Mail has been sent, check your inbox.'
    })

    return response.redirect('back')
  }
}

module.exports = ShareController
