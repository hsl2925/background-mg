<template>
  <div class="main_index">
    <!-- 搜索 -->
    <el-card>
      <router-view />
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="queryInfo.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset('queryInfoRef')">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <el-row>
        <el-button type="primary" @click="addDialogVisible = true"><i class="el-icon-plus"></i>新增</el-button>
        <el-button type="success" @click="showUpdateFromData()"><i class="el-icon-edit"></i>修改</el-button>
        <el-button type="danger" @click="deleteFormData()"><i class="el-icon-delete"></i>删除</el-button>
        <template>
            <download-excel class="export-excel-wrapper"
            :data="tableData"
            :fields="json_fields"
            :header="title"
            name="用户数据表.xls"
            >
            <el-button type="warning"><i class="el-icon-download"></i>导出</el-button>
            </download-excel>
        </template>
      </el-row>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="userList"
        :row-class-name="rowDataIndex"
        @row-click="handleRowClickRole"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleDataSelectionChange"
        :fit="true"
        :show-header="true">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :index="indexMethod" width="60" label="ID">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="230">
        </el-table-column>
        <el-table-column prop="avatar" label="头像" width="230">
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="200">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="230">
        </el-table-column>
        <el-table-column prop="mobile" label="邮箱" width="230">
        </el-table-column>
        <el-table-column prop="role" label="角色" width="220">
        </el-table-column>
        <el-table-column class="editer" fixed="right" label="操作" width="260">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row.id)" type="text" size="small"><i class="el-icon-view"></i>查看</el-button>
            <el-button type="text" size="small" @click="showEditDialog(scope.row.id)"><i class="el-icon-edit"></i>修改</el-button>
            <el-button type="text" size="small" @click="deleteFormInfo(scope.row.id)"><i class="el-icon-delete"></i>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        @current-change="getData"
        :total="totalPage">
      </el-pagination>
    </el-card>
    <!-- 添加用户的模态框 -->
    <el-dialog title="新增用户"
        :visible.sync="addDialogVisible"
        width="30%"
        size="mini"
        @close="addDialogClosed">
      <el-form :model="addUser" :rules="addUserRules" @submit.prevent="submitUser"
       ref="addSupplierRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addUser.nickname"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:9093/api/userAvatar"
            :headers="{ Authorization: `Bearer ${token}` }"
            :show-file-list="true"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            >
            <img v-if="addUser.avatar" :src="addUser.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in role"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addUser.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改供应商数据 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules"
       ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="editForm.avatar"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="editForm.role"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 外部按钮修改供应商数据 -->
    <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" width="30%">
      <el-form :model="editInfoBtb" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editInfoBtb.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editInfoBtb.password"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editInfoBtb.nickname"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="editInfoBtb.avatar"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editInfoBtb.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editInfoBtb.mobile"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="editInfoBtb.role"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSupplierInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Bread from '../commons/Bread.vue'

