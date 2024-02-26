const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')  // 导入验证数据的中间件

const tables_handler = require('../router_handler/tables')

const { add_table1,
        delete_table1,
        get_table1,
        update_table1
      } = require('../schema/table')

const { search_tables } = require('../schema/search')

router.get('/getTables', tables_handler.getTables)

// 新增供应商路由
router.post('/addTablesInfo', expressJoi(add_table1), tables_handler.addTablesInfo)

// 删除供应商路由  :id 动态参数
router.get('/deleteTablesById/:id', expressJoi(delete_table1), tables_handler.deleteTablesById)

// 根据id获取供应商数据
router.get('/getTablesById/:id', expressJoi(get_table1), tables_handler.getTablesById)

// 根据id更新供应商数据
router.post('/updateTablesById/:id', expressJoi(update_table1), tables_handler.updateTablesById)

// 分页查询
router.post('/getTablesPage', tables_handler.getTablesPage)

// 查询
router.post('/tablesSearch', expressJoi(search_tables),tables_handler.tablesSearch)

module.exports = router
