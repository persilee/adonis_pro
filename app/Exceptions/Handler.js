'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, ctx) {
    switch (error.name) {
      case 'UserNotFoundException':
        await this.handleUserNotFoundException(error, ctx)
        break;
      case 'PasswordMisMatchException':
        await this.handlePasswordMisMatchException(error, ctx)
        break;
      default:
        return super.handle(...arguments)
        break;
    }
  }

  async handleUserNotFoundException ({ status, uidField, passwordField, authScheme }, { request, response, session }) {
    const errorMessages = [{ field: uidField, message: `Cannot find user with provided ${uidField} :(` }]
    if (authScheme === 'session') {
      session.withErrors(errorMessages).flashExcept([passwordField])
      await session.commit()
      response.redirect('back')
      return
    }

    return super.handle(...arguments)
  }

  async handlePasswordMisMatchException ({ status, passwordField, authScheme }, { request, response, session }) {
    const errorMessages = [{ field: passwordField, message: 'Invalid user password :(' }]
    if (authScheme === 'session') {
      session.withErrors(errorMessages).flashExcept([passwordField])
      await session.commit()
      response.redirect('back')
      return
    }

    return super.handle(...arguments)
  }
  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
