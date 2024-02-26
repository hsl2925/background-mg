const joi = require('joi')

const id = joi.number().integer().min(1).required()
const de_note_number = joi.string()
const de_note_date = joi.date().required()
const de_note_person = joi.string().required()
const item_number = joi.string().required()
const number = joi.string().required()
const price = joi.number()

const logistics_number = joi.string().required()

// 校验规则 - 添加分类
exports.add_table1 = {
  body: {
    de_note_number: de_note_number,
    de_note_date: de_note_date,
    logistics_number: logistics_number,
    de_note_person: de_note_person,
    item_number: item_number,
    number: number,
    price: price
  }
}

// 校验规则 - 删除分类
exports.delete_table1 = {
  parmas: {
    id: id
  }
}

exports.delete_table2 = {
  parmas: {
    id: id
  }
}

// 校验规则 - 根据 id 获取分类
exports.get_table1 = {
  parmas: {
    id: id
  }
}

exports.get_table2 = {
  parmas: {
    id: id
  }
}

// 校验规则对象 - 更新分类
exports.update_table1 = {
  body: {
    Id: id,
    de_note_number: de_note_number,
    de_note_date: de_note_date,
    logistics_number: logistics_number,
    de_note_person: de_note_person,
    item_number: item_number,
    number: number,
    price: price
  }
}