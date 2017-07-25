<template>
  <div class="statistic-analysis">
    <el-collapse v-model="activeNames" @change="handleChangeCollapse">
      <el-collapse-item title="统计分析" name="1" class="top-box opened">
        <el-row :gutter="30">
          <el-col :span="12">
            <v-tree v-loading="methodTreeLoading" class="method-container" :data="methodTree" title="审计方法" @add="addMethod" :type="'method'" @addAll="handleAddAll"></v-tree>
          </el-col>
          <el-col :span="12">
            <v-tree v-loading="companyListLoading" ref="companyList" class="company-container" :data="companyList" title="被审计单位" @add="addCompany" type="company" @addAll="handleAddAll" :defaultProps="{children: 'children', label: 'unitName'}"></v-tree>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="结果" name="2" class="table-container opened">
        <v-table ref="resultTable" v-loading="tableLoading" :tableData="tableData" @removeCompany="handleRemoveCompany" @removeMethod="handleRemoveMethod" @showDetail="handleShowDetail" @changeCompany="handleChangeCompany" @createChart="handleCreateChart" @clearData="handleClearData" @showChart="handleShowChart" @changeLevel="handleChangeLevel" @changeYear="handleChangeYear" @drillingData="handleDrillingData"></v-table>
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
    <el-dialog title="图表" :visible.sync="singleMethodChartVisible" size="large" class="chart-data">
      <p v-if="drillingDataInfo.method">当前方法：{{drillingDataInfo.method.methodName}}</p>
      <v-chart :chartData="singleMethodChartData" defaultType="pie" @click="handleClickSingleChart"></v-chart>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="singleMethodChartVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图表" :visible.sync="dialogVisiblePieChart" size="large">
      <v-chart :chartData="multipleMethodCharData" defaultType="pie" @click="handleClickMultipleChart"></v-chart>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisiblePieChart = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="数据钻取" :visible.sync="showChartData" size="large" class="chart-data" @close="handleCloseDrillingData">
      <p v-if="drillingDataInfo.method">当前方法：{{drillingDataInfo.method.methodName}}</p>
      <p v-if="drillingDataInfo.company">当前单位：{{drillingDataInfo.company.companyName}}</p>
      <el-table :data="detailData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showChartData = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import _ from 'lodash'
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
      selectedMethods: [{ "id": 261, "type": "method", "title": "01 部门违规收取协会、学会的“赞助费”或“管理费”", "selected": 0, "description": "", "params": [] }, { "id": 262, "type": "method", "title": "02 部门在协会、学会私设“小金库”和报销各类费用", "selected": 0, "description": "", "params": [] }, { "id": 263, "type": "method", "title": "03 部门工作人员违规兼职取酬", "selected": 0, "description": "", "params": [] }, { "id": 264, "type": "method", "title": "04 协会、学会等中介机构利用部门的影响力违规收费", "selected": 0, "description": "", "params": [] }],
      selectedCompany: [{
        "unitGroupNum": "82",
        "unitCode": "902101",
        "unitName": "河南省国土资源厅 ",
        "unitLevel": 1
      }, {
        "unitGroupNum": "83",
        "unitCode": "024101",
        "unitName": "河南省民建 ",
        "unitLevel": 1
      }, {
        "unitGroupNum": "84",
        "unitCode": "041101",
        "unitName": "河南省统计局 ",
        "unitLevel": 1
      }, {
        "unitGroupNum": "85",
        "unitCode": "019101",
        "unitName": "河南省农工民主党 ",
        "unitLevel": 1
      }, {
        "unitGroupNum": "86",
        "unitCode": "036101",
        "unitName": "河南省民族事务委员会 ",
        "unitLevel": 1
      }],
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
      },
      showChartData: false,
      drillingDataInfo: {
        method: null,
        company: null
      }
    }
  },
  mounted() {
    this.loadMethodTree()
    this.loadCompanyList()
    this.getResult()
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
      this.companyListLoading = true
      this.$http.get(urlStore.findUnitsList).then(res => {
        if (res.ok && res.body.success) {
          this.companyList = res.body.data
        }
        this.companyListLoading = false
      }).catch(err => {
        this.companyListLoading = false
      })
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
        this.getResult()
      }
    },
    addCompany(data) {
      let index = this.selectedCompany.findIndex(company => {
        return (company.pCode !== undefined && data.pCode !== undefined && company.pCode == data.pCode) ||
          (company.unitCode == data.pCode) ||
          (company.pCode == data.unitCode) ||
          (company.unitCode == data.unitCode)
      })

      if (this.selectedCompany.some(company => (!company.subCompany && company.unitCode == data.unitCode) || (company.subCompany && company.subCompany.unitCode == data.unitCode))) {
        this.$message({
          message: '该单位已被添加',
          type: 'error',
          duration: 1500
        })
      } else if (index > -1) {
        let dataToReplace
        if (data.unitLevel == 1) {
          dataToReplace = data
        } else {
          let parentCompany = _.clone(this.companyList.find(item => item.unitCode == data.pCode))
          parentCompany.subCompany = data
          dataToReplace = parentCompany
        }

        let replacedCompany = this.selectedCompany.splice(index, 1, dataToReplace)
        this.getResult()
        this.$message({
          message: `存在相同一级单位的“${replacedCompany[0].unitName}”，已替换为当前选择单位“${data.unitName}”`,
          type: 'info'
        })
      } else {
        if (data.unitLevel == 1) {
          this.selectedCompany.push(data)
        } else {
          let parentCompany = _.clone(this.companyList.find(item => item.unitCode == data.pCode))
          if (!parentCompany) {
            this.$message({
              message: '该数据有误，添加失败',
              type: 'error',
              duration: 1500
            })
            return
          }
          parentCompany.subCompany = data
          this.selectedCompany.push(parentCompany)
        }
        this.getResult()
      }
    },
    getResult() {
      this.tableLoading = true
      let ret = []
      this.$http.get(urlStore.statisticQuery, {
        params: {
          year: 2016,
          unitCodes: this.selectedCompany.map(item => item.subCompany ? item.subCompany.unitCode : item.unitCode).join(','),
          methodIds: this.selectedMethods.map(item => item.id).join(','),
          type: this.$refs.resultTable.selectedLevel
        }
      }).then(res => {
        if (res.ok && res.body.success) {
          let tmpCompany = []
          let tmpData = res.body.data.find(item => item.units.length > 0)
          if (!tmpData) {
            this.selectedCompany.forEach((company, index) => {
              tmpCompany.push({
                companyId: company.unitCode,
                companyName: company.unitName,
                issues: 0,
                subCompany: company.subCompany
              })
            })
          } else {
            tmpData.units.forEach(item => {
              if (item.unitLevel == 1) {
                tmpCompany.push({
                  companyId: item.unitCode,
                  companyName: item.unitName,
                  issues: 0,
                  subCompany: null
                })
              } else {
                console.log(this.selectedCompany)
                let targetCompany = this.selectedCompany.find(item2 => {
                  console.log(item2,'+++')
                  return item2.subCompany && item2.subCompany.unitCode == item.unitCode
                })
                tmpCompany.push({
                  companyId: targetCompany.unitCode,
                  companyName: targetCompany.unitName,
                  issues: null,
                  subCompany: targetCompany.subCompany
                })
              }
            })
          }

          res.body.data.forEach(item => {
            let obj = {}
            obj.method = {
              methodId: item.methodId,
              methodName: item.methodName
            }
            obj.companies = JSON.parse(JSON.stringify(tmpCompany))
            item.units.length && item.units.forEach((unit, index) => {
              obj.companies[index].issues = unit.resultCount
            })
            obj.sum = item.resultCount
            ret.push(obj)
          })
          this.tableData = ret
        }
        this.tableLoading = false
      })
      // console.log(this.selectedMethods, this.selectedCompany)

      // this.selectedMethods.forEach(method => {
      //   let obj = {}
      //   let sum = 0
      //   obj.method = {
      //     methodId: method.id,
      //     methodName: method.title
      //   }
      //   obj.companies = []
      //   this.selectedCompany.forEach((company, index) => {
      //     let issuesNum = Math.ceil(Math.random() * 10)
      //     obj.companies.push({
      //       companyId: company.unitCode,
      //       companyName: company.unitName,
      //       issues: issuesNum,
      //       subCompany: company.subCompany
      //     })
      //     sum += issuesNum
      //   })
      //   obj.sum = sum
      //   ret.push(obj)
      // })
      // this.tableLoading = false
      // return ret
    },
    handleRemoveCompany(companyId, param) {
      this.tableLoading = true
      let index = this.selectedCompany.findIndex(item => item.unitCode == companyId)
      if (param == 'this') {
        this.selectedCompany.splice(index, 1)
      } else if (param == 'left') {
        this.selectedCompany = this.selectedCompany.slice(index)
      } else if (param == 'right') {
        this.selectedCompany = this.selectedCompany.slice(0, index + 1)
      } else if (param == 'others') {
        this.selectedCompany = [this.selectedCompany[index]]
      }
      this.tableData = []
      setTimeout(() => {
        this.getResult()
        this.tableLoading = false
        // this.$refs.resultTable.$forceUpdate()
      }, 300)
    },
    handleRemoveMethod(methodId, param) {
      this.tableLoading = true
      let index = this.selectedMethods.findIndex(item => item.id == methodId)
      if (param == 'this') {
        this.selectedMethods.splice(index, 1)
        this.tableData.splice(index, 1)
      } else if (param == 'top') {
        this.selectedMethods = this.selectedMethods.slice(index)
        this.tableData = this.tableData.slice(index)
      } else if (param == 'bottom') {
        this.selectedMethods = this.selectedMethods.slice(0, index + 1)
        this.tableData = this.tableData.slice(0, index + 1)
      } else if (param == 'others') {
        this.selectedMethods = [this.selectedMethods[index]]
        this.tableData = [this.tableData[index]]
      }
      this.tableLoading = false
    },
    handleShowDetail(data) {
      this.dialogVisibleDetail = true
    },
    handleChangeCompany(parentCompanyId, childCompany) {
      this.selectedCompany.every((item, index) => {
        if (item.unitCode == parentCompanyId) {
          if (item.subCompany && childCompany.unitCode == item.subCompany.unitCode) {
            return false
          }
          if (childCompany.unitLevel == 1 && !item.subCompany) {
            return false
          }
          if (childCompany.unitLevel == 1) {
            item.subCompany = null
            this.getResult()
            return false
          }
          this.selectedCompany[index].subCompany = childCompany
          setTimeout(() => {
            this.getResult()
          }, 10)
          return false
        }
        return true
      })
    },
    handleCreateChart(level, methodId, methodName) {
      this.drillingDataInfo.method = {
        methodId,
        methodName
      }
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
      if (level == -1) {
        return
      }
      this.selectedCompany.forEach(item => {
        item.subCompany = null
      })
      this.getResult()
    },
    handleChangeYear(year) {
      this.getResult()
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
    handleAddAll(target, searchVal) {
      if (target == 'method') {
        if (searchVal) {
          let methodsToAdd = this.getAllMethods().filter(item => (item.title.indexOf(searchVal) > -1 && !this.selectedMethods.some(seMethod => seMethod.id == item.id)))
          this.selectedMethods = this.selectedMethods.concat(methodsToAdd)
        } else {
          this.selectedMethods = this.getAllMethods()
        }
        this.getResult()
      } else if (target == 'company') {
        this.tableLoading = true

        setTimeout(() => {
          if (searchVal) {
            let companyListToAdd = this.companyList.filter(item => {
              return item.unitName.indexOf(searchVal) > -1
            })
            companyListToAdd.forEach(item => {
              this.addCompany(item)
            })
          } else {
            let companyListToAdd = this.companyList.filter(item => {
              return item.unitLevel == 1 && this.selectedCompany.findIndex(c => c.unitCode == item.unitCode) < 0
            })
            this.selectedCompany = (this.selectedCompany.concat(companyListToAdd))
          }

          this.getResult()
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs.resultTable.resizeFixedTableCol()
              this.tableLoading = false
            }, 10)
          })
        }, 300)
      }
    },
    handleDrillingData(companyId, level) {},
    handleClickSingleChart(data, index) {
      let company = this.singleMethodChartData.rows[index]
      this.drillingDataInfo.company = {
        companyId: company.id,
        companyName: company['单位']
      }
      this.showChartData = true
    },
    handleClickMultipleChart(data, index) {
      this.drillingDataInfo.method = {
        methodName: data.name
      }
      this.showChartData = true
    },
    handleCloseDrillingData() {
      this.drillingDataInfo = {
        method: null,
        company: null
      }
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

.chart-data {
  .el-dialog__body {
    padding-top: 5px;
    ;
  }
}

</style>
