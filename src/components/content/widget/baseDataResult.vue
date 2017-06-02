<template>
  <div class="result-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2 class="card-title">执行摘要</h2>
      </div>
      {{executeStatus}}
      <!-- <p v-if="!executeStatus" v-loading="!executeStatus">正在加载中......</p> -->
      <p v-if="executeStatus && executeStatus.status == 'error'">{{executeStatus.msg}}</p>
      <div class="result-list" v-if="showNoMatterWhat">
        <v-result-item v-if="executeStatus && executeStatus.data.length" v-for="(item, index) in executeStatus.data" :key="index" :item="item"></v-result-item>
      </div>
      <div class="batch-output clearfix">
        <el-button type="primary" @click="batchOutput" v-if="executeStatus && finished && currentJobId == selectedJobId">批量导出</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import vResultItem from './baseDataResultItem'
import $ from 'webpack-zepto'
import urlStore from '@/api/urlStore.js'
import {
  Message
} from 'element-ui'
export default {
  components: {
    vResultItem
  },
  props: ['single', 'data', 'executeStatus', 'finished', 'showNoMatterWhat'],
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
    }
  },
  methods: {
    batchOutput: function() {
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
    button {
      float: right;
    }
  }
}
</style>
