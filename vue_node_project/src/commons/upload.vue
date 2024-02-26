<template>
  <div class="upload">
    <el-upload
      ref="upload"
      list-type="picture-card"
      :action="actionUrl"
      :class="{ hide: isUpload }"
      :auto-upload="true"
      :http-request="upload"
      :limit="limit"
      :file-list="fileList"
      :accept="accept"
      :name="name"
      :show-file-list="true"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    limit: {
      default: 1
    },
    name: {
      type: String,
      default: 'file'
    },
    fileList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      isUpload: false,
      actionUrl: axios.defaults.baseURL + '/addCommodityInfo'
    }
  },
  methods: {
    handleChange (file, fileList) {
      // 判断上传文件是否达到限制
      this.isUpload = fileList.length >= this.limit
      // 由于设置自动上传为false,before-upload钩子失效，所以在on-change中检验文件是否符合要求
      const isJPG = ~['image/jpeg', 'image/png'].indexOf(file.raw.type)
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if (!isJPG || !isLt2M) {
        // 不符合直接删除该文件
        this.handleRemove(file)
      }
    },

    // 删除图片
    handleRemove (file) {
      this.$emit('on-response')
      setTimeout(() => {
        this.isUpload = false
      }, 1000)
    },

    // 预览图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 文件超出限制的提示
    handleExceed (file, fileList) {
      this.$message.error('文件个数超出限制')
    },

    // 文件上传成功的回调
    handleSuccess (file, fileList) {
      this.fileList.push({
        name: fileList.name,
        url: fileList.url
      })
      console.log(this.fileList, 130)
      console.log(file, fileList)
      // 通过派发自定义事件 getFileList 向父组件传值
      this.$emit('getFileList', this.fileList)
    },

    async upload () {
      // 使用的是multer中间件，所以需要传递formdata格式的数据
      const formData = new FormData()
      // 找到需要传递的文件
      const file = this.$refs.upload.uploadFiles
      // 设置请求头
      const headerConfig = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      // 遍历 添加文件信息
      // 注意：添加的字段名，需要与后端一样 "file"
      file.forEach((item) => {
        formData.append('file', item.raw)
      })
      let { data: res } = await this.$http.post('/upload', formData, headerConfig)
        .then((res) => {
          if (res.data.code === 200) {
            localStorage.setItem('url', res.data.resData.url)
          }
        })
      console.log(res)
    }
  }
}
</script>

<style scoped>
.hide .el-upload--picture-card {
  display: none;
}

.el-upload--picture-card {
  width: 100px !important;
  height: 100px !important;
  line-height: 104px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon:hover {
  border-color: #409eff !important;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
