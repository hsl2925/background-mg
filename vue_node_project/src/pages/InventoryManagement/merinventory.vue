<template>
<!-- 商品库存 -->
  <div class="main_index">
    <!-- 搜索 -->
    <el-card>
      <router-view />
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="queryInfo.product_name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-input v-model="queryInfo.product_type" placeholder="请输入商品类型"></el-input>
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
            name="商品库存数据表.xls"
            >
            <el-button type="warning"><i class="el-icon-download"></i>导出</el-button>
            </download-excel>
        </template>
      </el-row>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="merinventoryList"
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
        <el-table-column prop="item_number" label="商品编号" width="260">
        </el-table-column>
        <el-table-column prop="product_name" label="商品名称" width="230">
        </el-table-column>
        <el-table-column prop="product_price" label="商品价格" width="260">
        </el-table-column>
        <el-table-column prop="product_type" label="商品类型" width="220">
        </el-table-column>
        <el-table-column prop="inventory_number" label="库存数量" width="230">
        </el-table-column>
        <el-table-column prop="shelf_date" label="商品上架时间" width="210">
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
    <!-- 添加商品库存的模态框 -->
    <el-dialog title="新增商品"
        :visible.sync="addDialogVisible"
        width="30%"
        size="mini"
        @close="addDialogClosed">
      <el-form :model="addFormMerinventory" :rules="addMerinventoryRules"
       ref="addMerinventoryRef" label-width="100px">
        <el-form-item label="商品编号" prop="item_number">
          <el-input v-model="addFormMerinventory.item_number"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="product_name">
          <el-input v-model="addFormMerinventory.product_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="product_price">
          <el-input v-model="addFormMerinventory.product_price"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="product_type">
          <el-input v-model="addFormMerinventory.product_type"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="inventory_number">
          <el-input v-model="addFormMerinventory.inventory_number"></el-input>
        </el-form-item>
        <el-form-item label="商品上架时间" prop="shelf_date">
          <el-date-picker
            v-model="addFormMerinventory.shelf_date"
            type="date"
            :editable = true
            value-format = "yyyy-MM-dd"
            placeholder="请选择商品上架时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMerinventory()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改供应商数据 -->
    <el-dialog title="修改供应商" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules"
       ref="editFormRef" label-width="100px">
        <el-form-item label="商品编号">
          <el-input v-model="editForm.item_number"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="editForm.product_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="editForm.product_price"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-input v-model="editForm.product_type"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="inventory_number">
          <el-input v-model="editForm.inventory_number"></el-input>
        </el-form-item>
        <el-form-item label="商品上架时间" prop="shelf_date">
          <el-date-picker
            v-model="editForm.shelf_date"
            type="date"
            :editable = true
            value-format = "yyyy-MM-dd"
            placeholder="请选择商品上架时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMerinventoryInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 外部按钮修改供应商数据 -->
    <el-dialog title="修改供应商" :visible.sync="updateDialogVisible" width="30%">
      <el-form :model="editInfoBtb" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品编号">
          <el-input v-model="editInfoBtb.item_number"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="editInfoBtb.product_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="editInfoBtb.product_price"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-input v-model="editInfoBtb.product_type"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="inventory_number">
          <el-input v-model="editInfoBtb.inventory_number"></el-input>
        </el-form-item>
        <el-form-item label="商品上架时间" prop="shelf_date">
          <el-date-picker
            v-model="editInfoBtb.shelf_date"
            type="date"
            :editable = true
            value-format = "yyyy-MM-dd"
            placeholder="请选择商品上架时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMerinventoryInfo()">确 定</el-button>
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
      merinventoryList: [],
      queryInfo: { // 查询条件
        product_name: '',
        product_type: ''
      },
      // 模态框是否关闭
      addDialogVisible: false,
      // 添加商品库存表单
      addFormMerinventory: {
        item_number: '',
        product_name: '',
        product_price: '',
        product_type: '',
        inventory_number: '',
        shelf_date: ''
      },
      // 添加 表单验证
      addMerinventoryRules: {
        item_number: [{required: true, message: '请输入商品编号', trigger: 'blur'}],
        product_name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        product_price: [{required: true, message: '请输入商品价格', trigger: 'blur'}],
        product_type: [{required: true, message: '请输入商品类型', trigger: 'blur'}],
        inventory_number: [{required: true, message: '请输入商品库存数量', trigger: 'blur'}]
      },
      // 修改 表单验证
      editDialogVisible: false,
      editForm: {}, // 修改商品库存表单
      editFormRules: {
        item_number: [{required: true, message: '请输入商品编号', trigger: 'blur'}],
        product_name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        product_price: [{required: true, message: '请输入商品价格', trigger: 'blur'}],
        product_type: [{required: true, message: '请输入商品类型', trigger: 'blur'}],
        inventory_number: [{required: true, message: '请输入商品库存数量', trigger: 'blur'}]
      },
      // 表单数据导出到excel文件
      title: '商品库存数据表格',
      json_fields: {
        '库存ID': 'id',
        '库存编号': 'item_number',
        '商品名称': 'product_name',
        '商品价格': 'product_price',
        '商品类型': 'product_type',
        '商品库存量': 'inventory_number',
        '日期': 'shelf_date'
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
    this.addMerinventory()
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
      const {data: res} = await this.$http.post('/merinventorySearch', this.queryInfo)
      this.merinventoryList = res.data
      if (res.code !== 200) {
        this.$message.error('查询失败!!!')
      }
      if (this.queryInfo.product_name || this.queryInfo.product_type === '') {
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
      axios.post('/getMerinventoryPage', {
        page: this.pageNo,
        pageSize: this.pageCount
      }).then(res => {
        this.merinventoryList = res.data.data
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
      axios.get('/getMerinventoryData').then(res => {
        this.tableData = res.data.data
        this.totalPage = Math.ceil(this.tableData.length)
      }).catch(error => {
        console.log(error)
      })
    },
    // 表单重置
    addDialogClosed () {
      this.$refs.addMerinventoryRef.resetFields()
    },
    // 新增商品库存接口请求
    addMerinventory () {
      this.$refs.addMerinventoryRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('/addMerinventoryInfo/', this.addFormMerinventory)
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
    // 获取商品库存数据
    async showEditDialog (id) {
      const {data: res} = await this.$http.get('/getMerinventoryInfoById/' + id)
      if (res.status !== 0) {
        this.$message.error('查询数据失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改商品库存数据
    async editMerinventoryInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateMerinventoryInfoById/' + this.editForm.id, {
          Id: this.editForm.id,
          item_number: this.editForm.item_number,
          product_name: this.editForm.product_name,
          product_price: this.editForm.product_price,
          product_type: this.editForm.product_type,
          inventory_number: this.editForm.inventory_number,
          shelf_date: this.editForm.shelf_date
        })
        if (res.status !== 0) {
          this.$message.error('修改失败!')
        }
        this.editDialogVisible = false
        this.getData() // 更新列表数据
        this.$message.success('修改成功!')
      })
    },
    // 删除商品库存数据
    async deleteFormInfo (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除成功!')
      }
      const {data: res} = await this.$http.get('/deleteMerinventoryInfoById/' + id)

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
        const {data: res} = await this.$http.get('/deleteMerinventoryInfoById/' + this.ids)
        console.log(this.checkedData)
        if (res.status !== 0) {
          this.$message.error('删除失败!')
        }
        this.$message.success('删除成功!')
        const merinventoryList = this.merinventoryList
        const checkedData = this.checkedData
        this.merinventoryList = merinventoryList.filter((item) => {
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
        const {data: res} = await this.$http.get('/getMerinventoryInfoById/' + this.ids)
        if (res.status !== 0) {
          this.$message.error('查询数据失败!')
        }
        this.editInfoBtb = res.data
        this.updateDialogVisible = true
      }
    },
    // 按钮修改 id 获取数据
    async updateMerinventoryInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单预验证
        const {data: res} = await this.$http.post('/updateMerinventoryInfoById/' + this.editInfoBtb.id, {
          Id: this.editInfoBtb.id,
          item_number: this.editInfoBtb.item_number,
          product_name: this.editInfoBtb.product_name,
          product_price: this.editInfoBtb.product_price,
          product_type: this.editInfoBtb.product_type,
          inventory_number: this.editInfoBtb.inventory_number,
          shelf_date: this.editInfoBtb.shelf_date
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
