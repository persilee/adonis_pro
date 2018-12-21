'use strict'

const Env = use('Env')

class QiniuController {
	async imageUpload ({ params }) {
		const qiniu = require('qiniu')

    const accessKey = Env.get('ACCESS_KEY')
    const secretKey = Env.get('SECRET_KEY')
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const options = {
      scope: 'myblog',
      expires: 120
		}
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)

    return uploadToken
	}
}

module.exports = QiniuController
