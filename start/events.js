const Event = use('Event')

Event.on('user.login', ['User.log'])
Event.on('user.store', ['User.verification'])
Event.on('activity.leaveRoom', ['Activity.leave'])
Event.on('activity.joinRoom', ['Activity.join'])
