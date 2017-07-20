<template>
  <div class="statistic-analysis">
    <el-collapse v-model="activeNames" @change="handleChangeCollapse">
      <el-collapse-item title="统计分析" name="1" class="top-box opened">
        <el-row :gutter="30">
          <el-col :span="12">
            <v-tree v-loading="methodTreeLoading" class="method-container" :data="methodTree" title="审计方法" @add="addMethod" @addAll="handleAddAll('method')"></v-tree>
          </el-col>
          <el-col :span="12">
            <v-tree v-loading="companyListLoading" ref="companyList" class="company-container" :data="companyList" title="被审单位" @add="addCompany" @addAll="handleAddAll('company')"></v-tree>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="结果" name="2" class="table-container opened">
        <v-table ref="resultTable" v-loading="tableLoading" :tableData="tableData" @removeCompany="handleRemoveCompany" @removeMethod="handleRemoveMethod" @showDetail="handleShowDetail" @changeCompany="handleChangeCompany" @createChart="handleCreateChare" @clearData="handleClearData" @showChart="handleShowChart" @changeLevel="handleChangeLevel" @changeYear="handleChangeYear" @drillingData="handleDrillingData"></v-table>
      </el-collapse-item>
    </el-collapse>
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
        <el-button type="primary" @click="dialogVisibleDetail = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图表" :visible.sync="singleMethodChartVisible" size="large">
      <v-chart :chartData="singleMethodChartData" defaultType="bar"></v-chart>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="singleMethodChartVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图表" :visible.sync="dialogVisiblePieChart" size="large">
      <v-chart :chartData="multipleMethodCharData" defaultType="pie"></v-chart>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisiblePieChart = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import urlStore from '@/api/urlStore.js'
