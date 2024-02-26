const db = require('../config/db_config')
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义 sql 语句 根据用户id 查询用户的基本信息
  const sql = `select * from ev_users where id=?`

  db.query(sql, req.auth.user.id, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !==1) return res.cc('获取用户信息失败!')
  })

  res.send({
    status: 0,
    message: '获取用户基本信息成功!',
    data: result[0]
  })
}

// 新增用户
exports.addUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  console.log(userinfo)

  // 验证用户名是否被占用
  const sql = `select * from ev_users where username=?`
  db.query(sql, [userinfo.username], (err, result) => {
    if (err) {
      return res.cc(err)
    }
    if (result.length > 0) {
      return res.cc('该用户名已存在！')
    }

    // bcrypt.hashSync() 对密码进行加密处理
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    
    // 插入新用户数据
    const set = `insert into ev_users set?`
    let newUserInfo = { username: userinfo.username,
                        password: userinfo.password,
                        avatar: userinfo.avatar,
                        nickname: userinfo.nickname,
                        phone: userinfo.phone,
                        mobile: userinfo.mobile,
                        role: userinfo.role
                      }
    db.query(set, newUserInfo, (err, result) => {
      if(err) return res.cc(err)
      // 判断影响行数是否为1
      if (result.affectedRows !== 1) {
        return res.cc('新增失败!')
      }
      res.cc('新增成功!', 0)
    })
  })
}


// 更新用户基本信息的处理函数
exports.updateUserById = (req, res) => {
  // 定义待执行的 sql 语句
  const sql = `update ev_users set? where id=?`
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err) // 执行sql失败
    if (results.affectedRows !== 1) return res.cc('更新用户信息失败!')
    res.cc('更新用户信息成功', 0)
  })
}

// 删除用户
exports.deleteUserById = (req, res) => {
  const sql = `delete from ev_users where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !==1) return res.cc('删除用户失败!')
    res.cc('删除用户成功!', 0)
  })
}

// 根据id 获取用户数据
exports.getUserById = (req, res) => {
  const sql = `select * from ev_users where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !==1) return res.cc('获取用户数据失败!')
    res.send({
      status: 0,
      message: '获取用户数据成功!',
      data: results[0]
    })
  })
}

// 分页查询
exports.getUserPage = (req, res) => {
  let pageNo = Number(req.body.page) || 1
  let pageCount = Number(req.body.pageSize) || 10
  let pageSize = pageCount
  let page = (pageNo - 1) * pageCount
  console.log(page, pageSize)

  const sql = `select * from ev_users limit ${page}, ${pageSize}`
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

// 供应商列表搜索
exports.userSearch = (req, res) => {
  let sql = 'select * from ev_users'
  let params = req.body
  console.log(params, '参数')
  let arr = []
  for (let key in params) {
      arr.push(params[key])
  }
  if (params.username !== '') {
    if (arr[0] !== '') {
      sql += ` where username like "%${params.username}%" `
    } else {
      sql += ''
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

// 重置密码处理函数
exports.updatePassword = (req, res) => {
  const sql = `select * from ev_users where id=?`

  // 根据 id 查询用户信息的 sql 语句
  db.query(sql, req.auth.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !==1) return res.cc('用户不存在!')

    // TODO: 判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!compareResult) return res.cc('原密码错误!')

    const sql = `update ev_users set password=? where id=?`
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)  // 新密码加密处理
    db.query(sql, [newPwd, req.auth.id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !==1) return res.cc('更新密码失败!')
      res.cc('更新密码成功!', 0)
    })
  })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  const sql = `update ev_users set avatar=? where id=?`
  db.query(sql, [req.body.avatar, req.auth.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !==1) return res.cc('更新头像失败!')
    return res.cc('更新头像成功!', 0)
  })
}
