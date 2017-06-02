<template>
  <div class="result-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2 class="card-title">执行摘要</h2>
      </div>
      <div v-if="showProgress && currentJobId == selectedJobId" class="progress-container">
        <el-progress :percentage="progress"></el-progress>
        <p style="text-align: center;">{{progressMsg}}</p>
      </div>
      <!-- {{executeStatus}} -->
      <!-- <p v-if="!executeStatus" v-loading="!executeStatus">正在加载中......</p> -->
      <p v-if="executeStatus && executeStatus.status == 'error'">{{executeStatus.msg}}</p>
      <el-collapse v-model="activeNames" v-if="!single && currentJobId == selectedJobId && executeStatus && executeStatus.status == 'success'">
        <el-collapse-item :v-if="executeStatus.data.length" v-for="(item, index) in executeStatus.data" :key="index" :title="item.itemName" :name="item.itemId">
          <div class="result-list">
            <v-result-item :item="item" :showCheck="true" @changeCheck="changeCheck" :notitle="true"></v-result-item>
          </div>
        </el-collapse-item>
      </el-collapse>
      <!-- {{auditingMethodId}}/{{selectedMethodId}} -->
      <div class="result-list" v-if="single && auditingMethodId == selectedMethodId && executeStatus && executeStatus.status == 'success'">
        <v-result-item v-if="executeStatus.data.length" v-for="(item, index) in executeStatus.data" :key="index" :item="item"></v-result-item>
      </div>
      <div class="batch-output clearfix" v-if="executeStatus && finished && currentJobId == selectedJobId">
        <el-button type="primary" @click="batchOutput">批量导出</el-button>
        <el-checkbox class="select-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div>
    </el-card>
  </div>
</template>
<script>
import vResultItem from './resultItem'
import $ from 'webpack-zepto'
import urlStore from '@/api/urlStore.js'
import {
  Message
} from 'element-ui'
export default {
  components: {
    vResultItem
  },
  props: ['single', 'data', 'executeStatus', 'finished', 'showProgress', 'progressMsg', 'progress'],
  data: function() {
    return {
      activeNames: [],
      checkedCities: [],
      checkAll: true,
      isIndeterminate: false
    }
  },
  computed: {
    currentJobId: function() {
      return this.$store.getters.currentJobId
    },
    selectedJobId: function() {
      return this.$store.getters.selectedJobId
    },
    auditingMethodId: function() {
      return this.$store.getters.auditingMethodId
    },
    selectedMethodId: function() {
      return this.$store.getters.selectedMethod ? this.$store.getters.selectedMethod.id : null
    },
    slecteOptions: function() {
      let options = []
      $(this.$el).find('.check-result').find('input[type="checkbox"]').each(function(index, el) {
        options.push($(el).attr('true-value'))
      })
      return options
    }
  },
  methods: {
    changeCheck: function() {
      let checkAll = true
      let noneCheck = true
      $(this.$el).find('.check-result').find('input[type="checkbox"]').each(function(index, el) {
        if (!el.checked) {
          checkAll = false
        } else {
          noneCheck = false
        }
      })
      this.checkAll = checkAll
      if (checkAll || noneCheck) {
        this.isIndeterminate = false
      } else {
        this.isIndeterminate = true
      }
    },
    handleCheckAllChange: function(event) {
      if (this.checkAll) {
        $(this.$el).find('.check-result').find('.el-checkbox__input').addClass('is-checked').find('input').each(function(index, el) {
          el.checked = true
        })
      } else {
        $(this.$el).find('.check-result').find('.el-checkbox__input').removeClass('is-checked').find('input').each(function(index, el) {
          el.checked = false
        })
      }

      this.isIndeterminate = false
    },
    batchOutput: function() {
      console.log(this.$refs)
      let outputArr = []
      $(this.$el).find('.check-result').find('.is-checked input').each(function(index, el) {
        outputArr.push($(el).attr('true-value'))
      })
      if (!outputArr.length) {
        Message({
          message: '请选择执行结果',
          type: 'warning'
        })
        return
      }
      window.open(urlStore.exportBatch + `?methodInstanceIDs=${outputArr.join(',')}`)
    }
  }
}
</script>
<style lang="scss">
.box-card {
  h2 {
    padding-left: 10px;
    border-left: 4px solid #1abc9c;
    font-size: 20px;
    line-height: 40px;
    font-weight: normal;
    margin: 0;
  }
  .batch-output {
    margin-top: 10px;
    .select-all {
      float: right;
      line-height: 36px;
      margin-right: 20px;
    }
    button {
      float: right;
    }
  }
}
</style>
