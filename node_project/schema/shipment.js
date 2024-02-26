const joi = require('joi')

const id = joi.number().integer().min(1).required()
const del_note_number = joi.string()
const del_note_date = joi.date().required()
const del_note_person = joi.string().required()
const item_number = joi.string().required()
const number = joi.string().required()
const price = joi.number()

const logistics_number = joi.string().required()

// 校验规则 - 添加分类
exports.add_shipment = {
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

// 校验规则 - 删除分类
exports.delete_shipment = {
  parmas: {
    id: id
  }
}

// 校验规则 - 根据 id 获取分类
exports.get_shipment = {
  parmas: {
    id: id
  }
}


// 校验规则对象 - 更新分类
exports.update_shipment = {
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