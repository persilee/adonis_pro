'use strict'

const Route = use('Route')
const Profile = use('App/Models/Profile')

Route.get('/', ({ response }) => response.route('posts.index')).as('index')

Route.resource('chatRooms', 'ChatRoomController')

Route.get('users/verification/:token', 'VerificationController.verify').as('verification.email')

Route.post('users/verification/resend', 'VerificationController.resend').as('verification.resend')

Route.get('chatRoom/activity/remove/:id', 'ActivityController.remove')

Route.group(() => {
	Route.get('profile', 'ProfileController.edit').as('profile.edit')
	Route.post('profile', 'ProfileController.update').as('profile.update').validator('UpdateProfile')
	Route.get('password', 'PasswordController.edit').as('password.edit')
	Route.post('password', 'PasswordController.update').as('password.update').validator('UpdatePassword')
})
	.prefix('settings')
	.middleware([ 'auth' ])

Route.post('share/:type/:id/email', 'ShareController.email').as('share.email')
Route.get('share/:type/:id/email', 'ShareController.email').as('share.email')
Route.get('share/:id/like', 'ShareController.like').as('share.like')

Route.get('files/:id/download', 'FileController.download').as('files.download')

Route.get('upload', 'FileController.create').as('upload')

Route.resource('files', 'FileController')

Route.post('logout', 'AuthController.logout').as('logout')

Route.get('logout', 'AuthController.logout').as('logout')

Route.get('login', 'AuthController.login').as('login')

Route.post('auth', 'AuthController.auth').as('auth').validator('LoginUser')

Route.get('register', 'UserController.create').as('signUp')

Route.get('users/create', ({ response }) => response.route('signUp'))

Route.resource('posts', 'PostController').middleware(
	new Map([
		[ [ 'create', 'store', 'edit', 'update', 'destroy' ], [ 'auth' ] ],
		[ [ 'update', 'destroy', 'edit' ], [ 'own:post' ] ]
	])
).validator(new Map([
  [['posts.update', 'posts.store'], ['StorePost']]
]))

Route.resource('users', 'UserController').validator(new Map([
  [['users.store'], ['StoreUser']]
]))

Route.resource('tags', 'TagController')

Route.get('liked/show/:id', 'LikedController.likePosts')

Route.get('liked/:userId/:postId', 'LikedController.liked')

Route.get('notification', 'NotificationController.show').as('notification')

Route.get('notification/system', 'NotificationController.system').as('notification.system')

Route.get('notification/num/:id', 'NotificationController.noticesNum').as('notification.num')

Route.get('profiles/:id', async ({ params }) => {
	const profile = await Profile.find(params.id)
	const user = await profile.user().select('username').fetch()

	return {
		profile,
		user
	}
})
