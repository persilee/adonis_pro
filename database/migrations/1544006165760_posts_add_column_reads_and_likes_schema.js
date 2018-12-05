'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostsAddColumnReadsAndLikesSchema extends Schema {
  up () {
    this.table('posts', (table) => {
      table.integer('reads').unsigned()
      table.integer('likes').unsigned()
    })
  }

  down () {
    this.table('posts', (table) => {
      table.dropColumn('reads')
      table.dropColumn('likes')
    })
  }
}

module.exports = PostsAddColumnReadsAndLikesSchema