export default {
  components: {
    Bread
  },
  data () {
    // 邮箱、手机号 校验规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的邮箱!'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的手机号!'))
    }
    return {
      role: [{
        value: '选项1',
        label: '管理人员'
      }, {
        value: '选项2',
        label: '普通用户'
      }],
      value: '',
      tableData: [], // 当前页码表格数据
      pageNo: 1, // 表格页码
      pageCount: 10, // 数据数
      currentNo: 1, // 当前页码
      allData: [], // 全部数据
      totalPage: 1, // 总页码
      userList: [],
      queryInfo: { // 查询条件
        sale_vonder_id: '',
        corporate_name: '',
        contact: ''
      },
      // 模态框
      addDialogVisible: false,
      // 添加供应商表单
      addUser: {
        username: '',
        password: '',
        avatar: '',
        nickname: '',
        phone: '',
        mobile: '',
        role: ''
      },
      addUserRules: {
        username: [
          {
            // required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          }
        ]
      },
      // 修改
      editDialogVisible: false,
      editForm: {}, // 修改表单
      editFormRules: { // 表单验证
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ]
      },
      // 表单数据导出到excel文件
      title: 'xx表格',
      json_fields: {
        '用户ID': 'id',
        '用户名': 'username',
        '密码': 'password',
        '头像': 'avatar',
        '昵称': 'nickname',
        '联系电话': 'phone',
        '邮箱': 'mobile',
        '角色': 'role'
      },
      // radio选中数据
      checkedData: [],
      ids: [], // 获取单选的行数据
      updateDialogVisible: false,
      editInfoBtb: {}, // 外部按钮修改表单
      imageUrl: ''
    }
  },
  computed: {
    // form表单索引处理
    indexMethod () {
      return (this.pageNo - 1) * this.pageCount + 1
    }
  },
  created () {
    this.lists = this.$route.matched // 获取路由全部信息
  },
  mounted () {
    this.getList()
    this.getPageTotal()
    this.getData()
    this.addUsers()
  },
  watch: {
    $route (to, from) {
      this.lists = to.matched
    },
    vonderId () {
      this.search()
    }
  },
  methods: {
    // 头像上传
    beforeUpload (file) {
      return true
    },
    handleUploadSuccess (response, file) {
      // 处理上传成功后的逻辑，更新表单中的头像信息
      this.addUser.avatar = response.url // 假设服务端返回头像的URL
      this.imageUrl = URL.createObjectURL(file.row)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    async submitUser () {
      const formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.password)
      formData.append('avatar', this.avatar)
      formData.append('nickname', this.nickname)
      formData.append('phone', this.phone)
      formData.append('mobile', this.mobile)
      formData.append('role', this.role)

      try {
        const response = await axios.post('/addUser', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    },
    // 搜索
    async getList (index) {
      this.pageNo = index || this.pageNo
      const {data: res} = await this.$http.post('/userSearch', this.queryInfo)
      this.userList = res.data
      if (res.code !== 200) {
        this.$message.error('查询失败!!!')
      }
      if (this.queryInfo.username) {
        return 1
      }
    },
    // 搜索
    onSearch () {
      this.getList()
      console.log(this.queryInfo, '000')
    },
    // 重置 清空
    onReset (resetName) {
      for (var key in this.queryInfo) {
        this.queryInfo[key] = ''
        this.getData()
      }
    },
    // 单选 多选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClick (row) {
      console.log(row)
    },
    // 获取前10条数据
    getData (index) {
      this.pageNo = index || this.pageNo
      axios.post('/getUserPage', {
        page: this.pageNo,
        pageSize: this.pageCount
      }).then(res => {
        this.userList = res.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    // 当前页数据
    currentPage (currentPage) {
      this.currentNo = currentPage
      this.getData(this.currentNo)
    },
    // 获取总页数
    getPageTotal () {
      axios.get('/getSupplierData').then(res => {
        this.tableData = res.data.data
        this.totalPage = Math.ceil(this.tableData.length)
      }).catch(error => {
        console.log(error)
      })
    },
    // 表单重置
    addDialogClosed () {
      this.$refs.addSupplierRef.resetFields()
    },
    // 新增用户接口
    addUsers () {
      this.$refs.addSupplierRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('/addUser/', this.addUsers)
        if (res.status !== 0) {
          this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功!')
        this.getData()
        // this.userlist() // 更新列表数据
        this.addDialogVisible = false
      })
    },
    // 表单重置
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 获取供应商数据
    async showEditDialog (id) {
      const {data: res} = await this.$http.get('/getUserById/' + id)
      if (res.status !== 0) {
        this.$message.error('查询数据失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改供应商数据
    async editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateUserById/' + this.editForm.id, {
          Id: this.editForm.id,
          username: this.editForm.username,
          password: this.editForm.password,
          nickname: this.editForm.nickname,
          // avatar: this.editForm.avatar,
          phone: this.editForm.phone,
          mobile: this.editForm.mobile
        })
        if (res.status !== 0) {
          this.$message.error('修改失败!')
        }
        this.editDialogVisible = false
        this.getData() // 更新列表数据
        this.$message.success('修改成功!')
      })
    },
    // 删除供应商数据
    async deleteFormInfo (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除成功!')
      }
      const {data: res} = await this.$http.get('/deleteUserById/' + id)

      if (res.status !== 0) {
        this.$message.error('删除失败!')
      }

      this.getPageTotal()
      this.getData()
      this.$message.success('删除成功!')
    },
    // 按钮实现的删除
    rowDataIndex ({ row, rowIndex }) {
      row.index = rowIndex + 1
    },
    handleRowClickRole (row) {
      this.rowIndex = row.index
    },
    // 勾选数据
    handleDataSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.selection = selection
    },
    // 按钮删除
    async deleteFormData () {
      if (this.ids.length === 0) {
        this.$message.error('请先选择一条数据')
      } else {
        const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('取消删除成功!')
        }
        const {data: res} = await this.$http.get('/deleteUserById/' + this.ids)
        console.log(this.checkedData)
        if (res.status !== 0) {
          this.$message.error('删除失败!')
        }
        this.$message.success('删除成功!')
        const userList = this.userList
        const checkedData = this.checkedData
        this.userList = userList.filter((item) => {
          return checkedData.indexOf(item.index) === -1
        })
        // 更新列表
        this.getPageTotal()
        this.getData()
      }
    },
    // 按钮修改 id 获取数据
    async showUpdateFromData () {
      if (this.ids.length === 0) {
        this.$message.error('请先选择一条数据')
      } else {
        const {data: res} = await this.$http.get('/getUserById/' + this.ids)
        if (res.status !== 0) {
          this.$message.error('查询数据失败!')
        }
        this.editInfoBtb = res.data
        this.updateDialogVisible = true
      }
    },
    // 按钮修改 id 获取数据
    async updateSupplierInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateUserById/' + this.editInfoBtb.id, {
          Id: this.editInfoBtb.id,
          username: this.editInfoBtb.username,
          password: this.editInfoBtb.password,
          nickname: this.editInfoBtb.nickname,
          avatar: this.editInfoBtb.avatar,
          phone: this.editInfoBtb.phone,
          mobile: this.editInfoBtb.mobile
        })
        if (res.status !== 0) {
          this.$message.error('修改失败!')
        }
        this.$message.success('修改成功!')
        this.getData() // 更新列表数据
        this.updateDialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/supinfo.css";
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #b9b9b9;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 22px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
</style>
