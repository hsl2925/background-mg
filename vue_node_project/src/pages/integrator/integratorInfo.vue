<template>
  <div class="main_index">
    <!-- 搜索 -->
    <el-card>
      <router-view />
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="queryInfo.average_score" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="上架时间">
          <el-date-picker
            v-model="queryInfo.start_item_time"
            type="date"
            :editable = true
            value-format = "yyyy-MM-dd"
            placeholder="请选择商品上架时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="queryInfo.unit" placeholder="请输入商品数量"></el-input>
        </el-form-item>
        <el-form-item label="商品库存量">
          <el-input v-model="queryInfo.inventory" placeholder="请输入商品库存量"></el-input>
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
              name="商品信息表.xls">
            <el-button type="warning"><i class="el-icon-download"></i>导出</el-button>
            </download-excel>
        </template>
      </el-row>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="storelist"
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
        <el-table-column prop="item_number" label="商品编号" width="200">
        </el-table-column>
        <el-table-column prop="average_score" label="商品名称" width="200">
        </el-table-column>
        <el-table-column prop="start_item_time" label="商品上架时间" width="230">
        </el-table-column>
        <el-table-column prop="online" label="是否上架" width="200">
        </el-table-column>
        <el-table-column prop="imgBanner" label="商品图片" width="200">
        </el-table-column>
        <el-table-column prop="unit" label="商品数量" width="200">
        </el-table-column>
        <el-table-column prop="inventory" label="商品库存量" width="200">
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
    <!-- 添加商品信息的模态框 -->
    <el-dialog title="新增商品"
        :visible.sync="addDialogVisible"
        width="30%"
        size="mini"
        @close="addDialogClosed">
      <el-form :model="addCommodity" :rules="addStoreRules"
       ref="addStoreRef" label-width="100px">
        <el-form-item label="商品编号" prop="item_number">
          <el-input v-model="addCommodity.item_number"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="average_score">
          <el-input v-model="addCommodity.average_score"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="commodity_salary">
          <el-input v-model="addCommodity.commodity_salary"></el-input>
        </el-form-item>
        <el-form-item label="商品上架时间" prop="start_item_time">
          <el-input v-model="addCommodity.start_item_time"></el-input>
        </el-form-item>
        <el-form-item label="是否促销" prop="promotion">
          <el-radio-group v-model="addCommodity.promotion">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" prop="online">
          <el-radio-group v-model="addCommodity.online">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品好评率" prop="good">
          <el-input v-model="addCommodity.good"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgBanner">
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:9093/api/uploadImage"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-success="uploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品数量" prop="unit">
          <el-input v-model="addCommodity.unit"></el-input>
        </el-form-item>
        <el-form-item label="商品库存量" prop="inventory">
          <el-input v-model="addCommodity.inventory"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCommodityInfos()">确 定</el-button>
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
          <el-input v-model="editForm.average_score"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="editForm.commodity_salary"></el-input>
        </el-form-item>
        <el-form-item label="商品上架时间">
          <el-input v-model="editForm.start_item_time"></el-input>
        </el-form-item>
        <el-form-item label="是否促销" prop="promotion">
          <el-radio-group v-model="addCommodity.promotion">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" prop="online">
          <el-radio-group v-model="addCommodity.online">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品好评率">
          <el-input v-model="editForm.good"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="editForm.image_url"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="unit">
          <el-input v-model="editForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="商品库存量" prop="inventory">
          <el-input v-model="editForm.inventory"></el-input>
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
        <el-form-item label="商品编号">
          <el-input v-model="editInfoBtb.item_number"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="editInfoBtb.average_score"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="editInfoBtb.commodity_salary"></el-input>
        </el-form-item>
        <el-form-item label="商品上架时间">
          <el-input v-model="editInfoBtb.start_item_time"></el-input>
        </el-form-item>
        <el-form-item label="是否促销" prop="promotion">
          <el-radio-group v-model="editInfoBtb.promotion">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" prop="online">
          <el-radio-group v-model="editInfoBtb.online">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品好评率">
          <el-input v-model="editInfoBtb.good"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="editInfoBtb.image_url"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="unit">
          <el-input v-model="editInfoBtb.unit"></el-input>
        </el-form-item>
        <el-form-item label="商品库存量" prop="inventory">
          <el-input v-model="editInfoBtb.inventory"></el-input>
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
import Upload from '../../commons/upload.vue'

