<template>
  <div>
    <el-container class="home-container">
      <!-- 头部 -->
      <el-header>
        <div class="header">
          <img src="../assets/images/02.jpg" alt="">
          <span>供应链管理系统</span>
        </div>
        <!-- 个人信息/退出 -->
        <div class="user_info_right">
          <img src="../assets/images/dog.jpg" alt="">
          <div class="info">
            <div class="login_user_info">
              <span class="hying">欢迎</span>
              <span class="username">admin</span>
            </div>
          </div>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" size="mini">
              <el-dropdown-item command="my_info">个人信息</el-dropdown-item>
              <el-dropdown-item command="loginout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 折叠 -->
      <div class="toggle-button" @click="toggleCollapse">
        <i class="el-icon-s-fold"></i>
      </div>
      <!-- 侧边栏 -->
      <el-container>
        <!-- 侧边栏折叠展开 -->
        <el-aside :width="isCollapse ? '60px' : '200px'">
          <el-menu
          :index="item.id + ''"
            background-color="#314158"
            text-color="#fff"
            active-text-color="#409eff"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="$route.path"
            v-for="item in menuAsize" :key="item.id">
            <!-- 首页 -->
            <el-menu-item @click="indexEchart()">
              <i class="el-icon-s-data"></i>
              <span slot="title">首页</span>
            </el-menu-item>

            <el-submenu :index="i.id + ''" v-for="i in item" :key="i.id">
              <!-- 二级菜单 -->
              <template slot="title">
                <i class="el-icon-s-unfold"></i>
                <span>{{i.name}}</span>
              </template>
              <!-- 三级菜单 -->
              <el-menu-item :index="'/' + q.path" v-for="q in i.data" :key="q.id" @click="saveNavState('/' + q.path)">
                <template slot="title">
                  <i class="el-icon-s-data"></i>
                  <span>{{q.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容 -->
        <el-main>
          <bread />
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Bread from '../commons/Bread.vue'

export default {
  components: {
    Bread
  },
  data () {
    return {
      menulist: [],
      menuAsize: [],
      menuAsizeList: [],
      isCollapse: false, // 默认不折叠
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.indexEchart()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  computed: {

  },
  methods: {
    handleCommand (comItem) {
      switch (comItem) {
        case 'my_info':
          this.showInfoList()
          break
        case 'loginout':
          this.loginout()
          break
      }
    },
    showInfoList () {
      console.log('个人信息')
    },
    // 退出
    loginout () {
      window.sessionStorage.clear()
      this.$router.push('./login')
    },
    // 标题菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('/getSupInfo')
      console.log(res)
      if (res.status !== 0) return this.$message.error(res.message)
      this.menulist = res.data

      let leftArr = []
      let leftArrList = []
      res.data.forEach(v => {
        leftArr.push({
          id: v.id,
          name: v.name
        })
        console.log(v.data)
        leftArrList.push(v.data)
      })
      this.menulist = leftArr
      this.menuAsize = leftArrList
      console.log(this.menuAsize = leftArrList)
    },
    // 菜单折叠/展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    indexEchart (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
      this.$router.push('./home')
    }

  }
}
</script>

<style scoped>
  @import '../assets/css/index.css';

  .tabs {
    height: 32px;
    line-height: 32px;
    box-shadow: 0 0 8px 2px rgb(222, 221, 221);
    z-index: 999;
  }

  .el-card >>> .el-card__body {
    padding-top: 0px;
  }
  .item {
    height: 34px;
    line-height: 34px;
    font-size: 14px;
  }

  .el-tag >>> .el-tag--dark {
    border-radius: 0;
  }
</style>
