import Vue from 'vue'
import Router from 'vue-router'

// const login = () => import('../components/login.vue')
// const register = () => import('../components/register.vue')
// const index = () => import('../components/index.vue')
// const sidebar = () => import('../components/sidebar.vue')
// const supInfo = () => import('../pages/supplier/supInfo.vue')
// const shopOrder = () => import('../pages/shopMannger/shopOrder.vue')
// const shopOrderList = () => import('../pages/shopMannger/shopOrderList.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/login.vue') },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/register.vue')
    },
    {
      path: '/sidebar',
      name: 'sidebar',
      component: () => import('../components/sidebar.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../components/home.vue')
        },
        {
          path: '/supInfo',
          name: 'supInfo',
          component: () => import('../pages/supplier/supInfo.vue')
        },
        {
          path: '/shopOrder',
          name: 'shopOrder',
          component: () => import('../pages/shopManner/shopOrder.vue')
        },
        {
          path: '/shopOrderList',
          name: 'shopOrderList',
          component: () => import('../pages/shopManner/shopOrderList.vue')
        },
        {
          path: '/integrator',
          name: 'integrator',
          component: () => import('../pages/integrator/integratorInfo.vue')
        },
        {
          path: '/inproductrecord',
          name: 'inproductrecord',
          component: () => import('../pages/InventoryManagement/inproductrecord.vue')
        },
        {
          path: '/merinventory',
          name: 'merinventory',
          component: () => import('../pages/InventoryManagement/merinventory.vue')
        },
        {
          path: '/outproductrecord',
          name: 'outproductrecord',
          component: () => import('../pages/InventoryManagement/outproductrecord.vue')
        },
        {
          path: '/deliveryrecord',
          name: 'deliveryrecord',
          component: () => import('../pages/physicalManagement/deliveryrecord.vue')
        },
        {
          path: '/receiptrecord',
          name: 'receiptrecord',
          component: () => import('../pages/physicalManagement/receiptrecord.vue')
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('../components/user.vue')
        },
        {
          path: '/userPermission',
          name: 'userPermission',
          component: () => import('../components/userPermiss.vue')
        }
      ]
    }
  ]
})

// 为路由对象添加 beforeEach 路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的是登录页, 直接放行
  if (to.path === '/login') return next()
  // sessionStorage 中获取到token的值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有 token 强制跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
