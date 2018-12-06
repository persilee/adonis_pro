'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProfileAddBioAndWebsiteColumnSchema extends Schema {
  up () {
    this.table('profiles', (table) => {
      table.string('bio')
      table.string('website')
    })
  }

  down () {
    this.table('profiles', (table) => {
      table.dropColumn('bio')
      table.dropColumn('website')
    })
  }
}

module.exports = ProfileAddBioAndWebsiteColumnSchema
