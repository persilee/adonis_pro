'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {
  tags () {
    return this.belongsToMany('App/Models/Tag')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  static castDates (field, value) {
    if (field === 'updated_at') {
      return value.fromNow()
    }

    return super.formatDates(field, value)
  }
}

module.exports = Post
