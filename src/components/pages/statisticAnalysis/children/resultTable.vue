<template>
  <div class="table-box" v-loading="tableLoading">
    <el-table ref="resultTable" v-if="tableData && tableData.length" :data="tableData" border style="width: 100%" height="100%" @row-contextmenu="handleClickTableCell" @cell-mouse-enter="handleHoverCell" @cell-mouse-leave="handleLeaveCell" :summary-method="getSummaries" show-summary @cell-dblclick="handleDbClickCell">
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
    <p v-if="!tableData || !tableData.length" style="text-align:center">请从上方添加审计方法和单位数据</p>
    <div class="covers" v-if="tableData.length && tableData[0].companies.length">
      <div class="year-selector">
        <el-popover ref="popover" placement="top" width="200" v-model="popVisible">
          <el-select style="width:120px;" v-model="selectedYear" multiple placeholder="请选择年份" size="small">
            <el-option v-for="(item, index) in years" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-button type="primary" size="small" @click="changeYear">确定</el-button>
        </el-popover>
        <el-button type="text" v-popover:popover>修改日期</el-button>
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
            <el-dropdown-item command="exportData" class="hide-trigger">导出到前数据</el-dropdown-item>
            <el-dropdown-item class="dropdown-item-chart">生成统计方法图形报表<i class="el-icon-caret-right"></i></el-dropdown-item>
            <ul class="el-dropdown-menu" x-placement="top-end" v-show="dropdownMenuVisible">
              <li class="el-dropdown-menu__item" @click="showChart(0)">所有单位</li>
              <li class="el-dropdown-menu__item" @click="showChart(1)">一级单位</li>
              <li class="el-dropdown-menu__item" @click="showChart(2)">二级单位</li>
              <li class="el-dropdown-menu__item" @click="showChart(3)">三级单位</li>
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
          <li class="el-cascader-menu__item">导出所有单位</li>
          <li class="el-cascader-menu__item">导出一级单位</li>
          <li class="el-cascader-menu__item">导出二级单位</li>
          <li class="el-cascader-menu__item">导出三级单位</li>
        </ul>
      </div>
      <div class="method-menu el-cascader-menus" v-show="methodMenuVisible">
        <ul class="el-cascader-menu">
          <li class="el-cascader-menu__item" @click="removeMethod">移除该方法</li>
          <li class="el-cascader-menu__item el-cascader-menu__item--extensible secondary-item1">导出该方法数据</li>
          <li class="el-cascader-menu__item el-cascader-menu__item--extensible secondary-item2">生成该方法图形报表</li>
        </ul>
        <ul class="el-cascader-menu" v-show="methodSecondaryMenuVisible1">
          <li class="el-cascader-menu__item">导出所有单位数据</li>
          <li class="el-cascader-menu__item">导出一级单位数据</li>
          <li class="el-cascader-menu__item">导出二级单位数据</li>
          <li class="el-cascader-menu__item">导出三级单位数据</li>
        </ul>
        <ul class="el-cascader-menu" v-show="methodSecondaryMenuVisible2">
          <li class="el-cascader-menu__item" @click="createChart(0)">所有单位报表</li>
          <li class="el-cascader-menu__item" @click="createChart(1)">一级单位报表</li>
          <li class="el-cascader-menu__item" @click="createChart(2)">二级单位报表</li>
          <li class="el-cascader-menu__item" @click="createChart(3)">三级单位报表</li>
        </ul>
      </div>
      <div class="issue-menu el-cascader-menus" v-show="issueMenuVisible">
        <ul class="el-cascader-menu">
          <li class="el-cascader-menu__item">导出该疑点数据</li>
        </ul>
      </div>
    </div>
    <el-dialog title="搜索单位" :visible.sync="headCompanyVisible" size="small">
      <div @keyup.enter.stop="searchCompany">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
      </div>
      <el-tree class="company-tree" :data="companyData" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="companyTree" node-key="id" highlight-current @current-change="handleCompanyTreeChange">
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
export default {
  props: {
    tableData: {
      type: Array
    }
  },
  data() {
    return {
      years: this.getYearArr(),
      selectedYear: [],
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
        value: -1,
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
      currentRightMethod: null,

      // 点击表头搜索单位
      currentHeadCompany: null,
      headCompanyVisible: null,
      filterText: '',
      selectedTreeCompany: null,
      companyData: [{
        unitCode: 1,
        unitName: '一级单位',
        unitLevel: 1,
        children: [{
          unitCode: 4,
          unitName: '二级单位',
          unitLevel: 2,
          children: [{
            unitCode: 9,
            unitLevel: 3,
            unitName: '三级单位 1',
          }, {
            unitCode: 10,
            unitLevel: 3,
            unitName: '三级单位 2'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'unitName'
      },

      dropdownMenuVisible: false,

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
      this.$refs.resultTable && this.$refs.resultTable.doLayout()
      let height = $(this.$el).find('.el-table__fixed .el-table__fixed-header-wrapper').height() + $(this.$el).find('.el-table__fixed .el-table__fixed-body-wrapper').height()
      $(this.$el).find('.el-table__fixed-right, .el-table__fixed').height(height)
      $(this.$el).find('.el-table__fixed-right').css('right', `${this.scrollBarWidth}px`)
      $(this.$el).find('.el-table__fixed-right-patch').width(this.scrollBarWidth)
    },
    // +++++++搜索单位++++++++
    searchCompany() {
      this.$refs.companyTree.filter(this.filterText);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleCompanyTreeChange(data, node) {
      this.selectedTreeCompany = data
    },
    confirmChangeCompany() {
      this.headCompanyVisible = false
      if (!this.selectedTreeCompany) {
        return
      }
      this.selectedLevel = -1
      this.$emit('changeCompany', this.currentHeadCompany, this.selectedTreeCompany)
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
      let n = 20
      while (n--) {
        ret.push(currentYear - n)
      }
      return ret.reverse()
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
          } else if (this.currentHoverCell.col.property == 'sum') {
            this.righeMenuVisible = false
            return
          }
          this.righeMenuVisible = true
        } else if (!this.currentHoverCell && $(event.target).data('id')) {
          if ($target.hasClass('el-table__fixed') || $target.hasClass('el-table__fixed-right') || $target.parents('.el-table__fixed, .el-table__footer-wrapper, .el-table__fixed-right').length || $target.hasClass('header2-wrapper') || $target.parents('.header2-wrapper, .el-table__footer-wrapper').length) {
            this.righeMenuVisible = false
            return
          }
          this.methodMenuVisible = false
          this.issueMenuVisible = false
          this.companyMenuVisible = true

          let companyId = $(event.target).data('id')
          this.currentRightCompanyId = companyId
          this.righeMenuVisible = true
        }
        $menu.css({
          left: `${event.clientX}px`,
          top: `${event.clientY}px`
        })
      })

      // let $tooltip = $('.table-head-tooltip')
      // let $tableHeader = $(this.$el).find('.el-table__header-wrapper')
      // $tableHeader.off()
      // $tableHeader.on('mouseenter', 'th .cell', (event) => {
      //   event.preventDefault();
      //   let txt = $(event.target).text()
      //   if (txt) {
      //     let targetPosition = event.target.getClientRects()[0]
      //     $tooltip.text(txt).css({
      //       top: `${targetPosition.top - targetPosition.height - 25}px`,
      //       left: `${targetPosition.left + (targetPosition.width/2)}px`,
      //       display: 'block'
      //     });
      //   }
      // }).on('mouseleave', 'th .cell', (event) => {
      //   event.preventDefault();
      //   $tooltip.css('display', 'none');
      // });
    },
    changeYear() {
      this.popVisible = false
      this.$emit('changeYear', this.selectedYear)
    },
    handleClickTableCell(row, event) {},
    handleHoverCell(row, col, cell, event) {
      this.currentHoverCell = {
        row,
        col
      }
    },
    handleLeaveCell(row, col, cell, event) {
      this.currentHoverCell = null
    },
    handleDbClickCell(row, col, cell, event) {
      if (col.property.match('company')) {
        let companyId = col.property.split('-').pop()
        let sum = 0
        row.companies.every(item => {
          if (item.companyId == companyId) {
            sum = item.issues
            return false
          }
          return true
        })
        let data = {
          methodId: row.method.methodId,
          companyId: companyId,
          sum: sum
        }
        this.$emit('showDetail', data)
      }
    },
    removeCompany(param) {
      this.$emit('removeCompany', this.currentRightCompanyId, param)
    },
    removeMethod() {
      this.$emit('removeMethod', this.currentRightMethod.methodId)
    },
    createChart(level) {
      this.$emit('createChart', level, this.currentRightMethod.methodId, this.currentRightMethod.methodName)
    },

    // 右上菜单
    handleChangeLevel(val) {
      this.$emit('changeLevel', val)
    },

    // 右下菜单
    handleMenuCommand(command) {
      if (command == 'clearData') {
        this.$emit('clearData')
      } else if (command == 'exportData') {

      } else if (command == 'showChart') {
        this.$emit('showChart')
      }
    },
    showChart(level) {
      this.$emit('showChart', level)
    },
    handleMenuVisible(visible) {
      if (visible) {
        $('.dropdown-item-chart').off()
        $('body .table-menu').find('.hide-trigger').off()
        setTimeout(() => {
          $('.dropdown-item-chart').on('mouseenter', (event) => {
            event.preventDefault();
            this.dropdownMenuVisible = true
          })
          $('body .table-menu').find('.hide-trigger').on('mouseenter', (event) => {
            event.preventDefault();
            this.dropdownMenuVisible = false
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
        // cursor: pointer;
        // th .cell:before {
        //   content: "\E61D";
        //   font-family: element-icons!important;
        //   speak: none;
        //   font-style: normal;
        //   font-weight: 400;
        //   font-variant: normal;
        //   text-transform: none;
        //   line-height: 1;
        //   vertical-align: baseline;
        //   display: inline-block;
        //   -webkit-font-smoothing: antialiased;
        //   -moz-osx-font-smoothing: grayscale;
        //   display: inline-block;
        //   font-size: 15px;
        //   color: #8492a6;
        // }
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
      height: 180px;
    }
    .company-menu {
      min-width: 180px;
      height: 192px;
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
