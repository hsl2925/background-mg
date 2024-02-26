<template>
  <div class="main_index">
    <!-- 搜索 -->
    <el-card>
      <router-view />
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef" class="demo-form-inline">
        <el-form-item label="订单编号">
          <el-input v-model="queryInfo.sale_order_number" placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="queryInfo.sale_delivery_date"
            type="date"
            :editable = true
            value-format = "yyyy-MM-dd"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="采购员">
          <el-input v-model="queryInfo.sale_purchaser" placeholder="请输入采购员"></el-input>
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
            name="采购订单数据表.xls">
            <el-button type="warning"><i class="el-icon-download"></i>导出</el-button>
            </download-excel>
        </template>
      </el-row>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="shopOrderList"
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
        <el-table-column prop="sale_order_number" label="订单编号" width="260">
        </el-table-column>
        <el-table-column prop="sale_goods_date" label="下单日期" width="260">
        </el-table-column>
        <el-table-column prop="sale_delivery_date" label="交货日期" width="260">
        </el-table-column>
        <el-table-column prop="sale_purchaser" label="采购员" width="260">
        </el-table-column>
        <el-table-column prop="sale_vonder_id" label="供应商编号" width="260">
        </el-table-column>
        <el-table-column class="editer" fixed="right" label="操作" width="230">
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
    <!-- 添加采购订单的模态框 -->
    <el-dialog title="新增采购订单"
        :visible.sync="addDialogVisible"
        width="30%"
        size="mini"
        @close="addDialogClosed">
      <el-form :model="addFormShopOrder" :rules="addShopOrderRules"
       ref="addShopOrderRef" label-width="100px">
        <el-form-item label="订单编号" prop="sale_order_number">
          <el-input v-model="addFormShopOrder.sale_order_number"  @change="typeCheck()"></el-input>
        </el-form-item>
        <el-form-item label="下单日期" prop="sale_goods_date">
          <el-date-picker
            v-model="addFormShopOrder.sale_goods_date"
            type="datetime"
            :editable = true
            value-format = "yyyy-MM-dd HH:mm:ss"
            placeholder="请选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交货日期" prop="sale_delivery_date">
          <el-date-picker
            v-model="addFormShopOrder.sale_delivery_date"
            type="datetime"
            :editable = true
            value-format = "yyyy-MM-dd HH:mm:ss"
            placeholder="请选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="采购员" prop="sale_purchaser">
          <el-input v-model="addFormShopOrder.sale_purchaser"></el-input>
        </el-form-item>
        <el-form-item label="供应商编号" prop="sale_vonder_id">
          <el-input v-model="addFormShopOrder.sale_vonder_id" @change="typeCheck()"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addShopOrder()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改采购订单数据 -->
    <el-dialog title="修改采购订单" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules"
       ref="editFormRef" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="editForm.sale_order_number" @change="typeCheck()"></el-input>
        </el-form-item>
        <el-form-item label="下单日期">
        <el-date-picker
          v-model="editForm.sale_goods_date"
          type="datetime"
          value-format = "yyyy-MM-dd HH:mm:ss"
          :editable = true
          placeholder="请选择日期时间">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="交货日期">
        <el-date-picker
          v-model="editForm.sale_delivery_date"
          type="datetime"
          :editable = true
          value-format = "yyyy-MM-dd HH:mm:ss"
          placeholder="请选择日期时间">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="采购员">
          <el-input v-model="editForm.sale_purchaser"></el-input>
        </el-form-item>
        <el-form-item label="供应商编号" prop="sale_vonder_id">
          <el-input v-model="editForm.sale_vonder_id"  @change="typeCheck()"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editShopOrderInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 外部按钮修改采购订单数据 -->
    <el-dialog title="修改采购订单" :visible.sync="updateDialogVisible" width="30%">
      <el-form :model="editInfoBtb" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="editInfoBtb.sale_order_number" @change="typeCheck()"></el-input>
        </el-form-item>
        <el-form-item label="下单日期">
        <el-date-picker
          v-model="editInfoBtb.sale_goods_date"
          type="datetime"
          :editable = true
          value-format = "yyyy-MM-dd HH:mm:ss"
          placeholder="请选择日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="交货日期">
        <el-date-picker
          v-model="editInfoBtb.sale_delivery_date"
          type="datetime"
          value-format = "yyyy-MM-dd HH:mm:ss"
          :editable = true
          placeholder="请选择日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="采购员" prop="sale_purchaser">
          <el-input v-model="editInfoBtb.sale_purchaser"></el-input>
        </el-form-item>
        <el-form-item label="供应商编号" prop="sale_vonder_id" >
          <el-input v-model="editInfoBtb.sale_vonder_id" @change="typeCheck()"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateShopOrderInfo()">确 定</el-button>
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
    return {
      tableData: [], // 当前页码表格数据
      pageNo: 1, // 表格页码
      pageCount: 10, // 数据数
      currentNo: 1, // 当前页码
      allData: [], // 全部数据
      totalPage: 1, // 总页码
      shopOrderList: [],
      queryInfo: { // 查询条件
        sale_order_number: '',
        sale_delivery_date: '',
        sale_purchaser: ''
      },
      // 模态框
      addDialogVisible: false,
      // 添加采购订单
      addFormShopOrder: {
        sale_order_number: '',
        sale_goods_date: '',
        sale_delivery_date: '',
        sale_purchaser: '',
        sale_vonder_id: ''
      },
      // 前端校验规则配置
      addShopOrderRules: {
        sale_order_number: [{required: true, message: '请输入订单编号', trigger: 'blur'}],
        sale_goods_date: [{required: true, message: '请选择下单日期'}],
        sale_delivery_date: [{required: true, message: '请选择交货日期'}],
        sale_purchaser: [{required: true, message: '请输入采购人姓名'}]
      },
      // 修改
      editDialogVisible: false,
      editForm: {}, // 修改表单
      editFormRules: { // 表单验证
        sale_order_number: [{required: true, message: '请输入订单编号', trigger: 'blur'}],
        sale_goods_date: [{required: true, message: '请选择下单日期'}],
        sale_delivery_date: [{required: true, message: '请选择交货日期'}],
        sale_purchaser: [{required: true, message: '请输入采购人姓名'}]
      },
      // 表单数据导出到excel文件
      title: '采购订单信息表格',
      json_fields: {
        '采购订单ID': 'id',
        '订单编号': 'sale_order_number',
        '下单日期': 'sale_goods_date',
        '交货日期': 'sale_delivery_date',
        '采购员': 'sale_purchaser',
        '供应商编号': 'sale_vonder_id'
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
    this.addShopOrder()
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
    // 前端验证输入的数不能有重复值
    typeCheck (v) {
      try {
        this.tableData.forEach(item => {
          if (item.sale_order_number === v) {
            throw new Error('sale-order-number-error')
          } else if (item.sale_vonder_id === v) {
            throw new Error('sale-order-number-error')
          }
        })
        return true
      } catch (e) {
        if (e.message === 'type-check-error') {
          this.$message({
            message: '订单编号已存在!',
            type: 'warning'
          })
          return false
        } else if (e.message === 'sale-vonder-id-error') {
          this.$message({
            message: '供应商编号已存在!',
            type: 'warning'
          })
          return false
        }
      }
    },
    // 搜索
    async getList (index) {
      this.pageNo = index || this.pageNo
      const {data: res} = await this.$http.post('/shopOrderInfoSearch', this.queryInfo)
      this.shopOrderList = res.data
      if (res.code !== 200) {
        this.$message.error('查询失败!!!')
      }
      if (this.queryInfo.sale_order_number || this.queryInfo.sale_delivery_date || this.queryInfo.sale_purchaser === '') {
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
      axios.post('/getShopOrderInfoPage', {
        page: this.pageNo,
        pageSize: this.pageCount
      }).then(res => {
        this.shopOrderList = res.data.data
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
      axios.get('/getShopOrderInfoData').then(res => {
        this.tableData = res.data.data
        this.totalPage = Math.ceil(this.tableData.length)
      }).catch(error => {
        console.log(error)
      })
    },
    // 表单重置
    addDialogClosed () {
      this.$refs.addShopOrderRef.resetFields()
    },
    // 新增采购单
    addShopOrder () {
      this.$refs.addShopOrderRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('/addShopOrderInfo/', this.addFormShopOrder)
        if (res.status !== 0) {
          this.$message.error('添加数据失败!')
        }

        this.$message.success('添加数据成功!')
        this.getData()
        // this.shoporderlist() // 更新列表数据
        this.addDialogVisible = false
      })
    },
    // 表单重置
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 获取采购单数据(修改)
    async showEditDialog (id) {
      const {data: res} = await this.$http.get('/getShopOrderInfoById/' + id)
      if (res.status !== 0) {
        this.$message.error('查询数据失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改采购单数据
    async editShopOrderInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateShopOrderInfoById/' + this.editForm.id, {
          Id: this.editForm.id,
          sale_order_number: this.editForm.sale_order_number,
          sale_goods_date: this.editForm.sale_goods_date,
          sale_delivery_date: this.editForm.sale_delivery_date,
          sale_purchaser: this.editForm.sale_purchaser,
          sale_vonder_id: this.editForm.sale_vonder_id
        })
        if (res.status !== 0) {
          this.$message.error('修改失败!')
        }

        this.getData() // 更新列表数据
        this.$message.success('修改成功!')
        this.editDialogVisible = false
      })
    },
    // 删除采购单数据
    async deleteFormInfo (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除成功!')
      }
      const {data: res} = await this.$http.get('/deleteShopOrderInfoById/' + id)

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
        const {data: res} = await this.$http.get('/deleteShopOrderInfoById/' + this.ids)
        console.log(this.checkedData)
        if (res.status !== 0) {
          this.$message.error('删除失败!')
        }
        this.$message.success('删除成功!')
        const shopOrderList = this.shopOrderList
        const checkedData = this.checkedData
        this.shopOrderList = shopOrderList.filter((item) => {
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
        const {data: res} = await this.$http.get('/getShopOrderInfoById/' + this.ids)
        if (res.status !== 0) {
          this.$message.error('查询数据失败!')
        }
        this.editInfoBtb = res.data
        this.updateDialogVisible = true
      }
    },
    // 按钮修改 id 获取数据
    async updateShopOrderInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateShopOrderInfoById/' + this.editInfoBtb.id, {
          Id: this.editInfoBtb.id,
          sale_order_number: this.editInfoBtb.sale_order_number,
          sale_goods_date: this.editInfoBtb.sale_goods_date,
          sale_delivery_date: this.editInfoBtb.sale_delivery_date,
          sale_purchaser: this.editInfoBtb.sale_purchaser,
          sale_vonder_id: this.editInfoBtb.sale_vonder_id
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
