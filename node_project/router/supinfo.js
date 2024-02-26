// 供应商
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')  // 导入验证数据的中间件

const supplier_handler = require('../router_handler/supinfo')
const { add_supplier_schema,
        delete_supplier_schema,
        get_supplier_schema,
        update_supplier_schema
      } = require('../schema/supinfo')

const { search_supplier_schema } = require('../schema/search')

router.get('/getSupInfo', supplier_handler.getSupInfo)

// 新增供应商路由
router.post('/addSupplierInfo', expressJoi(add_supplier_schema), supplier_handler.addSupplierInfo)

// 删除供应商路由  :id 动态参数
router.get('/deleteSupplierInfoById/:id', expressJoi(delete_supplier_schema), supplier_handler.deleteSupplierInfoById)

// 根据id获取供应商数据
router.get('/getSupplierInfoById/:id', expressJoi(get_supplier_schema), supplier_handler.getSupplierInfoById)

// 根据id更新供应商数据
router.post('/updateSupplierInfoById/:id', expressJoi(update_supplier_schema), supplier_handler.updateSupplierInfoById)

// 获取供应商数据
router.get('/getSupplierData', supplier_handler.getSupplierData)

// 分页查询
router.post('/getSupplierPage', supplier_handler.getSupplierPage)

// 搜索
router.post('/supplierSearch', expressJoi(search_supplier_schema),supplier_handler.supplierSearch)

module.exports = router
