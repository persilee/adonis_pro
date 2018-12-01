const { hooks } = require('@adonisjs/ignitor')
const { range } = require('lodash')

hooks.after.providersBooted(() => {
  const View = use('View')

  View.global('pageItems', (lastPage, page) => {
    const allPageItems = range(1, lastPage + 1)
    const pageItemRange = 2
    const pageItemAfter = allPageItems.slice(page, page + pageItemRange)
    const pageItemBefore = allPageItems.slice(page - lastPage - pageItemRange - 1, page - 1)
    let pageItems = [
      ...pageItemBefore,
      page,
      ...pageItemAfter
    ]

    let firstItem = [1]
    let lastItem = [lastPage]

    if (pageItemRange + 2 < page) {
      firstItem = [
        ...firstItem,
        '...'
      ]
    }

    if (lastPage - page -1 > pageItemRange) {
      lastItem = [
        '...',
        ...lastItem
      ]
    }

    if (pageItemRange + 1 < page) {
      pageItems = [
        ...firstItem,
        ...pageItems
      ]
    }

    if (lastPage - page > pageItemRange) {
      pageItems = [
        ...pageItems,
        ...lastItem
      ]
    }

    return pageItems
  })

  View.global('parseInt', (value) => {
    return parseInt(value)
  })

  const Exception = use('Exception')

  Exception.handle('InvalidSessionException', async (error, { response }) => {
    return response.route('login')
  })

  Exception.handle('PermissionCheckException', async (error, { session, response }) => {
    session.flash({
      type: 'danger',
      message: 'You have no permission to do this.'
    })

    await session.commit()

    return response.redirect('back')
  })

})
