<template>
  <div class="table-box">
    <div class="table-fixed top">
      <table>
        <thead>
          <tr>
            <th>
              <div class="cell">年度</div>
            </th>
            <th v-for="(col, index) in colData" :key="index">
              <div class="cell">{{col.title}}</div>
            </th>
            <th>
              <div class="cell">各单位汇总</div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="table-fixed left">
      <table v-if="rowData && colData">
        <tbody>
          <tr>
            <th>
              <div class="cell">年度</div>
            </th>
          </tr>
          <tr v-for="(row, index) in rowData" :key="index">
            <th>
              <div class="cell">{{row.title}}</div>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-fixed right">
      <table>
        <thead>
          <tr>
            <th>
              <div class="cell">各单位汇总</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rowData" :key="index">
            <th>
              <div class="cell">汇总</div>
            </th>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>
              <div class="cell">菜单</div>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="table-wrapper">
      <table v-if="rowData && colData">
        <tbody>
          <tr v-for="(row, index) in rowData" :key="index">
            <th>
              <div class="cell invisible">{{row.title}}</div>
            </th>
            <td v-for="(col, colIndex) in colData" :key="colIndex">
              <div class="cell">{{row.id}},{{col.id}}</div>
            </td>
            <th>
              <div class="cell invisible">汇总</div>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-fixed bottom">
      <table>
        <tfoot>
          <tr>
            <th>
              <div class="cell">各方法汇总</div>
            </th>
            <td v-for="(col, index) in colData" :key="index">
              <div class="cell">{{col.id}}</div>
            </td>
            <th>
              <div class="cell">菜单</div>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="fixed-title">
      <table class="left-top">
        <thead>
          <tr>
            <th>
              <div class="cell">年度</div>
            </th>
          </tr>
        </thead>
      </table>
      <table class="right-top">
        <thead>
          <tr>
            <th>
              <div class="cell">各单位汇总</div>
            </th>
          </tr>
        </thead>
      </table>
      <table class="left-bottom">
        <tfoot>
          <tr>
            <th>
              <div class="cell">各方法汇总</div>
            </th>
          </tr>
        </tfoot>
      </table>
      <table class="right-bottom">
        <tfoot>
          <tr>
            <th>
              <div class="cell">菜单</div>
            </th>
          </tr>
        </tfoot>
      </table>
      <div class="right-top-patch"></div>
    </div>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
export default {
  props: {
    rowData: {
      type: Array
    },
    colData: {
      type: Array
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    setTimeout(() => {
      let $scrollTable = $(this.$el).find('.table-wrapper')
      let $fixedTop = $(this.$el).find('.table-fixed.top')
      let $fixedBottom = $(this.$el).find('.table-fixed.bottom')
      let $fixedLeft = $(this.$el).find('.table-fixed.left')
      let $fixedRight = $(this.$el).find('.table-fixed.right')
      $scrollTable.find('table').width($scrollTable.find('table').width())
      $fixedTop.width($scrollTable.find('table').width())
      $fixedLeft.height($scrollTable.height() + $fixedTop.height() - 17).width($scrollTable.find('th').eq(0).width())
      $fixedRight.height($scrollTable.height() + $fixedTop.height() - 17).width($scrollTable.find('th').last().width())

      $(this.$el).find('.left-top').width($scrollTable.find('th').eq(0).width())
      $(this.$el).find('.left-bottom').width($scrollTable.find('th').eq(0).width())
      $(this.$el).find('.right-top').width($scrollTable.find('th').last().width())
      $(this.$el).find('.right-bottom').width($scrollTable.find('th').last().width())

      $(this.$el).find('.right-top-patch').height($fixedTop.height())
      $scrollTable.on('scroll', function(event) {
        $fixedTop.find('table').css('left', `-${$scrollTable[0].scrollLeft}px`)
        $fixedBottom.find('table').css('left', `-${$scrollTable[0].scrollLeft}px`)
        $fixedLeft.find('table').css('top', `-${$scrollTable[0].scrollTop}px`)
        $fixedRight.find('table').css('top', `-${$scrollTable[0].scrollTop}px`)
      })
    }, 10)
  },
  methods: {

  }
}
</script>
<style lang="scss">
.table-box {
  height: 100%;
  position: relative;
  background-color: #eef1f6;
  overflow: hidden;
  table {
    position: relative;
    width: 100%;
    border-collapse: collapse;
    border-left: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
  }
  thead {
    background-color: #eef1f6;
  }
  tr {
    height: 30px;
  }
  th,
  td {
    border-right: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;
    padding: 0 15px;
    min-width: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
  }
  th:first-child,
  th:last-child {
    min-width: 130px;
  }
  .cell {
    width: 100px;
    white-space: nowrap;
    word-break: break-all;
    line-height: 24px;
    box-sizing: border-box;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .table-wrapper {
    max-height: calc(100% - 60px);
    overflow: scroll;
    background-color: #fff;
  }
  .table-fixed {
    overflow: hidden;
    &.left {
      position: absolute;
      left: 0;
      top: 0;
      background: #fff;
      z-index: 2;
      tr:first-child {
        background-color: #eef1f6;
      }
    }
    &.right {
      position: absolute;
      right: 17px;
      top: 0;
      background: #fff;
      z-index: 2;
    }
    &.top {
      top: 0;
    }
    &.bottom {
      background-color: #eef1f6;
      overflow-y: scroll;
      z-index: 2;
      &::-webkit-scrollbar {
        visibility: hidden;
      }
    }
  }
  .fixed-title {
    table {
      position: absolute;
      background-color: #eef1f6;
      z-index: 99;
      &.left-top {
        top: 0;
        left: 0;
      }
      &.right-top {
        top: 0;
        right: 17px;
      }
      &.left-bottom {
        bottom: 0;
        left: 0;
      }
      &.right-bottom {
        bottom: 0;
        right: 17px;
      }
    }
    .right-top-patch {
      position: absolute;
      width: 17px;
      top: -1px;
      right: 0;
      background-color: #eef1f6;
    }
  }
}
</style>
