const joi = require('joi')

// 1. 商品出库/发货模块验证规则
// 2. 定义字段相关验证规则
const id = joi.number().integer().min(1).required()
const del_note_number = joi.string().required()
const del_note_date = joi.date().required()
const logistics_number = joi.string().required()
const del_note_person = joi.string().required()
const item_number = joi.string().required()
const number = joi.string().required()
const price = joi.string().required()

// 新增出库记录
exports.add_productrecord_schema = {
  body: {
    del_note_number: del_note_number,
    del_note_date: del_note_date,
    logistics_number: logistics_number,
    del_note_person: del_note_person,
    item_number: item_number,
    number: number,
    price: price
  }
}

// 根据 id 进行数据删除操作
exports.delete_productrecord_schema = {
  parmas: {
    id: id
  }
}

// 根据 id 获取对应数据 进行相应处理
exports.get_productrecord_schema = {
  parmas: {
    id: id
  }
}

// 获取 id 对应数据进行更新操作
exports.update_productrecord_schema = {
  body: {
    Id: id,
    del_note_number: del_note_number,
    del_note_date: del_note_date,
    logistics_number: logistics_number,
    del_note_person: del_note_person,
    item_number: item_number,
    number: number,
    price: price
  }
}
