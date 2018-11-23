'use strict'

class PostController {
  index() {
    return `List to posts.`
  }

  store() {
    return `Post has been created.`
  }

  show({ params }) {
    return `You are watching post ${params.id}`
  }

  update({ params }) {
    return `Post ${params.id} has been updated`
  }

  destroy({ params }) {
    return `Post ${params.id} has been removed`
  }

  create () {
    return `Create post.`
  }

  edit ({ params }) {
    return `Editing post ${params.id}.`
  }
}

module.exports = PostController
