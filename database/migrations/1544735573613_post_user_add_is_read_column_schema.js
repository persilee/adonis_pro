'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostUserAddIsReadColumnSchema extends Schema {
  up () {
    this.table('post_user', (table) => {
      table.boolean('is_read').notNull().defaultTo(false)
    })
  }

  down () {
    this.table('post_user', (table) => {
      table.dropColumn('is_read')
    })
  }
}

module.exports = PostUserAddIsReadColumnSchema
