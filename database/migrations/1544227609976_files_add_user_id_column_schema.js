'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileAddUserIdColumnSchema extends Schema {
  up () {
    this.table('files', (table) => {
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id')
    })
  }

  down () {
    this.table('files', (table) => {
      table.dropForeign('user_id')
      table.dropColumn('user_id')
    })
  }
}

module.exports = FileAddUserIdColumnSchema
