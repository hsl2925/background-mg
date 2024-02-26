// 路由处理函数模块
const db = require('../config/db_config')

// 获取供应商列表的处理函数
exports.getSupInfo = (req, res) => {
  const sql =  `select * from sup_info where is_delete=0 order by id asc`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取数据标题列表成功!',
      data: [
        {
          // id: 1,
          // name: '首页',
          data: [
            {
              // 二级
              id: 1,
              name: '供应商管理',
              data: [
                {
                  // 三级
                  id: 1,
                  name: '供应商信息',
                  path: 'supInfo'
                }
              ]
            },
            {
              // 二级
              id: 2,
              name: '采购管理',
              data: [
                {
                  // 三级
                  id: 1,
                  name: '采购订单',
                  path: 'shopOrder'
                },
                {
                  id: 2,
                  name: '采购明细',
                  path: 'shopOrderList'
                }
              ]
            },
            {
              // 二级
              id: 3,
              name: '商品管理',
              data: [
                {
                  // 三级
                  id: 1,
                  name: '商品信息',
                  path: 'integrator'
                }
              ]
            },
            {
              // 二级
              id: 4,
              name: '库存管理',
              data: [
                {
                  // 三级
                  id: 1,
                  name: '商品库存',
                  path: 'merinventory'
                },
                {
                  // 三级
                  id: 2,
                  name: '商品入库记录',
                  path: 'inproductrecord'
                },
                {
                  // 三级
                  id: 3,
                  name: '商品出库记录',
                  path: 'outproductrecord'
                }
              ]
            },
            {
              // 二级
              id: 5,
              name: '物流管理',
              data: [
                {
                  // 三级
                  id: 1,
                  name: '商品发货记录',
                  path: 'deliveryrecord'
                },
                {
                  // 三级
                  id: 2,
                  name: '商品收货记录',
                  path: 'receiptrecord'
                }
              ]
            },
            {
              // 二级
              id: 6,
              name: '用户管理',
              data: [
                {
                  // 三级
                  id: 1,
                  name: '用户列表',
                  path: 'userInfo'
                },
                {
                  // 三级
                  id: 2,
                  name: '用户权限',
                  path: 'userPermission'
                }
              ]
            }
          ]
        }
      ]
    })
  })
}

// 获取全部供应商数据
exports.getSupplierData = (req, res) => {
  const sql = `select * from sup_info order by id asc`

  db.query(sql, (error, results, fields) => {
    if (error) {
      res.json({ err_code: 0, message: "获取失败" })
    } else {
      results = JSON.parse(JSON.stringify(results))
      res.json({ success_code: 200, data: results })
    }
  })
}

// 分页查询
exports.getSupplierPage = (req, res) => {
  let pageNo = Number(req.body.page) || 1
  let pageCount = Number(req.body.pageSize) || 10
  let pageSize = pageCount
  let page = (pageNo - 1) * pageCount
  console.log(page, pageSize)

  const sql = `select * from sup_info limit ${page}, ${pageSize}`
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

// 新增供应商的处理函数
exports.addSupplierInfo = (req, res) => {
  // 定义查重的 sql 语句
  const sql = `select * from sup_info where re_vonder_name=? or sale_vonder_id=? order by id desc`

  let datas = [req.body.re_vonder_name, req.body.sale_vonder_id]
  db.query(sql, datas, (error, results) => {
    if (error) return res.cc(error)
    if (results.length === 2) return res.cc('分类名称与别名已存在, 请重新输入!')
    if (results.length === 1 && results[0].re_vonder_name === req.body.re_vonder_name && results[0].sale_vonder_id === req.body.sale_vonder_id)
    if (results.length === 1 && results[0].re_vonder_name === req.body.re_vonder_name) return res.cc('供应商名称已存在, 请重新输入!')
    if (results.length === 1 && results[0].sale_vonder_id === req.body.sale_vonder_id) return res.cc('供应商编号已存在, 请重新输入!')

    // TODO: 新增供应商数据
    const sql = `insert into sup_info set?`
    db.query(sql, req.body, (error, results) => {
      if (error) return res.cc(error)
      if (results.affectedRows !== 1) return res.cc('新增供应商数据失败!')

      res.cc('新增供应商数据成功!', 0)
    })
  })
}

// 删除供应商数据的处理函数
exports.deleteSupplierInfoById = (req, res) => {
  const sql = `delete from sup_info where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !==1) return res.cc('删除供应商数据失败!')
    res.cc('删除供应商数据成功!', 0)
  })
}

// 根据id 获取供应商数据
exports.getSupplierInfoById = (req, res) => {
  const sql = `select * from sup_info where id=?`

  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !==1) return res.cc('获取供应商数据失败!')
    res.send({
      status: 0,
      message: '获取供应商数据成功!',
      data: results[0]
    })
  })
}

// 更新供应商信息函数
exports.updateSupplierInfoById = (req, res) => {
  // 定义查重的sql语句
  const sql = `select * from sup_info where Id<>? and (re_vonder_name=? or sale_vonder_id=?)`

  const datas = [req.body.Id, req.body.re_vonder_name, req.body.sale_vonder_id]

  db.query(sql, datas, (err, results) => {
    if (err) res.cc(err)
    if (results.length === 2) return res.cc('分类名称与别名已存在, 请重新输入!')
    if (results.length === 1 && results[0].re_vonder_name === req.body.re_vonder_name && results[0].sale_vonder_id === req.body.sale_vonder_id)
    if (results.length === 1 && results[0].re_vonder_name === req.body.re_vonder_name) return res.cc('供应商名称已存在, 请重新输入!')
    if (results.length === 1 && results[0].sale_vonder_id === req.body.sale_vonder_id) return res.cc('供应商编号已存在, 请重新输入!')

    const sql = `update sup_info set? where Id=?`
    db.query(sql, [req.body, req.body.Id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新供应商数据失败!')

      res.cc('更新供应商数据成功!', 0)
    })
  })
}

// 供应商列表搜索
exports.supplierSearch = (req, res) => {
  let sql = 'select * from sup_info'
  let params = req.body
  console.log(params, '参数')

  let arr = []
  for (let key in params) {
      arr.push(params[key])
  }
  if (params.sale_vonder_id !== '') {
    if (arr[0] !== '') {
      sql += ` where sale_vonder_id like "%${params.sale_vonder_id}%" `
    } else {
      sql += ''
    }
  }
  if (params.corporate_name !== '') {
      if (arr[0] === '') {
        sql += ` where corporate_name like "%${params.corporate_name}%"`
      } else {
        sql += ` and corporate_name like "%${params.corporate_name}%"`
      }
  }
  if (params.contact !== '') {
      if (arr[0] === '' && arr[1] === '') {
        sql += ` where contact like "%${params.contact}%"`
      } else {
        sql += ` and contact like "%${params.contact}%"`
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

