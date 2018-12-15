'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowAddIsReadColumnSchema extends Schema {
  up () {
    this.table('follows', (table) => {
      table.boolean('is_read').notNull().defaultTo(false)
    })
  }

  down () {
    this.table('follows', (table) => {
      table.dropColumn('is_read')
    })
  }
}

module.exports = FollowAddIsReadColumnSchema
