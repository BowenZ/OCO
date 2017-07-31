<template>
  <div class="table-box" v-loading="tableLoading">
    <el-table ref="resultTable" v-if="tableData && tableData.length" :data="tableData" border style="width: 100%" height="100%" @cell-mouse-enter="handleHoverCell" @cell-mouse-leave="handleLeaveCell" :summary-method="getSummaries" show-summary @cell-click="handleClickCell">
      <el-table-column fixed prop="method" label="" show-overflow-tooltip width="140">
        <template scope="scope">
          <span>{{scope.row.method.methodName}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(company, index) in tableData[0].companies" :key="index" :prop="'company-'+company.companyId" :label="company.companyName" :render-header="renderHeaderFunction">
        <el-table-column :prop="'company-'+company.companyId" :label="company.subCompany?company.subCompany.unitName:''" show-overflow-tooltip min-width="100" :render-header="renderHeaderFunction2">
          <template scope="scope">
            <span>{{scope.row.companies[index].issues}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="sum" fixed="right" label="" show-overflow-tooltip width="150">
      </el-table-column>
    </el-table>
    <div class="covers" v-if="tableData && tableData.length && tableData[0].companies.length">
      <div class="year-selector">
        <el-popover ref="popover" placement="top" width="200" v-model="popVisible">
          <el-select style="width:120px;" v-model="selectedYear" multiple placeholder="请选择年份" size="small">
            <el-option v-for="(item, index) in years" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-button type="primary" size="small" @click="changeYear">确定</el-button>
        </el-popover>
        <el-button type="text" v-popover:popover>审计年度</el-button>
      </div>
      <div class="level-selector">
        <el-select v-model="selectedLevel" placeholder="各单位汇总（全）" size="small" @change="handleChangeLevel">
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span class="left-bottom-copy">各方法汇总</span>
      <div class="menu">
        <el-dropdown trigger="click" @command="handleMenuCommand" @visible-change="handleMenuVisible">
          <span class="el-dropdown-link">
            菜单<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="table-menu">
            <el-dropdown-item command="clearData" class="hide-trigger">清空数据</el-dropdown-item>
            <el-dropdown-item class="dropdown-item-chart" data-multi="1">生成多方法图形报表<i class="el-icon-caret-right"></i></el-dropdown-item>
            <el-dropdown-item command="exportDoubtData" class="hide-trigger">导出当前疑点数据</el-dropdown-item>
            <el-dropdown-item command="exportStatisticData" class="hide-trigger">导出当前统计信息</el-dropdown-item>
            <el-dropdown-item class="dropdown-item-chart">生成统计方法图形报表<i class="el-icon-caret-right"></i></el-dropdown-item>
            <ul class="el-dropdown-menu" v-show="dropdownMenuVisible">
              <li class="el-dropdown-menu__item" @click="showMethodChart(0)">所有单位</li>
              <li class="el-dropdown-menu__item" @click="showMethodChart(1)">一级单位</li>
              <li class="el-dropdown-menu__item" @click="showMethodChart(2)">二级单位</li>
              <li class="el-dropdown-menu__item" @click="showMethodChart(3)">三级单位</li>
            </ul>
            <ul class="el-dropdown-menu" v-show="dropdownMenuVisible2">
              <li class="el-dropdown-menu__item" @click="showMethodChartMulti(0)">所有单位</li>
              <li class="el-dropdown-menu__item" @click="showMethodChartMulti(1)">一级单位</li>
              <li class="el-dropdown-menu__item" @click="showMethodChartMulti(2)">二级单位</li>
              <li class="el-dropdown-menu__item" @click="showMethodChartMulti(3)">三级单位</li>
            </ul>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="right-menu" v-show="righeMenuVisible">
      <div class="company-menu el-cascader-menus" v-show="companyMenuVisible">
        <ul class="el-cascader-menu">
          <li class="el-cascader-menu__item" @click="removeCompany('this')">移除该单位</li>
          <li class="el-cascader-menu__item" @click="removeCompany('left')">移除左侧所有单位</li>
          <li class="el-cascader-menu__item" @click="removeCompany('right')">移除右侧所有单位</li>
          <li class="el-cascader-menu__item" @click="removeCompany('others')">移除其他所有单位</li>
          <li class="el-cascader-menu__item el-cascader-menu__item--extensible secondary-item">导出该单位数据</li>
        </ul>
        <ul class="el-cascader-menu" v-show="companySecondaryMenuVisible">
          <li class="el-cascader-menu__item" @click="exportDataByCompany(0)">导出所有单位</li>
          <li class="el-cascader-menu__item" @click="exportDataByCompany(1)">导出一级单位</li>
          <li class="el-cascader-menu__item" @click="exportDataByCompany(2)">导出二级单位</li>
          <li class="el-cascader-menu__item" @click="exportDataByCompany(3)">导出三级单位</li>
        </ul>
      </div>
      <div class="method-menu el-cascader-menus" v-show="methodMenuVisible">
        <ul class="el-cascader-menu">
          <li class="el-cascader-menu__item" @click="removeMethod('this')">移除该方法</li>
          <li class="el-cascader-menu__item" @click="removeMethod('top')">移除上方所有方法</li>
          <li class="el-cascader-menu__item" @click="removeMethod('bottom')">移除下方所有方法</li>
          <li class="el-cascader-menu__item" @click="removeMethod('others')">移除其他所有方法</li>
          <li class="el-cascader-menu__item el-cascader-menu__item--extensible secondary-item1">导出该方法数据</li>
          <li class="el-cascader-menu__item el-cascader-menu__item--extensible secondary-item2">生成该方法图形报表</li>
        </ul>
        <ul class="el-cascader-menu" v-show="methodSecondaryMenuVisible1">
          <li class="el-cascader-menu__item" @click="exportDataByMethod(0)">导出所有单位数据</li>
          <li class="el-cascader-menu__item" @click="exportDataByMethod(1)">导出一级单位数据</li>
          <li class="el-cascader-menu__item" @click="exportDataByMethod(2)">导出二级单位数据</li>
          <li class="el-cascader-menu__item" @click="exportDataByMethod(3)">导出三级单位数据</li>
        </ul>
        <ul class="el-cascader-menu" v-show="methodSecondaryMenuVisible2">
          <li class="el-cascader-menu__item" @click="showCompanyChart(0)">所有单位报表</li>
          <li class="el-cascader-menu__item" @click="showCompanyChart(1)">一级单位报表</li>
          <li class="el-cascader-menu__item" @click="showCompanyChart(2)">二级单位报表</li>
          <li class="el-cascader-menu__item" @click="showCompanyChart(3)">三级单位报表</li>
        </ul>
      </div>
      <div class="issue-menu el-cascader-menus" v-show="issueMenuVisible">
        <ul class="el-cascader-menu">
          <li class="el-cascader-menu__item" @click="exportDataByCell">导出该疑点数据</li>
        </ul>
      </div>
    </div>
    <el-dialog class="search-company" title="搜索单位" :visible.sync="headCompanyVisible" size="small" @close="handleCloseSearch">
      <div @keyup.enter.stop="searchCompany">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
      </div>
      <el-tree v-loading="searchCompanyLoading" class="company-tree" :data="companyData" :props="defaultProps" default-expand-all empty-text="无数据：该单位无下属单位" :filter-node-method="filterNode" ref="companyTree" node-key="id" highlight-current @current-change="handleCompanyTreeChange">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="headCompanyVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChangeCompany">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import renderFunctions from './renderFunctions'
import urlStore from '@/api/urlStore.js'
export default {
  props: {
    tableData: {
      type: Array
    }
  },
  data() {
    return {
      years: this.getYearArr(),
      selectedYear: [2016],
      popVisible: false,
      levelOptions: [{
        value: 0,
        label: '各单位汇总（全）'
      }, {
        value: 1,
        label: '各单位汇总（一）'
      }, {
        value: 2,
        label: '各单位汇总（二）'
      }, {
        value: 3,
        label: '各单位汇总（三）'
      }, {
        value: 4,
        label: '自定义'
      }],
      selectedLevel: 0,

      righeMenuVisible: false,
      companyMenuVisible: false,
      methodMenuVisible: false,
      issueMenuVisible: false,
      companySecondaryMenuVisible: false,
      methodSecondaryMenuVisible1: false,
      methodSecondaryMenuVisible2: false,

      currentHoverCell: null,
      currentRightCompanyId: null,
      currentRightCompanyIndex: 0,
      currentRightMethod: null,

      // 点击表头搜索单位
      searchCompanyLoading: false,
      currentHeadCompany: null,
      headCompanyVisible: null,
      filterText: '',
      selectedTreeCompany: null,
      companyData: [],
      defaultProps: {
        children: 'children',
        label: 'unitName'
      },

      dropdownMenuVisible: false,
      dropdownMenuVisible2: false,

      tableLoading: false,

      scrollBarWidth: 0
    }
  },
  watch: {
    tableData: function(newVal) {
      setTimeout(() => {
        this.addEventListener()
        this.resizeFixedTableCol()
      }, 100)
    },
    currentHeadCompany: function(newVal) {
      this.searchCompanyLoading = true
      this.companyData = []
      this.$http.post(urlStore.findUnitTreeByPcode, {
        pCode: this.currentHeadCompany
      }, {
        emulateJSON: true
      }).then(res => {
        if (res.ok && res.body.status) {
          this.companyData = res.body.data
        } else {
          this.$message({
            message: '请求出现错误：' + res.body.msg,
            type: 'warning'
          })
        }
        this.searchCompanyLoading = false
      }).then(err => {
        this.searchCompanyLoading = false
      })
    }
  },
  mounted() {
    this.scrollBarWidth = this._getScrollbarWidth()
    setTimeout(() => {
      this.addEventListener()
      $(this.$el).find('.company-menu .secondary-item').on('mouseenter', (event) => {
        event.preventDefault();
        this.companySecondaryMenuVisible = true
      })
      $(this.$el).find('.method-menu .secondary-item1').on('mouseenter', (event) => {
        event.preventDefault();
        this.methodSecondaryMenuVisible2 = false
        this.methodSecondaryMenuVisible1 = true
      })
      $(this.$el).find('.method-menu .secondary-item2').on('mouseenter', (event) => {
        event.preventDefault();
        this.methodSecondaryMenuVisible1 = false
        this.methodSecondaryMenuVisible2 = true
      })
      // $('body').append('<div class="el-tooltip__popper is-dark el-fade-in-linear-enter-to table-head-tooltip"></div>')
    }, 100)
  },
  methods: {
    _getScrollbarWidth() {
      var oP = document.createElement('p'),
        styles = {
          width: '100px',
          height: '100px',
          overflowY: 'scroll'
        },
        i, scrollbarWidth;
      for (i in styles) oP.style[i] = styles[i];
      document.body.appendChild(oP);
      scrollbarWidth = oP.offsetWidth - oP.clientWidth;
      oP.remove();
      return scrollbarWidth;
    },
    resizeFixedTableCol() {
      let $el = $(this.$el)
      this.$refs.resultTable && this.$refs.resultTable.doLayout()
      let height = $el.find('.el-table__fixed .el-table__fixed-header-wrapper').height() + $el.find('.el-table__fixed .el-table__fixed-body-wrapper').height()
      $el.find('.el-table__fixed-right, .el-table__fixed').height(height)
      $el.find('.el-table__fixed-right').css('right', `${this.scrollBarWidth}px`)
      $el.find('.el-table__fixed-right-patch').width(this.scrollBarWidth)
    },
    // +++++++搜索单位++++++++
    searchCompany() {
      this.$refs.companyTree.filter(this.filterText)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.unitName.indexOf(value) !== -1;
    },
    handleCompanyTreeChange(data, node) {
      this.selectedTreeCompany = data
    },
    confirmChangeCompany() {
      this.headCompanyVisible = false
      if (!this.selectedTreeCompany) {
        return
      }
      this.selectedLevel = 4
      this.$emit('changeCompany', this.currentHeadCompany, _.clone(this.selectedTreeCompany))
      this.selectedTreeCompany = null
    },
    // ++++++++++++++++++++++
    getSummaries(param) {
      const {
        columns,
        data
      } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[0] = ''
          return
        }
        if (index === columns.length - 1) {
          sums[index] = ''
          return
        }
        const values = data.map(item => {
          return Number(item.companies[index - 1].issues)
        })
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            return prev + curr
          })
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums;
    },
    getYearArr() {
      return [2016]
      let ret = []
      let currentYear = (new Date()).getFullYear()
      let n = 10
      while (n--) {
        ret.push(currentYear - n)
      }
      return ret.reverse()
    },
    getSelectedYear() {
      return this.selectedYear.join(',')
    },
    addEventListener() {
      let $table = $(this.$el).find('.el-table')
      let $menu = $(this.$el).find('.right-menu')
      $(document).off()
      $(document).click((event) => {
        this.righeMenuVisible = false
        this.companySecondaryMenuVisible = false
        this.methodSecondaryMenuVisible1 = false
        this.methodSecondaryMenuVisible2 = false
      })
      $table.off()
      $table.on('contextmenu', (event) => {
        let $target = $(event.target)
        event.preventDefault()
        this.righeMenuVisible = false
        this.companySecondaryMenuVisible = false
        this.methodSecondaryMenuVisible1 = false
        this.methodSecondaryMenuVisible2 = false
        if ($target.parents('.el-table__fixed-header-wrapper').length) {
          this.righeMenuVisible = false
          return
        }
        if (this.currentHoverCell) {
          if (this.currentHoverCell.col.property == 'method') {
            this.companyMenuVisible = false
            this.issueMenuVisible = false
            this.methodMenuVisible = true
            this.currentRightMethod = this.currentHoverCell.row.method
          } else if (this.currentHoverCell.col.property.match('company')) {
            this.companyMenuVisible = false
            this.methodMenuVisible = false
            this.issueMenuVisible = true
            this.currentRightMethod = this.currentHoverCell.row.method
            this.currentRightCompanyId = this.currentHoverCell.col.property.split('-').pop()
          } else if (this.currentHoverCell.col.property == 'sum') {
            this.righeMenuVisible = false
            return
          }
          this.righeMenuVisible = true
        } else if ($target.data('id')) {
          // if ($target.hasClass('el-table__fixed') || $target.hasClass('el-table__fixed-right') || $target.parents('.el-table__fixed, .el-table__footer-wrapper, .el-table__fixed-right, .header2-wrapper').length || $target.hasClass('header2-wrapper')) {
          //   this.righeMenuVisible = false
          //   return
          // }
          this.methodMenuVisible = false
          this.issueMenuVisible = false
          this.companyMenuVisible = true

          this.currentRightCompanyId = $target.data('id')
          this.currentRightCompanyIndex = $target.data('index')
          this.righeMenuVisible = true
        }
        let menuHeight = 230
        if (menuHeight + event.clientY > window.innerHeight && this.methodMenuVisible) {
          $menu.css({
            left: `${event.clientX}px`,
            top: `${event.clientY - menuHeight}px`
          })
        } else {
          $menu.css({
            left: `${event.clientX}px`,
            top: `${event.clientY}px`
          })
        }
      })
    },
    changeYear() {
      this.popVisible = false
      this.$emit('changeYear', this.selectedYear)
    },
    handleHoverCell(row, col, cell, event) {
      this.currentHoverCell = {
        row,
        col
      }
    },
    handleLeaveCell(row, col, cell, event) {
      this.currentHoverCell = null
    },
    handleClickCell(row, col, cell, event) {
      // if($(event.target).text() == 0){
      //   this.$message({
      //     message: '无疑点数据',
      //     type: 'info'
      //   })
      //   return
      // }
      if (col.property.match('company')) {
        let companyId = col.property.split('-').pop()
        let data = {
          methodId: row.method.methodId,
          unitCodes: [{
            unitCode: companyId,
            unitLevel: this.selectedLevel
          }],
          year: this.selectedYear.join(',')
        }
        if (this.selectedLevel == 4) {
          let company = row.companies.find(item => item.companyId == companyId)
          if (company && company.subCompany) {
            data.unitLevel = 4
            data.unitCodes[0].unitCode = company.subCompany.unitCode
          }
        }
        data.unitCodes = JSON.stringify(data.unitCodes)
        this.$emit('showDetail', data, $(event.target).text())
      }
    },
    removeCompany(param) {
      this.$emit('removeCompany', this.currentRightCompanyId, this.currentRightCompanyIndex, param)
    },
    removeMethod(param) {
      this.$emit('removeMethod', this.currentRightMethod.methodId, param)
    },
    showCompanyChart(level) {
      this.$emit('showCompanyChart', level, this.currentRightMethod.methodId, this.currentRightMethod.methodName)
    },

    // 导出数据
    exportDataByMethod(level) {
      this.$emit('exportDataByMethod', level, this.currentRightMethod.methodId)
    },
    exportDataByCell() {
      this.$emit('exportDataByCell', this.currentRightMethod.methodId, this.currentRightCompanyId)
    },
    exportDataByCompany(level){
      this.$emit('exportDataByCompany', this.currentRightCompanyId, level, this.getSelectedYear())
    },

    // 右上菜单
    handleChangeLevel(val) {
      this.$emit('changeLevel', val)
    },

    // 右下菜单
    handleMenuCommand(command) {
      this.$emit(command)
    },
    showMethodChart(level) {
      this.$emit('showMethodChart', level)
      $(this.$el).find('.covers .menu .el-dropdown-link').trigger('click')
      this.dropdownMenuVisible = false
      this.dropdownMenuVisible2 = false
    },
    showMethodChartMulti(level){
      this.$emit('showMethodChartMulti', level)
      $(this.$el).find('.covers .menu .el-dropdown-link').trigger('click')
      this.dropdownMenuVisible = false
      this.dropdownMenuVisible2 = false
    },
    handleMenuVisible(visible) {
      if (visible) {
        $('.dropdown-item-chart').off()
        $('body .table-menu').find('.hide-trigger').off()
        setTimeout(() => {
          $('.dropdown-item-chart').on('mouseenter', (event) => {
            event.preventDefault()
            if(event.target.dataset.multi){
              this.dropdownMenuVisible2 = true
            }else{
              this.dropdownMenuVisible = true
            }
          })
          $('body .table-menu').find('.hide-trigger').on('mouseenter', (event) => {
            event.preventDefault()
            this.dropdownMenuVisible = false
            this.dropdownMenuVisible2 = false
          })
        }, 10)
      } else {
        this.dropdownMenuVisible = false
      }
    },
    drillingData(companyId, level) {
      this.$emit('drillingData', companyId, level)
    },
    showSearchCompany(column, index) {
      this.currentHeadCompany = column.property.split('-').pop()
      this.headCompanyVisible = true
    },
    handleCloseSearch(){
      $(this.$refs.companyTree.$el).find('.el-tree-node.is-current').removeClass('is-current')
    },
    renderHeaderFunction: renderFunctions.renderHeaderFunction,
    renderHeaderFunction2: renderFunctions.renderHeaderFunction2
  }
}

