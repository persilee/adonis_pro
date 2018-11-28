'use strict'

const Database = use('Database')
const Post = use('App/Models/Post')
const User = use('App/models/User')
const Tag = use('App/models/Tag')
const { validateAll } = use('Validator')

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
  async index ({ request, response, view }) {
    const posts = await Post.query()
      .with('user', (builder) => {
        builder.select('id', 'username')
      })
      .with('user.profile')
      .fetch()
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
  async create ({ request, response, view }) {
    const users = await User.all()
    const tags = await Tag.all()

    return view.render('post.create', { users: users.toJSON(), tags: tags.toJSON() })
  }

  /**
   * Create/save a new post.
   * POST posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, session }) {
    const rules = {
      title: 'required',
      content: 'required'
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const newPost = request.only(['title', 'content'])
    const tags = request.input('tags')
    // const postId = await Database.insert(newPost).into('posts')
    // console.log(postId)
    // const post = await Post.create(newPost)

    const user = await User.find(request.input('user_id'))
    const post = await user.posts()
      .create(newPost)
    await post.tags()
      .attach(tags)

    return response.redirect(`posts/${post.id}`)
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
  async show ({ params, request, response, view }) {
    // const post = await Database.from('posts')
    //   .where('id', params.id)
    //   .first()

    const post = await Post.findOrFail(params.id)
    const tags = await post.tags()
      .select('id', 'title')
      .fetch()

    return view.render('post.show', { post, tags: tags.toJSON() })
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
  async edit ({ params, request, response, view }) {
    // const post = await Database.from('posts')
    //   .where('id', params.id)
    //   .first()

    const post = await Post.findOrFail(params.id)
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
  async update ({ params, request, response }) {
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
  async destroy ({ params, request, response }) {
    // await Database.table('posts')
    //   .where('id', params.id)
    //   .delete()

    const post = await Post.find(params.id)
    try {
      await post.tags().detach()
      post.delete()
    } catch (error) {
      console.log(error)
    }
    return 'success'
  }
}

module.exports = PostController
