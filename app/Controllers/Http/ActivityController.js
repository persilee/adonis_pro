'use strict'

const Event = use('Event')

const Activity = use('App/models/Activity')

class ActivityController {

  async remove ({ params, auth }) {

    const user = await auth.getUser()

    console.log(user)

    try {
      await Activity.query().where('username', user.username).delete()
    } catch (error) {
      console.log(error)
    }

    Event.emit('activity.leaveRoom', user)

    return 'success'
  }

}

module.exports = ActivityController
