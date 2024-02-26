// 所有路由处理函数
const db = require('../config/db_config')

// 获取所有采购订单数据
exports.getShopOrderInfoData = (req, res) => {
  const sql = `select * from purchase_order_form order by id asc`
  db.query(sql, (error, results, fields) => {
    if (error) {
      res.json({ err_code: 0, message: "获取失败" })
    } else {
      results = JSON.parse(JSON.stringify(results))
      res.json({ success_code: 200, data: results })
    }
  })
}

// 新增采购订单接口
exports.addShopOrderInfo = (req, res) => {
  // 定义查重的 sql 语句
  const sql = `select * from purchase_order_form where sale_order_number=? order by id desc`

  let datas = [req.body.sale_order_number]
  db.query(sql, datas, (error, results) => {
    if (error) return res.cc(error)
    if (results.length === 2) return res.cc('订单编号已存在, 请重新输入!')
    if (results.length === 1 && results[0].sale_order_number === req.body.sale_order_number)
    if (results.length === 1 && results[0].sale_order_number === req.body.sale_order_number) return res.cc('订单编号已存在, 请重新输入!')

    // TODO: 新增采购订单数据
    const sql = `insert into purchase_order_form set?`
    db.query(sql, req.body, (error, results) => {
      if (error) return res.cc(error)
      if (results.affectedRows !== 1) return res.cc('新增订单数据失败!')

      res.cc('新增订单数据成功!', 0)
    })
  })
}

// 获取全部采购订单数据
exports.getShopOrderInfoData = (req, res) => {
  const sql = `select * from purchase_order_form order by id asc`

  db.query(sql, (error, results, fields) => {
    if (error) {
      res.json({ err_code: 0, message: "获取失败" })
    } else {
      results = JSON.parse(JSON.stringify(results))
      res.json({ success_code: 200, data: results })
    }
  })
}

// 根据id 获取采购订单数据
exports.getShopOrderInfoById = (req, res) => {
  const sql = `select * from purchase_order_form where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)

    if (results.length !==1) return res.cc('获取采购订单数据失败!')

    res.send({
      status: 0,
      message: '获取采购订单数据成功!',
      data: results[0]
    })
  })
}

// 更新采购订单信息函数
exports.updateShopOrderInfoById = (req, res) => {
  const sql = `select * from purchase_order_form where Id<>? and (sale_order_number=? or sale_vonder_id=?)`

  const datas = [req.body.Id, req.body.sale_order_number, req.body.sale_vonder_id]

  db.query(sql, datas, (err, results) => {
    if (err) res.cc(err)

    if (results.length === 2) return res.cc('分类名称与别名已存在, 请重新输入!')
    if (results.length === 1 && results[0].sale_order_number === req.body.sale_order_number && results[0].sale_vonder_id === req.body.sale_vonder_id)
    if (results.length === 1 && results[0].sale_order_number === req.body.sale_order_number) return res.cc('供应商名称已存在, 请重新输入!')
    if (results.length === 1 && results[0].sale_vonder_id === req.body.sale_vonder_id) return res.cc('供应商编号已存在, 请重新输入!')


    const sql = `update purchase_order_form set? where Id=?`
    db.query(sql, [req.body, req.body.Id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新采购订单数据失败!')

      res.cc('更新采购订单数据成功!', 0)
    })
  })
}

// 删除采购订单数据的处理函数
exports.deleteShopOrderInfoById = (req, res) => {
  const sql = `delete from purchase_order_form where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !==1) return res.cc('删除采购订单数据失败!')
    res.cc('删除采购订单数据成功!', 0)
  })
}

// 分页查询
exports.getShopOrderInfoPage = (req, res) => {
  let pageNo = Number(req.body.page) || 1
  let pageCount = Number(req.body.pageSize) || 10
  let pageSize = pageCount
  let page = (pageNo - 1) * pageCount
  console.log(page, pageSize)

  const sql = `select * from purchase_order_form limit ${page}, ${pageSize}`
  db.query(sql, (error, results, fields) => {
    if (error){
      console.log(error)
      res.json({ err_code: 0, message: "获取分页数据失败"})
    } else {
      console.log(results)
        res.json({success_code: 200, message: '获取分页数据成功', data: results })
    }
  })
}

// 采购订单列表查询条件接口
exports.shopOrderInfoSearch = (req, res) => {
  let sql = 'select * from purchase_order_form'
  let params = req.body

  console.log(params, '参数')

  let arr = []
  for (let key in params) {
      arr.push(params[key])
  }
  if (params.sale_order_number !== '') {
    if (arr[0] !== '') {
      sql += ` where sale_order_number like "%${params.sale_order_number}%" `
    } else {
      sql += ''
    }
  }
  if (params.sale_delivery_date !== '') {
      if (arr[0] === '') {
        sql += ` where sale_delivery_date like "%${params.sale_delivery_date}%"`
      } else {
        sql += ` and sale_delivery_date like "%${params.sale_delivery_date}%"`
      }
  }
  if (params.sale_purchaser !== '') {
      if (arr[0] === '' && arr[1] === '') {
        sql += ` where sale_purchaser like "%${params.sale_purchaser}%"`
      } else {
        sql += ` and sale_purchaser like "%${params.sale_purchaser}%"`
      }
  }
  db.query(sql, (err, result) => {
    if (err) {
        console.log(err)
    }
    if (result) {
        res.json({
            code: 200,
            message: '查询成功!',
            data: result
        })
    }
  })
  console.log(arr, '000')

}
