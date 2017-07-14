<template>
  <div id="index">
    <!-- <v-logo></v-logo> -->
    <v-menu></v-menu>
    <v-main :class="{active: drawerIsOpened}"></v-main>
  </div>
</template>
<script>
import vMenu from './menu.vue'
import vMain from './main.vue'
import vLogo from './logo.vue'
export default {
  components: {
    vMenu,
    vMain,
    vLogo
  },
  data: function() {
    return {
      visible: false
    }
  },
  computed: {
    drawerIsOpened: function() {
      return this.$store.state.drawerIsOpened
    }
  }
}
</script>
<style lang="scss">
body {
  .el-loading-mask {
    background-color: initial;
  }
}
</style>
