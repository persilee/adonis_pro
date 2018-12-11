'use strict'

const Ws = use('Ws')
const Mail = use('Mail')
const Env = use('Env')
const md5 = require('js-md5')

const User = exports = module.exports = {}

User.method = async () => {
}

User.log = async (user) => {
  const email = user.email ? user.email : user.username
  Ws.getChannel('demo')
    .topic('demo')
    .broadcast('message', {
      type: 'login',
      username: user.username,
      email: md5(email),
      listId: user.id,
      content: '<small class="text-muted">just logged in.</small>'
    })
}

User.verification = async (user) => {
  const verification = await user.generateVerification()

  await Mail.send(
    'email.verification',
    {
      appURL: Env.get('APP_URL'),
      verification,
      user
    },
    (message) => {
      message.to(user.email).from(Env.get('SITE_MAIL')).subject(`Please verify your email ${user.email}.`)
    }
  )
}
