;(function () {
	let url = window.location.href
	let tags = ''
	let post_btn = ''
	let simplemde
	let simplemdeId = ''
	let herder_status = $('.header.editor-header .status-text')
	$.each($('input:checkbox'), function () {
		if ($(this).is(':checked')) {
			tags += `<span id="${$(this).attr('id')}" value="${$(
				this
			).val()}" class="badge badge-light mr-2 active">${$(this).siblings('label').text()}</span>`
		} else {
			tags += `<span id="${$(this).attr('id')}" value="${$(this).val()}" class="badge badge-light mr-2">${$(this)
				.siblings('label')
				.text()}</span>`
		}
	})

	if (url.indexOf('edit') != -1) {
		simplemdeId = $('textarea').attr('id')
		post_btn =
			'<div id="post-edit-btn" class="mt-4 mb-2 d-flex justify-content-center"><button type="button" class="btn btn-outline-primary btn-sm edit-btn">Confirm and Update</button></div>'
	} else if (url.indexOf('create') != -1) {
		simplemdeId = 'simplemde'
		post_btn =
			'<div id="post-create-btn" class="mt-4 mb-2 d-flex justify-content-center"><button type="button" class="btn btn-outline-primary btn-sm edit-btn">Confirm and Publish</button></div>'
	}

	$(document).on('click', '.popover-body .badge', function () {
		let _this = $(this)
		$.each($('input:checkbox'), function () {
			if (_this.attr('id') == $(this).attr('id')) {
				$(this).attr('checked', !$(this).is(':checked'))
			}
		})
		$(this).toggleClass('active')
	})

	$('#myPopover').popover({
		title   : '<h6 class="text-muted mt-1">TAGS</h6>',
		content : tags + post_btn,
		html    : true
	})

	if (simplemdeId && $('#' + simplemdeId).length) {
		simplemde = new SimpleMDE({
			element                 : $('#simplemde')[0],
			autosave                : {
				enabled  : true,
				uniqueId : simplemdeId,
				delay    : 1500
			},
			spellChecker            : false,
			renderingConfig         : {
				codeSyntaxHighlighting : true
			},
			autofocus               : false,
			autoDownloadFontAwesome : false,
			toolbar                 : [
				'bold',
				'italic',
				'heading',
				'|',
				'horizontal-rule',
				'quote',
				'unordered-list',
				'ordered-list',
				'|',
				'link',
				'image',
				'table',
				'|',
				'side-by-side',
				'fullscreen',
				'guide'
			]
		})
		simplemde.toggleSideBySide()
		simplemde.toggleFullScreen()
		herder_status.text('Post ' + $('.editor-statusbar .autosave').text())
		setInterval(() => {
			herder_status.text('Post ' + $('.editor-statusbar .autosave').text())
		}, 61000)
	}

	$('pre code').each(function (i, block) {
		hljs.highlightBlock(block)
	})

	$('#edit-title').on('change', function () {
		if ($('#edit-title').length) {
			$('input[name="title"]').val($('#edit-title').val())
		} else if ($('#create-title').length) {
			$('input[name="title"]').val($('#create-title').val())
		}
	})

	$(document).on('click', '#post-edit-btn', function () {
		simplemde.clearAutosavedValue()
		$('#edit-btn').trigger('click')
	})
	$(document).on('click', '#post-create-btn', function () {
		if ($('input[name="title"]').val() == '') {
			$('.top-right')
				.notify({
					type     : 'danger',
					closable : false,
					message  : {
						text : "Title can't be blank "
					}
				})
				.show()
		} else if (simplemde.value() == '') {
			$('.top-right')
				.notify({
					type     : 'danger',
					closable : false,
					message  : {
						text : "Content can't be blank"
					}
				})
				.show()
		} else {
			simplemde.clearAutosavedValue()
			$('#create-btn').trigger('click')
		}
	})

	const deleteButton = $('#delete')
	deleteButton.click(() => {
		const id = deleteButton.data('id')
		const _csrf = deleteButton.data('csrf')

		$.ajax({
			url     : `/posts/${id}}`,
			method  : 'DELETE',
			data    : {
				_csrf
			},
			success : (response) => {
				if (response == 'success') {
					window.location.href = '/posts'
				}
			}
		})
	})

	const likeElement = $('.post-suspended-panel .post-panel.likes')
	const userId = likeElement.data('user')
	const post_id = likeElement.data('id')
	const cookieName = 'uniqueness' + userId + post_id
	if (
		Cookies.getJSON(cookieName) &&
		Cookies.getJSON(cookieName).userId == userId &&
		Cookies.getJSON(cookieName).cookieId == post_id
	) {
		likeElement.unbind('click')
		likeElement.addClass('active')
		likeElement.find('.is-liked').addClass('liked')
		$('.status .likes .icon-love').addClass('liked')
	} else if (post_id) {
		likeElement.on('click', function () {
			const time = new Date().getTime()
			const ip = returnCitySN['cip'] + returnCitySN['cname']
			const userAgent = navigator.userAgent
			const uniqueness_cookie = time + ip + userAgent
			let likes = $(this).attr('badge')
			const _this = $(this)
			Cookies.set(cookieName, { cookieContent: uniqueness_cookie, cookieId: post_id, userId: userId })
			$.ajax({
				url     : `/share/${post_id}/like`,
				method  : 'GET',
				data    : {
					uniqueness_cookie : uniqueness_cookie
				},
				success : function (response) {
					if (response.status == 'success') {
						if (Cookies.getJSON(cookieName).cookieContent == response.cookie) {
							_this.addClass('active')
							_this.attr('badge', parseInt(likes) + 1)
							$('.status .likes').html(
								`<i class="iconfont icon-love liked mr-2"></i>${parseInt(likes) + 1}`
							)
							_this.unbind('click')
							_this.find('.is-liked').addClass('liked')
						}
					}
				}
			})
		})
	}

	const listLikes = $('.list-group-item .icon-love')
	const likeIds = Object.keys(Cookies.get())

	if (listLikes.length > 0) {
		$.each(likeIds, function (i, n) {
			if (n.indexOf('uniqueness') != -1) {
				const id = n.slice(10, n.length)
				listLikes.each(function (a, b) {
					if (id == $(this).attr('user') + $(this).attr('id')) {
						$(this).addClass('liked')
					}
				})
			}
		})
	}

	$('#file-icon').on('click', function () {
		$('#file').click()
	})

	$('#file').on('change', function () {
		$('.file-input .text-success small').text($(this).get(0).files[0].name)
		$('.file-input .text-muted small').text('')
	})

	$('.container.frofile .list-group-item .input-box .input-content .action-box').on('click', function () {
		$(this).siblings('input').select()
	})

	if ($('.invalid-feedback').length) {
		$('.invalid-feedback').css('display', 'block')
	}

	if ($('.post-suspended-panel .top').length) {
		$('.post-suspended-panel .top').on('click', function () {
			$(document).scrollTop(0)
		})
	}

	var p = 0,
		t = 0
	$(document).on('scroll', function (e) {
		p = $(this).scrollTop()
		if (t <= p) {
			//下滚
			if ($(window).scrollTop() > 10) {
				if (!$('.limit-width').hasClass('slideOutUp'))
					$('.limit-width').addClass('slideOutUp').removeClass('slideInDown')
			}
		} else {
			//上滚
			if ($('.limit-width').hasClass('slideOutUp'))
				$('.limit-width').removeClass('slideOutUp').addClass('slideInDown')
		}
		setTimeout(function () {
			t = p
		}, 0)
	})

	const viewer = new Viewer($('.post-content')[0], {
		toolbar          : false,
		button           : false,
		navbar           : false,
		movable          : false,
		zoomable         : false,
		toggleOnDblclick : false,
		shown () {
			$(document).on('click', '.viewer-container img', function () {
				viewer.hide()
			})
		}
	})

	$(document).on('mousewheel', '.viewer-container', function () {
		viewer.hide()
	})
})()
