// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import store from './store'
import * as echarts from 'echarts'
import JsonExcel from 'vue-json-excel'
import '../src/assets/css/global.css'

import { Button, Table, TableColumn, Input, InputNumber, Form, FormItem, MessageBox,
  Message,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Card,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Row,
  Col,
  Tag,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Dialog,
  Statistic,
  Pagination,
  DatePicker,
  Carousel,
  CarouselItem,
  Radio,
  RadioButton,
  RadioGroup,
  Upload,
  Image,
  Select,
  Option } from 'element-ui'

Vue.use(Option)
Vue.use(Select)
Vue.use(Image)
Vue.use(Upload)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Card)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Dialog)
Vue.component(Statistic.name, Statistic)
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.use(Carousel)
Vue.use(CarouselItem)

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

Vue.component('downloadExcel', JsonExcel)

Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
Vue.use(echarts)

axios.defaults.baseURL = 'http://127.0.0.1:9093'
Vue.prototype.$http = axios

// axios 请求拦截
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
