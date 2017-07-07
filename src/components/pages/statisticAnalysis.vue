<template>
  <div class="statistic-analysis">
    <el-card class="top-box">
      <el-row :gutter="30">
        <el-col :span="12">
          <div class="method-container">
            <v-search title="审计方法" @message="handleSearchMethod"></v-search>
            <div class="method-tree">
              <el-tree ref="methodTree" :data="methodTree" :render-content="renderContent" node-key="id" :default-expand-all="false" :props="methodProps" :filter-node-method="filterNode">
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="company-container">
            <v-search title="被审单位" @message="handleSearchCompany"></v-search>
            <div class="company-list">
              <el-tree ref="companyList" :data="companyList" :render-content="renderContent" node-key="id" :default-expand-all="false" :props="methodProps" :filter-node-method="filterNode">
              </el-tree>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import urlStore from '@/api/urlStore.js'
import vSearch from '../drawers/search.vue'
export default {
  components: {
    vSearch
  },
  data() {
    return {
      methodTree: null,
      companyList: null,
      methodProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  mounted() {
    // 加载方法树
    this.$http.get(urlStore.getDetail).then(res => {
      if (res.ok) {
        this.methodTree = res.body.tree
      }
    })

    // 加载单位
    this.$http.get(urlStore.findMethods).then(res => {
      if (res.ok) {
        this.companyList = res.body.data
      }
    })
  },
  methods: {
  	filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    handleSearchMethod(msg) {
      console.log(msg)
      this.$refs.methodTree.filter(msg)
    },
    handleSearchCompany(msg) {
      console.log(msg)
      this.$refs.companyList.filter(msg)
    },
    add(node, data){
    	console.log('========')
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
.statistic-analysis {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0 auto;
  padding: 20px;
  .top-box {
    height: 50%;
    .search-input {
      h4 {
        font-weight: normal;
        line-height: 50px;
        margin: 0;
      }
      form {
        top: 5px;
      }
      input[type="text"] {
        background-color: #fff;
        padding-left: 0;
        color: #000;
      }
    }
    .tree-btn{
    	float: right; 
			padding: 0 15px;
			opacity: 0;
    }
    .el-tree-node__content:hover{
    	.tree-btn{
    		opacity: 1;
    	}
    }
    .el-card__body,
    .el-row,
    .el-col,
    .method-container,
    .company-container {
      height: 100%;
    }
    .method-tree,
    .company-list {
      height: calc(100% - 50px);
    }
    .el-tree {
      height: 100%;
      overflow: auto;
    }
  }
  .method-container {}
}
</style>
