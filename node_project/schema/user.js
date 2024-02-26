const joi = require('joi')

// 定义数据表字段的验证规则
const id = joi.number().integer().min(1).required()
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const email = joi.string().required()
const mobile = joi.string().required()
const avatar = joi.string()

// 登录表单的验证规则对象
exports.log_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password
  }
}

// 注册表单的验证规则对象
exports.reg_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
    email,
    mobile,
    avatar
  }
}


// 验证规则对象 - 更新用户基本信息
exports.update_userinfo_scheme = {
  body: {
    id: id,
    username: username,
    password: password
  }
}

// 验证规则对象 - 重置密码
exports.update_password_scheme = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref('oldPwd')).concat(password)
  }
}

// 验证规则对象 - 更换头像
exports.update_avatar_scheme = {
  body: {
    avatar: avatar
  }
}
