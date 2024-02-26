// 采购订单明细
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')  // 导入验证数据的中间件

const shop_order_detail_handler = require('../router_handler/shopOrderInfoDetail')

// 引入校验规则模块
const { add_shoporder_detail_schema,
  delete_shoporder_detail_schema,
  get_shoporder_detail_schema,
  update_shoporder_detail_schema
} = require('../schema/shopOrderInfoDetail')

// 搜索查询
const { search_shoporder_detail_schema } = require('../schema/search')


// 新增采购订单详情
router.post('/addShopOrderDetail', expressJoi(add_shoporder_detail_schema), shop_order_detail_handler.addShopOrderDetail)

// 删除采购订单详情  :id 动态参数
router.get('/deleteShopOrderDetailById/:id', expressJoi(delete_shoporder_detail_schema), shop_order_detail_handler.deleteShopOrderDetailById)

// 根据id获取采购订单数据详情
router.get('/getShopOrderDetailById/:id', expressJoi(get_shoporder_detail_schema), shop_order_detail_handler.getShopOrderDetailById)

// 根据id更新采购订单数据详情
router.post('/updateShopOrderDetailById/:id', expressJoi(update_shoporder_detail_schema), shop_order_detail_handler.updateShopOrderDetailById)

// 获取全部采购订单数据详情
router.get('/getShopOrderDetailData', shop_order_detail_handler.getShopOrderDetailData)

// 分页查询
router.post('/getShopOrderDetailPage', shop_order_detail_handler.getShopOrderDetailPage)

// 搜索采购订单数据列表
router.post('/shopOrderDetailSearch', expressJoi(search_shoporder_detail_schema), shop_order_detail_handler.shopOrderDetailSearch)

module.exports = router
