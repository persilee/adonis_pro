$(function () {
	if (location.href == 'http://localhost:3333/chatRooms') {
		chatRoom()
	}

	function chatRoom () {
		const ws = adonis.Ws('ws://localhost:3333/')
		ws.connect()

		const connectionStatus = $('.connection-status')
		const connectionStatusText = $('.connection-status .text')
		const connectionStatusIcon = $('.connection-status .icon')
		const email = $('.user-list-box .header .toggle-btn').data('email')
		const message = $('#message')
		const messages = $('#messages')
		const userList = $('#user-list')

		ws.on('open', () => {
			connectionStatus.removeClass('text-muted')
			connectionStatusIcon.addClass('text-success')
			connectionStatusText.text('Connected')

			subscribeToChannel()
		})

		ws.on('close', (data) => {
			connectionStatus.addClass('text-muted')
			connectionStatusIcon.removeClass('text-success')
			connectionStatusText.text('Disconnected')
		})

		// ws.close()

		const subscribeToChannel = () => {
			const activityId = returnCitySN['cip'].replace(/\./g, '-')
			const demo = ws.subscribe('demo')
			demo.on('message', (message) => {
				if (message.type == 'login') {
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
					// messages.children('div:last-child')[0].scrollIntoView()
					messages.scrollTop(messages[0].scrollHeight)
				} else if (message.type == 'join') {
					if (message.id && message.username != 'Anonymous') {
						$('#' + message.id).remove()
					} else if (message.activityId) {
						$('#' + activityId).remove()
					}
					userList.append(`
              <li id="${message.id
					? message.id
					: message.activityId}" class="list-group-item d-flex align-items-center py-3">
                <div class="avatar mr-2">
                  <div class="toggle-btn"
                  style="background-image: url('https://cn.gravatar.com/avatar/${message.email}?s=60&d=robohash&r=G');">
                  </div>
                </div>
                <div class="info text-truncate">
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
				} else if (message.type == 'leave') {
					if (message.id && message.username != 'Anonymous') {
						$('#' + message.id).remove()
					} else if (message.activityId) {
						$('#' + activityId).remove()
					}
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

				$('.message-box-inner').animate(
					{ scrollTop: $('.message-box-inner').height() + $('.message-box-inner').scrollTop() },
					'slow'
				)
				$('.user-list').animate({ scrollTop: $('.user-list').height() + $('.user-list').scrollTop() }, 'slow')
			})
		}

		function imgReader (item) {
			var blob = item.getAsFile(),
        reader = new FileReader()

			reader.onload = function (e) {
				var img = new Image(),
					p = document.createElement('p')
        img.src = e.target.result
				p.appendChild(img)
				$(message).append(p)
      }
			reader.readAsDataURL(blob)
    }

    /**
     * 改变blob图片的质量，为考虑兼容性
     * @param blob 图片对象
     * @param callback 转换成功回调，接收一个新的blob对象作为参数
     * @param format 目标格式，mime格式
     * @param quality 介于0-1之间的数字，用于控制输出图片质量，仅当格式为jpg和webp时才支持质量，png时quality参数无效
     */
    function changeBlobImageQuality (blob, callback, format, quality) {
      format = format || 'image/jpeg';
      quality = quality || 0.5;
      var fr = new FileReader();
      fr.onload = function (e) {
        var dataURL = e.target.result;
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          var newDataURL = canvas.toDataURL(format, quality);
          if (callback){
            callback(dataURLtoBlob(newDataURL), newDataURL);
          }
          canvas = null;
        };
        img.src = dataURL;
      };
      fr.readAsDataURL(blob);
      function dataURLtoBlob (dataurl) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          len = bstr.length,
          u8arr = new Uint8Array(len);
        while (len--) u8arr[len] = bstr.charCodeAt(len);
        return new Blob([u8arr], { type: mime });
      }
    }

		$(message).on('paste', function (e) {
			e.preventDefault()
			let text = ''
			let clipboardData = e.originalEvent.clipboardData,
				files,
				items,
				item

			if (clipboardData) {
				items = clipboardData.items
        if (items && items.length && clipboardData.types.indexOf('Files') > 0) {
					for (var i = 0; i < clipboardData.types.length; i++) {
						if (clipboardData.types[i] === 'Files') {
              item = items[i]
							break
						}
					}
					if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
            changeBlobImageQuality(item.getAsFile(), function (newBlob, newDataURL) {
              console.log(newBlob.size / 1024 / 1024)
              if (newBlob.size / 1024 / 1024 > 3.6) {
                $('.top-right')
                  .notify({
                    type: 'danger',
                    closable: false,
                    message: {
                      text: 'The image size cannot exceed 3.6M'
                    }
                  })
                  .show()
              } else {
                var img = new Image(),
                  p = document.createElement('p')
                img.src = newDataURL
                p.appendChild(img)
                $(message).append(p)
              }
            })
					}
        } else {
          if (window.clipboardData && clipboardData.setData) {
            // IE
            text = window.clipboardData.getData('text')
          } else {
            text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本')
          }
          document.execCommand('insertText', false, text)
        }
      }
		})

		$(message).keydown(function (e) {
			if ((e.ctrlKey || e.metaKey) && e.keyCode == 13) {
				e.preventDefault()
				//console.log('换行');
				if (browserType() == 'IE' || browserType() == 'Edge') {
					$(this).append('<div></div>')
				} else if (browserType() == 'FF') {
					$(this).append('<br/><br/>')
				} else {
					$(this).append('<div><br/></div>')
				}
				//设置输入焦点
				var o = document.getElementById('message').lastChild
				var textbox = document.getElementById('message')
				var sel = window.getSelection()
				var range = document.createRange()
				range.selectNodeContents(textbox)
				range.collapse(false)
				range.setEndAfter(o)
				range.setStartAfter(o)
				sel.removeAllRanges()
				sel.addRange(range)

				$(this).scrollTop($(this)[0].scrollHeight)

				return false
			}

			if (e.keyCode == 13) {
				e.preventDefault()
				const messageContent = $.trim($(this).html())
				$(this).html('')
				if (messageContent) {
					ws.getSubscription('demo').emit('message', {
						content: messageContent,
						email: email
					})
				}
			}
		})

		$('#send-message').on('click', function () {
			if ($.trim($(message).html())) {
				const messageContent = $.trim($(message).html())
				$(message).html('')
				ws.getSubscription('demo').emit('message', {
					content: messageContent,
					email: email
				})
			}
		})

		function browserType () {
			var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
			var isOpera = false
			if (userAgent.indexOf('Edge') > -1) {
				return 'Edge'
			}
			if (userAgent.indexOf('.NET') > -1) {
				return 'IE'
			}
			if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
				isOpera = true
				return 'Opera'
			} //判断是否Opera浏览器
			if (userAgent.indexOf('Firefox') > -1) {
				return 'FF'
			} //判断是否Firefox浏览器
			if (userAgent.indexOf('Chrome') > -1) {
				return 'Chrome'
			}
			if (userAgent.indexOf('Safari') > -1) {
				return 'Safari'
			} //判断是否Safari浏览器
			if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
				return 'IE'
			} //判断是否IE浏览器
		}

		const os = (function () {
			const UserAgent = navigator.userAgent.toLowerCase()
			return {
				isIpad: /ipad/.test(UserAgent),
				isIphone: /iphone os/.test(UserAgent),
				isAndroid: /android/.test(UserAgent),
				isWindowsCe: /windows ce/.test(UserAgent),
				isWindowsMobile: /windows mobile/.test(UserAgent),
				isWin2K: /windows nt 5.0/.test(UserAgent),
				isXP: /windows nt 5.1/.test(UserAgent),
				isVista: /windows nt 6.0/.test(UserAgent),
				isWin7: /windows nt 6.1/.test(UserAgent),
				isWin8: /windows nt 6.2/.test(UserAgent),
				isWin81: /windows nt 6.3/.test(UserAgent),
				isMac: /mac os/.test(UserAgent)
			}
		})()

		if (os.isMac) {
			$('.action .instruction').text('Press Cmd+Enter to start a new line')
		} else {
			$('.action .instruction').text('Press Ctrl+Enter to start a new line')
		}

		$('.message-box-inner').scrollTop($('.message-box-inner').height() + 10)
	}
})
