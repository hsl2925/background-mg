const db = require('../config/db_config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const svgCaptcha = require('svg-captcha')

// 验证数据库是否配置连接成功
db.query('select 1', (err, results) => {
  if (err) return console.log(err.message)
  console.log(results)
})

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  console.log(userinfo)

  // 验证用户名是否被占用
  const sql = `select * from user_register where username=?`
  db.query(sql, [userinfo.username], (err, result) => {
    if (err) {
      return res.cc(err)
    }
    if (result.length > 0) {
      return res.cc('该用户名已注册！')
    }

    // bcrypt.hashSync() 对密码进行加密处理
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    // 插入新用户数据
    const set = `insert into user_register set?`
    let newUserInfo = {
      username: userinfo.username,
      password: userinfo.password,
      confirmPwd: userinfo.password,
      email: userinfo.email,
      mobile: userinfo.mobile,
      avatar: userinfo.avatar,
    }
    db.query(set, newUserInfo, (err, result) => {
      if (err) return res.cc(err)
      // 判断影响行数是否为1
      if (result.affectedRows !== 1) {
        return res.cc('注册失败!')
      }
      res.cc('注册成功!', 0)
    })
  })
}

// 登录的处理函数
exports.regLogin = (req, res) => {
  const userinfo = req.body // 接收表单数据
  console.log(userinfo)
  const sql = `select * from user_register where username=?`

  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('用户不存在')

    // 密码输入判断是否与数据库一致
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password,
    )
    if (!compareResult) return res.cc('用户名或密码错误, 请重新输入')
    console.log(compareResult)

    // 登录成功 生成 Token 字符串
    const user = { ...results[0], password: '' }
    // 对用户信息加密 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    })
    res.send({
      status: 0,
      message: '登录成功!',
      token: 'Bearer ' + tokenStr,
    })
  })
}

// 验证码
exports.checkCode = (req, res) => {
  const img = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1l',
    color: true,
    noise: 1,
    background: '#333',
    height: 38,
    width: 80,
  })
  console.log(img.text)
  res.send(img)
}
