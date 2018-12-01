'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class PermissionCheckException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = PermissionCheckException
