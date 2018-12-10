'use strict'

const Ws = use('Ws')
const md5 = require('js-md5')

const Activity = exports = module.exports = {}

Activity.method = async () => {

}


Activity.leave = async (user) => {
  console.log('user leave')
  Ws.getChannel('demo')
    .topic('demo')
    .broadcast('message', {
      type: 'leave',
      username: user.username,
      email: md5(user.email),
      content: '<small class="text-muted">just leave room.</small>'
    })
}
