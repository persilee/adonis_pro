;(function () {
	if ($('#simplemde').length) {
		new SimpleMDE({
			element                 : $('#simplemde')[0],
			spellChecker            : false,
			renderingConfig         : {
				codeSyntaxHighlighting : true
			},
			autofocus               : true,
			autoDownloadFontAwesome : false
		})
	}

	$('pre code').each(function (i, block) {
		hljs.highlightBlock(block)
	})

	function htmlEncodeJQ (str) {
		return $('<span/>').text(str).html()
	}

	function htmlDecodeJQ (str) {
		return $('<span/>').html(str).text()
  }


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
})()
