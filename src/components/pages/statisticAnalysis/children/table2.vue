<template>
  <div class="table-box">
    <el-table v-if="tableData && tableData.length" :data="tableData" border style="width: 100%" height="100%" @row-contextmenu="handleClickTableCell" @cell-mouse-enter="handleHoverCell" @cell-mouse-leave="handleLeaveCell">
      <el-table-column fixed prop="method" label="审计方法" show-overflow-tooltip width="140">
        <template scope="scope">
          <span>{{scope.row.method.methodName}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(company, index) in tableData[0].companies" prop="companies" :label="company.companyName" show-overflow-tooltip min-width="100">
        <template scope="scope">
          <span>{{scope.row.companies[index].issues}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sum" fixed="right" label="各单位汇总" show-overflow-tooltip width="150">
      </el-table-column>
    </el-table>
    <div class="year-selector" v-if="tableData.length">
      <el-popover ref="popover" placement="top" width="160" v-model="popVisible">
        <el-select v-model="selectedYear" multiple placeholder="请选择年份" size="small">
          <el-option v-for="(item, index) in years" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click="changeYear" style="margin-top: 5px;float: right;">确定</el-button>
      </el-popover>
      <el-button type="text" size="small" v-popover:popover>修改日期</el-button>
    </div>
    <div class="level-selector" v-if="tableData.length">
      <el-select v-model="selectedLevel" placeholder="各单位汇总（全）" size="small">
        <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="right-menu" v-show="righeMenuVisible">
      <div class="company-menu el-cascader-menus" v-show="companyMenuVisible">
        <ul class="el-cascader-menu">
          <li class="el-cascader-menu__item">移除该单位</li>
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
          <li class="el-cascader-menu__item">移除该方法</li>
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
          <li class="el-cascader-menu__item">所有单位报表</li>
          <li class="el-cascader-menu__item">一级单位报表</li>
          <li class="el-cascader-menu__item">二级单位报表</li>
          <li class="el-cascader-menu__item">三级单位报表</li>
        </ul>
      </div>
      <div class="issue-menu el-cascader-menus" v-show="issueMenuVisible">
        <ul class="el-cascader-menu">
          <li class="el-cascader-menu__item">导出该疑点数据</li>
        </ul>
      </div>
    </div>
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

      currentHoverCell: null
    }
  },
  watch: {
    tableData: function(newVal) {
      this.addEventListener()
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
    getSumaries() {

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
        if (this.currentHoverCell) {
          if (this.currentHoverCell.col.property == 'method') {
            this.companyMenuVisible = false
            this.issueMenuVisible = false
            this.methodMenuVisible = true
          } else if (this.currentHoverCell.col.property == 'companies') {
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
      $(cell).addClass('active')
    },
    handleLeaveCell(row, col, cell, event) {
      this.currentHoverCell = null
      $(cell).removeClass('active')
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
    td.active {
      background-color: #edf7ff;
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
}
</style>
