'use strict'

const Route = use('Route')

Route.on('/').render('welcome')

Route.resource('posts', 'PostController')
  .except(['index'])
  // .only(['index', 'show', 'store'])
  // .apiOnly()

