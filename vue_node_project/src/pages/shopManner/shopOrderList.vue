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
            v-model="queryInfo.sale_order_date"
            type="date"
            :editable = true
            value-format = "yyyy-MM-dd"
            placeholder="请选择日期">
          </el-date-picker>
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
            name="采购订单详情数据表.xls"
            >
            <el-button type="warning"><i class="el-icon-download"></i>导出</el-button>
            </download-excel>
        </template>
      </el-row>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="shopOrderListDetail"
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
        <el-table-column prop="item_number" label="供应商编号" width="260">
        </el-table-column>
        <el-table-column prop="sale_order_number" label="订单编号" width="260">
        </el-table-column>
        <el-table-column prop="number" label="数量(件)" width="260">
        </el-table-column>
        <el-table-column prop="price" label="单价(元)" width="260">
        </el-table-column>
        <el-table-column prop="sale_order_date" label="日期" width="260">
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
    <!-- 添加采购订单详情的模态框 -->
    <el-dialog title="新增采购订单详情"
        :visible.sync="addDialogVisible"
        width="30%"
        size="mini"
        @close="addDialogClosed">
      <el-form :model="addFormShopOrder" :rules="addShopOrderRules"
       ref="addShopOrderRef" label-width="100px">
        <el-form-item label="供应商编号" prop="item_number">
          <el-input v-model="addFormShopOrder.item_number" @change="typeCheck()"></el-input>
        </el-form-item>
        <el-form-item label="订单编号" prop="sale_order_number">
          <el-input v-model="addFormShopOrder.sale_order_number" @change="typeCheck()"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="addFormShopOrder.number"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="addFormShopOrder.price"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="sale_order_date">
          <el-date-picker
            v-model="addFormShopOrder.sale_order_date"
            type="datetime"
            :editable = true
            value-format = "yyyy-MM-dd HH:mm:ss"
            placeholder="请选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addShopOrderInfoDetail()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改采购爱订单详情数据 -->
    <el-dialog title="修改采购订单" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules"
       ref="editFormRef" label-width="100px">
        <el-form-item label="供应商编号">
          <el-input :disabled="true" v-model="editForm.item_number" @change="typeCheck()"></el-input>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input :disabled="true" v-model="editForm.sale_order_number" @change="typeCheck()"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="editForm.number"></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="日期">
        <el-date-picker
          v-model="editForm.sale_order_date"
          type="datetime"
          value-format = "yyyy-MM-dd HH:mm:ss"
          :editable = true
          placeholder="请选择日期时间">
        </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editShopOrderInfoDetail()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 外部按钮修改采购订单详情数据 -->
    <el-dialog title="修改采购订单" :visible.sync="updateDialogVisible" width="30%">
      <el-form :model="editInfoBtb" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="供应商编号">
          <el-input :disabled="true" v-model="editInfoBtb.item_number" @change="typeCheck()"></el-input>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input :disabled="true" v-model="editInfoBtb.sale_order_number" @change="typeCheck()"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="editInfoBtb.number"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="editInfoBtb.price"></el-input>
        </el-form-item>
        <el-form-item label="下单日期">
        <el-date-picker
          v-model="editInfoBtb.sale_order_date"
          type="datetime"
          :editable = true
          value-format = "yyyy-MM-dd HH:mm:ss"
          placeholder="请选择日期">
        </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateShopInfoDetail()">确 定</el-button>
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
      shopOrderListDetail: [],
      queryInfo: { // 查询条件
        sale_order_number: '',
        sale_order_date: ''
      },
      // 模态框
      addDialogVisible: false,
      // 添加采购订单
      addFormShopOrder: {
        item_number: '',
        sale_order_number: '',
        number: '',
        price: '',
        sale_order_date: ''
      },
      // 前端校验规则配置
      addShopOrderRules: {
        item_number: [{required: true, message: '请输入商品编号', trigger: 'blur'}],
        sale_order_number: [{required: true, message: '请输入订单编号', trigger: 'blur'}],
        number: [{equired: true, message: '请输入订单数', trigger: 'blur'}],
        price: [{required: true, message: '请输入订单价格', trigger: 'blur'}],
        sale_order_date: [{required: true, message: '请选择交货日期', trigger: 'blur'}]
      },
      // 修改
      editDialogVisible: false,
      editForm: {}, // 修改表单
      editFormRules: {},
      // 表单数据导出到excel文件
      title: '采购订单信息表格',
      json_fields: {
        '采购订单ID': 'id',
        '供应商编号': 'item_number',
        '订单编号': 'sale_order_number',
        '数量': 'number',
        '单价': 'price',
        '日期': 'sale_order_date'
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
    this.addShopOrderInfoDetail()
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
      const {data: res} = await this.$http.post('/shopOrderDetailSearch', this.queryInfo)
      this.shopOrderListDetail = res.data
      if (res.code !== 200) {
        this.$message.error('查询失败!!!')
      }
      if (this.queryInfo.sale_order_number || this.queryInfo.sale_delivery_date) {
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
      axios.post('/getShopOrderDetailPage', {
        page: this.pageNo,
        pageSize: this.pageCount
      }).then(res => {
        this.shopOrderListDetail = res.data.data
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
      axios.get('/getShopOrderDetailData').then(res => {
        this.tableData = res.data.data
        console.log(this.tableData)
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
    addShopOrderInfoDetail () {
      this.$refs.addShopOrderRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('/addShopOrderDetail/', this.addFormShopOrder)
        if (res.status !== 0) {
          this.$message.error('添加数据失败!')
        }

        this.$message.success('添加数据成功!')
        this.getData()
        this.addDialogVisible = false
      })
    },
    // 表单重置
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 获取采购单数据(修改)
    async showEditDialog (id) {
      const {data: res} = await this.$http.get('/getShopOrderDetailById/' + id)
      if (res.status !== 0) {
        this.$message.error('查询数据失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改采购单数据
    async editShopOrderInfoDetail () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateShopOrderDetailById/' + this.editForm.id, {
          Id: this.editForm.id,
          item_number: this.editForm.item_number,
          sale_order_number: this.editForm.sale_order_number,
          number: this.editForm.number,
          price: this.editForm.price,
          sale_order_date: this.editForm.sale_order_date
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
      const {data: res} = await this.$http.get('/deleteShopOrderDetailById/' + id)

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
        const {data: res} = await this.$http.get('/deleteShopOrderDetailById/' + this.ids)
        console.log(this.checkedData)
        if (res.status !== 0) {
          this.$message.error('删除失败!')
        }
        this.$message.success('删除成功!')
        const shopOrderListDetail = this.shopOrderListDetail
        const checkedData = this.checkedData
        this.shopOrderListDetail = shopOrderListDetail.filter((item) => {
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
        const {data: res} = await this.$http.get('/getShopOrderDetailById/' + this.ids)
        if (res.status !== 0) {
          this.$message.error('查询数据失败!')
        }
        this.editInfoBtb = res.data
        this.updateDialogVisible = true
      }
    },
    // 按钮修改 id 获取数据
    async updateShopInfoDetail () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateShopOrderDetailById/' + this.editInfoBtb.id, {
          Id: this.editInfoBtb.id,
          item_number: this.editInfoBtb.item_number,
          sale_order_number: this.editInfoBtb.sale_order_number,
          number: this.editInfoBtb.number,
          price: this.editInfoBtb.price,
          sale_order_date: this.editInfoBtb.sale_order_date
        })
        if (res.status !== 0) {
          this.$message.error('修改失败!')
        }

        this.$message.success('修改成功!')
        this.getData() // 更新列表数据
        this.updateDialogVisible = false
      })
    },
    // 前端验证输入的数不能有重复值
    typeCheck (v) {
      try {
        this.tableData.forEach(item => {
          if (item.item_number === v) {
            throw new Error('item-number-error')
          } else if (item.sale_order_number === v) {
            throw new Error('sale-order-number-error')
          }
        })
        return true
      } catch (e) {
        if (e.message === 'item-number-error') {
          this.$message({
            message: '供应商编号已存在!',
            type: 'warning'
          })
          return false
        } else if (e.message === 'sale-order-number-error') {
          this.$message({
            message: '订单编号已存在!',
            type: 'warning'
          })
          return false
        }
      }
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/supinfo.css";
</style>
