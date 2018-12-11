'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActivityAddColumnActivityIdSchema extends Schema {
  up () {
    this.table('activities', (table) => {
      table.string('activity_id', 80)
    })
  }

  down () {
    this.table('activities', (table) => {
      table.dropForeign('activity_id')
    })
  }
}

module.exports = ActivityAddColumnActivityIdSchema
