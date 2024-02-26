const joi = require('joi')

// 定义数据表字段的验证规则
const id = joi.number().integer().min(1).required()
const username = joi.string().required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const avatar = joi.string()
const nickname = joi.string()
const phone = joi.string()
const mobile = joi.string()
const role = joi.string()

// 新增用户
exports.add_user_schema = {
  body: {
    username,
    password,
    avatar,
    nickname,
    phone,
    mobile,
    role
  }
}

// 根据id删除用户
exports.delete_user_schema = {
  parmas: {
    id: id
  }
}

// 根据 id 获取用户数据
exports.get_user_schema = {
  parmas: {
    id: id
  }
}

// 更新用户
exports.update_user_schema = {
  body: {
    Id: id,
    username,
    password,
    avatar,
    nickname,
    phone,
    mobile,
    role
  }
}

// 查询

