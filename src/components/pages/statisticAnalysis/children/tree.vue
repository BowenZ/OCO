<template>
  <div class="tree-box">
    <v-search :title="title" @message="handleSearch">
      <span slot="append">
        <el-button type="text" size="small" style="margin-left:5px" @click="addAll">添加所有</el-button>
      </span>
    </v-search>
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
    appendTreeNode(data){
      this.$refs.tree.store.append(data, this.$refs.tree.data)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    handleSearch(msg) {
      this.$refs.tree.filter(msg)
    },
    add(node, data){
      // node.parent.removeChildByData(data)
      if(data.type){
        this.$emit('add', this.getMethods(data))
      }else{
        this.$emit('add', data)
      }
      return false
    },
    getMethods(data){
      if(!data){
        return
      }
      let ret = []
      if(data.type == 'method'){
        ret.push(data)
      }else if(data.children && data.children.length){
        data.children.forEach(item => {
          ret = ret.concat(this.getMethods(item))
        })
      }
      return ret
    },
    addAll(){
      this.$emit('addAll')
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
