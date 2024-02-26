const joi = require('joi')

// 供应商数据规则配置
const id = joi.number().integer().min(1)
const re_vonder_name = joi.string()
const corporate_name = joi.string()
const contact = joi.string()
const con_phone = joi.string()
const con_email = joi.string()

// 订单数据规则配置
const sale_order_number = joi.string()
const sale_goods_date = joi.date()
const sale_delivery_date = joi.date()
const sale_purchaser = joi.string()
const sale_vonder_id = joi.string()

const item_number = joi.string()
const sale_order_date = joi.string()

// 商品查询字段
const average_score = joi.string()
const start_item_time = joi.string()
const unit = joi.string()
const inventory = joi.string()

// 入库 收货
const de_note_number = joi.string()
const de_note_person = joi.string()

// 用户
const username = joi.string()

// 商品库存
const product_name = joi.string()
const product_type = joi.string()

// 供应商数据
exports.search_supplier_schema = {
  params: {
    Id: id,
    re_vonder_name: re_vonder_name,
    sale_vonder_id: sale_vonder_id,
    corporate_name: corporate_name,
    contact: contact,
    con_phone: con_phone,
    con_email: con_email
  }
}

// 订单数据
exports.search_shoporder_schema = {
  params: {
    Id: id,
    sale_order_number: sale_order_number,
    sale_goods_date: sale_goods_date,
    sale_delivery_date: sale_delivery_date,
    sale_purchaser: sale_purchaser,
    sale_vonder_id: sale_vonder_id
  }
}

// 订单数据详情搜索
exports.search_shoporder_detail_schema = {
  params: {
    item_number: item_number,
    sale_order_date: sale_order_date
  }
}

// 出库记录查询
exports.search_productrecord_schema = {
  params: {
    item_number: item_number,
    sale_order_date: sale_order_date
  }
}

// 商品信息查询条件
exports.search_commodity_schema = {
  params: {
    average_score: average_score, // 商品名称
    start_item_time: start_item_time, // 商品上架时间
    unit: unit, // 商品数量
    inventory: inventory // 商品库存量
  }
}

// 入库 收货
exports.search_tables = {
  params: {
    item_number: item_number,
    de_note_number: de_note_number,
    de_note_person: de_note_person
  }
}

exports.search_shipment = {
  params: {
    item_number: item_number,
    del_note_number: de_note_number,
    del_note_person: de_note_person
  }
}

// 用户查询条件
exports.search_user = {
  params: {
    username: username
  }
}

// 商品库存查询条件
exports.search_merinventory = {
  params: {
    product_name: product_name,
    product_type: product_type
  }
}