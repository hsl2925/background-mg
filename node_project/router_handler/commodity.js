// 商品信息模块路由处理函数
const db = require('../config/db_config')
const multer = require('multer')
const fs = require('fs')

// 获取所有商品信息数据
exports.getCommodityData = (req, res) => {
  const sql = `select * from commodity order by id asc`
  db.query(sql, (error, results, fields) => {
    if (error) {
      res.json({ err_code: 0, message: "获取失败" })
    } else {
      results = JSON.parse(JSON.stringify(results))
      res.json({ success_code: 200, data: results })
    }
  })
}

// 新增商品信息
exports.addCommodityInfo = (req, res) => {
  // 定义查重的 sql 语句
  const sql = `select * from commodity where item_number=? order by id desc`

  let datas = [req.body.item_number]
  db.query(sql, datas, (error, results) => {
    if (error) return res.cc(error)
    if (results.length === 1 && results[0].item_number === req.body.item_number) return res.cc('商品编号已存在, 请重新输入!')

    // TODO: 新增商品信息数据
    const sql = `insert into commodity set?`

    db.query(sql, req.body, (error, results) => {
      if (error) return res.cc(error)
      if (results.affectedRows !== 1) return res.cc('新增失败!')

      res.cc('新增成功!', 0)
    })
  })
}

// 获取全部商品信息数据
exports.getCommodityData = (req, res) => {

  const sql = `select * from commodity order by id asc`

  db.query(sql, (error, results, fields) => {
    if (error) {
      res.json({ err_code: 0, message: "获取失败" })
    } else {
      results = JSON.parse(JSON.stringify(results))
      res.json({ success_code: 200, data: results })
    }
  })
}

// 根据id 获取数据
exports.getCommodityById = (req, res) => {
  const sql = `select * from commodity where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)

    if (results.length !==1) return res.cc('获取数据失败!')

    res.send({
      status: 0,
      message: '获取数据成功!',
      data: results[0]
    })
  })
}

// 更新商品信息函数
exports.updateCommodityById = (req, res) => {
  const sql = `select * from commodity where Id<>? and (sale_order_number=? or sale_vonder_id=?)`

  const datas = [req.body.Id, req.body.sale_order_number, req.body.sale_vonder_id]

  db.query(sql, datas, (err, results) => {
    if (err) res.cc(err)

    if (results.length === 2) return res.cc('分类名称与别名已存在, 请重新输入!')
    if (results.length === 1 && results[0].sale_order_number === req.body.sale_order_number && results[0].sale_vonder_id === req.body.sale_vonder_id)
    if (results.length === 1 && results[0].sale_order_number === req.body.sale_order_number) return res.cc('供应商名称已存在, 请重新输入!')
    if (results.length === 1 && results[0].sale_vonder_id === req.body.sale_vonder_id) return res.cc('供应商编号已存在, 请重新输入!')

    const sql = `update commodity set? where Id=?`
    db.query(sql, [req.body, req.body.Id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新数据失败!')

      res.cc('更新数据成功!', 0)
    })
  })
}

// 删除商品信息数据
exports.deleteCommodityById = (req, res) => {
  const sql = `delete from commodity where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !==1) return res.cc('删除数据失败!')
    res.cc('删除数据成功!', 0)
  })
}

// 分页查询
exports.getCommodityPage = (req, res) => {
  let pageNo = Number(req.body.page) || 1
  let pageCount = Number(req.body.pageSize) || 10
  let pageSize = pageCount
  let page = (pageNo - 1) * pageCount
  console.log(page, pageSize)

  const sql = `select * from commodity limit ${page}, ${pageSize}`
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

// 商品信息列表查询条件接口
exports.commoditySearch = (req, res) => {
  let sql = 'select * from commodity'
  let params = req.body

  console.log(params, '参数')

  let arr = []
  for (let key in params) {
      arr.push(params[key])
  }
  if (params.average_score !== '') {
    if (arr[0] !== '') {
      sql += ` where average_score like "%${params.average_score}%" `
    } else {
      sql += ''
    }
  }
  if (params.start_item_time !== '') {
      if (arr[0] === '') {
        sql += ` where start_item_time like "%${params.start_item_time}%"`
      } else {
        sql += ` and start_item_time like "%${params.start_item_time}%"`
      }
  }
  if (params.unit !== '') {
      if (arr[0] === '' && arr[1] === '') {
        sql += ` where unit like "%${params.unit}%"`
      } else {
        sql += ` and unit like "%${params.unit}%"`
      }
  }
  if (params.inventory !== '') {
    if (arr[0] === '' && arr[2] === '') {
      sql += ` where inventory like "%${params.inventory}%"`
    } else {
      sql += ` and inventory like "%${params.inventory}%"`
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
