const multer = require('multer')
const fs = require('fs')

// 创建一个存储引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
})

// 配置上传中间件
const upload = multer({ storage }).single('file')

exports.uploadImage = (req, res, next) => {
  upload(req, res, (err) => {

    const { image_url } = req.body
    const id = results.insertId
    const sql = `update commodity set image_url=? where id=?`
    const values = [image_url]

    db.query(sql, values, (err, results) => {
      
      if (err instanceof multer.MulterError) {
        res.status(500).json({ error: '上传失败' })
      } else if (err) {
        res.status(500).json({ error: err.message })
      } else {
        // 上传成功
        const file = req.file
        const fileInfo = {
          type: file.mimetype,
          name: file.originalname,
          size: file.size,
          path: file.path
        }
        res.status(200).json({message: '上传成功', data: fileInfo})
      }
    })
  })
}