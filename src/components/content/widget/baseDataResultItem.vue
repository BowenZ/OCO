<template>
  <div class="audit-item base-data-result-item">
    <div class="item-header">
      <h3>{{selectedData.title}}</h3>
    </div>
    <div class="item-content">
      <ul v-if="item.children.length">
        <li v-if="method" v-for="(method, index) in item.children" :class="method.status">
          <!-- {{method}} -->
          <div v-if="method" class="method-item">
            <div class="method-name">
              <h4>
                <el-checkbox class="check-result" :true-label="method.methodId" :checked="method.isSelected == 1" v-if="showCheck"></el-checkbox>
                <span>
                  <i :class="{'el-icon-circle-check':method.status=='success', 'el-icon-circle-close':method.status=='error', 'el-icon-loading': method.status=='loading', 'el-icon-time': method.status=='queuing'}"></i>
                </span>
                {{selectedData.title}}
                <span class="row-info" v-if="method.data && (isNaN(method.data.rowCount) || method.data.rowCount==0)"> | ({{method.data.rowCount}})</span><!-- 返回中文提示 -->
                <span class="row-count" v-if="method.tableData && method.status=='success'" @click="shwoMoreData($event)"> | 查看详细数据</span><!-- 数据量 -->
                <span class="row-count" v-if="method.status == 'error'" @click="shwoMoreData($event)"> | (查看错误详情)</span>
              </h4>
              <a v-if="method.outputLink" :href="urlStore.root+method.outputLink" target="_blank" class="el-button el-button--primary output-link">导出数据</a>
            </div>
            <div class="item-data">
              <el-table v-if="method.tableData && method.status=='success'" :data="method.tableData" height="250" border style="width: 100%">
                <el-table-column v-for="(key, index) in Object.keys(method.tableData[0])" :key="index" :prop="key" :label="key">
                </el-table-column>
              </el-table>
              <div class="info-error" v-if="method.status == 'error'">
                <span class="el-icon-close"></span>
                <p v-html="method.message"></p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import urlStore from '../../../api/urlStore.js'
export default {
  props: ['item', 'showCheck'],
  data: function() {
    return {
      urlStore: urlStore,
      dialogVisible: false
    }
  },
  methods: {
    shwoMoreData: function(event, flag) {
      let $target
      if (flag) {
        $target = $(event.target).parents('.method-item').find('.accord-data')
      } else {
        $target = $(event.target).parents('.method-item').find('.item-data')
      }
      if (!$target.hasClass('active')) {
        let targetHeight = $target.css('display', 'block').height()
        $target.css('max-height', 0).addClass('active')
        setTimeout(function() {
          $target.css('max-height', (+targetHeight + 10) + 'px')
        }, 0)
      } else {
        $target.css('max-height', 0)
        setTimeout(function() {
          $target.css('display', 'none').removeClass('active').css('max-height', 'initial')
        }, 200)
      }
    }
  },
  computed: {
    selectedData: function() {
      return this.$store.getters.selectedData
    }
  }
}
</script>
<style lang="scss">
@import '../../../assets/scss/variables.scss';
.audit-item {
  margin-bottom: 30px;
  .item-header {
    h3 {
      font-size: 18px;
    }
  }
  .item-content {
    ul {
      list-style: none;
      li {
        .method-name {
          h4 {
            font-weight: normal;
            display: inline-block;
            span {
              display: inline-block;
              margin-right: 6px;
              cursor: pointer;
            }
          }
          .output-link {
            float: right;
            margin-top: 14px;
            text-decoration: none;
          }
          .row-info {
            color: $blue;
          }
          .accord {
            color: #1abc9c;
          }
        }
        &.success {
          .method-name {
            .row-count {
              color: $success;
            }
          }
        }
        &.error {
          .method-name {
            .row-count {
              color: $danger;
            }
          }
        }
      }
    }
    .el-icon-circle-check {
      color: $success;
    }
    .el-icon-circle-close {
      color: $danger;
    }
    .el-icon-loading {
      color: $blue;
    }
    .el-icon-time {
      color: $silver;
    }
    .accord-data {
      padding-left: 5%;
      margin-bottom: 20px;
      overflow: hidden;
      display: none;
      transition: all .2s ease-out;
      &.active {
        display: block;
        visibility: visible;
      }
      >div {
        border: 1px solid #d1dbe5;
        border-radius: 4px;
        h4 {
          border-bottom: 1px solid #d1dbe5;
          padding: 5px 10px;
          margin: 0;
        }
        p {
          margin: 0;
          padding: 10px;
        }
      }
    }
    .item-data {
      padding-left: 5%;
      overflow: hidden;
      display: none;
      // visibility: hidden;
      // max-height: 0;
      transition: all .2s ease-out;
      &.active {
        display: block;
        visibility: visible;
      }
      .info-error {
        box-shadow: inset 0px 0px 2px rgba(0, 0, 0, .2);
        min-width: 300px;
        padding: 10px 12px;
        box-sizing: border-box;
        border-radius: 2px;
        position: relative;
        span {
          width: 40px;
          height: 40px;
          position: absolute;
          left: 0;
          top: 0;
          text-align: center;
          line-height: 40px;
          background: $danger;
          color: #fff;
        }
        p {
          margin: 0;
          margin-left: 38px;
          position: relative;
          // height: 20px;
          line-height: 20px;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-align: center;
          align-items: center;
        }
      }
    }
  }
}


/* .result-container {
  transform: translateY(-30px);
  opacity: 0;
  transition: all .2s ease-out;
  &.active {
    transform: translateY(0);
    opacity: 1;
  }
} */
</style>
