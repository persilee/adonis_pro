'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VerificationSchema extends Schema {
  up () {
    this.create('verifications', (table) => {
      table.increments()
      table.string('token')
      table.integer('user_id').unsigned().index()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('verifications')
  }
}

module.exports = VerificationSchema
