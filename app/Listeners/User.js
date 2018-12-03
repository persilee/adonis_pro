'use strict'

const Ws = use('Ws')

const User = exports = module.exports = {}

User.method = async () => {
}

User.log = async (user) => {
  Ws.getChannel('demo')
    .topic('demo')
    .broadcast('message', {
      username: user.username,
      content: '<small class="text-muted">just logged in.</small>'
    })
}
