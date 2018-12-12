'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostUserSchema extends Schema {
  up () {
    this.create('post_user', (table) => {
      table.increments()
      table.integer('post_id').unsigned()
      table.foreign('post_id').references('posts.id')
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('post_user')
  }
}

module.exports = PostUserSchema
