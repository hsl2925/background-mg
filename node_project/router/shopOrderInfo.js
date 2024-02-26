// 采购订单
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')  // 导入验证数据的中间件

const shop_order_handler = require('../router_handler/shopOrderInfo')

// 引入校验规则模块
const { add_shoporder_schema,
  delete_shoporder_schema,
  get_shoporder_schema,
  update_shoporder_schema
} = require('../schema/shopOrderInfo')

// 搜索查询
const { search_shoporder_schema } = require('../schema/search')

//router.get('/getShopOrderInfo', shop_order_handler.getShopOrderInfo)

// 新增采购订单
router.post('/addShopOrderInfo', expressJoi(add_shoporder_schema), shop_order_handler.addShopOrderInfo)

// 删除采购订单  :id 动态参数
router.get('/deleteShopOrderInfoById/:id', expressJoi(delete_shoporder_schema), shop_order_handler.deleteShopOrderInfoById)

// 根据id获取采购订单数据
router.get('/getShopOrderInfoById/:id', expressJoi(get_shoporder_schema), shop_order_handler.getShopOrderInfoById)

// 根据id更新采购订单数据
router.post('/updateShopOrderInfoById/:id', expressJoi(update_shoporder_schema), shop_order_handler.updateShopOrderInfoById)

// 获取全部采购订单数据
router.get('/getShopOrderInfoData', shop_order_handler.getShopOrderInfoData)

// 分页查询
router.post('/getShopOrderInfoPage', shop_order_handler.getShopOrderInfoPage)

// 搜索
router.post('/shopOrderInfoSearch', expressJoi(search_shoporder_schema), shop_order_handler.shopOrderInfoSearch)

module.exports = router
