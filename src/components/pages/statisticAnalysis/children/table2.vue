<template>
  <div class="table-box">
    <el-table v-if="tableData && tableData.length" :data="tableData" border style="width: 100%" height="100%" @row-contextmenu="handleClickTableCell" @cell-mouse-enter="handleHoverCell" @cell-mouse-leave="handleLeaveCell" :summary-method="getSummaries" show-summary @cell-dblclick="handleDbClickCell" @header-click="handleHeaderClick">
      <el-table-column fixed prop="method" label="审计方法" show-overflow-tooltip width="140">
        <template scope="scope">
          <span>{{scope.row.method.methodName}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(company, index) in tableData[0].companies" :prop="'company-'+company.companyId" :label="company.companyName">
        <el-table-column :prop="'company-'+company.companyId" :label="company.subCompany?company.subCompany.label:''" show-overflow-tooltip min-width="100">
          <template scope="scope">
            <span>{{scope.row.companies[index].issues}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="sum" fixed="right" label="各单位汇总" show-overflow-tooltip width="150">
      </el-table-column>
    </el-table>
    <p v-if="!tableData || !tableData.length" style="text-align:center">请从上方添加审计方法和单位数据</p>
    <div class="covers" v-if="tableData.length">
      <div class="year-selector">
        <el-popover ref="popover" placement="top" width="160" v-model="popVisible">
          <el-select v-model="selectedYear" multiple placeholder="请选择年份" size="small">
            <el-option v-for="(item, index) in years" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-button type="primary" size="small" @click="changeYear" style="margin-top: 5px;float: right;">确定</el-button>
        </el-popover>
        <el-button type="text" size="small" v-popover:popover>修改日期</el-button>
      </div>
      <div class="level-selector">
        <el-select v-model="selectedLevel" placeholder="各单位汇总（全）" size="small">
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span class="left-bottom-copy">各方法汇总</span>
      <div class="menu">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>清空数据</el-dropdown-item>
            <el-dropdown-item>导出到前数据</el-dropdown-item>
            <el-dropdown-item>生成统计方法图形报表</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="right-menu" v-show="righeMenuVisible">
      <div class="company-menu el-cascader-menus" v-show="companyMenuVisible">
        <ul class="el-cascader-menu">
          <li class="el-cascader-menu__item" @click="removeCompany">移除该单位</li>
          <li class="el-cascader-menu__item el-cascader-menu__item--extensible secondary-item">导出该单位数据</li>
        </ul>
        <ul class="el-cascader-menu" v-show="companySecondaryMenuVisible">
          <li class="el-cascader-menu__item">所有单位</li>
          <li class="el-cascader-menu__item">一级单位</li>
          <li class="el-cascader-menu__item">二级单位</li>
          <li class="el-cascader-menu__item">三级单位</li>
        </ul>
      </div>
      <div class="method-menu el-cascader-menus" v-show="methodMenuVisible">
        <ul class="el-cascader-menu">
          <li class="el-cascader-menu__item" @click="removeMethod">移除该方法</li>
          <li class="el-cascader-menu__item el-cascader-menu__item--extensible secondary-item1">导出该方法数据</li>
          <li class="el-cascader-menu__item el-cascader-menu__item--extensible secondary-item2">生成该方法图形报表</li>
        </ul>
        <ul class="el-cascader-menu" v-show="methodSecondaryMenuVisible1">
          <li class="el-cascader-menu__item">所有单位数据</li>
          <li class="el-cascader-menu__item">一级单位数据</li>
          <li class="el-cascader-menu__item">二级单位数据</li>
          <li class="el-cascader-menu__item">三级单位数据</li>
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
      <el-tree class="company-tree" :data="companyData" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="companyTree" highlight-current @current-change="handleCompanyTreeChange">
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
      currentRightCompany: null,
      currentRightMethod: null,

      // 点击表头搜索单位
      currentHeadCompany: null,
      headCompanyVisible: null,
      filterText: '',
      selectedTreeCompany: null,
      companyData: [{
        id: 1,
        label: '一级单位',
        level: 1,
        children: [{
          id: 4,
          label: '二级单位',
          level: 2,
          children: [{
            id: 9,
            level: 3,
            label: '三级单位 1',
          }, {
            id: 10,
            level: 3,
            label: '三级单位 2'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    tableData: function(newVal) {
      setTimeout(() => {
        this.addEventListener()
      }, 10)
    }
  },
  mounted() {
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
    }, 10);
  },
  methods: {
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
      this.$emit('changeCompany', this.currentHeadCompany, this.selectedTreeCompany)
      this.headCompanyVisible = false
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
          sums[0] = '各方法汇总'
          return
        }
        if (index === columns.length - 1) {
          sums[index] = '菜单'
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
        event.preventDefault()
        if ($(event.target).parents('.el-table__fixed-header-wrapper').length) {
          this.righeMenuVisible = false
          return
        }
        if (this.currentHoverCell) {
          if (this.currentHoverCell.col.property == 'method') {
            this.companyMenuVisible = false
            this.issueMenuVisible = false
            this.methodMenuVisible = true
            this.currentRightMethod = this.currentHoverCell.row.method.methodId
          } else if (this.currentHoverCell.col.property.match('company')) {
            this.companyMenuVisible = false
            this.methodMenuVisible = false
            this.issueMenuVisible = true
          } else if (this.currentHoverCell.col.property == 'sum') {
            this.righeMenuVisible = false
            return
          }
        } else if (!this.currentHoverCell) {
          if ($(event.target).parents('.el-table__fixed').length) {
            this.righeMenuVisible = false
            return
          }
          this.methodMenuVisible = false
          this.issueMenuVisible = false
          this.companyMenuVisible = true

          let companyName = ''
          let $target = $(event.target)
          if ($target.hasClass('cell')) {
            companyName = $target.text()
          } else if ($target.children('.cell').length) {
            companyName = $target.children('.cell').text()
          }
          this.currentRightCompany = companyName
        }
        $menu.css({
          left: `${event.clientX}px`,
          top: `${event.clientY}px`
        })
        this.righeMenuVisible = true
      });
    },
    changeYear() {
      console.log(this.selectedYear)
    },
    handleClickTableCell(row, event) {
      // console.log(row, event)
    },
    handleHoverCell(row, col, cell, event) {
      this.currentHoverCell = {
          row,
          col
        }
        // $(cell).addClass('active')
    },
    handleLeaveCell(row, col, cell, event) {
      this.currentHoverCell = null
        // $(cell).removeClass('active')
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
    handleHeaderClick(column, event) {
      this.currentHeadCompany = column.property.split('-').pop()
      this.headCompanyVisible = true
    },
    removeCompany() {
      this.$emit('removeCompany', this.currentRightCompany)
    },
    removeMethod() {
      this.$emit('removeMethod', this.currentRightMethod)
    },
    createChart(level) {
      this.$emit('createChart', level, this.currentRightMethod)
    }
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
    thead .cell {
      white-space: nowrap;
      padding: 0 3px;
    }
    .el-table__fixed,
    .el-table__fixed-right {
      thead .cell {
        padding: 0 18px;
      }
    }
    .el-table__body-wrapper {
      td {
        cursor: pointer;
      }
    }
    .el-table__header-wrapper th {
      cursor: pointer;
    }
  }
  .year-selector {
    position: absolute;
    top: 8px;
    left: 85px;
    z-index: 99;
  }
  .level-selector {
    position: absolute;
    right: 28px;
    top: 5px;
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
    .company-menu {}
  }
  .left-bottom-copy {
    position: absolute;
    left: 30px;
    bottom: 10px;
    font-size: 14px;
    color: rgb(31, 61, 58);
  }
  .menu {
    position: absolute;
    right: 50px;
    bottom: 10px;
    cursor: pointer;
  }
}
</style>
