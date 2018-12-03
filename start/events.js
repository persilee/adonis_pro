const Event = use('Event')

Event.on('user.login', ['User.log'])
Event.on('user.store', ['User.verification'])
