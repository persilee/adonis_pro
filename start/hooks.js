const { hooks } = require('@adonisjs/ignitor')
const { range } = require('lodash')
const decode = require('decode-html')
const md5 = require('js-md5')

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

  View.global('decodeHtml', (str) => {
    return decode(str)
  })

  View.global('md5', (str) => {
    return md5(str)
  })

  const Exception = use('Exception')

  Exception.handle('InvalidSessionException', async (error, { response, request, session }) => {
    session.put('redirectUrl', request.url())
    await session.commit()

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

  const Validator = use('Validator')
  const Hash = use('Hash')

  const hashVerified = async (data, field, message, args, get) => {
    const value = get(data, field)

    if (!value) {
      return
    }

    const [ hashedValue ] = args
    const verified = await Hash.verify(value, hashedValue)

    if (!verified) {
      throw message
    }
  }

  Validator.extend('hashVerified', hashVerified)

})
