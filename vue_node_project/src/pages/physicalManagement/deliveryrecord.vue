<template>
  <div>
    <outproductrecord/>
  </div>
</template>

<script>
import outproductrecord from '../InventoryManagement/outproductrecord.vue'
export default {
  components: {
    outproductrecord
  },
  data () {
    return {
      property: 'value'
    }
  }
}
</script>

<style scoped>

</style>
