'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationAddReadedColumnSchema extends Schema {
  up () {
    this.table('notifications', (table) => {
      table.boolean('is_read').notNull().defaultTo(false)
    })
  }

  down () {
    this.table('notifications', (table) => {
      table.dropColumn('is_read')
    })
  }
}

module.exports = NotificationAddReadedColumnSchema
