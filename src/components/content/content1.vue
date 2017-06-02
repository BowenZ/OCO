<template>
  <div class="content content1">
    <v-step :steps="steps" :currentStep="currentStep"></v-step>
    <div class="content-block" element-loading-text="正在加载数据">
      <!-- {{disableInput}}/{{auditing}} -->
      <!-- {{selectedParams}} -->
      <v-params @doAudit="doAudit" :showExecuteButton="true" :multiple="true" :disableInput="disableInput || auditing" :params="selectedParams"></v-params>
      <v-result :single="false" :executeStatus="multipleExecuteStatus" :finished="finished" :showProgress="showProgress" :progress="progress" :progressMsg="progressMsg"></v-result>
    </div>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import {
  Message
} from 'element-ui'
import vStep from './widget/step'
import vParams from './widget/params'
import vResult from './widget/result'
import urlStore from '../../api/urlStore.js'

function getLast(arr) {
  if (!arr || arr.length == 0) {
    return false
  }
  return arr[arr.length - 1]
}

export default {
  components: {
    vStep,
    vParams,
    vResult
  },
  data: function() {
    return {
      steps: ['填写参数', '执行审计'],
      currentStep: 0,
      disableInput: false,
      finished: false,
      showProgress: false,
      progress: 0,
      progressMsg: null
    }
  },
  methods: {
    updateExeStatus: function(jobId) {
      if (!jobId) {
        let currentJobId = this.$store.getters.currentJobId
        if (currentJobId) {
          jobId = currentJobId
        } else {
          jobId = ''
        }
      }
      this.$http.get(urlStore.getExecuteMethods, {
        params: {
          jobId: jobId,
          userId: this.$store.getters.user.userId
        }
      }).then(res => {
        if (res.body.progressMsg) {
          this.progressMsg = res.body.progressMsg
          this.progress = res.body.progress
          this.showProgress = true
        }
        this.$store.commit('setCurrentJobId', res.body.jobId)
        if (res.body.data.length > 0) {
          this.$store.commit('setMultipleExecuteStatus', res.body)
        } else {
          this.disableInput = false
          this.$store.commit('setAuditStatus', false)
        }
        let count = 0
        let total = 0
        res.body.data.forEach(item => {
          if (item.children.length) {
            item.children.forEach(mtd => {
              total++
              if (mtd.status == 'success' || mtd.status == 'error') {
                count++
              }
            })
          }
        })
        let lastStatus = getLast(getLast(res.body.data).children).status
        if ((lastStatus == 'success' || lastStatus == 'error') && count == total) {
          console.log('====multiple finished====')
          this.finishAudit()
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
    finishAudit: function() {
      this.$store.commit('setAuditStatus', false)
      this.$store.commit('setContinueAudit', false)
      this.finished = true
      this.disableInput = false
        // this.$store.commit('finishIt')
      this.currentStep = 2
    },
    doAudit: function() {
      if (this.$store.getters.selectedJobId === null) {
        Message({
          message: '请选择审计项目',
          type: 'warning',
          duration: 1500,
          showClose: true
        })
        return
      }
      let selectedMethods = this.$store.getters.selectedMethods
      if (!selectedMethods.length) {
        Message({
          message: '请选择审计方法',
          type: 'warning'
        })
        return
      }
      this.progressMsg = null
      this.progress = 0
      this.showProgress = false
      this.currentStep = this.steps.length - 1
      $(this.$el).find('.result-container').addClass('active')
      this.disableInput = true
      this.$store.commit('setAuditStatus', true)
      let self = this
      setTimeout(function() {
        let auditParams = self.$store.getters.auditParams
        let exeParams = []
        selectedMethods.forEach(method => {
          let exeParam = {
            methodId: method.id,
            params: []
          }
          auditParams.forEach(item => {
            (item.rid + '').split(',').forEach(rid => {
              if (rid == method.id) {
                exeParam.params.push({
                  id: item.id,
                  val: item.val
                })
              }
            })
          })
          exeParams.push(exeParam)
        })

        self.$http.post(urlStore.saveJob, {
          methodInstanceJson: JSON.stringify(exeParams),
          jobId: self.$store.getters.selectedJobId,
          userId: self.$store.getters.user.userId
        }, {
          emulateJSON: true
        }).then(res => {
          let result = res.body
          if (result.status == 'success') {
            console.log('多方法审计开始：', result)
            Message({
              message: '审计即将开始正在执行...',
              type: 'info',
              duration: 5000,
              showClose: true
            })
            self.finished = false
            if (!self.finished) {
              self.$store.commit('setMultipleExecuteStatus', null)
              self.updateExeStatus(result.jobId)
              let timer = setInterval(function() {
                if (self.finished) {
                  clearInterval(timer)
                } else {
                  console.log('====multiple continue====')
                  self.updateExeStatus(result.jobId)
                }
              }, 5000)
            }
          } else {
            Message({
              message: '出现错误：' + result.msg,
              type: 'danger',
              duration: 2000,
              showClose: true
            })
          }
        }, res => {
          Message({
            message: '执行出现错误',
            type: 'error',
            duration: 2000,
            showClose: true
          })
        })
      }, 100)
    },
    doContinueAudit: function() {
      let self = this
      this.$http.get(urlStore.getExecuteMethods, {
        params: {
          jobId: '',
          userId: this.$store.getters.user.userId
        }
      }).then(res => {
        if (res.body.data.length) {
          self.$store.commit('setCurrentJobId', res.body.jobId)
          self.currentStep = self.steps.length - 1
          $(self.$el).find('.result-container').addClass('active')
          self.disableInput = true
          self.$store.commit('setAuditStatus', true)
          self.finished = false
          if (!self.finished) {
            console.log('====multiple begin====')
            Message({
              message: '审计项目继续执行中...',
              type: 'info',
              duration: 2000,
              showClose: true
            })
            self.showProgress = true
            self.updateExeStatus()
            let timer = setInterval(function() {
              if (self.finished) {
                clearInterval(timer)
              } else {
                console.log('====multiple continue====')
                self.updateExeStatus()
              }
            }, 5000)
          }
        }
      })
    }
  },
  computed: {
    selectedParams: function() {
      let params = this.$store.getters.selectedParams
      if (params && params.length) {
        return params
      } else {
        this.$store.commit('refreshSelectedParams')
      }
      return this.$store.getters.selectedParams
    },
    auditing: function() {
      return this.$store.getters.auditing
    },
    methodTree: function() {
      return this.$store.getters.methodTree
    },
    continueAudit: function() {
      return this.$store.getters.continueAudit
    },
    multipleExecuteStatus: function() {
      return this.$store.getters.multipleExecuteStatus
    }
  },
  watch: {
    continueAudit: function(newVal) {
      if (newVal) {
        this.doContinueAudit()
      }
    }
  }
}
</script>
<style lang="scss">
</style>
