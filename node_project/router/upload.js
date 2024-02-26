// 用于配置对应路由
const express = require('express')
const router = express.Router()

const picList = require('../router_handler/upload')

// 文件上传
router.post('/uploadImage', picList.uploadImage)
 
module.exports = router