import vTree from './children/tree'
import vTable from './children/resultTable'
import vBarChart from './children/barChart'
import vPieChart from './children/pieChart'
import vChart from './children/vChart'
export default {
  components: {
    vTree,
    vTable,
    vBarChart,
    vPieChart,
    vChart
  },
  data() {
    return {
      activeNames: ['1', '2'],
      methodTreeLoading: false,
      methodTree: null,
      companyListLoading: false,
      companyList: null,
      methodProps: {
        children: 'children',
        label: 'title'
      },
      selectedMethods: [],
      selectedCompany: [{
          "id": 101,
          "title": "开封市工商局相国寺分局",
          "params": [],
          "externalDataSource": [
            "临时表_人员信息"
          ]
        },
        {
          "id": 102,
          "title": "开封市工商局夜市分局",
          "params": [],
          "externalDataSource": [
            "临时表_人员信息"
          ]
        }
      ],
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
      singleMethodChartVisible: false,
      dialogVisiblePieChart: false,
      singleMethodChartData: {
        columns: ['单位', '问题数'],
        rows: [{
          '单位': '安阳市工商局',
          '问题数': 5,
          id: 123
        }, {
          '单位': '濮阳市工商局',
          '问题数': 9,
          id: 123
        }, {
          '单位': '河南省财政厅',
          '问题数': 6,
          id: 123
        }, {
          '单位': '河南省农业综合开发公司',
          '问题数': 4,
          id: 123
        }, {
          '单位': '开封市工商局机关',
          '问题数': 12,
          id: 123
        }, {
          '单位': '开封市经济检查支队',
          '问题数': 3,
          id: 123
        }]
      },
      multipleMethodCharData: {
        columns: ['审计方法', '问题数'],
        rows: [{
          '审计方法': '部门预算执行总体情况和执行率',
          '问题数': 15
        }, {
          '审计方法': '预算项目执行情况',
          '问题数': 29
        }, {
          '审计方法': '年底向宾馆培训中心招待所等大额转款',
          '问题数': 36
        }, {
          '审计方法': '工会经费实际支出超预算',
          '问题数': 14
        }, {
          '审计方法': '福利费支出超预算',
          '问题数': 12
        }, {
          '审计方法': '财政供养人员经商办企业',
          '问题数': 3
        }]
      }
    }
  },
  mounted() {
    this.loadMethodTree()
    this.loadCompanyList()
    this.tableData = this.getResult()
  },
  methods: {
    loadMethodTree() {
      // 加载方法树
      this.methodTreeLoading = true
      this.$http.post(urlStore.findAllListWithAuditItemAndAuditMethodModel).then(res => {
        if (res.ok) {
          this.methodTree = res.body.tree
        }
        this.methodTreeLoading = false
      }).catch(err => {
        this.methodTreeLoading = false
      })
    },
    loadCompanyList() {
      // 加载单位
      // this.companyListLoading = true
      // this.$http.get(urlStore.findMethods).then(res => {
      //   if (res.ok) {
      //     this.companyList = res.body.data
      //   }
      //   this.companyListLoading = false
      // }).catch(err => {
      //   this.companyListLoading = false
      // })
      this.companyList = [{
        "id": 1,
        "title": "安阳市工商局高新开发区分局",
        "params": [{
          "id": 1,
          "name": "p01",
          "type": "int",
          "value": "-99",
          "isNull": 1,
          "style": "pop"
        }, {
          "id": 2,
          "name": "p02",
          "type": "string",
          "value": "default Vales",
          "isNull": 1
        }],
        "externalDataSource": [
          "账户表"
        ]
      }, {
        "id": 2,
        "title": "濮阳市工商局开发区分局",
        "params": [{
          "id": 3,
          "name": "p03",
          "type": "int",
          "value": "-99",
          "isNull": 1
        }, {
          "id": 4,
          "name": "p04",
          "type": "boolean",
          "value": "0",
          "isNull": 1
        }],
        "externalDataSource": [
          "t2_ex1",
          "t2_ex2"
        ]
      }, {
        "id": 3,
        "title": "河南省财政厅农业综合开发资金专户",
        "params": [{
          "id": 13,
          "name": "p13",
          "type": "int",
          "value": "-99",
          "isNull": 1
        }, {
          "id": 14,
          "name": "p14",
          "type": "date",
          "value": "1900-01-01 00:00:00",
          "isNull": 0
        }],
        "externalDataSource": [
          "t7_ex1",
          "t7_ex2"
        ]
      }, {
        "id": 8,
        "title": "河南省农业综合开发公司",
        "params": [{
          "id": 15,
          "name": "p15",
          "type": "int",
          "value": "-99",
          "isNull": 1
        }, {
          "id": 16,
          "name": "p16",
          "type": "float",
          "value": "-99.99",
          "isNull": 0
        }],
        "externalDataSource": [
          "t8_ex1",
          "t8_ex2"
        ]
      }, {
        "id": 94,
        "title": "开封市工商局机关",
        "params": [{
          "id": 91,
          "name": "预算年度",
          "type": "string",
          "isNull": 1
        }, {
          "id": 92,
          "name": "单位编码",
          "type": "string",
          "isNull": 0
        }],
        "externalDataSource": [
          "s"
        ]
      }, {
        "id": 99,
        "title": "开封市经济检查支队",
        "params": [],
        "externalDataSource": [
          "临时表_人员信息"
        ]
      }, {
        "id": 100,
        "title": "开封市工商行政管理局经济技术开发区分局",
        "params": [],
        "externalDataSource": [
          "临时表_人员信息"
        ]
      }, {
        "id": 101,
        "title": "开封市工商局相国寺分局",
        "params": [],
        "externalDataSource": [
          "临时表_人员信息"
        ]
      }, {
        "id": 102,
        "title": "开封市工商局夜市分局",
        "params": [],
        "externalDataSource": [
          "临时表_人员信息"
        ]
      }]
    },
    handleChangeCollapse(activeNames) {
      if (activeNames.length == 1) {
        $(this.$el).find('.el-collapse').addClass('one')
      } else {
        $(this.$el).find('.el-collapse').removeClass('one')
      }
      setTimeout(() => {
        this.$refs.resultTable.resizeFixedTableCol()
      }, 1000)
    },
    addMethod(data) {
      let filteredData = []
      data.forEach(item => {
        if (!this.selectedMethods.some(method => method.id == item.id)) {
          filteredData.push(item)
        }
      })
      if (filteredData.length) {
        this.selectedMethods = this.selectedMethods.concat(filteredData)
        this.tableData = this.getResult()
      }
    },
    addCompany(data) {
      if (!this.selectedCompany.some(company => company.id == data.id)) {
        this.selectedCompany.push(data)
        this.tableData = this.getResult()
      }else{
        this.$message({
          message: '该单位已被添加',
          type: 'error',
          duration: 1500
        })
      }
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
          this.tableData = []
          setTimeout(() => {
            this.tableData = this.getResult()
            this.tableLoading = false
            // this.$refs.resultTable.$forceUpdate()
          }, 300)
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
      this.dialogVisibleDetail = true
    },
    handleChangeCompany(parentCompanyId, childCompany) {
      this.selectedCompany.every(item => {
        if (item.id == parentCompanyId) {
          if (item.subCompany && childCompany.id == item.subCompany.id) {
            return false
          }
          if (childCompany.level == 1 && !item.subCompany) {
            return false
          }
          if (childCompany.level == 1) {
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
    handleCreateChare(level, methodId) {
      this.singleMethodChartVisible = true
    },
    handleClearData() {
      this.$confirm('是否清空当前表格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedCompany = []
        this.selectedMethods = []
        this.tableData = []
        this.loadMethodTree()
        this.loadCompanyList()
        this.$message({
          type: 'success',
          message: '已清空!'
        });
      }).catch(() => {

      })
    },
    handleShowChart() {
      this.dialogVisiblePieChart = true
    },
    handleChangeLevel(level) {
      if(level == -1){
        return
      }
      this.selectedCompany.forEach(item => {
        item.subCompany = null
      })
      this.tableData = this.getResult()
    },
    handleChangeYear(year) {
      this.tableData = this.getResult()
    },
    getMethods(data) {
      if (!data) {
        return
      }
      let ret = []
      if (data.type == 'method') {
        ret.push(data)
      } else if (data.children && data.children.length) {
        data.children.forEach(item => {
          ret = ret.concat(this.getMethods(item))
        })
      }
      return ret
    },
    getAllMethods() {
      let ret = []
      this.methodTree.forEach((item, index) => {
        ret = ret.concat(this.getMethods(item))
      })
      return ret
    },
    handleAddAll(target) {
      if (target == 'method') {
        this.selectedMethods = this.getAllMethods()
        this.tableData = this.getResult()
      } else if (target == 'company') {
        this.selectedCompany = this.companyList
        this.tableData = this.getResult()
      }
    },
    handleDrillingData(companyId, level){
      console.log('========', companyId, level)
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
  padding: 10px;
  .el-collapse {
    height: 100%;
    border: none;
    &.one {
      .el-collapse-item.is-active {
        height: calc(100% - 43px);
      }
    }
    .el-collapse-item {
      height: auto;
      &.is-active {
        height: 50%;
      }
      .el-collapse-item__wrap {
        height: calc(100% - 43px);
        .el-collapse-item__content {
          height: 100%;
        }
      }
    }
  }
  .top-box {
    // height: 50%;
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
    // height: calc(50% - 20px);
    // margin-top: 20px;
    // margin-bottom: 20px;
    .el-card__body {
      height: 100%;
    }
  }
  .el-loading-mask {
    background-color: rgba(255, 255, 255, .9);
  }
}

.el-dialog__header {
  button {
    float: right;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    font-size: 16px;
    cursor: pointer;
  }
}

</style>
