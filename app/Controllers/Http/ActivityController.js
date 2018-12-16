'use strict'

const Event = use('Event')

const Activity = use('App/Models/Activity')

class ActivityController {

  async remove ({ params, auth }) {

    const user = await auth.getUser()

    const activityUser = await Activity.findByOrFail('username', auth.user.username)

    if (activityUser) {
      Event.emit('activity.leaveRoom', user)
      await Activity.query().where('username', user.username).delete()
    }

    return 'success'
  }

}

module.exports = ActivityController
