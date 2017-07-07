<template>
  <div class="drawer-inner drawer3" v-loading="!basicMethods || loading" element-loading-text="正在加载数据">
    <header>
      <v-search title="基础数据" @message="handleMessage"></v-search>
    </header>
    <section class="drawer-content">
      <el-tree class="filter-tree" :data="basicMethods" :props="defaultProps" :filter-node-method="filterNode" ref="tree" highlight-current @current-change="handleTreeChange" :render-content="renderContent">
      </el-tree>
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
      loading: false,
      basicMethods: null,
      defaultProps: {
        label: 'title',
        children: 'children'
      }
    }
  },
  mounted() {
    this.loadMethod()
  },
  methods: {
    loadMethod: function(){
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
    handleMessage: function(msg) {
      // this.loading = true
      this.$refs.tree.filter(msg)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    handleTreeChange(data, node){
      if(data.type == 'method'){
        this.$store.commit('setSelectedData', data)
      }else{
        this.$store.commit('setSelectedData', null)
      }
    },
    refresh: function(){
      this.currentIndex = null
      this.loading = false
      this.basicMethods = null
      this.$store.commit('setSelectedData', null)
      this.loadMethod()
    },
    renderContent(h, {
      node,
      data,
      store
    }) {
      if ($.trim(data.description) && data.type == 'method') {
        return (
          <el-popover
            placement="right"
            // title="标题"
            width="600"
            trigger="hover">
            <span slot="reference">{node.label}</span>
            <p domPropsInnerHTML={data.description}></p>
          </el-popover>)
      } else {
        return (<span>{node.label}</span>)
      }
    }
  }
}
</script>
<style lang="scss">
.drawer3 {
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
  .el-tree{
    font-size: 13px;
  }
}
</style>
