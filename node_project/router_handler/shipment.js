// 商品入库记录 商品收货记录路由处理函数
const db = require('../config/db_config')

// 查询 table1, table2 表中的所有记录
exports.getShipment = (req, res) => {
  const sql = `select t1.id, t1.del_note_number, t1.del_note_date,
  t1.de_note_person, t1.item_number, t1.number,
  t1.price from out_record_form t1 join shipping_record_form t2 on t1.id = t2.id`

  db.query(sql, (error, results, fields) => {
    if (error) {
      res.json({ err_code: 0, message: "获取失败!" })
    } else {
      results = JSON.parse(JSON.stringify(results))
      res.json({ success_code: 200, data: results })
    }
  })
}

// 向 table1 表和 table2 表中新增一条记录
exports.addShipmentInfo =  (req, res) => {
  const { del_note_number, del_note_date, logistics_number, del_note_person, item_number, number, price } = req.body

  const sql = `insert into out_record_form (del_note_number, del_note_date, logistics_number, del_note_person,
     item_number, number, price) values (?,?,?,?,?,?,?)`

  let datas1 = [ del_note_number, del_note_date, logistics_number, del_note_person, item_number, number, price ]

  db.query(sql , datas1, (err, results) => {
    if (err) throw err

    const id = results.insertId

    const sql = `insert into shipping_record_form (del_note_number, del_note_date, logistics_number, del_note_person,
       item_number, number, price) values (?,?,?,?,?,?,?)`

    let datas2 = [ del_note_number, del_note_date, logistics_number, del_note_person, item_number, number, price, id ]

    db.query(sql, datas2, (err, results) => {
      if (err) throw err
      res.cc('新增数据成功!', 0)
    })
  })
}

// 更新 table1 表和 table2 表中的一条记录
exports.updateShipmentById =  (req, res) => {
  const { id } = req.params
  const sql = `update out_record_form set? where Id=?`
  db.query(sql , [req.body, req.body.Id], (err, result) => {
    if (err) throw err;
    const sql = `update shipping_record_form set? where Id=?`
    db.query(sql , [req.body, req.body.Id], (err, result) => {
      if (err) throw err
      res.cc('修改数据成功!', 0)
    })
  })
}

// 删除 table1 表和 table2 表中的一条记录
exports.deleteShipmentById =  (req, res) => {
  const { id } = req.params

  const sql = `delete from out_record_form where id=?`

  db.query(sql , [id], (err, result) => {
    if (err) throw err

    const sql = `delete from shipping_record_form where id=?`

    db.query(sql , [id], (err, result) => {
      if (err) throw err
      res.cc('删除数据成功!', 0)
    })
  })
}

// 分页查询
exports.getShipmentPage = (req, res) => {
  let pageNo = Number(req.body.page) || 1
  let pageCount = Number(req.body.pageSize) || 10
  let pageSize = pageCount
  let page = (pageNo - 1) * pageCount
  console.log(page, pageSize)

  const sql = `select * from out_record_form limit ${page}, ${pageSize}`
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

// 根据id 获取数据
exports.getShipmentById = (req, res) => {
  const sql = `select * from out_record_form where id=?`
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

// 供应商列表搜索
exports.shipmentSearch = (req, res) => {
  let sql = 'select * from out_record_form'
  let params = req.body
  console.log(params, '参数')
  let arr = []
  for (let key in params) {
      arr.push(params[key])
  }
  if (params.item_number !== '') {
    if (arr[0] !== '') {
      sql += ` where item_number like "%${params.item_number}%" `
    } else {
      sql += ''
    }
  }
  if (params.del_note_number !== '') {
      if (arr[0] === '') {
        sql += ` where del_note_number like "%${params.del_note_number}%"`
      } else {
        sql += ` and del_note_number like "%${params.del_note_number}%"`
      }
  }
  if (params.del_note_person !== '') {
      if (arr[0] === '' && arr[1] === '') {
        sql += ` where del_note_person like "%${params.del_note_person}%"`
      } else {
        sql += ` and del_note_person like "%${params.del_note_person}%"`
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
