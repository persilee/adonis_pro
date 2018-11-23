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

Route.any('*', ({ view }) => view.render('welcome'))
