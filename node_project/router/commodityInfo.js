// 商品信息路由
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')  // 导入验证数据的中间件

const commodity_handler = require('../router_handler/commodity')

// 引入校验规则模块
const { 
  add_commodity_schema,
  delete_commodity_schema,
  get_commodity_schema,
  update_commodity_schema,
} = require('../schema/commodity')

// 搜索查询
const { search_commodity_schema } = require('../schema/search')

// 新增
router.post('/addCommodityInfo', expressJoi(add_commodity_schema), commodity_handler.addCommodityInfo)

// 删除
router.get('/deleteCommodityById/:id', expressJoi(delete_commodity_schema), commodity_handler.deleteCommodityById)

// id获取数据
router.get('/getCommodityById/:id', expressJoi(get_commodity_schema), commodity_handler.getCommodityById)

// id更新数据
router.post('/updateCommodityById/:id', expressJoi(update_commodity_schema), commodity_handler.updateCommodityById)

// 获取全部数据
router.get('/getCommodityData', commodity_handler.getCommodityData)

// 分页查询
router.post('/getCommodityPage', commodity_handler.getCommodityPage)

// 搜索
router.post('/commoditySearch', expressJoi(search_commodity_schema), commodity_handler.commoditySearch)

module.exports = router
