'use strict'

class QiniuController {
	async imageUpload ({ params }) {
		const qiniu = require('qiniu')

    const accessKey = 'nulLMpS6oXHaG7MBV41RAQ--VCgepFK_-IfTKnBM'
    const secretKey = 'RyOJ8RN8NDWokXVGHF8WFiM2lfesbaeh8-m0-QbS'
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
