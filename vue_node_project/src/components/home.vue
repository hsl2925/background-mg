<template>
  <div>
    <!-- header -->
    <div class="header_info">
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <div>
              <el-statistic group-separator="," :value="value1" :title="title1"></el-statistic>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <div>
              <el-statistic group-separator="," :value="value2" :title="title2"></el-statistic>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <div>
              <el-statistic group-separator="," :value="value3" :title="title3"></el-statistic>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <div>
              <el-statistic group-separator="," :value="value4" :title="title4"></el-statistic>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <!-- bodylist -->
    <el-container>
      <el-aside width="660px">
        <el-card>
          <el-table
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%"
            max-height="652">
            <el-table-column
              property="name"
              label="商品名称"
              width="160">
            </el-table-column>
            <el-table-column
              property="number"
              label="销售数量(件)"
              width="130">
            </el-table-column>
            <el-table-column
              property="revenue"
              label="销售额(元)"
              width="160">
            </el-table-column>
            <el-table-column
              property="date"
              label="日期"
              width="160">
            </el-table-column>
          </el-table>
        </el-card>
      </el-aside>
      <el-main>
        <!-- 轮播图 -->
        <div class="swiper">
          <el-card>
            <div>商品轮播图</div>
            <el-carousel :interval="4000" type="card" height="236px">
              <el-carousel-item v-for="(item, index) in imgList" :key="index">
                <!-- <h3 class="medium">{{ item }}</h3> -->
                <img class="medium" :src="item" alt="">
              </el-carousel-item>
            </el-carousel>
          </el-card>
        </div>
        <!-- 柱形图、 饼图 -->
        <div class="echarts_info">
          <div class="main">
            <el-card>
              <div id="main" style="width: 510px; height:300px;"></div>
            </el-card>
          </div>
          <div class="bar">
            <el-card>
              <div id="pie" style="width: 530px; height:300px;"></div>
            </el-card>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        {
          date: '2023-06-12',
          name: '牛奶',
          number: '126',
          revenue: 701.3
        },
        {
          date: '2023-06-13',
          name: '青菜',
          number: '1002',
          revenue: 306.82
        },
        {
          date: '2023-06-12',
          name: '海鲜',
          number: '89',
          revenue: 1366.02
        },
        {
          date: '2023-06-12',
          name: '豆类22',
          number: '63',
          revenue: 125.33
        },
        {
          date: '2023-06-19',
          name: '榴莲',
          number: '31',
          revenue: 398.36
        },
        {
          date: '2023-06-12',
          name: '青菜',
          number: '1002',
          revenue: 725.36
        },
        {
          date: '2023-06-12',
          name: '打折',
          number: '701',
          revenue: 236.3
        },
        {
          date: '2023-06-12',
          name: '水果',
          number: '163',
          revenue: 1301.32
        },
        {
          date: '2023-06-20',
          name: '饮料',
          number: '301',
          revenue: 367
        },
        {
          date: '2023-06-12',
          name: '零食',
          number: '309',
          revenue: 1330.01
        },
        {
          date: '2023-06-03',
          name: '猪肉',
          number: '1023',
          revenue: 1330.01
        },
        {
          date: '2023-06-12',
          name: '牛肉',
          number: '102',
          revenue: 405.23
        },
        {
          date: '2023-06-11',
          name: '鱼类',
          number: '203',
          revenue: 255.9
        }
      ],
      value1: 331,
      title1: '当日收货(件)',
      value2: 608,
      title2: '当日出货(件)',
      value3: 402,
      title3: '当日销售(件)',
      value4: 360,
      title4: '打折商品(件)',
      imgList: [
        require('../assets/images/supinfo/images1.png'),
        require('../assets/images/supinfo/images2.jpg'),
        require('../assets/images/supinfo/images3.jpg'),
        require('../assets/images/supinfo/images4.jpg'),
        require('../assets/images/supinfo/images5.jpg'),
        require('../assets/images/supinfo/images6.jpg')
      ]
    }
  },

  mounted () {
    this.bar()
    this.pie()
    this.line()
  },
  methods: {
    handleCurrentChange () {},
    // 柱形图
    bar () {
      // 初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '商品销售统计图'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['食品类', '家庭清洁', '个人护理', '生鲜', '运动休闲', '电子产品']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [950, 200, 396, 100, 190, 720]
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    // 饼图
    pie () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('pie'))
      var option
      // 指定图表的配置项和数据
      option = {
        title: {
          text: '商品分类统计',
          subtext: 'Count From',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Count From',
            type: 'pie',
            radius: '60%',
            left: '20%',
            top: '16%',
            data: [
              { value: 1048, name: '食品类商品' },
              { value: 735, name: '家庭清洁用品' },
              { value: 580, name: '个人护理' },
              { value: 484, name: '生鲜' },
              { value: 300, name: '运动休闲用品' },
              { value: 300, name: '电子数码产品' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      option && myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin-top: 10px;
    height: 136px;
    width: 400px;
  }
  .text {
    font-size: 14px;
  }

  .header_info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* header */
  .el-row >>> .el-col {
    margin: 20px 130px;
    font-weight: 700;
  }

  .el-col >>> div {
    width: 110px;
    font-size: 18px;
    color: #409eff;
  }

/* 表 */
  .el-container, .el-main, .el-aside {
    padding-top: 10px;
    padding-right: 0px;
  }

  .el-container, .el-main >>> .swiper {
    padding-top: 0;
  }

  .swiper .el-card {
    width: 1120px;
  }

  .swiper >>> .el-carousel {
    width: 960px;
    height: 268px;
    margin-left: 45px;
    margin-top: 10px;
  }
  .swiper div {
    font-weight: 700;
    font-size: 18px;
  }

  .echarts_info {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  .echarts_info .el-card {
    margin-top: 10px;
  }

  .el-carousel__item {
    line-height: 343px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #1d62c4;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #b0bd3a;
  }

  .el-table-column {
    text-align: center;
  }

 .el-table >>> .cell {
  font-size: 13px;
  text-align: left;
  height: 38px;
  line-height: 38px;
}
</style>
