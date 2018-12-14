'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationSchema extends Schema {
  up () {
    this.create('notifications', (table) => {
      table.increments()
      table.integer('post_id').unsigned()
      table.foreign('post_id').references('posts.id')
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id')

      table.timestamps()
    })
  }

  down () {
    this.drop('notifications')
  }
}

module.exports = NotificationSchema
