// 商品库存 - 表单验证规则对象
const joi = require('joi')

// 2. 定义字段相关验证规则
const id = joi.number().integer().min(1).required()
const item_number = joi.string().required()
const product_name = joi.string().required()
const product_price = joi.number().required()
const product_type = joi.string().required()
const inventory_number = joi.string().required()
const shelf_date =  joi.date().required()

// 3. 新增商品库存验证
exports.add_merinventory_schema = {
  body: {
    item_number: item_number,
    product_name: product_name,
    product_price: product_price,
    product_type: product_type,
    inventory_number: inventory_number,
    shelf_date: shelf_date
  }
}

// 4. 根据 id 进行数据删除操作
exports.delete_merinventory_schema = {
  parmas: {
    id: id
  }
}

// 5. 根据 id 获取对应数据 进行相应处理
exports.get_merinventory_schema = {
  parmas: {
    id: id
  }
}

// 6. 获取 id 对应数据进行更新操作
exports.update_merinventory_schema = {
  body: {
    Id: id,
    item_number: item_number,
    product_name: product_name,
    product_price: product_price,
    product_type: product_type,
    inventory_number: inventory_number,
    shelf_date: shelf_date
  }
}
