<template>
  <div class="statistic-analysis">
    <el-card class="top-box">
      <el-row :gutter="30">
        <el-col :span="12">
          <v-tree class="method-container" :data="methodTree" title="审计方法" @add="addMethod"></v-tree>
        </el-col>
        <el-col :span="12">
          <v-tree class="company-container" :data="companyList" title="被审单位" @add="addCompany"></v-tree>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="table-container">
      <v-table :rowData="selectedMethods" :colData="selectedCompany"></v-table>
    </el-card>
  </div>
</template>
<script>
import urlStore from '@/api/urlStore.js'
import vTree from './children/tree'
import vTable from './children/table'
export default {
  components: {
    vTree,
    vTable
  },
  data() {
    return {
      methodTree: null,
      companyList: null,
      methodProps: {
        children: 'children',
        label: 'title'
      },
      selectedMethods: [{
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }],
      selectedCompany: [{
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }, {
        id: 1,
        title: 'asd'
      }]
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
    addMethod: function(data) {
      console.log(data)
    },
    addCompany: function(data) {
      console.log(data)
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
    .tree-btn {
      float: right;
      padding: 0 15px;
      opacity: 0;
    }
    .el-tree-node__content:hover {
      .tree-btn {
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
  }
  .table-container {
    height: calc(50% - 20px);
    margin-top: 20px;
    margin-bottom: 20px;
    .el-card__body {
      height: 100%;
    }
  }
}
</style>
