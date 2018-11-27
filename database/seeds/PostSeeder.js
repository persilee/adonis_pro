'use strict'

/*
|--------------------------------------------------------------------------
| PostSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Post = use('App/Models/Post')

class PostSeeder {
  async run () {
    const posts = [
      { title: '今天午饭吃了啥', content: '今天中午吃了粥，然后下午肚子好饿 😢', user_id: 1 },
      { title: 'adonis框架学习', content: 'adonis 是一个 Node.js 框架，通过几天的学习，发现这个框架还挺好用的 😑', user_id: 1 },
      { title: '辣条', content: '今天在京东买了 三只松鼠 的辣条，那滋味 🌶 🌶 🌶 ', user_id: 2 },
      { title: '每天保持使用手机不超过1小时', content: '现在的人们越来越依赖手机 📱 ，使用手机占据了我们大量的时间，使得我们的生活变得愈发的单一乏味，我们应该少用手机，多去做些实际的事情，比如：看书📖、写字、做手工艺品、做饭、练习吉他🎸 等', user_id: 1 },
      { title: '《无一生还》中的凶手到底是谁？', content: '哈哈，其实凶手就是法官', user_id: 2 }
    ]

    await Post.createMany(posts)
  }
}

module.exports = PostSeeder
