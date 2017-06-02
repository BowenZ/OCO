<template>
  <div class="drawer-inner drawer2" v-loading="!basicMethods || loading" element-loading-text="正在加载数据">
    <header>
      <h4>基础数据</h4>
    </header>
    <section class="drawer-content">
      <ul class="audit-methods" v-if="basicMethods && basicMethods.length">
        <li v-for="(method, index) in basicMethods"><a href="#" @click.prevent="clickMethod($event, index, method.title)" :data-id="method.id">{{method.title}}</a></li>
      </ul>
    </section>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import urlStore from '@/api/urlStore.js'
export default {
  data: function() {
    return {
      currentIndex: null,
      loading: false,
      basicMethods: null
    }
  },
  mounted() {
    this.$http.get(urlStore.findBasicMethod, {
      params: {
        userId: this.$store.getters.user.userId
      }
    }).then(res => {
      if (res.ok && res.body.status == 'success') {
        this.basicMethods = res.body.data
      }
    })
  },
  methods: {
    clickMethod: function(event, index, title) {
      let $target = $(event.target)
      $target.parents('.audit-methods').find('.active').removeClass('active')
      $target.addClass('active')
      this.currentIndex = index
      this.$store.commit('setSelectedData', this.basicMethods[index])
    },
    changeLoading: function() {
      this.loading = !this.loading
    }
  }
}
</script>
<style lang="scss">
.drawer2 {
  header {
    height: 71px;
  }
  .drawer-content {
    color: rgb(214, 216, 219);
  }
  .audit-methods {
    padding-left: 20px;
    list-style: none;
    font-size: 14px;
    li {
      margin-bottom: 15px;
      a {
        // color: #d8e3ff;
        color: #fff;
        text-decoration: none;
        &.active {
          // color: #1abc9c;
          color: #8fffe9;
        }
      }
    }
  }
}
</style>
