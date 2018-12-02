const ws = adonis.Ws()
ws.connect()

const connectionStatus = $('.connection-status')
const connectionStatusText = $('.connection-status .text')
const connectionStatusIcon = $('.connection-status .icon')

ws.on('open', () => {
  connectionStatus.removeClass('text-muted')
  connectionStatusIcon.addClass('text-success')
  connectionStatusText.text('Connected')
})

ws.on('close', () => {
  connectionStatus.addClass('text-muted')
  connectionStatusIcon.removeClass('text-success')
  connectionStatusText.text('Disconnected')
})
