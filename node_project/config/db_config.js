const mysql = require('mysql')

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'student_db',
  timezone: "08:00" // 数据库日期格式化
})

module.exports = db