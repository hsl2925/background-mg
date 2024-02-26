const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

// 导入路由处理函数
const userinfo_handler = require('../router_handler/userinfo')

const { 
  add_user_schema,
  update_user_schema,
  delete_user_schema,
  get_user_schema
} = require('../schema/userInfo')

const { search_user } = require('../schema/search')

// 获取用户信息路由
router.get('/getUserInfo', userinfo_handler.getUserInfo)

// 分页
router.post('/getUserPage', userinfo_handler.getUserPage)

// 新增用户路由
router.post('/addUser', expressJoi(add_user_schema), userinfo_handler.addUser)

// 删除用户路由
router.get('/deleteUserById/:id', expressJoi(delete_user_schema), userinfo_handler.deleteUserById)

// 根据id获取用户数据
router.get('/getUserById/:id', expressJoi(get_user_schema), userinfo_handler.getUserById)

// 根据id更新用户数据
router.post('/updateUserById/:id', expressJoi(update_user_schema), userinfo_handler.updateUserById)

// 搜索
router.post('/userSearch', expressJoi(search_user), userinfo_handler.userSearch)

module.exports = router
