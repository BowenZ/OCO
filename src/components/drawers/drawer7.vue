<template>
  <div class="drawer-inner drawer7">
    <header>
      <h4>{{title}}</h4>
    </header>
    <section class="drawer-content">
      <div class="drawer-box" v-if="user">
        <ul class="menu">
          <li>
            <!-- <router-link tag="span" :to="{path: 'statisticAnalysis'}"> -->
              <el-button type="text" @click="goToPage(0)">统计分析</el-button>
            <!-- </router-link> -->
          </li>
          <li>
            <el-button type="text" @click="goToPage(1)">用户行为统计</el-button>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      title: '决策分析'
    }
  },
  computed: {
    user: function() {
      return this.$store.getters.user
    }
  },
  methods: {
    goToPage(index){
      this.$store.commit('setCurrentDrawerPage', index)
    }
  }
}
</script>
<style lang="scss">
.drawer7 {
  ul.menu{
    list-style: none;
  }
}
</style>
