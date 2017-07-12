<template>
  <div class="tree-box">
    <v-search :title="title" @message="handleSearch"></v-search>
    <div class="method-tree">
      <el-tree ref="tree" :data="data" :render-content="renderContent" node-key="id" :default-expand-all="false" :props="methodProps" :filter-node-method="filterNode">
      </el-tree>
    </div>
  </div>
</template>
<script>
import vSearch from '@/components/drawers/search.vue'
export default {
  components: {
    vSearch
  },
  props: {
    title: {
      type: String
    },
    data: {
      type: Array
    }
  },
  data(){
    return {
      methodProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    handleSearch(msg) {
      this.$refs.tree.filter(msg)
    },
    add(node, data){
      this.$emit('add', data)
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span class="tree-btn">
            <el-button size="mini" type="text" on-click={ () => this.add(node, data) } icon="plus"></el-button>
            <i style="display:none"></i>
          </span>
        </span>);
    }
  }
}
</script>
<style lang="scss">
  .tree-box{
    .el-tree {
      height: 100%;
      overflow: auto;
    }
  }
</style>
