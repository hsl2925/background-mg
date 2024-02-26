<template>
  <div>
    <inproductrecord/>
  </div>
</template>

<script>
import inproductrecord from '../InventoryManagement/inproductrecord.vue'
export default {
  components: {
    inproductrecord
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
