<template>
  <div class="drawer-inner drawer2" v-loading="!singleMethods || loading" element-loading-text="正在加载数据">
    <header>
      <v-search title="审计方法" @changeLoading="changeLoading"></v-search>
    </header>
    <section class="drawer-content">
      <!-- <p>当前选中方法：<strong v-if="singleMethods && singleMethods.length && singleMethods[currentIndex]">{{singleMethods[currentIndex].title}}</strong> <strong v-else>无</strong></p> -->
      <ul class="audit-methods" v-if="singleMethods && singleMethods.length">
        <li v-for="(method, index) in singleMethods"><a href="#" @click.prevent="clickMethod($event, index)" :data-id="method.id">{{method.title}}</a></li>
      </ul>
    </section>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import urlStore from '@/api/urlStore.js'
import vSearch from './search.vue'
export default {
  components: {
    vSearch
  },
  data: function() {
    return {
      currentIndex: null,
      loading: false
    }
  },
  mounted: function() {
    // this.$store.dispatch('getSingleMethods')
    this.$http.get(urlStore.findMethods, {
      params: {
        userId: this.$store.getters.user.userId
      }
    }).then(res => {
      if (res.body.status == 'success') {
        this.$store.commit('setSingleMethods', res.body.data)
        if (res.body.isCanExecute && res.body.isCanExecute == 0) {
          this.$store.commit('setAuditStatus', true)
          this.$store.commit('setContinueAudit', true)
        }
      }
    }, res => {
      this.$store.commit('setSingleMethods', [])
    })
  },
  computed: {
    singleMethods: function() {
      return this.$store.getters.singleMethods
    }
  },
  methods: {
    clickMethod: function(event, index) {
      let $target = $(event.target)
      $target.parents('.audit-methods').find('.active').removeClass('active')
      $target.addClass('active')
      this.currentIndex = index
      this.$store.commit('setSelectedMethod', this.singleMethods[index])
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
