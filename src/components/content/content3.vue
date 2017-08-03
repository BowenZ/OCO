<!-- 基础数据 -->
<template>
  <div class="content content3">
    <v-step :steps="steps" :currentStep="currentStep"></v-step>
    <div class="content-block">
      <v-method-description v-if="selectedData" :description="selectedData.description"></v-method-description>
      <v-params ref="params" :showExecuteButton="false" :multiple="false" :disableInput="disableInput || auditing" :params="singleParams"></v-params>
      <v-base-param></v-base-param>
      <div class="execute-button clearfix" v-if="selectedData">
        <el-button type="primary" size="large" @click="doAudint" :loading="disableInput || auditing">执行查询</el-button>
      </div>
      <!-- <v-result-item></v-result-item> -->
      <v-result :single="true" :data="1" :executeStatus="baseDataExecuteStatus" :showProgress="showProgress" :progress="progress" :progressMsg="progressMsg"></v-result>
    </div>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import vStep from './widget/step'
import vParams from './widget/params'
import vImport from './widget/import'
import vResult from './widget/result'
import vMethodDescription from './widget/methodDescription'
import vBaseParam from './widget/baseParam'
import {
  Message
} from 'element-ui'

import urlStore from '../../api/urlStore.js'

export default {
  components: {
    vParams,
    vResult,
    vStep,
    vImport,
    vMethodDescription,
    vBaseParam
  },
  data: function() {
    return {
      steps: ['填写参数', '执行审计'],
      currentStep: 0,
      disableInput: false,
      finished: false,
      baseDataExecuteStatus: null,
      showResult: false,
      currentBaseJobId: null,
      showProgress: false,
      progress: 0,
      progressMsg: null,
    }
  },
  methods: {
    updateExeStatus: function(jobId, methodId) {
      if (!jobId) {
        let currentBaseJobId = this.currentBaseJobId
        if (currentBaseJobId) {
          jobId = currentBaseJobId
        } else {
          jobId = ''
        }
      }
      this.$http.get(urlStore.getExecuteBasicMethod, {
        params: {
          jobId: jobId,
          methodModelId: methodId?methodId:this.$store.getters.auditingBaseMethodId,
          userId: this.$store.getters.user.userId
        }
      }).then(res => {
        if (res.body.progressMsg) {
          this.progressMsg = res.body.progressMsg
          this.progress = res.body.progress
          this.showProgress = true
        }
        this.$store.commit('setCurrentBaseJobId', res.body.jobId)
        this.$store.commit('setAuditingBaseMethodId', res.body.data[0].children[0].methodId)
        this.currentBaseJobId = res.body.jobId
        this.baseDataExecuteStatus = res.body
        if (res.body.data[0].children[0].status == 'success' || res.body.data[0].children[0].status == 'error') {
          this.disableInput = false
          this.$store.commit('setAuditStatus', false)
          this.finished = true
          this.disableInput = false
          this.currentStep = 4
          this.$store.commit('setCurrentBaseJobId', '')
          this.$store.commit('setContinueAudit', false)
          // this.$store.commit('setAuditingBaseMethodId', '')
          console.log('====base finished====')
        }
      }, res => {
        Message({
          message: '更新状态出现错误',
          type: 'error',
          duration: 2000,
          showClose: true
        })
      })
    },
    doAudint: function() {
      if (!this.selectedData) {
        Message({
          message: '请选择基础数据',
          type: 'warning',
          duration: 1500,
          showClose: true
        })
        return
      }

      // 判断表单输入合法性
      let valid = true
      if (this.$refs.params.$refs.form) {
        this.$refs.params.$refs.form.validate(val => {
          valid = val
        })
      }
      if (!valid) {
        Message({
          message: '请正确填写参数',
          type: 'warning',
          duration: 1500,
          showClose: true
        })
        return
      }

      // 开始执行审计
      this.$store.commit('setAuditStatus', true)
      let formData = []

      this.progressMsg = null
      this.progress = 0
      this.showProgress = false

      this.currentStep = 2
      this.disableInput = true
      $(this.$el).find('form .el-form-item').each(function(index, el) {
        let id = $(el).data('id')
        let val
        let $input = $(el).find('input')
        if ($input[0].type == 'radio') {
          val = $input[0].checked ? $input.eq(0).val() : $input.eq(1).val()
        } else if ($input[0].type == 'text') {
          val = $input.val()
        }
        formData.push({
          id: id,
          value: val
        })
      })
      let auditParams = {}
      auditParams.methodId = this.selectedData.id
      auditParams.params = formData
      this.$http.post(urlStore.saveSingleMehtodJob, {
        methodInstanceJson: JSON.stringify(auditParams),
        userId: this.$store.getters.user.userId
      }, {
        emulateJSON: true
      }).then(res => {
        if (res.body.status == 'success') {
          this.baseDataExecuteStatus
          Message({
            message: '审计即将开始正在执行...',
            type: 'info',
            duration: 5000,
            showClose: true
          })
          this.finished = false
          this.updateExeStatus(res.body.jobId, auditParams.methodId)
          let timer = setInterval(() => {
            if (this.finished) {
              clearInterval(timer)
              this.$store.commit('setContinueAudit', false)
            } else {
              console.log('====base continue====')
              this.updateExeStatus(res.body.jobId, auditParams.methodId)
            }
          }, 5000)
        } else {
          Message({
            message: '执行出现错误...',
            type: 'warning',
            duration: 2000,
            showClose: true
          })
        }
      })
    },
    doContinueAudit: function() {
      let self = this
      let methodId = this.$store.getters.auditingBaseMethodId
      this.$http.get(urlStore.getExecuteBasicMethod, {
        params: {
          jobId: '',
          methodModelId: methodId?methodId:'',
          userId: this.$store.getters.user.userId
        }
      }).then(res => {
        if (res.body.data.length) {
          self.currentBaseJobId = res.body.jobId
          self.currentStep = 2
          self.disableInput = true
          self.$store.commit('setAuditStatus', true)
          if (!self.finished) {
            console.log('====base begin====')
            Message({
              message: '基础数据审计继续执行中...',
              type: 'info',
              duration: 2000,
              showClose: true
            })
            self.updateExeStatus()
            let timer = setInterval(function() {
              if (self.finished) {
                clearInterval(timer)
                this.$store.commit('setContinueAudit', false)
              } else {
                console.log('====base continue====')
                self.updateExeStatus()
              }
            }, 5000)
          }
        }
      })
    }
  },
  computed: {
    singleParams: function() {
      return this.$store.getters.selectedData ? this.$store.getters.selectedData.params : null
    },
    auditing: function() {
      return this.$store.getters.auditing
    },
    selectedData: function() {
      return this.$store.getters.selectedData
    },
    continueAudit: function() {
      return this.$store.getters.continueAudit
    }
  },
  watch: {
    continueAudit: function(newVal) {
      if (newVal == 'basic') {
        this.doContinueAudit()
      }
    },
    selectedData: function(newVal){
      // newVal && this.updateExeStatus(null, newVal.id)
    }
  }
}
</script>
<style lang="scss">

</style>
