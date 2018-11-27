'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostTagSchema extends Schema {
  up () {
    this.create('post_tag', (table) => {
      table.increments()
      table.integer('post_id').unsigned()
      table.foreign('post_id').references('posts.id')
      table.integer('tag_id').unsigned()
      table.foreign('tag_id').references('tags.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('post_tag')
  }
}

module.exports = PostTagSchema
