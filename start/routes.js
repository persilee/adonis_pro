'use strict'

const Database = use('Database')
const Route = use('Route')

Route.on('/').render('welcome')

Route.resource('posts', 'PostController').except(['index'])
// .only(['index', 'show', 'store'])
// .apiOnly()

Route.get('/list-of-users', () => 'List of users.').as('users.index')

Route.get('/users', ({ request }) => {
  switch (request.format()) {
    case 'json':
      return [{ name: 'lishaoy' }, { name: 'miaomiao' }]
    default:
      return `lishaoy`
  }
}).formats(['json', 'html'], true)

Route.group(() => {
  Route.get('users', () => 'Manage users')
  Route.get('posts', () => 'Manage posts')
}).prefix('admin')

// Route.post('/articles', ({ request }) => request.post())
// Route.post('/articles', ({ request }) => request.all())
// Route.post('/articles', ({ request }) => request.only(['title', 'content']))
// Route.post('/articles', ({ request }) => request.except(['title', 'content']))
// Route.post('/articles', ({ request }) => request.input('status', 'draft'))

// Route.post('/articles', ({ request }) => request.only(['title', 'content']))
// Route.post('/articles', ({ request }) => request.collect(['title', 'content']))

Route.get('/articles', ({ request, response }) => {
  // response.header('Content-type', 'text/plain')
  response.type('text/plain')
  return '<h1>Post of list.</h1>'
})

Route.any('*', ({ view }) => view.render('welcome'))

