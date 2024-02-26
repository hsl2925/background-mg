const joi = require('joi')

// 定义对字段的验证规则
const id = joi.number().integer().min(1).required()
const re_vonder_name = joi.string().required()
const sale_vonder_id = joi.string().required()
const corporate_name = joi.string().required()
const contact = joi.string().required()
const con_phone = joi.string().required()
const con_email = joi.string().required()

// alphanum() 只能包含字母和对象
// const alias = joi.string().alphanum().required()

// 校验规则 - 添加分类
exports.add_supplier_schema = {
  body: {
    re_vonder_name: re_vonder_name,
    sale_vonder_id: sale_vonder_id,
    corporate_name: corporate_name,
    contact: contact,
    con_phone: con_phone,
    con_email: con_email
  }
}

// 校验规则 - 删除分类
exports.delete_supplier_schema = {
  parmas: {
    id: id
  }
}

// 校验规则 - 根据 id 获取分类
exports.get_supplier_schema = {
  parmas: {
    id: id
  }
}

// 校验规则对象 - 更新分类
exports.update_supplier_schema = {
  body: {
    Id: id,
    re_vonder_name: re_vonder_name,
    sale_vonder_id: sale_vonder_id,
    corporate_name: corporate_name,
    contact: contact,
    con_phone: con_phone,
    con_email: con_email
  }
}