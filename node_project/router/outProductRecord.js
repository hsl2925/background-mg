// 路由请求 出库/发货
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')  // 导入验证数据的中间件

const out_productrecord_handler = require('../router_handler/outRecord')

// 引入校验规则模块
const { 
  add_productrecord_schema,
  delete_productrecord_schema,
  get_productrecord_schema,
  update_productrecord_schema,
} = require('../schema/outProductRecord')

// 搜索查询
const { search_productrecord_schema } = require('../schema/search')

// 新增
router.post('/addOutProductRecord', expressJoi(add_productrecord_schema), out_productrecord_handler.addOutProductRecord)

// 删除
router.get('/deleteOutProductRecordById/:id', expressJoi(delete_productrecord_schema), out_productrecord_handler.deleteOutProductRecordById)

// id获取数据
router.get('/getOutProductRecordById/:id', expressJoi(get_productrecord_schema), out_productrecord_handler.getOutProductRecordById)

// id更新数据
router.post('/updateOutProductRecordById/:id', expressJoi(update_productrecord_schema), out_productrecord_handler.updateOutProductRecordById)

// 获取全部数据
router.get('/getOutProductRecordData', out_productrecord_handler.getOutProductRecordData)

// 分页查询
router.post('/getOutProductRecordPage', out_productrecord_handler.getOutProductRecordPage)

// 搜索
router.post('/outProductRecordSearch', expressJoi(search_productrecord_schema), out_productrecord_handler.outProductRecordSearch)

module.exports = router
