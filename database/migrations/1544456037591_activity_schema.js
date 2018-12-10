'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActivitySchema extends Schema {
  up () {
    this.create('activities', (table) => {
      table.increments()
      table.string('username', 80).notNullable()
      table.string('email', 254).notNullable()
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('activities')
  }
}

module.exports = ActivitySchema
