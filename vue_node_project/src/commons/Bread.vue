<template>
  <div class="tabs">
    <el-tag v-for="(item, index) in tags"
      :key="item.path"
      :closable="item.name !== 'home'"
      :effect="item.name === $route.name ? 'dark' : 'plain'"
      @click="changeMenu(item)"
      @close="handleClose(item, index)">
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {

    }
  },
  methods: {
    // 点击tag跳转
    changeMenu (item) {
      this.$router.push({ name: item.name })
    },
    handleClose (item, index) {
      // 删除面包屑数据
      this.$store.commit('closeTag', item)
      // 如果删除的刚好是自己
      if (item.name === this.$route.name) {
        const length = this.tags.length
        // 如果删除的是最后一个:跳到前一个
        if (length === index) {
          this.$router.push({ name: this.tags[index - 1].name })
        } else {
          this.$router.push({ name: this.tags[index].name })
        }
      }
    }
  },
  computed: {
    ...mapState({
      tags: state => state.tab.tabList
    })
  }
}
</script>

<style scoped>
.tabs {
    padding-bottom: 5px;
    height: 32px;
    line-height: 32px;
  }

.el-tag {
    margin-right: 5px;
    cursor: pointer;
  }
</style>
