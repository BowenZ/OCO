<template>
  <div class="statistic-analysis">
    <el-card class="top-box">
      <el-row :gutter="30">
        <el-col :span="12">
          <v-tree class="method-container" :data="methodTree" title="审计方法" @add="addMethod"></v-tree>
        </el-col>
        <el-col :span="12">
          <v-tree ref="companyList" class="company-container" :data="companyList" title="被审单位" @add="addCompany"></v-tree>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="table-container">
      <v-table v-loading="tableLoading" :tableData="tableData" @removeCompany="handleRemoveCompany" @removeMethod="handleRemoveMethod" @showDetail="handleShowDetail" @changeCompany="handleChangeCompany" @createChart="handleCreateChare"></v-table>
    </el-card>
    <el-dialog title="数据钻取" :visible.sync="dialogVisibleDetail" size="large">
      <el-table :data="detailData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisibleDetail = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisibleDetail = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图表" :visible.sync="dialogVisibleLineChart" size="large">
      <v-line-chart></v-line-chart>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisibleDetail = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisibleDetail = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import urlStore from '@/api/urlStore.js'
import vTree from './children/tree'
import vTable from './children/table2'
import vLineChart from './children/lineChart'
export default {
  components: {
    vTree,
    vTable,
    vLineChart
  },
  data() {
    return {
      methodTree: null,
      companyList: null,
      methodProps: {
        children: 'children',
        label: 'title'
      },
      selectedMethods: [],
      selectedCompany: [],
      tableData: [],
      tableLoading: false,

      // 钻取数据
      dialogVisibleDetail: false,
      detailData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],

      // 图表
      dialogVisibleLineChart: false
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
    addMethod(data) {
      this.selectedMethods = this.selectedMethods.concat(data)
      this.tableData = this.getResult()
    },
    addCompany(data) {
      this.selectedCompany.push(data)
      this.tableData = this.getResult()
    },
    getResult() {
      let ret = []
      this.selectedMethods.forEach(method => {
        let obj = {}
        let sum = 0
        obj.method = {
          methodId: method.id,
          methodName: method.title
        }
        obj.companies = []
        this.selectedCompany.forEach((company, index) => {
          let issuesNum = Math.ceil(Math.random() * 10)
          obj.companies.push({
            companyId: company.id,
            companyName: company.title,
            issues: issuesNum,
            subCompany: company.subCompany
          })
          sum += issuesNum
        })
        obj.sum = sum
        ret.push(obj)
      })
      return ret
    },
    handleRemoveCompany(companyName) {
      this.tableLoading = true
      let noMatch = this.selectedCompany.every((item, index) => {
        if (item.title == companyName) {
          this.selectedCompany.splice(index, 1)
          this.tableData = [] //this.getResult()
          setTimeout(() => {
            this.tableData = this.getResult()
            this.tableLoading = false
          }, 10)
          return false
        }
        return true
      })
      if (noMatch) {
        this.tableLoading = false
      }
    },
    handleRemoveMethod(methodId) {
      this.selectedMethods.every((item, index) => {
        if (item.id == methodId) {
          this.selectedMethods.splice(index, 1)
          this.tableData = this.getResult()
          return false
        }
        return true
      })
    }, 
    handleShowDetail(data) {
      console.log(data)
      this.dialogVisibleDetail = true
    },
    handleChangeCompany(parentCompany, childCompany){
      console.log(parentCompany, childCompany)
      this.selectedCompany.every(item => {
        if(item.id == parentCompany){
          if(item.subCompany && childCompany.id == item.subCompany.id){
            return false
          }
          if(childCompany.level == 1 && !item.subCompany){
            return false
          }
          if(childCompany.level == 1){
            item.subCompany = null
            this.tableData = this.getResult()
            return false
          }
          item.subCompany = childCompany
          this.tableData = this.getResult()
          return false
        }
        return true
      })
    },
    handleCreateChare(level, methodId){
      console.log(level, methodId)
      this.dialogVisibleLineChart = true
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
  .el-loading-mask {
    background-color: rgba(255, 255, 255, .9);
  }
}
</style>
