<template>
  <!-- 商品出库记录 -->
  <div class="main_index">
    <!-- 搜索 -->
    <el-card>
      <router-view />
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef" class="demo-form-inline">
        <el-form-item label="商品编号">
          <el-input v-model="queryInfo.item_number" placeholder="请输入商品编号"></el-input>
        </el-form-item>
        <el-form-item label="出库单号">
          <el-input v-model="queryInfo.del_note_number" placeholder="请输入入库单号"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="queryInfo.del_note_person" placeholder="请输入负责人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset('queryInfoRef')">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <el-row>
        <el-button type="primary" @click="addDialogVisible = true"><i class="el-icon-plus"></i>新增</el-button>
        <el-button type="success" @click="showUpdateFromData()" disabled><i class="el-icon-edit"></i>修改</el-button>
        <el-button type="danger" @click="deleteFormData()"><i class="el-icon-delete"></i>删除</el-button>
        <template>
            <download-excel class="export-excel-wrapper"
            :data="tableData"
            :fields="json_fields"
            :header="title"
            name="入库记录.xls"
            >
            <el-button type="warning"><i class="el-icon-download"></i>导出</el-button>
            </download-excel>
        </template>
      </el-row>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="productList"
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
        <el-table-column prop="del_note_number" label="出库单号" width="230">
        </el-table-column>
        <el-table-column prop="del_note_date" label="出库日期" width="230">
        </el-table-column>
        <el-table-column prop="logistics_number" label="物流编号" width="230">
        </el-table-column>
        <el-table-column prop="del_note_person" label="负责人" width="180">
        </el-table-column>
        <el-table-column prop="item_number" label="商品编号" width="200">
        </el-table-column>
        <el-table-column prop="number" label="数量" width="180">
        </el-table-column>
        <el-table-column prop="price" label="单价" width="180">
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
    <!-- 添加数据 -->
    <el-dialog title="新增出库商品"
        :visible.sync="addDialogVisible"
        width="30%"
        size="mini"
        @close="addDialogClosed">
      <el-form :model="addFormProduct" :rules="addSupplierRules"
       ref="addSupplierRef" label-width="100px">
        <el-form-item label="出库单号" prop="del_note_number">
          <el-input v-model="addFormProduct.del_note_number"></el-input>
        </el-form-item>
        <el-form-item label="出库日期" prop="del_note_date">
          <el-date-picker
            v-model="addFormProduct.del_note_date"
            type="date"
            :editable = true
            value-format = "yyyy-MM-dd"
            placeholder="请选择出库日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="物流编号" prop="logistics_number">
          <el-input v-model="addFormProduct.logistics_number"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="del_note_person">
          <el-input v-model="addFormProduct.del_note_person"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="item_number">
          <el-input v-model="addFormProduct.item_number"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="addFormProduct.number"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="addFormProduct.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addInProduct()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改数据 -->
    <el-dialog title="修改出库记录" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules"
       ref="editFormRef" label-width="100px">
        <el-form-item label="出库单号">
          <el-input v-model="editForm.del_note_number"></el-input>
        </el-form-item>
        <el-form-item label="出库日期">
          <el-date-picker
            v-model="editForm.del_note_date"
            type="date"
            :editable = true
            value-format = "yyyy-MM-dd"
            placeholder="请选择出库日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="物流编号">
          <el-input v-model="editForm.logistics_number"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="editForm.del_note_person"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="item_number">
          <el-input v-model="editForm.item_number"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="editForm.number"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editProductInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 外部按钮修改出库数据 -->
    <el-dialog title="修改出库记录" :visible.sync="updateDialogVisible" width="30%">
      <el-form :model="editInfoBtb" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="出库单号">
          <el-input v-model="editInfoBtb.del_note_number"></el-input>
        </el-form-item>
        <el-form-item label="出库日期">
          <el-date-picker
            v-model="editInfoBtb.del_note_date"
            type="date"
            :editable = true
            value-format = "yyyy-MM-dd"
            placeholder="请选择出库日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="物流编号">
          <el-input v-model="editInfoBtb.logistics_number"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="editInfoBtb.del_note_person"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="item_number">
          <el-input v-model="editInfoBtb.item_number"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model="editInfoBtb.number"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="editInfoBtb.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateProductInfo()">确 定</el-button>
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
      productList: [],
      queryInfo: { // 查询条件
        item_number: '',
        del_note_number: '',
        del_note_person: ''
      },
      // 模态框
      addDialogVisible: false,
      // 添加出库表单
      addFormProduct: {
        del_note_number: '',
        del_note_date: '',
        logistics_number: '',
        del_note_person: '',
        item_number: '',
        number: '',
        price: ''
      },
      addSupplierRules: {
        del_note_number: [{required: true, message: '请输入出库单号', trigger: 'blur'}],
        logistics_number: [{required: true, message: '请输入物流编号'}],
        item_number: [{required: true, message: '请输入商品编号'}]
      },
      // 修改
      editDialogVisible: false,
      editForm: {}, // 修改表单
      editFormRules: { // 表单验证
        del_note_number: [{required: true, message: '请输入出库单号', trigger: 'blur'}],
        logistics_number: [{required: true, message: '请输入物流编号'}],
        item_number: [{required: true, message: '请输入商品编号'}]
      },
      // 表单数据导出到excel文件
      title: 'xx表格',
      json_fields: {
        '出库ID': 'id',
        '出库单号': 'del_note_number',
        '出库日期': 'del_note_date',
        '物流编号': 'logistics_number',
        '负责人': 'del_note_person',
        '商品编号': 'item_number',
        '数量': 'number',
        '单价': 'price'
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
    this.addInProduct()
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
      const {data: res} = await this.$http.post('/shipmentSearch', this.queryInfo)
      this.productList = res.data
      if (res.code !== 200) {
        this.$message.error('查询失败!!!')
      }
      if (this.queryInfo.item_number || this.queryInfo.del_note_number || this.queryInfo.del_note_person === '') {
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
      axios.post('/getShipmentPage', {
        page: this.pageNo,
        pageSize: this.pageCount
      }).then(res => {
        this.productList = res.data.data
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
      axios.get('/getShipment').then(res => {
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
    addInProduct () {
      this.$refs.addSupplierRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('/addShipmentInfo/', this.addFormProduct)
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
    // 获取供应商数据
    async showEditDialog (id) {
      const {data: res} = await this.$http.get('/getShipmentById/' + id)
      if (res.status !== 0) {
        this.$message.error('查询数据失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改数据
    editProductInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateShipmentById/' + this.editForm.id, {
          Id: this.editForm.id,
          del_note_number: this.editForm.del_note_number,
          del_note_date: this.editForm.del_note_date,
          logistics_number: this.editForm.logistics_number,
          del_note_person: this.editForm.del_note_person,
          item_number: this.editForm.item_number,
          number: this.editForm.number,
          price: this.editForm.price
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
      const {data: res} = await this.$http.get('/deleteShipmentById/' + id)

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
        const {data: res} = await this.$http.get('/deleteShipmentById/' + this.ids)
        console.log(this.checkedData)
        if (res.status !== 0) {
          this.$message.error('删除失败!')
        }
        this.$message.success('删除成功!')
        const productList = this.productList
        const checkedData = this.checkedData
        this.productList = productList.filter((item) => {
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
        const {data: res} = await this.$http.get('/getShipmentById/' + this.ids)
        if (res.status !== 0) {
          this.$message.error('查询数据失败!')
        }
        this.editInfoBtb = res.data
        this.updateDialogVisible = true
      }
    },
    // 按钮修改 id 获取数据
    async updateProductInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateShipmentById/' + this.editInfoBtb.id, {
          Id: this.editInfoBtb.id,
          del_note_number: this.editInfoBtb.del_note_number,
          del_note_date: this.editInfoBtb.del_note_date,
          logistics_number: this.editInfoBtb.logistics_number,
          del_note_person: this.editInfoBtb.del_note_person,
          item_number: this.editInfoBtb.item_number,
          number: this.editInfoBtb.number,
          price: this.editInfoBtb.price
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
