'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Post = use('App/Models/Post')

class FollowController {

  async follower ({ params, request, response, view, auth }) {

    const user = await User.find(params.id)
    await user.load('profile')

    const total_liked = await user.likes().orderBy('updated_at', 'desc').with('user').getCount()
    const total_post = await Post.query().where('user_id', params.id).getCount()
    let followed = ''
    if (auth.user) {
      const follows = await Database.raw(
        'select users.email,users.username,users.id,a.created_at,a.is_read,a.user_id from adonis.users , (SELECT follows.user_id, follows.created_at,follows.is_read FROM adonis.follows where follows.follow_id = ?) as a where a.user_id = users.id',
        [auth.user.id]
      )

      follows[0].forEach(function (follow, f) {
        if (follow.id == params.id) {
          followed = 'followed'
        }
      })
    }

    const followersNum = await Database.raw(
      'select count(*) as followers from adonis.users , (SELECT follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.user_id = ?) as a where a.follow_id = users.id order by a.created_at and a.is_read <> 1',
      [params.id]
    )

    const followedNum = await Database.raw(
      'select count(*) as followed from adonis.users , (SELECT follows.user_id, follows.created_at,follows.is_read FROM adonis.follows where follows.follow_id = ?) as a where a.user_id = users.id',
      [params.id]
    )

    const total_follower = followersNum[0][0].followers
    const total_followed = followedNum[0][0].followed

    const followers = await Database.raw(
      'select users.email,users.username,users.id,a.created_at,a.is_read,a.follow_id from adonis.users , (SELECT follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.user_id = ?) as a where a.follow_id = users.id order by a.created_at desc limit 50',
      [params.id]
    )

    if(auth.user){
      const follows = await Database.raw(
        'select users.email,users.username,users.id,a.created_at,a.is_read,a.user_id from adonis.users , (SELECT follows.user_id, follows.created_at,follows.is_read FROM adonis.follows where follows.follow_id = ?) as a where a.user_id = users.id',
        [auth.user.id]
      )

      follows[0].forEach(function (follow, f) {
        followers[0].forEach(function (follower, fr) {
          if (follow.id == follower.id) {
            followers[0][fr].is_followed = 'followed'
          }
        })
      })
    }

    const total_reads = await Post.query()
      .where('user_id', params.id)
      .getSum('reads')

    const total_likes = await Post.query()
      .where('user_id', params.id)
      .getSum('likes')

    return view.render('user.follow.follower', {
      user: user.toJSON(),
      total_reads,
      total_likes,
      total_liked,
      total_post,
      total_follower,
      total_followed,
      followed,
      followers: followers[0]
    })
  }

  async followed ({ params, request, response, view, auth }) {

    const user = await User.find(params.id)
    await user.load('profile')

    const total_liked = await user.likes().orderBy('updated_at', 'desc').with('user').getCount()
    const total_post = await Post.query().where('user_id', params.id).getCount()
    let followed = ''
    if (auth.user) {
      const follows = await Database.raw(
        'select users.email,users.username,users.id,a.created_at,a.is_read,a.user_id from adonis.users , (SELECT follows.user_id, follows.created_at,follows.is_read FROM adonis.follows where follows.follow_id = ?) as a where a.user_id = users.id',
        [auth.user.id]
      )

      follows[0].forEach(function (follow, f) {
        if (follow.id == params.id) {
          followed = 'followed'
        }
      })
    }

    const followersNum = await Database.raw(
      'select count(*) as followers from adonis.users , (SELECT follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.user_id = ?) as a where a.follow_id = users.id order by a.created_at and a.is_read <> 1',
      [params.id]
    )

    const followedNum = await Database.raw(
      'select count(*) as followed from adonis.users , (SELECT follows.user_id, follows.created_at,follows.is_read FROM adonis.follows where follows.follow_id = ?) as a where a.user_id = users.id',
      [params.id]
    )

    const total_follower = followersNum[0][0].followers
    const total_followed = followedNum[0][0].followed

    const followedList = await Database.raw(
      'select users.email,users.username,users.id,a.created_at,a.is_read,a.follow_id,a.user_id from adonis.users , (SELECT follows.user_id,follows.follow_id, follows.created_at,follows.is_read FROM adonis.follows where follows.follow_id = ?) as a where a.user_id = users.id order by a.created_at desc limit 50',
      [params.id]
    )

    if (auth.user) {
      const follows = await Database.raw(
        'select users.email,users.username,users.id,a.created_at,a.is_read,a.user_id from adonis.users , (SELECT follows.follow_id,follows.user_id, follows.created_at,follows.is_read FROM adonis.follows where follows.follow_id = ?) as a where a.user_id = users.id',
        [auth.user.id]
      )

      follows[0].forEach(function (follow, f) {
        followedList[0].forEach(function (followed, fr) {
          if (auth.user.id == followed.follow_id){
            followedList[0][fr].is_followed = 'followed'
          }
          if (follow.id == followed.id) {
            followedList[0][fr].is_followed = 'followed'
          }
        })
      })
    }

    const total_reads = await Post.query()
      .where('user_id', params.id)
      .getSum('reads')

    const total_likes = await Post.query()
      .where('user_id', params.id)
      .getSum('likes')

    return view.render('user.follow.followed', {
      user: user.toJSON(),
      total_reads,
      total_likes,
      total_liked,
      total_post,
      total_follower,
      total_followed,
      followed,
      followedList: followedList[0]
    })
  }

}

module.exports = FollowController
