'use strict'

class PostController {
  index ( { view } ) {
    return view.render('posts.index')
  }
}

module.exports = PostController
