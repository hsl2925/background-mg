// 商品库存接口
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')  // 导入验证数据的中间件

const merinventory_handler = require('../router_handler/merinventory')
const { add_merinventory_schema,
        delete_merinventory_schema,
        get_merinventory_schema,
        update_merinventory_schema
      } = require('../schema/merinventory')

const { search_merinventory } = require('../schema/search')

router.get('/getMerinventory', merinventory_handler.getMerinventory)

// 新增商品库存
router.post('/addMerinventoryInfo', expressJoi(add_merinventory_schema), merinventory_handler.addMerinventoryInfo)

// 删除商品库存
router.get('/deleteMerinventoryInfoById/:id', expressJoi(delete_merinventory_schema), merinventory_handler.deleteMerinventoryInfoById)

// 根据id获取商品库存数据
router.get('/getMerinventoryInfoById/:id', expressJoi(get_merinventory_schema), merinventory_handler.getMerinventoryInfoById)

// 根据id更新商品库存数据
router.post('/updateMerinventoryInfoById/:id', expressJoi(update_merinventory_schema), merinventory_handler.updateMerinventoryInfoById)

// 获取商品库存数据
router.get('/getMerinventoryData', merinventory_handler.getMerinventoryData)

// 分页查询
router.post('/getMerinventoryPage', merinventory_handler.getMerinventoryPage)

// 搜索
router.post('/merinventorySearch', expressJoi(search_merinventory), merinventory_handler.merinventorySearch)

module.exports = router
