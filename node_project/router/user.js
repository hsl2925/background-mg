const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

const userHandler = require('../router_handler/user')
const { reg_schema, log_schema } = require('../schema/user')

// 登录
router.post('/login', expressJoi(log_schema), userHandler.regLogin)

// 注册
router.post('/register', expressJoi(reg_schema), userHandler.regUser)

// 验证码
router.get('/checkCode', userHandler.checkCode)

module.exports = router
