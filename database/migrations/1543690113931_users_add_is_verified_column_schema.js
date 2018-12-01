'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersAddIsVerifiedColumnSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.boolean('is_verified').notNull().defaultTo(false)
    })
  }

  down () {
    this.table('users_add_is_verified_columns', (table) => {
      table.dropColumn('is_verified')
    })
  }
}

module.exports = UsersAddIsVerifiedColumnSchema
