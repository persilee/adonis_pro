'use strict'

const Route = use('Route')
const Profile = use('App/Models/Profile')

Route.on('/').render('welcome')

Route.group(() => {
  Route.get('profile', 'ProfileController.edit').as('profile.edit')
  Route.post('profile', 'ProfileController.update').as('profile.update')
}).prefix('settings').middleware(['auth'])

Route.post('share/:type/:id/email', 'ShareController.email').as('share.email')

Route.get('files/:id/download', 'FileController.download').as('files.download')

Route.get('upload', 'FileController.create').as('upload')

Route.resource('files', 'FileController')

Route.post('logout', 'AuthController.logout').as('logout')

Route.get('login', 'AuthController.login').as('login')

Route.post('auth', 'AuthController.auth').as('auth')

Route.get('register', 'UserController.create').as('signUp')

Route.get('users/create', ({ response }) => response.route('signUp'))

Route.resource('posts', 'PostController').middleware(
	new Map([
		[ [ 'create', 'store', 'edit', 'update', 'destroy' ], [ 'auth' ] ],
		[ [ 'update', 'destroy', 'edit' ], [ 'own:post' ] ]
	])
)

Route.resource('users', 'UserController')

Route.resource('tags', 'TagController')

Route.get('profiles/:id', async ({ params }) => {
	const profile = await Profile.find(params.id)
	const user = await profile.user().select('username').fetch()

	return {
		profile,
		user
	}
})
