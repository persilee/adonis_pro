'use strict'

const Post = use('App/Models/Post')

class ShareController {
  async email ({ auth, params, request, response, session }) {
    const user = await auth.getUser()

    switch (params.type) {
      case 'post':
        const post = await Post.find(params.id)
        const author = await post.user().fetch()
        return {
          post,
          author,
          user
        }
        break;

      default:
        break;
    }

  }
}

module.exports = ShareController