</script>
<style lang="scss">
.table-box {
  position: relative;
  height: 100%;
  >.el-table {
    height: 100%;
    td,
    th {
      &:hover {
        background-color: #d3e8f9;
      }
    }
    .el-table__fixed-header-wrapper thead div,
    .el-table__header-wrapper thead div {
      background-color: transparent;
    }
    .el-table__fixed-header-wrapper th:first-of-type {
      background: #d2d6dc;
    }
    thead .cell {
      white-space: nowrap;
      padding: 0 3px;
    }
    .el-table__fixed,
    .el-table__fixed-right {
      overflow: hidden;
      thead .cell {
        padding: 0 18px;
      }
    }
    .el-table__fixed {
      .el-table__fixed-body-wrapper tr {
        background-color: #eef1f6;
        cursor: context-menu;
      }
    }
    .el-table__fixed-right {
      .el-table__fixed-body-wrapper tr {
        background-color: #e2f0e4;
      }
    }
    .el-table__body-wrapper {
      // overflow-y: scroll;
      td {
        cursor: pointer;
      }
    }
    .el-table__header-wrapper {
      tr .cell {
        padding: 0;
        height: 40px;
        .header-wrapper {
          display: inline-block;
          width: 100%;
          line-height: 40px;
          padding: 0 3px;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          >span {
            cursor: pointer;
          }
        }
      }
      tr:first-of-type {
        cursor: context-menu;
        padding: 0;
        .el-tooltip {
          display: inline-block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: normal;
          white-space: nowrap;
          vertical-align: bottom;
          line-height: 40px;
          padding: 0 3px;
          box-sizing: border-box;
        }
      }
      tr:last-of-type {
        .header-wrapper {
          display: inline-block;
          width: 100%;
          line-height: 40px;
          padding: 0 3px;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          .el-tooltip {
            cursor: pointer;
          }
          button {
            padding-left: 8px;
            padding-right: 8px;
          }
        }
      }
    }
    .el-table__footer-wrapper {
      border-top: 1px solid rgb(223, 236, 235);
      overflow-x: hidden;
      overflow-y: scroll;
      tr {
        background-color: #c9e5f5;
      }
      td {
        min-width: 100px;
        &.gutter {
          min-width: 0;
        }
        &:first-child .cell {
          width: 140px;
        }
      }
    }
    .el-table__fixed:before,
    .el-table__fixed-right:before {
      height: 0;
      visibility: hidden;
    }
  }
  .year-selector {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 99;
    padding: 18px 38px;
    background: #d2d6dc;
  }
  .level-selector {
    position: absolute;
    right: 24px;
    top: 26px;
    z-index: 99;
    width: 125px;
    .el-input__inner {
      padding: 3px;
    }
  }
  .right-menu {
    position: fixed;
    z-index: 99;
    .el-cascader-menu {
      height: auto;
    }
    .company-menu {
      .el-cascader-menu {
        min-width: 180px;
        height: 192px;
      }
    }
  }
  .left-bottom-copy {
    position: absolute;
    left: 1px;
    bottom: 0px;
    font-size: 14px;
    color: #1f3d3a;
    padding: 7px 35px;
    background: #c9e5f5;
    border-right: 1px solid rgb(223, 236, 235);
  }
  .menu {
    position: absolute;
    right: 0;
    bottom: 0;
    background: #d2d6dc;
    padding: 8px 59px;
    .el-dropdown-link {
      cursor: pointer;
    }
  }
  .search-company {
    .company-tree {
      max-height: 300px;
      overflow: auto;
    }
  }
}

.el-dropdown-menu {
  .el-dropdown-menu__item {
    font-size: 14px;
    line-height: 30px;
  }
  .el-icon-caret-right {
    font-family: 'element-icons';
    content: "\E606";
    font-size: 12px;
    transform: scale(0.8);
    color: #bfcbd9;
    line-height: 30px;
    margin-left: 5px;
  }
  >.el-dropdown-menu {
    left: 100%;
    top: -6px;
    min-width: 80px;
    &:first-of-type{
      top: 26px;
    }
  }
}

.table-head-tooltip {
  display: none;
  white-space: nowrap;
  transform: translateX(-50%);
  &:after {
    content: '';
    border-style: solid;
    border-width: 5px;
    border-color: transparent;
    border-top-color: rgb(31, 61, 58);
    position: absolute;
    display: block;
    left: 0;
    right: 0;
    margin: auto;
    width: 0px;
    height: 0px;
    top: 100%;
  }
}

.el-message-box__header {
  button {
    border: none;
    background: transparent;
    font-size: 14px;
  }
}

</style>
