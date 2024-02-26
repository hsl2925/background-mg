const joi = require('joi')

// 定义字段相关验证规则
const id = joi.number().integer().min(1).required()
const item_number = joi.string().required()
const sale_order_number = joi.string().required()
const number = joi.string().required()
const price = joi.string().required()
const sale_order_date = joi.date().required()

// 新增校验规则
exports.add_shoporder_detail_schema = {
  body: {
    item_number: item_number,
    sale_order_number: sale_order_number,
    number: number,
    price: price,
    sale_order_date: sale_order_date
  }
}

// 校验规则 - 删除数据对应id
exports.delete_shoporder_detail_schema = {
  parmas: {
    id: id
  }
}

// 校验规则 - 根据 id 获取订单数据
exports.get_shoporder_detail_schema = {
  parmas: {
    id: id
  }
}

// 校验规则对象 - 更新订单
exports.update_shoporder_detail_schema = {
  body: {
    Id: id,
    item_number: item_number,
    sale_order_number: sale_order_number,
    number: number,
    price: price,
    sale_order_date: sale_order_date
  }
}