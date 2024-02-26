<template>
  <div class="main_index">
    <!-- 搜索 -->
    <el-card>
      <router-view />
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef" class="demo-form-inline">
        <el-form-item label="供应商编号">
          <el-input v-model="queryInfo.sale_vonder_id" placeholder="请输入供应商编号"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="queryInfo.corporate_name" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="queryInfo.contact" placeholder="请输入联系人"></el-input>
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
            name="供应商数据表.xls"
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
        :show-header="true"
        >
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :index="indexMethod" width="60" label="ID">
        </el-table-column>
        <el-table-column prop="re_vonder_name" label="供应商信息" width="260">
        </el-table-column>
        <el-table-column prop="sale_vonder_id" label="供应商编号" width="230">
        </el-table-column>
        <el-table-column prop="corporate_name" label="公司名称" width="260">
        </el-table-column>
        <el-table-column prop="contact" label="联系人" width="220">
        </el-table-column>
        <el-table-column prop="con_phone" label="联系电话" width="230">
        </el-table-column>
        <el-table-column prop="con_email" label="电子邮件" width="210">
        </el-table-column>
        <el-table-column class="editer" fixed="right" label="操作" width="180">
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
    <!-- 添加供应商的模态框 -->
    <el-dialog title="新增供应商"
        :visible.sync="addDialogVisible"
        width="30%"
        size="mini"
        @close="addDialogClosed">
      <el-form :model="addFormSupplier" :rules="addSupplierRules"
       ref="addSupplierRef" label-width="100px">
        <el-form-item label="供应商名称" prop="re_vonder_name">
          <el-input v-model="addFormSupplier.re_vonder_name"></el-input>
        </el-form-item>
        <el-form-item label="供应商编号" prop="sale_vonder_id">
          <el-input v-model="addFormSupplier.sale_vonder_id"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="corporate_name">
          <el-input v-model="addFormSupplier.corporate_name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="addFormSupplier.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="con_phone">
          <el-input v-model="addFormSupplier.con_phone"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" prop="con_email">
          <el-input v-model="addFormSupplier.con_email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSupplier()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改供应商数据 -->
    <el-dialog title="修改供应商" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules"
       ref="editFormRef" label-width="100px">
        <el-form-item label="供应商名称">
          <el-input v-model="editForm.re_vonder_name"></el-input>
        </el-form-item>
        <el-form-item label="供应商编号">
          <el-input v-model="editForm.sale_vonder_id"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="editForm.corporate_name"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="editForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="con_phone">
          <el-input v-model="editForm.con_phone"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" prop="con_email">
          <el-input v-model="editForm.con_email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSupplierInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 外部按钮修改供应商数据 -->
    <el-dialog title="修改供应商" :visible.sync="updateDialogVisible" width="30%">
      <el-form :model="editInfoBtb" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="供应商名称">
          <el-input v-model="editInfoBtb.re_vonder_name"></el-input>
        </el-form-item>
        <el-form-item label="供应商编号">
          <el-input v-model="editInfoBtb.sale_vonder_id"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="editInfoBtb.corporate_name"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="editInfoBtb.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="con_phone">
          <el-input v-model="editInfoBtb.con_phone"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" prop="con_email">
          <el-input v-model="editInfoBtb.con_email"></el-input>
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
import Bread from '../../commons/Bread.vue'

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
      addFormSupplier: {
        re_vonder_name: '',
        sale_vonder_id: '',
        corporate_name: '',
        contact: '',
        con_phone: '',
        con_email: ''
      },
      addSupplierRules: {
        re_vonder_name: [{required: true, message: '请输入供应商名称', trigger: 'blur'}],
        sale_vonder_id: [{required: true, message: '请输入供应商编号'}],
        corporate_name: [{required: true, message: '请输入公司名称'}],
        contact: [{required: true, message: '请输入联系人'}],
        con_phone: [{required: true, message: '请输入联系电话', trigger: 'blur'}, {validator: checkMobile, trigger: 'blur'}],
        con_email: [{required: true, message: '请输入电子邮件', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}]
      },
      // 修改
      editDialogVisible: false,
      editForm: {}, // 修改表单
      editFormRules: { // 表单验证
        re_vonder_name: [{required: true, message: '请输入供应商名称', trigger: 'blur'}],
        sale_vonder_id: [{required: true, message: '请输入供应商编号'}],
        corporate_name: [{required: true, message: '请输入公司名称'}],
        contact: [{required: true, message: '请输入联系人'}],
        con_phone: [{required: true, message: '请输入联系电话', trigger: 'blur'}, {validator: checkMobile, trigger: 'blur'}],
        con_email: [{required: true, message: '请输入电子邮件', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}]
      },
      // 表单数据导出到excel文件
      title: '供应商信息表格',
      json_fields: {
        '供应商ID': 'id',
        '供应商名称': 're_vonder_name',
        '供应商编号': 'sale_vonder_id',
        '公司名称': 'corporate_name',
        '联系人': 'contact',
        '联系电话': 'con_phone',
        '电子邮件': 'con_email',
        '是否删除': 'is_delete'
      },
      // radio选中数据
      checkedData: [],
      ids: [], // 获取单选的行数据
      updateDialogVisible: false,
      editInfoBtb: {} // 外部按钮修改表单
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
    this.addSupplier()
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
    // 搜索
    async getList (index) {
      this.pageNo = index || this.pageNo
      const {data: res} = await this.$http.post('/supplierSearch', this.queryInfo)
      this.userList = res.data
      if (res.code !== 200) {
        this.$message.error('查询失败!!!')
      }
      if (this.queryInfo.sale_vonder_id || this.queryInfo.corporate_name || this.queryInfo.contact === '') {
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
      axios.post('/getSupplierPage', {
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
    // 新增供应商接口
    addSupplier () {
      this.$refs.addSupplierRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('/addSupplierInfo/', this.addFormSupplier)
        if (res.status !== 0) {
          this.$message.error('添加数据失败!')
        }
        this.$message.success('添加数据成功!')
        this.getData()
        this.userlist() // 更新列表数据
        this.addDialogVisible = false
      })
    },
    // 表单重置
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 获取供应商数据
    async showEditDialog (id) {
      const {data: res} = await this.$http.get('/getSupplierInfoById/' + id)
      if (res.status !== 0) {
        this.$message.error('查询数据失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改供应商数据
    async editSupplierInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateSupplierInfoById/' + this.editForm.id, {
          Id: this.editForm.id,
          re_vonder_name: this.editForm.re_vonder_name,
          sale_vonder_id: this.editForm.sale_vonder_id,
          corporate_name: this.editForm.corporate_name,
          contact: this.editForm.contact,
          con_phone: this.editForm.con_phone,
          con_email: this.editForm.con_email
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
      const {data: res} = await this.$http.get('/deleteSupplierInfoById/' + id)

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
        const {data: res} = await this.$http.get('/deleteSupplierInfoById/' + this.ids)
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
        const {data: res} = await this.$http.get('/getSupplierInfoById/' + this.ids)
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
        const {data: res} = await this.$http.post('/updateSupplierInfoById/' + this.editInfoBtb.id, {
          Id: this.editInfoBtb.id,
          re_vonder_name: this.editInfoBtb.re_vonder_name,
          sale_vonder_id: this.editInfoBtb.sale_vonder_id,
          corporate_name: this.editInfoBtb.corporate_name,
          contact: this.editInfoBtb.contact,
          con_phone: this.editInfoBtb.con_phone,
          con_email: this.editInfoBtb.con_email
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
  @import "../../assets/css/supinfo.css";
</style>
