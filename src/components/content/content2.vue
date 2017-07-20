<template>
  <div class="content content2">
    <v-step :steps="steps" :currentStep="currentStep"></v-step>
    <div class="content-block">
      <!-- {{selectedMethod}} -->
      <v-params ref="params" :showExecuteButton="false" :multiple="false" :disableInput="disableInput || auditing" :params="singleParams"></v-params>
      <v-import v-if="selectedMethod" @fileChange="handleFileChange" @importFile="handleImportFile" @uploadFinished="handleUploadFinished" :disableInput="disableInput || auditing"></v-import>
      <div class="execute-button clearfix" v-if="selectedMethod">
        <el-button type="primary" size="large" @click="doAudint" :loading="disableInput || auditing">执行审计</el-button>
      </div>
      <!-- <v-result-item></v-result-item> -->
      <v-result :single="true" :data="1" :executeStatus="singleExecuteStatus"></v-result>
    </div>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import vStep from './widget/step'
import vParams from './widget/params'
import vImport from './widget/import'
import vResult from './widget/result'
import {
  Message
} from 'element-ui'

import urlStore from '../../api/urlStore.js'
// import vResultItem from './widget/resultItem'

export default {
  components: {
    vStep,
    vParams,
    vResult,
    // vResultItem,
    vImport

  },
  data: function() {
    return {
      steps: ['填写参数', '外部数据导入', '执行审计'],
      currentStep: 0,
      disableInput: false,
      uploadFinished: false,
      externalFiles: null,
      finished: false
    }
  },
  methods: {
    updateExeStatus: function(jobId, methodId) {
      if (!jobId) {
        let currentSingleJobId = this.$store.getters.currentSingleJobId
        if (currentSingleJobId) {
          jobId = currentSingleJobId
        } else {
          jobId = ''
        }
      }
      this.$http.get(urlStore.getExecuteSingleMethod, {
        params: {
          jobId: jobId,
          methodModelId: methodId?methodId:this.$store.getters.auditingMethodId,
          userId: this.$store.getters.user.userId
        }
      }).then(res => {
        this.$store.commit('setCurrentSingleJobId', res.body.jobId)
        this.$store.commit('setAuditingMethodId', res.body.data[0].children[0].methodId)
        this.$store.commit('setSingleExecuteStatus', res.body)
        if (res.body.data[0].children[0].status == 'success' || res.body.data[0].children[0].status == 'error') {
          this.disableInput = false
          this.$store.commit('setAuditStatus', false)
          this.finished = true
          this.disableInput = false
          this.currentStep = 4
          this.$store.commit('setCurrentSingleJobId', '')
          this.$store.commit('setContinueAudit', false)
          // this.$store.commit('setAuditingMethodId', '')
          console.log('====single finished====')
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
      let self = this
      if (!this.selectedMethod) {
        Message({
          message: '请选择审计方法',
          type: 'warning',
          duration: 1500,
          showClose: true
        })
        return
      }
      if (this.selectedMethod.externalDataSource && this.selectedMethod.externalDataSource.length && !this.uploadFinished) {
        Message({
          message: '请上传数据文件后再执行审计',
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
      this.currentStep = 2
      $(this.$el).find('.result-container').addClass('active')
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
      auditParams.methodId = self.selectedMethod.id
      auditParams.params = formData
      auditParams.externalFiles = self.externalFiles
      self.$http.post(urlStore.saveSingleMehtodJob, {
        methodInstanceJson: JSON.stringify(auditParams),
        userId: this.$store.getters.user.userId
      }, {
        emulateJSON: true
      }).then(res => {
        if (res.body.status == 'success') {
          this.$store.commit('setSingleExecuteStatus', null)
          Message({
            message: '审计即将开始正在执行...',
            type: 'info',
            duration: 5000,
            showClose: true
          })
          self.$store.commit('setSingleExecuteStatus', null)
          self.finished = false
          self.updateExeStatus(res.body.jobId, auditParams.methodId)
          let timer = setInterval(function() {
            if (self.finished) {
              clearInterval(timer)
              this.$store.commit('setContinueAudit', false)
            } else {
              console.log('====single continue====')
              self.updateExeStatus(res.body.jobId, auditParams.methodId)
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
      let methodId = this.$store.getters.auditingMethodId
      this.$http.get(urlStore.getExecuteSingleMethod, {
        params: {
          jobId: '',
          methodModelId: methodId?methodId:'',
          userId: this.$store.getters.user.userId
        }
      }).then(res => {
        if (res.body.data.length) {
          self.$store.commit('setCurrentSingleJobId', res.body.jobId)
          self.currentStep = 2
          self.disableInput = true
          self.$store.commit('setAuditStatus', true)
          if (!self.finished) {
            console.log('====single begin====')
            Message({
              message: '审计方法继续执行中...',
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
                console.log('====single continue====')
                self.updateExeStatus()
              }
            }, 5000)
          }
        }
      })
    },
    handleFileChange: function() {
      this.currentStep = 1
    },
    handleImportFile: function() {
      this.currentStep = 2
    },
    handleUploadFinished: function(files) {
      this.uploadFinished = true
      this.externalFiles = files
    }
  },
  computed: {
    singleParams: function() {
      return this.$store.getters.singleParams
    },
    auditing: function() {
      return this.$store.getters.auditing
    },
    selectedMethod: function() {
      return this.$store.getters.selectedMethod
    },
    singleExecuteStatus: function() {
      let ret = this.$store.getters.singleExecuteStatus
      return ret

    },
    continueAudit: function() {
      return this.$store.getters.continueAudit
    }
  },
  watch: {
    continueAudit: function(newVal) {
      if (newVal == 'single') {
        this.doContinueAudit()
      }
    },
    selectedMethod: function(newVal){
      // console.log('+++++++++++', newVal)
      // this.updateExeStatus(null, newVal.id)
    }
  }
}
</script>
<style lang="scss">

</style>
