// 商品库存路由处理函数
const db = require('../config/db_config')

// 获取所有商品库存数据
exports.getMerinventory = (req, res) => {
  const sql = `select * from inventory_out order by id asc`
  db.query(sql, (error, results, fields) => {
    if (error) {
      res.json({ err_code: 0, message: "获取失败" })
    } else {
      results = JSON.parse(JSON.stringify(results))
      res.json({ success_code: 200, data: results })
    }
  })
}

// 新增商品库存接口
exports.addMerinventoryInfo = (req, res) => {
  // 定义查重的 sql 语句
  const sql = `select * from inventory_out where item_number=? order by id desc`

  let datas = [req.body.item_number]
  db.query(sql, datas, (error, results) => {
    if (results.length === 1 && results[0].item_number === req.body.item_number) {
      return res.cc('商品编号已存在, 请重新输入!')
    }

    // TODO: 新增商品库存
    const sql = `insert into inventory_out set?`
    db.query(sql, req.body, (error, results) => {
      if (error) return res.cc(error)
      if (results.affectedRows !== 1) return res.cc('新增商品库存数据失败!')

      res.cc('新增商品库存数据成功!', 0)
    })
  })
}

// 获取全部商品库存数据
exports.getMerinventoryData = (req, res) => {
  const sql = `select * from inventory_out order by id asc`

  db.query(sql, (error, results, fields) => {
    if (error) {
      res.json({ err_code: 0, message: "获取失败" })
    } else {
      results = JSON.parse(JSON.stringify(results))
      res.json({ success_code: 200, data: results })
    }
  })
}

// 根据id 获取商品库存数据
exports.getMerinventoryInfoById = (req, res) => {
  const sql = `select * from inventory_out where id=?`

  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !==1) return res.cc('获取商品库存数据失败!')

    res.send({
      status: 0,
      message: '获取商品库存数据成功!',
      data: results[0]
    })
  })
}

// 更新商品库存数据信息函数
exports.updateMerinventoryInfoById = (req, res) => {
  const sql = `select * from inventory_out where Id<>? and item_number=?`
  const datas = [req.body.Id, req.body.item_number]

  db.query(sql, datas, (err, results) => {
    if (err) res.cc(err)
    if (results.length === 1 && results[0].item_number === req.body.item_number) {
      return res.cc('商品编号已存在, 请重新输入!')
    }

    const sql = `update inventory_out set? where Id=?`
    db.query(sql, [req.body, req.body.Id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新商品库存数据失败!')

      res.cc('更新商品库存数据成功!', 0)
    })
  })
}

// 删除商品库存数据
exports.deleteMerinventoryInfoById = (req, res) => {
  const sql = `delete from inventory_out where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !==1) return res.cc('删除商品库存数据失败!')
    res.cc('删除商品库存数据成功!', 0)
  })
}

// 分页查询
exports.getMerinventoryPage = (req, res) => {
  let pageNo = Number(req.body.page) || 1
  let pageCount = Number(req.body.pageSize) || 10
  let pageSize = pageCount
  let page = (pageNo - 1) * pageCount
  console.log(page, pageSize)

  const sql = `select * from inventory_out limit ${page}, ${pageSize}`
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

// 商品库存数据列表查询条件接口
exports.merinventorySearch = (req, res) => {
  let sql = 'select * from inventory_out'
  let params = req.body

  console.log(params, '参数')

  let arr = []
  for (let key in params) {
      arr.push(params[key])
  }
  if (params.product_name !== '') {
    if (arr[0] !== '') {
      sql += ` where product_name like "%${params.product_name}%" `
    } else {
      sql += ''
    }
  }
  if (params.product_type !== '') {
      if (arr[0] === '') {
        sql += ` where product_type like "%${params.product_type}%"`
      } else {
        sql += ` and product_type like "%${params.product_type}%"`
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