export default {
  components: {
    Bread,
    Upload
  },
  data () {
    return {
      tableData: [], // 当前页码表格数据
      pageNo: 1, // 表格页码
      pageCount: 10, // 数据数
      currentNo: 1, // 当前页码
      allData: [], // 全部数据
      totalPage: 1, // 总页码
      storelist: [],
      queryInfo: { // 查询条件
        average_score: '',
        start_item_time: '',
        unit: '',
        inventory: ''
      },
      // 模态框
      addDialogVisible: false,
      // 添加商品信息表单
      addCommodity: {
        item_number: '',
        average_score: '',
        commodity_salary: '',
        start_item_time: '',
        promotion: '',
        online: '',
        good: '',
        // imgBanner: '',
        // img: [],
        image_url: '',
        unit: '',
        inventory: ''
      },
      // 表单预验证
      addStoreRules: {
        item_number: [{required: true, message: '请输入商品编号', trigger: 'blur'}],
        average_score: [{required: true, message: '请输入商品名称'}],
        commodity_salary: [{required: true, message: '请输入商品价格'}],
        start_item_time: [{required: true, message: '请输入商品上架时间'}],
        unit: [{required: true, message: '请输入商品数量', trigger: 'blur'}],
        inventory: [{required: true, message: '请输入商品库存', trigger: 'blur'}]
      },
      // 修改
      editDialogVisible: false,
      editForm: {}, // 修改表单
      editFormRules: { // 表单验证
        item_number: [{required: true, message: '请输入商品编号', trigger: 'blur'}],
        average_score: [{required: true, message: '请输入商品名称'}],
        commodity_salary: [{required: true, message: '请输入商品价格'}],
        start_item_time: [{required: true, message: '请输入商品上架时间'}],
        unit: [{required: true, message: '请输入商品数量', trigger: 'blur'}],
        inventory: [{required: true, message: '请输入商品库存', trigger: 'blur'}]
      },
      // 表单数据导出到excel文件
      title: '商品信息表格',
      json_fields: {
        '商品ID': 'id',
        '商品编号': 'item_number',
        '商品名称': 'average_score',
        '商品价格': 'commodity_salary',
        '商品上架时间': 'start_item_time',
        '是否促销': 'promotion',
        '是否上架': 'online',
        '商品好评率': 'good',
        '商品图片': 'image_url',
        '商品数量': 'unit',
        '商品库存量': 'inventory'
      },
      // radio选中数据
      checkedData: [],
      ids: [], // 获取单选的行数据
      updateDialogVisible: false,
      editInfoBtb: {}, // 外部按钮修改表单
      fileList: []
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
    this.addCommodityInfos()
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
    // 文件上传
    uploadSuccess (res, file) {
      if (res.data.name === 'banner.jpg') {
        this.addCommodity.imgBanner = res.data.path
      } else {
        this.addCommodity.img.push(res.data.path)
      }
    },
    // 删除图片
    handleRemove (file, fileList) {
      console.log(file, fileList, '1111111')
      if (file.name === 'banner.jpg') {
        this.form.imgBanner = ''
      } else {
        // Array.prototype.contains = (obj) => {
        //   var i = this.length
        //   while (i--) {
        //     if (this[i] === obj) {
        //       return i
        //     }
        //   }
        //   return false
        // }
        const path = file.response.data.path
        this.form.img.splice(this.form.img.contains(path), 1)
      }
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 搜索
    async getList (index) {
      this.pageNo = index || this.pageNo
      const {data: res} = await this.$http.post('/commoditySearch', this.queryInfo)
      this.storelist = res.data
      if (res.code !== 200) {
        this.$message.error('查询失败!!!')
      }
      if (this.queryInfo.average_score || this.queryInfo.start_item_time || this.queryInfo.unit === '' || this.queryInfo.inventory === '') {
        return 1
      }
    },
    // 搜索
    onSearch () {
      this.getList()
      console.log(this.queryInfo, '000')
    },
    // 重置
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
      axios.post('/getCommodityPage', {
        page: this.pageNo,
        pageSize: this.pageCount
      }).then(res => {
        this.storelist = res.data.data
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
      axios.get('/getCommodityData').then(res => {
        this.tableData = res.data.data
        this.totalPage = Math.ceil(this.tableData.length)
      }).catch(error => {
        console.log(error)
      })
    },
    // 表单重置
    addDialogClosed () {
      this.$refs.addSoreRef.resetFields()
    },
    // 新增
    addCommodityInfos () {
      this.$refs.addStoreRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('/addCommodityInfo/', this.addCommodity)
        if (res.status !== 0) {
          this.$message.error('添加数据失败!')
        }
        this.$message.success('添加数据成功!')
        this.getData()
        // this.storelist() // 更新列表数据
        this.addDialogVisible = false
      })
    },
    // 表单重置
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 获取供应商数据
    async showEditDialog (id) {
      const {data: res} = await this.$http.get('/getCommodityById/' + id)
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
        const {data: res} = await this.$http.post('/updateCommodityById/' + this.editForm.id, {
          Id: this.editForm.id,
          item_number: this.editForm.item_number,
          average_score: this.editForm.average_score,
          commodity_salary: this.editForm.commodity_salary,
          start_item_time: this.editForm.start_item_time,
          promotion: this.editForm.promotion,
          online: this.editForm.online,
          good: this.editForm.good,
          image_url: this.editForm.image_url,
          unit: this.editForm.unit,
          inventory: this.editForm.inventory

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
      const {data: res} = await this.$http.get('/deleteCommodityById/' + id)

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
        const {data: res} = await this.$http.get('/deleteCommodityById/' + this.ids)
        console.log(this.checkedData)
        if (res.status !== 0) {
          this.$message.error('删除失败!')
        }
        this.$message.success('删除成功!')
        const storelist = this.storelist
        const checkedData = this.checkedData
        this.storelist = storelist.filter((item) => {
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
        const {data: res} = await this.$http.get('/getCommodityById/' + this.ids)
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
        const {data: res} = await this.$http.post('/updateCommodityById/' + this.editInfoBtb.id, {
          Id: this.editInfoBtb.id,
          item_number: this.editInfoBtb.item_number,
          average_score: this.editInfoBtb.average_score,
          commodity_salary: this.editInfoBtb.commodity_salary,
          start_item_time: this.editInfoBtb.start_item_time,
          promotion: this.editInfoBtb.promotion,
          online: this.editInfoBtb.online,
          good: this.editInfoBtb.good,
          image_url: this.editInfoBtb.image_url,
          unit: this.editInfoBtb.unit,
          inventory: this.editInfoBtb.inventory
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
