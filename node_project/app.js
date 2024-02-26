const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const joi = require('joi')

// 配置跨域cors
const cors = require('cors')
app.use(cors())

// 解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 路由之前封装 res.cc
app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      // instanceof检测是否为Error的实例
      message: err instanceof Error? err.message : err
    })
  }
  next()
}) 

// 路由之前配置解析 Token 中间件
const { expressjwt } = require('express-jwt')
const config = require('./config/config')

app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api/] }))

// 使用 body-parser 中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// 1.导入并注册路由模块
const user = require('./router/user')
app.use('/api', user)

// 2.导入并注册路由模块 用户基本信息
const userInfoRouter = require('./router/userinfo')
app.use('/', userInfoRouter)

// 3.导入并使用供应商的路由模块
const artCateRouter = require('./router/supinfo')
app.use('/', artCateRouter)

// 4. 导入并使用采购订单的路由模块
const purchaseOrder = require('./router/shopOrderInfo')
app.use('/', purchaseOrder)

// 5. 导入并使用采购订单详情的路由模块
const purchaseOrderDetail = require('./router/shopOrderInfoDetail')
app.use('/', purchaseOrderDetail)

// 5. 导入并使用出库记录路由模块addCommodityInfo
const outProduct = require('./router/outProductRecord')
app.use('/', outProduct)

// 7. 导入并使用商品信息路由模块
const addcommodity = require('./router/commodityInfo')
app.use('/', addcommodity)

// 8. 图片/文件上传路由模块导入
const uploadFile = require('./router/upload')
app.use('/api', uploadFile)

// 9. 表同步操作
const tables = require('./router/tables')
app.use('/', tables)

// 10. 表同步操作
const shipment = require('./router/shipment')
app.use('/', shipment)

// 11. 商品库存路由模块
const merinventory = require('./router/merinventory')
app.use('/', merinventory)


// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证导致失败的错误
  if (err instanceof joi.ValidationError)  return res.cc(err)
  if (err.name === 'UnauthorizedError') return res.cc('登录过期!')
  // 未知的错误
  res.cc(err)
})

// 启动服务器
app.listen(9093, () => {
  console.log('express server running at http://127.0.0.1:9093')
})
