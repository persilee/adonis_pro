const ws = adonis.Ws('ws://localhost:3333')
ws.connect()

const connectionStatus = $('.connection-status')
const connectionStatusText = $('.connection-status .text')
const connectionStatusIcon = $('.connection-status .icon')
const email = $('.user-list-box .header .toggle-btn').data('email')
const message = $('#message')
const messages = $('.messages')
const userList = $('#user-list')

ws.on('open', () => {
	connectionStatus.removeClass('text-muted')
	connectionStatusIcon.addClass('text-success')
	connectionStatusText.text('Connected')

	subscribeToChannel()
})

ws.on('close', () => {
	connectionStatus.addClass('text-muted')
	connectionStatusIcon.removeClass('text-success')
	connectionStatusText.text('Disconnected')
})

const subscribeToChannel = () => {
	const demo = ws.subscribe('demo')

	demo.on('new:user', (message) => {
		console.log(message)
	})
	demo.on('message', (message) => {
		if (message.type == 'login') {
			userList.append(`
        <li class="list-group-item d-flex align-items-center py-3">
          <div class="avatar mr-2">
            <div class="toggle-btn"
            style="background-image: url('https://cn.gravatar.com/avatar/${message.email}?s=60&d=robohash&r=G');">
            </div>
          </div>
          <div class="info">
            <span>${message.username}</span>
          </div>
        </li>
      `)
      messages.append(`
        <div class="message my-4 d-flex justify-content-center">
          <div class="mr-2">
              <div class="toggle-btn char-room login-tip"
              style="background-image: url('https://cn.gravatar.com/avatar/${message.email}?s=60&d=robohash&r=G');">
              </div>
          </div>
          <div class="d-flex">
            <div class="username login-tip">
              <small class="text-muted" style="white-space: nowrap">${message.username}: </small>
            </div>
            <div class="text login-tip">
              ${message.content}
            </div>
          </div>
        </div>
        `)
		} else {
			messages.append(`
        <div class="message my-4 d-flex">
          <div class="mr-2">
              <div class="toggle-btn char-room"
              style="background-image: url('https://cn.gravatar.com/avatar/${message.email}?s=60&d=robohash&r=G');">
              </div>
          </div>
          <div class="d-flex flex-column">
            <div class="username">
              <small class="text-muted" style="white-space: nowrap">${message.username}: </small>
            </div>
            <div class="text shadow-sm">
              ${message.content}
            </div>
          </div>
        </div>
        `)
		}

		messages.animate({ scrollTop: messages.height() + messages.scrollTop() }, 'slow')
	})
}

$(message).keyup(function (e) {
	if (e.which == 13) {
		e.preventDefault()

		const messageContent = $(this).val()
		$(this).val('')

		if (messageContent) {
			ws.getSubscription('demo').emit('message', {
        content : messageContent,
        email: email
			})
		}
	}
})
