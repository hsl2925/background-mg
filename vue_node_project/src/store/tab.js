export default {
  state: {
    tabList: [
      {
        path: '/',
        name: 'home',
        label: '首页'
      },
      {
        path: '/supInfo',
        name: 'supInfo',
        label: '供应商信息'
      },
      {
        path: '/shopOrder',
        name: 'shopOrder',
        label: '采购订单'
      },
      {
        path: '/shopOrderList',
        name: 'shopOrderList',
        label: '采购订单明细'
      },
      {
        path: '/integrator',
        name: 'integrator',
        label: '商品信息'
      },
      {
        path: '/merinventory',
        name: 'merinventory',
        label: '商品库存'
      },
      {
        path: '/inproductrecord',
        name: 'inproductrecord',
        label: '商品入库记录'
      },
      {
        path: '/outproductrecord',
        name: 'outproductrecord',
        label: '商品出库记录'
      },
      {
        path: '/deliveryrecord',
        name: 'deliveryrecord',
        label: '商品发货记录'
      },
      {
        path: '/receiptrecord',
        name: 'receiptrecord',
        label: '商品收货记录'
      }
    ]
  },
  mutations: {
    // 更新面包屑的数据
    SelectMenu (state, item) {
      // 如果点击的不在面包屑数据中,则添加
      const index = state.tabList.findIndex(val => val.name === item.name)
      if (index === -1) {
        state.tabList.push(item)
      }
    },
    // 删除tag:删除tabList中对应的item
    closeTag (state, item) {
      // 要删除的是state.tabList中的item
      const index = state.tabList.findIndex(val => val.name === item.name)
      state.tabList.splice(index, 1)
    }
  }
}
