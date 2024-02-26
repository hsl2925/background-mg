// 1. 商品信息数据验证
const joi = require('joi')

// 2. 定义字段相关验证规则
const id = joi.number().integer().min(1).required()
const item_number = joi.string().required()
const average_score = joi.string().required()
const commodity_salary = joi.string().required()
const start_item_time = joi.date().required()
const promotion = joi.string().required()
const online = joi.string().required()
const good = joi.string()
const image_url = joi.string()
const unit = joi.string().required()
const inventory = joi.string().required()

// 3. 新增商品记录
exports.add_commodity_schema = {
  body: {
    item_number: item_number,
    average_score: average_score,
    commodity_salary: commodity_salary,
    start_item_time: start_item_time,
    promotion: promotion,
    online: online,
    good: good,
    image_url: image_url,
    unit: unit,
    inventory: inventory
  }
}

// 4. 根据 id 进行数据删除操作
exports.delete_commodity_schema = {
  parmas: {
    id: id
  }
}

// 5. 根据 id 获取对应数据 进行相应处理
exports.get_commodity_schema = {
  parmas: {
    id: id
  }
}

// 6. 获取 id 对应数据进行更新操作
exports.update_commodity_schema = {
  body: {
    Id: id,
    item_number: item_number,
    average_score: average_score,
    commodity_salary: commodity_salary,
    start_item_time: start_item_time,
    promotion: promotion,
    online: online,
    good: good,
    image_url: image_url,
    unit: unit,
    inventory: inventory
  }
}
