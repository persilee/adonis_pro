const ws = adonis.Ws()
ws.connect()

const connectionStatus = $('.connection-status')
const connectionStatusText = $('.connection-status .text')
const connectionStatusIcon = $('.connection-status .icon')
const message = $('#message')
const messages = $('.messages')

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

  demo.on('message', (message) => {
    console.log(message)
    messages.append(`
    <div class="message my-4 d-flex">
      <div class="mr-2">
        <small class="text-black-50" style="white-space: nowrap">${message.username}: </small>
      </div>
      <div>
        ${message.content}
      </div>
    </div>
    `)
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
        content: messageContent
      })
    }
  }
});
