'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const randomstring = use('randomstring')

class User extends Model {
  async hasProfile () {
    const profile = await this.profile().fetch()

    if (!profile) {
      return false
    }

    return true
  }

  verification () {
    return this.hasOne('App/Models/Verification')
  }

  async generateVerification () {
    const token = randomstring.generate({
      length: 6,
      charset: 'numeric'
    })

    const verification = await this.verification().create({
      token
    })

    return verification
  }

  profile () {
    return this.hasOne('App/Models/Profile')
  }

  posts () {
    return this.hasMany('App/Models/Post')
  }

  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
