const joi = require('joi')

// 定义字段相关验证规则
const id = joi.number().integer().min(1).required()
const sale_order_number = joi.string().required()
const sale_goods_date = joi.date().required()
const sale_delivery_date = joi.date().required()
const sale_purchaser = joi.string().required()
const sale_vonder_id = joi.string().required()

// alphanum() 只能包含字母和对象
// const alias = joi.string().alphanum().required()

// 新增校验规则
exports.add_shoporder_schema = {
  body: {
    sale_order_number: sale_order_number,
    sale_goods_date: sale_goods_date,
    sale_delivery_date: sale_delivery_date,
    sale_purchaser: sale_purchaser,
    sale_vonder_id: sale_vonder_id
  }
}

// 校验规则 - 删除数据对应id
exports.delete_shoporder_schema = {
  parmas: {
    id: id
  }
}

// 校验规则 - 根据 id 获取订单数据
exports.get_shoporder_schema = {
  parmas: {
    id: id
  }
}

// 校验规则对象 - 更新订单
exports.update_shoporder_schema = {
  body: {
    Id: id,
    sale_order_number: sale_order_number,
    sale_goods_date: sale_goods_date,
    sale_delivery_date: sale_delivery_date,
    sale_purchaser: sale_purchaser,
    sale_vonder_id: sale_vonder_id
  }
}
