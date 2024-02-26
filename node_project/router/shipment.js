// 商品入库记录 商品收货记录
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')  // 导入验证数据的中间件

const shipment_handler = require('../router_handler/shipment')

const { add_shipment,
        delete_shipment,
        get_shipment,
        update_shipment
      } = require('../schema/shipment')

const { search_shipment } = require('../schema/search')

router.get('/getShipment', shipment_handler.getShipment)

// 新增
router.post('/addShipmentInfo', expressJoi(add_shipment), shipment_handler.addShipmentInfo)

// 删除 :id 动态参数
router.get('/deleteShipmentById/:id', expressJoi(delete_shipment), shipment_handler.deleteShipmentById)

// 根据id获取数据
router.get('/getShipmentById/:id', expressJoi(get_shipment), shipment_handler.getShipmentById)

// 根据id更新数据
router.post('/updateShipmentById/:id', expressJoi(update_shipment), shipment_handler.updateShipmentById)

// 分页查询
router.post('/getShipmentPage', shipment_handler.getShipmentPage)

// 条件查询
router.post('/shipmentSearch', expressJoi(search_shipment), shipment_handler.shipmentSearch)

module.exports = router
