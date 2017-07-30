<template>
  <div class="search-company">
    <div class="search">
      <el-input placeholder="请输入搜索内容" v-model="searchVal">
        <el-button slot="append" type="primary" @click="commitCompany">确定</el-button>
      </el-input>
    </div>
    <div class="company-tree">
      <el-tree class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree" highlight-current @current-change="handleChangeCompany">
      </el-tree>
    </div>
  </div>
</template>
<script>
export default {
  props: ['companyList','searchLevel'],
  data: function() {
    return {
      searchVal: '',
      defaultProps: { children: 'children', label: 'unitName' },
      selectedCompany: null
    }
  },
  computed: {
  	treeData: function(){
  		if(this.searchLevel == 0){
  			return this.companyList
  		}
  		return this.companyList.filter(item => {
  			return item.unitLevel == this.searchLevel
  		})
  	}
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.unitName.indexOf(value) !== -1;
    },
    handleChangeCompany(data){
    	this.selectedCompany = data
    },
    commitCompany(){
    	this.$emit('commitData', this.selectedCompany)
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
.search-company {
  .el-tree {
    max-height: 300px;
    overflow: auto;
  }
}

</style>
