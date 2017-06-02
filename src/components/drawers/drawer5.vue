<template>
  <div class="drawer-inner drawer4">
    <header>
      <h4>{{title}}</h4>
    </header>
    <section class="drawer-content">
      <div class="drawer-box" v-if="user">
        <h5>当前用户：<span class="username">{{user.username}}</span></h5>
        <el-button size="small" class="logout-button" @click="logout">退出登录</el-button>
      </div>
    </section>
  </div>
</template>
<script>
import vSearch from './search.vue'
export default {
  components: {
    vSearch
  },
  data: function() {
    return {
      title: '登录管理'
    }
  },
  computed: {
    user: function() {
      return this.$store.getters.user
    }
  },
  methods: {
    logout: function() {
      this.$store.commit('logout')
      this.$router.push('/login')
      this.$store.commit('updateCurrentDrawerIndex', 0)
    }
  }
}
</script>
<style lang="scss">
.drawer4 {
  .drawer-content {
    .drawer-box {
      h5 {
        font-size: 16px;
      }
      .username{
        text-decoration: underline;
      }
      .logout-button {
        float: right;
      }
    }
  }
}
</style>
