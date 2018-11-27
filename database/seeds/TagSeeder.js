'use strict'

/*
|--------------------------------------------------------------------------
| TagSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Tag = use('App/Models/Tag')

class TagSeeder {
  async run () {
    const tags = [
      { title: '工作' },
      { title: '日常' },
    ]

    await Tag.createMany(tags)
  }
}

module.exports = TagSeeder
