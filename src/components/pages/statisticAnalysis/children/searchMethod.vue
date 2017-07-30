<template>
  <div class="search-method">
    <div class="search">
      <el-input placeholder="请输入搜索内容" v-model="searchVal">
        <el-button slot="append" type="primary" @click="commitMethod">确定</el-button>
      </el-input>
    </div>
    <div class="method-tree">
      <el-tree class="filter-tree" :data="methodList" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree" highlight-current @current-change="handleChangeMethod">
      </el-tree>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    methodList: {
      type: Array
    }
  },
  data: function() {
    return {
      searchVal: '',
      defaultProps: { children: 'children', label: 'title' },
      selectedmethod: null
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    handleChangeMethod(data) {
      this.selectedMethod = data
    },
    commitMethod() {
      this.$emit('commitData', this.selectedMethod)
    }
  },
  watch: {
    searchVal(val) {
      this.$refs.tree.filter(val);
    }
  }
}

</script>
<style lang="scss">
.search-method {
  .el-tree {
    max-height: 300px;
    overflow: auto;
  }
}

</style>
