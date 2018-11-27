'use strict'

/*
|--------------------------------------------------------------------------
| ProfileSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Profile = use('App/Models/Profile')

class ProfileSeeder {
  async run () {
    const profiles = [
      { github: 'persilee', user_id: 1 },
      { github: 'persilee', user_id: 2 }
    ]

    await Profile.createMany(profiles)
  }
}

module.exports = ProfileSeeder
