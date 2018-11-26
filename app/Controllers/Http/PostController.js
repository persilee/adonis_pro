'use strict'

const Database = use('Database')
const Post = use('App/Models/Post')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const posts = await Post.all()
    // return posts
    return view.render('post.index', { posts: posts.toJSON() })
  }

  /**
   * Render a form to be used for creating a new post.
   * GET posts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
    return view.render('post.create')
  }

  /**
   * Create/save a new post.
   * POST posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const newPost = request.only(['title', 'content'])
    // const postId = await Database.insert(newPost).into('posts')
    // console.log(postId)
    const post = await Post.create(newPost)
    return response.redirect(`posts/${ post.id }`)
  }

  /**
   * Display a single post.
   * GET posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    // const post = await Database.from('posts')
    //   .where('id', params.id)
    //   .first()

    const post = await Post.findOrFail(params.id)
    return view.render('post.show', { post })
  }

  /**
   * Render a form to update an existing post.
   * GET posts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
    // const post = await Database.from('posts')
    //   .where('id', params.id)
    //   .first()

    const post  = await Post.findOrFail(params.id)
    return view.render('post.edit', { post: post.toJSON() })
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const updatedPost = request.only(['title', 'content'])
    // await Database.table('posts')
    //   .where('id', params.id)
    //   .update(updatedPost)

    const post = await Post.findOrFail(params.id)
    post.merge(updatedPost)
    post.save()
  }

  /**
   * Delete a post with id.
   * DELETE posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    // await Database.table('posts')
    //   .where('id', params.id)
    //   .delete()

    const post = await Post.find(params.id)
    post.delete()
    return 'success'
  }
}

module.exports = PostController
