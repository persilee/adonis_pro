'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostsAddMdContentColumnSchema extends Schema {
  up () {
    this.table('posts', (table) => {
      table.text('md_content', 'longText')
    })
  }

  down () {
    this.table('posts', (table) => {
      table.dropColumn('md_content')
    })
  }
}

module.exports = PostsAddMdContentColumnSchema
