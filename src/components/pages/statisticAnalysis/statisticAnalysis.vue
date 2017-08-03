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
        <p v-if="!this.selectedMethods.length && !this.selectedCompany.length" style="text-align:center">请从上方添加审计方法和单位数据</p>
        <div v-if="this.selectedMethods.length && !this.selectedCompany.length" style="height:100%;overflow:auto;">
          <p>选择审计方法和单位后将自动开始执行审计</p>
          <p>已选择方法：</p>
          <ul>
            <li v-for="method in this.selectedMethods">{{method.title}}</li>
          </ul>
        </div>
        <div v-if="this.selectedCompany.length && !this.selectedMethods.length" style="height:100%;overflow:auto;">
          <p>已选择单位</p>
          <ul>
            <li v-for="company in this.selectedCompany">
              <span v-if="company.subCompany">{{company.subCompany.unitName}}</span>
              <span v-else>{{company.unitName}}</span>
            </li>
          </ul>
        </div>
        <v-table ref="resultTable" v-loading="tableLoading" :element-loading-text="tableLoadingText" :tableData="tableData" @removeCompany="handleRemoveCompany" @removeMethod="handleRemoveMethod" @showDetail="handleShowDetail" @changeCompany="handleChangeCompany" @showCompanyChart="handleShowCompanyChart" @clearData="handleClearData" @showMethodChart="handleShowMethodChart" @changeLevel="handleChangeLevel" @changeYear="handleChangeYear" @drillingData="handleDrillData" @exportDataByMethod="handleExportDataByMethod" @exportDataByCell="handleExportDataByCell" @exportDoubtData="handleExportDoubtData" @exportStatisticData="handleExportStatisticData" @exportDataByCompany="handleExportDataByCompany" @showMethodChartMulti="handleShowMethodChartMulti"></v-table>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="疑点明细数据" :visible.sync="dialogVisibleDetail" size="full">
      <div class="detail-data-table" v-loading="detailDataLoading" element-loading-text="正在加载数据，请稍后...">
        <p v-if="drillingDataInfo.method && drillingDataInfo.method.methodName">审计方法：{{drillingDataInfo.method.methodName}}</p>
        <p v-if="drillingDataInfo.company && drillingDataInfo.company.companyName">被审计单位：{{drillingDataInfo.company.companyName}}</p>
        <p><span v-if="drillingDataInfo.resultCount">查询出总记录数为：<strong>{{ drillingDataInfo.resultCount }}</strong> 条<span v-if="drillingDataInfo.viewCount">，</span></span>显示记录数为：<strong>{{ drillingDataInfo.viewCount }}</strong>条</p>
        <el-table v-if="detailTableHeader" :data="detailTableData" max-height="500" border style="width: 100%">
          <el-table-column type="index" width="40">
          </el-table-column>
          <el-table-column v-for="(key, index) in Object.keys(detailTableHeader)" :show-overflow-tooltip="true" :key="index" :prop="key" :label="key" sortable>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="exportDataFromDetail">导出数据</el-button>
        <el-button type="primary" @click="dialogVisibleDetail = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图表" :visible.sync="showCompanyChart" size="large" class="chart-data">
      <p v-if="drillingDataInfo.method">当前方法：{{drillingDataInfo.method.methodName}}</p>
      <v-chart :chartData="companyChartData" defaultType="pie" @click="handleClickCompanyChart" @search="handleSearchAnotherCompany"></v-chart>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showCompanyChart = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图表" :visible.sync="showMethodChart" size="large">
      <v-chart :chartData="methodCharData" defaultType="pie" @click="handleClickMethodChart" @search="handleSearchAnotherMethod"></v-chart>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showMethodChart = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="多图表展示" :visible.sync="showMultiMethodChart" size="large">
      <v-chart-multi :chartData="multiChartData" :level="chartLevel" defaultType="pie" @click="handleClickMultiChart"></v-chart-multi>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showMultiMethodChart = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="根据一级单位钻取数据" :visible.sync="showDrillTable" size="large">
      <v-drill-table v-loading="drillLevel2Loading" element-loading-text="正在钻取数据，请稍后..." :data="drillData" :drillParent="drillParent" :drillLevel="drillLevel" @drillLevel2="handleDrillData" @showDrillDataDetail="handleShowDrillDataDetail"></v-drill-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleExportDataByPcode(1)">导出数据</el-button>
        <el-button type="primary" @click="showDrillTable = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="根据二级单位钻取数据" :visible.sync="showDrillTable2" size="large">
      <v-drill-table :data="drillData2" :drillParent="drillParent2" :drillLevel="2" @showDrillDataDetail="handleShowDrillDataDetail"></v-drill-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleExportDataByPcode(2)">导出数据</el-button>
        <el-button type="primary" @click="showDrillTable2 = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="搜索方法" :visible.sync="showSearchMethod" size="large">
      <v-search-method :methodList="methodTree" @commitData="handleCommitSearchMethod"></v-search-method>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSearchMethod = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="搜索单位" :visible.sync="showSearchCompany" size="large">
      <v-search-company :companyList="companyList" :searchLevel="drillingDataInfo.level" @commitData="handleCommitSearchCompany"></v-search-company>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSearchCompany = false">取消</el-button>
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
import vChart from './children/vChart'
import vChartMulti from './children/vChartMulti'
import vDrillTable from './children/drillTable'
import vSearchCompany from './children/searchCompany'
import vSearchMethod from './children/searchMethod'
export default {
  components: {
    vTree,
    vTable,
    vChart,
    vChartMulti,
    vDrillTable,
    vSearchCompany,
    vSearchMethod
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
      selectedCompany: [],
      tableData: [],
      tableLoading: false,
      tableLoadingText: '',
      publicLevel: 0,

      // 钻取数据
      dialogVisibleDetail: false,
      detailTableData: null,
      detailTableHeader: null,
      detailDataLoading: false,

      // 图表
      showCompanyChart: false,
      showMethodChart: false,
      companyChartData: null,
      methodCharData: null,
      chartMethodId: null,
      showSearchCompany: false,
      showSearchMethod: false,

      showMultiMethodChart: false,
      multiChartData: [],
      chartLevel: 0,

      // 一级钻取二级
      drillingDataInfo: {
        method: null,
        company: null
      },
      showDrillTable: false,
      drillData: null,
      drillParent: null,
      drillLevel: 1,

      // 二级钻取三级
      drillingDataInfo2: {
        method: null,
        company: null
      },
      showDrillTable2: false,
      drillData2: null,
      drillParent2: null,
      drillLevel2Loading: false,

      // 从明细数据导出文件
      exportDetailInfo: {}
    }
  },
  mounted() {
    this.loadMethodTree()
    this.loadCompanyList()
  },
  methods: {
    // 加载方法树
    loadMethodTree() {
      this.methodTreeLoading = true
      this.$http.post(urlStore.findAllListWithAuditItemAndAuditMethodModel).then(res => {
        if (res.ok) {
          this.methodTree = res.body.tree
          this.selectedMethods = _.clone(res.body.tree[0].children[0].children)
          if (this.selectedCompany.length) {
            this.getResult()
          }
        }
        this.methodTreeLoading = false
      }).catch(err => {
        this.$message({
          message: '请求审计方法数据出错',
          type: 'error'
        })
        this.methodTreeLoading = false
      })
    },
    // 加载单位
    loadCompanyList() {
      this.companyListLoading = true
      this.$http.get(urlStore.findUnitsList).then(res => {
        if (res.ok && res.body.success) {
          this.companyList = res.body.data
          this.selectedCompany = res.body.data.filter(item => item.unitLevel == 1).slice(0, 3)
          if (this.selectedMethods.length) {
            this.getResult()
          }
        }
        this.companyListLoading = false
      }).catch(err => {
        this.$message({
          message: '请求被审计单位数据出错',
          type: 'error'
        })
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
      }, 1200)
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
        this.selectedCompany.length && this.getResult()
      }
    },
    addCompany(data, noResult) {
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

          this.$refs.resultTable.selectedLevel = 4
        }
        let replacedCompany = this.selectedCompany.splice(index, 1, dataToReplace);
        (!noResult && this.selectedMethods.length) && this.getResult()
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
          this.$refs.resultTable.selectedLevel = 4
        }
        (!noResult && this.selectedMethods.length) && this.getResult()
      }
    },
    getResult() {
      this.tableLoading = true
      this.tableLoadingText = '正在请求数据...'
      let ret = []
      let level = this.publicLevel
      // let level = this.$refs.resultTable.selectedLevel
      // let unitCodes = this.selectedCompany.map(item => {
      //   if (item.subCompany && level == 4) {
      //     return {
      //       unitCode: item.subCompany.unitCode,
      //       unitLevel: 4
      //     }
      //   }
      //   return {
      //     unitCode: item.unitCode,
      //     unitLevel: this.publicLevel
      //   }
      // })
      let unitCodes
      if(this.selectedCompany.every(item => item.subCompany && item.subCompany.unitCode) && this.$refs.resultTable.selectedLevel == 4){
        level = 0
        unitCodes = this.selectedCompany.map(item => {
          return item.unitCode + ':' + item.subCompany.unitCode
        }).join(',')
      }else{
        if(level == 0){
          level = 4
        }
        unitCodes = this.selectedCompany.map(item => {
          if(item.subCompany && item.subCompany.unitCode){
            return item.unitCode + ':' + item.subCompany.unitCode
          }
          return item.unitCode
        }).join(',')
      }

      this.$http.get(urlStore.statisticQuery, {
        params: {
          year: this.$refs.resultTable.getSelectedYear(),
          // unitCodes: JSON.stringify(unitCodes),
          unitCodes: unitCodes,
          level: level,
          methodIds: this.selectedMethods.map(item => item.id).join(',')
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
                resultCount: 0,
                subCompany: company.subCompany
              })
            })
          } else {
            tmpData.units.forEach(item => {
              if (item.unitLevel == 1) {
                tmpCompany.push({
                  companyId: item.unitCode,
                  companyName: item.unitName,
                  resultCount: 0,
                  subCompany: null
                })
              } else {
                let targetCompany = this.selectedCompany.find(item2 => {
                  return item2.subCompany && item2.subCompany.unitCode == item.unitCode
                })
                tmpCompany.push({
                  companyId: targetCompany.unitCode,
                  companyName: targetCompany.unitName,
                  resultCount: null,
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
              obj.companies[index].resultCount = unit.resultCount
            })
            obj.sum = item.resultCount
            ret.push(obj)
          })
          this.tableData = ret

          setTimeout(() => {
            this.$refs.resultTable.resizeFixedTableCol()
            this.tableLoading = false
          }, 100)
        }
      }).catch(err => {
        this.$message({
          message: '查询数据失败',
          type: 'warning'
        })
        this.tableLoading = false
      })
    },
    handleRemoveCompany(companyId, companyIndex, param) {
      this.tableLoading = true
      this.tableLoadingText = '正在加载中...'
      let index = this.tableData[0].companies.findIndex(item => item.companyId == companyId)
      this.tableData.forEach(item => {
        if (param == 'this') {
          item.companies.splice(index, 1)
        } else if (param == 'left') {
          item.companies = item.companies.slice(index)
        } else if (param == 'right') {
          item.companies = item.companies.slice(0, index + 1)
        } else if (param == 'others') {
          item.companies = [item.companies[index]]
        }
      })
      // if (param == 'this') {
      //   this.selectedCompany.splice(index, 1)
      // } else if (param == 'left') {
      //   this.selectedCompany = this.selectedCompany.slice(index)
      // } else if (param == 'right') {
      //   this.selectedCompany = this.selectedCompany.slice(0, index + 1)
      // } else if (param == 'others') {
      //   this.selectedCompany = [this.selectedCompany[index]]
      // }

      let tmpArr = []
      this.tableData[0].companies.forEach(item => {
        let tmpData = this.selectedCompany.find(com => com.unitCode == item.companyId)
        if(tmpData){
          tmpArr.push(tmpData)
        }
      })
      this.selectedCompany = tmpArr

      let tmpData = this.tableData
      this.tableData = []
      setTimeout(() => {
        // this.getResult()
        this.tableData = tmpData
        this.tableLoading = false
        // this.$refs.resultTable.$forceUpdate()
      }, 300)
    },
    handleRemoveMethod(methodId, param) {
      this.tableLoading = true
      let index = this.tableData.findIndex(item => item.method.methodId == methodId)
      if (param == 'this') {
        this.tableData.splice(index, 1)
      } else if (param == 'top') {
        this.tableData = this.tableData.slice(index)
      } else if (param == 'bottom') {
        this.tableData = this.tableData.slice(0, index + 1)
      } else if (param == 'others') {
        this.tableData = [this.tableData[index]]
      }
      let tmpMethods = []
      this.tableData.forEach((item, index) => {
        let tmpData = this.selectedMethods.find(method => method.id == item.method.methodId)
        if(tmpData){
          tmpMethods.push(tmpData)
        }
      })
      this.selectedMethods = tmpMethods
      this.tableLoading = false
    },
    handleShowDetail(data, resultCount) {
      this.drillingDataInfo.resultCount = resultCount

      this.detailTableHeader = null
      this.detailTableData = null
      this.drillingDataInfo.viewCount = 0

      this.tableLoading = true
      this.tableLoadingText = '正在加载数据，请稍后...'
      this.$http.post(urlStore.viewResultData, data, {
        emulateJSON: true
      }).then(res => {
        if (res.ok) {
          this.dialogVisibleDetail = true
          this.detailTableHeader = res.body.tableHeader
          this.detailTableData = res.body.tableData
          this.drillingDataInfo.viewCount = res.body.tableData.length

          this.exportDetailInfo = data
        }
        this.tableLoading = false
      }).catch(err => {
        this.drillingDataInfo.viewCount = 0
        this.tableLoading = false
      })
    },
    handleShowDrillDataDetail(data, resultCount) {
      this.drillingDataInfo.resultCount = resultCount
      data.year = this.$refs.resultTable.getSelectedYear()

      this.detailTableHeader = null
      this.detailTableData = null
      this.drillingDataInfo.viewCount = 0

      this.detailDataLoading = true
      this.dialogVisibleDetail = true
      this.$http.post(urlStore.viewResultData, data, {
        emulateJSON: true
      }).then(res => {
        if (res.ok && res.body.tableHeader) {
          this.detailTableHeader = res.body.tableHeader
          this.detailTableData = res.body.tableData
          this.drillingDataInfo.viewCount = res.body.tableData.length
          this.drillingDataInfo.methodId = data.methodId
          this.drillingDataInfo.unitCodes = data.unitCodes
          this.drillingDataInfo.year = data.year
          this.exportDetailInfo = data
        } else if (res.ok && !res.body.tableHeader) {
          this.$message({
            message: '未查到数据',
            type: 'info'
          })
        }
        this.detailDataLoading = false
      }).catch(err => {
        this.drillingDataInfo.viewCount = 0
        this.detailDataLoading = false
      })
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
            if (!this.selectedCompany[index].subCompany) {
              this.selectedCompany[index].subCompany = childCompany
            }
            this.getResult()
          }, 10)
          return false
        }
        return true
      })
    },
    handleShowCompanyChart(level, methodId, methodName) {
      this.tableLoading = true
      this.tableLoadingText = '正在生成图表，请稍后'
      // let unitCodes = this.selectedCompany.map(item => {
      //   return {
      //     unitCode: item.unitCode,
      //     unitLevel: level
      //   }
      // })
      let unitCodes = this.selectedCompany.map(item => {
        if(item.subCompany && item.subCompany.unitCode){
          return item.unitCode + ':' + item.subCompany.unitCode
        }
        return item.unitCode
      }).join(',')
      this.$http.get(urlStore.statisticQuery, {
        params: {
          year: this.$refs.resultTable.getSelectedYear(),
          unitCodes: unitCodes,
          level: level == 0?4:level,
          methodIds: methodId,
          topRow: 10,
          topType: 'unit'
        }
      }).then(res => {
        if (res.ok) {
          let tmpData = {
            columns: ['单位', '问题数'],
            rows: []
          }

          res.body.data[0].units.forEach(item => {
            tmpData.rows.push({
              '单位': item.unitName,
              '问题数': item.resultCount,
              unitCode: item.unitCode
            })
          })

          this.drillingDataInfo.method = {
            methodId,
            methodName
          }
          this.drillingDataInfo.level = level
          this.drillingDataInfo.resultCount = res.body.data[0].resultCount

          this.exportDetailInfo.methodId = methodId
          this.exportDetailInfo.level = level
          this.exportDetailInfo.year = this.$refs.resultTable.getSelectedYear()

          this.companyChartData = tmpData
          this.showCompanyChart = true
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          message: '请求出错',
          type: 'warning'
        })
        this.tableLoading = false
      })
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
        // this.loadMethodTree()
        // this.loadCompanyList()
        this.$message({
          type: 'success',
          message: '已清空!'
        });
      }).catch(() => {

      })
    },
    handleShowMethodChart(level) {
      this.tableLoading = true
      this.tableLoadingText = '正在生成图表，请稍后'
      // let unitCodes = this.selectedCompany.map(item => {
      //   return {
      //     unitCode: item.unitCode,
      //     unitLevel: level
      //   }
      // })
      let unitCodes = this.selectedCompany.map(item => {
        if(item.subCompany && item.subCompany.unitCode){
          return item.unitCode + ':' + item.subCompany.unitCode
        }
        return item.unitCode
      }).join(',')
      this.$http.get(urlStore.statisticQuery, {
        params: {
          year: this.$refs.resultTable.getSelectedYear(),
          unitCodes: unitCodes,
          level: level == 0?4:level,
          methodIds: this.selectedMethods.map(item => item.id).join(','),
          topRow: 10,
          topType: 'method'
        }
      }).then(res => {
        if (res.ok) {
          let tmpData = {
            columns: ['审计方法', '问题数'],
            rows: []
          }

          res.body.data.forEach(item => {
            tmpData.rows.push({
              '审计方法': item.methodName,
              '问题数': item.resultCount,
              methodId: item.methodId
            })
          })

          this.methodCharData = tmpData
          this.showMethodChart = true

          this.drillingDataInfo.level = level

          this.exportDetailInfo.unitCodes = JSON.stringify(this.selectedCompany.map(item => {
            return {
              unitCode: item.unitCode,
              unitLevel: level
            }
          }))
          this.exportDetailInfo.year = this.$refs.resultTable.getSelectedYear()
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          message: '请求出错',
          type: 'warning'
        })
        this.tableLoading = false
      })
    },
    handleShowMethodChartMulti(level){
      this.tableLoading = true
      this.tableLoadingText = '正在生成图表，请稍后'
      // let unitCodes = this.selectedCompany.map(item => {
      //   return {
      //     unitCode: item.unitCode,
      //     unitLevel: level
      //   }
      // })

      let unitCodes = this.selectedCompany.map(item => {
        if(item.subCompany && item.subCompany.unitCode){
          return item.unitCode + ':' + item.subCompany.unitCode
        }
        return item.unitCode
      }).join(',')
      let methodIds = this.selectedMethods.map(item => item.id).join(',')
      let year = this.$refs.resultTable.getSelectedYear()
      this.$http.get(urlStore.statisticQuery, {
        params: {
          year,
          // unitCodes: JSON.stringify(unitCodes),
          level: level == 0?4:level,
          unitCodes: unitCodes,
          methodIds,
          topRow: 10,
          topType: 'unit'
        }
      }).then(res => {
        if(res.ok){
          this.showMultiMethodChart = true
          this.tableLoading = false
          this.chartLevel = level
          let tmpArr = []
          res.body.data.forEach(item => {
            let tmpData = {
              columns: ['单位', '问题数'],
              rows: [],
              methodId: item.methodId,
              methodName: item.methodName
            }
            item.units.forEach(unit => {
              tmpData.rows.push({
                '单位': unit.unitName,
                '问题数': unit.resultCount,
                methodId: item.methodId,
                unitCode: unit.unitCode
              })
            })
            tmpArr.push(tmpData)
          })
          this.multiChartData = tmpArr
        }
      }).catch(err => {
        this.tableLoading = false
        this.$message({
          message: '请求出错',
          type: 'warning'
        })
      })
    },
    handleChangeLevel(level) {
      if (level == 4) {
        return
      }
      this.publicLevel = level
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
        this.tableLoading = '正在请求数据...'

        setTimeout(() => {
          if (searchVal) {
            let companyListToAdd = this.companyList.filter(item => {
              return item.unitName.indexOf(searchVal) > -1
            })
            companyListToAdd.forEach(item => {
              this.addCompany(item)
            })
            setTimeout(() => {
              this.getResult()
            }, 20)
          } else {
            let companyListToAdd = this.companyList.filter(item => {
              return item.unitLevel == 1 && !this.selectedCompany.some(c => c.unitCode == item.unitCode)
            })
            this.selectedCompany = (this.selectedCompany.concat(companyListToAdd))
            this.getResult()
          }
        }, 300)
      }
    },
    handleClickCompanyChart(data, index) {
      this.drillingDataInfo.resultCount = data.value
      let company = this.companyChartData.rows[index]
      this.drillingDataInfo.company = {
        companyId: company.unitCode,
        companyName: company['单位']
      }
      this.detailTableHeader = null
      this.detailTableData = null
      this.detailDataLoading = true
      this.dialogVisibleDetail = true
      this.$http.post(urlStore.viewResultData, {
        unitCodes: JSON.stringify([{
          unitCode: this.drillingDataInfo.company.companyId,
          unitLevel: this.drillingDataInfo.level
        }]),
        methodId: this.drillingDataInfo.method.methodId,
        year: this.$refs.resultTable.getSelectedYear()
      }, {
        emulateJSON: true
      }).then(res => {
        if (res.ok) {
          this.detailTableHeader = res.body.tableHeader
          this.detailTableData = res.body.tableData
          this.drillingDataInfo.viewCount = res.body.tableData.length

          this.exportDetailInfo.unitCodes = JSON.stringify([{
            unitCode: company.unitCode,
            unitLevel: this.exportDetailInfo.level
          }])
        }
        this.detailDataLoading = false
      }).catch(err => {
        this.detailDataLoading = false
      })
    },
    handleClickMethodChart(data, index) {
      this.drillingDataInfo.method = {
        methodId: this.selectedMethods.find(item => item.title == data.name).id,
        methodName: data.name
      }
      this.drillingDataInfo.resultCount = data.value
      this.drillingDataInfo.company = null
      this.detailTableHeader = null
      this.detailTableData = null
      this.detailDataLoading = true
      this.dialogVisibleDetail = true
      this.$http.post(urlStore.viewResultData, {
        unitCodes: JSON.stringify(this.selectedCompany.map(item => {
          return {
            unitCode: item.unitCode,
            unitLevel: this.drillingDataInfo.level
          }
        })),
        methodId: this.drillingDataInfo.method.methodId,
        year: this.$refs.resultTable.getSelectedYear()
      }, {
        emulateJSON: true
      }).then(res => {
        if (res.ok) {
          this.detailTableHeader = res.body.tableHeader
          this.detailTableData = res.body.tableData
          this.drillingDataInfo.viewCount = res.body.tableData.length

          this.exportDetailInfo.methodId = this.drillingDataInfo.method.methodId
        } else {
          this.$message({
            message: '未查询到数据',
            type: 'info'
          })
        }
        this.detailDataLoading = false
      }).catch(err => {
        this.detailDataLoading = false
      })
    },
    handleClickMultiChart(data){
      this.drillingDataInfo.company = null
      this.detailTableHeader = null
      this.detailTableData = null

      this.drillingDataInfo.method = {
        methodId: data.methodId,
        methodName: data.methodName
      }
      this.drillingDataInfo.company = {
        companyName: data.unitName
      }
      this.drillingDataInfo.resultCount = data.resultCount
      this.detailDataLoading = true
      this.dialogVisibleDetail = true
      this.$http.post(urlStore.viewResultData, {
        unitCodes: data.unitCodes,
        methodId: data.methodId,
        year: this.$refs.resultTable.getSelectedYear()
      }, {
        emulateJSON: true
      }).then(res => {
        if (res.ok) {
          this.detailTableHeader = res.body.tableHeader
          this.detailTableData = res.body.tableData
          this.drillingDataInfo.viewCount = res.body.tableData.length

          this.exportDetailInfo.methodId = this.drillingDataInfo.method.methodId
        } else {
          this.$message({
            message: '未查询到数据',
            type: 'info'
          })
        }
        this.detailDataLoading = false
      }).catch(err => {
        this.detailDataLoading = false
      })
    },
    handleCloseDrillingData() {
      this.drillingDataInfo = {
        method: null,
        company: null
      }
    },

    // 钻取数据
    handleDrillData(companyId, level) {
      if (level == 1) {
        this.handleDrillLevel1(companyId)
      } else if (level == 2) {
        this.handleDrillLevel2(companyId)
      } else if (level == 3) {
        this.$message({
          message: '无法继续钻取：该单位为三级单位',
          type: 'warning'
        })
        return
      }
    },
    handleDrillLevel1(companyId) {
      this.tableLoading = true
      this.tableLoadingText = '正在钻取数据，请稍后...'
      this.$http.post(urlStore.dataDrillByPcode, {
        year: this.$refs.resultTable.getSelectedYear(),
        pCode: companyId,
        methodIds: this.selectedMethods.map(item => item.id).join(',')
      }, {
        emulateJSON: true
      }).then(res => {
        if (res.ok && res.body.success) {
          if (!res.body.data.length || !res.body.data[0].units.length) {
            this.$message({
              message: '无法继续钻取：该单位没有下属单位',
              type: 'info'
            })
          } else {
            this.drillData = res.body.data
            this.drillParent = this.companyList.find(item => item.unitCode == companyId)
            this.drillLevel = 1
            this.showDrillTable = true
          }
        } else {
          this.$message({
            message: res.body.msg || '请求出错',
            type: 'warning'
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
        this.$message({
          message: '请求出错',
          type: 'warning'
        })
      })
    },
    handleDrillLevel2(companyId) {
      this.drillLevel2Loading = true
      this.$http.post(urlStore.dataDrillByPcode, {
        year: this.$refs.resultTable.getSelectedYear(),
        pCode: companyId,
        methodIds: this.selectedMethods.map(item => item.id).join(',')
      }, {
        emulateJSON: true
      }).then(res => {
        if (res.ok && res.body.success) {
          if (!res.body.data.length || !res.body.data[0].units.length) {
            this.$message({
              message: '无法继续钻取：该单位没有下属单位',
              type: 'info'
            })
          } else {
            this.drillData2 = res.body.data
            this.drillParent2 = this.companyList.find(item => item.unitCode == companyId)
            this.showDrillTable2 = true
          }
        } else {
          this.$message({
            message: res.body.msg || '请求出错',
            type: 'warning'
          })
        }
        this.drillLevel2Loading = false
      }).catch(err => {
        this.drillLevel2Loading = false
        this.$message({
          message: '请求出错',
          type: 'warning'
        })
      })
    },
    handleExportDataByMethod(level, methodId) {
      let unitCodes = this.selectedCompany.map(item => {
        return {
          unitCode: item.unitCode,
          unitLevel: level
        }
      })
      let param = {
        methodIds: methodId,
        year: this.$refs.resultTable.getSelectedYear(),
        unitCodes: JSON.stringify(unitCodes)
      }

      window.open(`${urlStore.export}?methodIds=${param.methodIds}&year=${param.year}&unitCodes=${encodeURIComponent(param.unitCodes)}`)
    },
    handleExportDataByCell(methodId, companyId) {
      let param = {
        methodIds: methodId,
        year: this.$refs.resultTable.getSelectedYear(),
        unitCodes: [{
          unitCode: companyId,
          unitLevel: 0
        }]
      }
      if (this.$refs.resultTable.selectedLevel != 0) {
        if (this.$refs.resultTable.selectedLevel == 4) {
          let company = this.selectedCompany.find(item => item.unitCode == companyId)
          if (company && company.subCompany) {
            param.unitCodes = [{
              unitCode: company.subCompany.unitCode,
              unitLevel: 4
            }]
          }
        } else {
          param.unitCodes[0].unitLevel = this.$refs.resultTable.selectedLevel
        }
      }
      param.unitCodes = JSON.stringify(param.unitCodes)

      window.open(`${urlStore.export}?methodIds=${param.methodIds}&year=${param.year}&unitCodes=${encodeURIComponent(param.unitCodes)}`)
    },
    handleExportDataByCompany(unitCode, unitLevel, year) {
      let methodIds = this.selectedMethods.map(item => item.id).join(',')
      let unitCodes = JSON.stringify([{
        unitCode: unitCode,
        unitLevel: unitLevel
      }])
      window.open(`${urlStore.export}?methodIds=${methodIds}&year=${year}&unitCodes=${encodeURIComponent(unitCodes)}`)
    },
    handleExportDataByPcode(drillLevel) {
      let methodIds
      let unitCodes
      if (drillLevel == 1) {
        methodIds = this.drillData.map(item => item.methodId).join(',')
        unitCodes = this.drillData[0].units.map(item => {
          return {
            unitCode: item.unitCode,
            unitLevel: 2
          }
        })
      } else {
        methodIds = this.drillData2.map(item => item.methodId).join(',')
        unitCodes = this.drillData2[0].units.map(item => {
          return {
            unitCode: item.unitCode,
            unitLevel: 3
          }
        })
      }
      let param = {
        methodIds: methodIds,
        year: this.$refs.resultTable.getSelectedYear(),
        unitCodes: JSON.stringify(unitCodes)
      }
      window.open(`${urlStore.export}?methodIds=${param.methodIds}&year=${param.year}&unitCodes=${encodeURIComponent(param.unitCodes)}`)
    },
    exportDataFromDetail() {
      let companyInfo
      if (this.showMethodChart) {
        companyInfo = JSON.stringify(this.selectedCompany.map(item => {
          return {
            unitCode: item.unitCode,
            unitLevel: this.drillingDataInfo.level
          }
        }))
      } else {
        companyInfo = this.exportDetailInfo.unitCodes
      }
      window.open(`${urlStore.export}?methodIds=${this.exportDetailInfo.methodId}&year=${this.exportDetailInfo.year}&unitCodes=${encodeURIComponent(companyInfo)}`)
    },
    handleExportDoubtData() {
      let param = {
        methodIds: this.selectedMethods.map(item => item.id).join(','),
        year: this.$refs.resultTable.getSelectedYear()
      }
      let level = this.$refs.resultTable.selectedLevel
      let units
      if (level == 4) {
        units = this.selectedCompany.map(item => {
          if (item.subCompany) {
            return {
              unitCode: item.subCompany.unitCode,
              unitLevel: 4
            }
          }
          return {
            unitCode: item.unitCode,
            unitLevel: 0
          }
        })
      } else {
        units = this.selectedCompany.map(item => {
          return {
            unitCode: item.unitCode,
            unitLevel: level
          }
        })
      }
      window.open(`${urlStore.export}?methodIds=${param.methodIds}&year=${param.year}&unitCodes=${encodeURIComponent(JSON.stringify(units))}`)
    },
    handleExportStatisticData() {
      let param = {
        methodIds: this.selectedMethods.map(item => item.id).join(','),
        year: this.$refs.resultTable.getSelectedYear()
      }
      let level = this.$refs.resultTable.selectedLevel
      let units
      if (level == 4) {
        units = this.selectedCompany.map(item => {
          if (item.subCompany) {
            return {
              unitCode: item.subCompany.unitCode,
              unitLevel: 4
            }
          }
          return {
            unitCode: item.unitCode,
            unitLevel: 0
          }
        })
      } else {
        units = this.selectedCompany.map(item => {
          return {
            unitCode: item.unitCode,
            unitLevel: level
          }
        })
      }
      window.open(`${urlStore.exportStatisticData}?methodIds=${param.methodIds}&year=${param.year}&unitCodes=${encodeURIComponent(JSON.stringify(units))}`)
    },
    handleSearchAnotherCompany() {
      this.showSearchCompany = true
    },
    handleSearchAnotherMethod() {
      this.showSearchMethod = true
    },
    handleCommitSearchCompany(company) {
      if (!company) {
        return
      }
      this.handleShowDetail({
        methodId: this.drillingDataInfo.method.methodId,
        unitCodes: JSON.stringify([{
          unitCode: company.unitCode,
          unitLevel: this.drillingDataInfo.level
        }]),
        year: this.$refs.resultTable.getSelectedYear()
      })
    },
    handleCommitSearchMethod(method) {
      if (!method) {
        return
      }
      let codes = this.selectedCompany.map(item => {
        return {
          unitCode: item.unitCode,
          unitLevel: this.drillingDataInfo.level
        }
      })
      this.handleShowDetail({
        methodId: method.id,
        unitCodes: JSON.stringify(codes),
        year: this.$refs.resultTable.getSelectedYear()
      })
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
  .detail-data-table {
    min-height: 200px;
    .el-table {
      th>.cell {
        padding: 0 3px;
        font-size: 12px;
      }
      td {
        height: 30px;
        .cell {
          font-size: 12px;
          padding: 0 5px;
        }
      }
    }
  }

  .el-dialog {
    top: 6%!important;
  }

  .el-dialog--full {
    top: 0%!important;
    .el-dialog__body {
      height: calc(100% - 120px);
      padding: 10px;
      overflow: auto;
    }
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
