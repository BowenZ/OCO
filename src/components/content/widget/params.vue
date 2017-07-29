<template>
  <div class="params-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2 class="card-title">参数填写</h2>
        <!-- <el-button style="float: right;" type="primary">操作按钮</el-button> -->
      </div>
      <!-- {{disableInput}} -->
      <!-- {{params}} -->
      <!-- <br> -->
      <!-- <p v-if="!params || !params.length">无参数</p> -->
      <el-form :model="formModel" ref="form" label-position="left" label-width="80px" v-if="params && params.length && formModel">
        <el-row :gutter="50">
          <el-col :xs="24" :md="12" v-for="(item, index) in params" :key="index">
            <div class="input-box">
              <span class="required-param" v-if="!(item.isNull-0)"><i>*</i></span>
              <el-form-item v-if="item.style=='pop'" :prop="item.name" :label="item.name" :rules="[{ required: !(item.isNull-0), message: '请输入参数信息', trigger: 'blur' }]" :data-id="item.id" :data-rid="item.releventMethodsId && item.releventMethodsId.join(',')">
                <el-input v-model="formModel[item.name]" :disabled="disableInput">
                  <el-button slot="prepend" icon="more" @click="showChooseParam(item.name)"></el-button>
                  <el-tooltip v-if="multiple" slot="append" placement="top-start">
                    <div slot="content">
                      <h3>相关方法列表</h3>
                      <p v-for="method in item.releventMethods">{{method}}</p>
                    </div>
                    <el-button>({{item.releventMethods.length}})</el-button>
                  </el-tooltip>
                </el-input>
              </el-form-item>
              <el-form-item v-else-if="item.type=='boolean'" :prop="item.name" :label="item.name" :rules="[{ required: !(item.isNull-0), message: '请输入参数信息', trigger: 'change' }]" :data-id="item.id" :data-rid="item.releventMethodsId && item.releventMethodsId.join(',')">
                <el-radio-group v-model="formModel[item.name]" :disabled="disableInput">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                  <el-tooltip v-if="multiple" placement="top-start" class="right-tooltip">
                    <div slot="content">
                      <h3>相关方法列表</h3>
                      <p v-for="method in item.releventMethods">{{method}}</p>
                    </div>
                    <el-button>({{item.releventMethods.length}})</el-button>
                  </el-tooltip>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-else-if="item.type=='date'" :prop="item.name" :label="item.name" :rules="[{ type: 'date', required: !(item.isNull-0), message: '请输入参数信息', trigger: 'blur' }]" :data-id="item.id" :data-rid="item.releventMethodsId && item.releventMethodsId.join(',')">
                <!-- {{item.releventMethodsId}} -->
                <el-date-picker v-model="formModel[item.name]" type="date" :disabled="disableInput" placeholder="选择日期">
                </el-date-picker>
                <el-tooltip v-if="multiple" placement="top-start" class="right-tooltip">
                  <div slot="content">
                    <h3>相关方法列表</h3>
                    <p v-for="method in item.releventMethods">{{method}}</p>
                  </div>
                  <el-button class="date-tooltip">({{item.releventMethods.length}})</el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item v-else :prop="item.name" :label="item.name" :rules="[{ required: !(item.isNull-0), message: '请输入参数信息', trigger: 'blur' }]" :data-id="item.id" :data-rid="item.releventMethodsId && item.releventMethodsId.join(',')">
                <el-input v-model="formModel[item.name]" :disabled="disableInput">
                  <el-tooltip v-if="multiple" slot="append" placement="top-start">
                    <div slot="content">
                      <h3>相关方法列表</h3>
                      <p v-for="method in item.releventMethods">{{method}}</p>
                    </div>
                    <el-button>({{item.releventMethods.length}})</el-button>
                  </el-tooltip>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <p v-else>无参数</p>
      <!-- <div class="execute-button clearfix" v-if="showExecuteButton">
        <el-button type="primary" @click="execute" :loading="disableInput">执行审计</el-button>
      </div> -->
    </el-card>
    <el-dialog title="选择参数" v-model="dialogVisible" size="tiny" @close="handleClose" :close-on-click-modal="false">
      <div class="popup-param" @keyup.enter="searchParam('pressEnter')">
        <p>请输入要搜索的单位名称</p>
        <el-select v-model="popupSearch" multiple filterable remote placeholder="搜索关键词" :remote-method="searchParam" :loading="loading" loading-text="正在加载参数信息，请稍后..." :no-data-text="searchTips" @change="handleSelectChange">
          <el-option v-for="(item, index) in paramList" :key="index" :label="item.label" :value="item.value+index">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import urlStore from '@/api/urlStore.js'
export default {
  props: ['showExecuteButton', 'multiple', 'disableInput', 'params'],
  data: function() {
    return {
      formModel: null,
      popupSearch: null,
      dialogVisible: false,
      loading: false,
      paramList: [],
      currentParamName: null,
      searchTips: '请按回车键搜索'
    }
  },
  methods: {
    execute: function() {
      let formData = []
      if (this.$refs.form) {
        this.$refs.form.validate(valid => {
          if (valid) {
            $(this.$el).find('form .el-form-item').each(function(index, el) {
              let id = $(el).data('id')
              let rid = $(el).data('rid')
              let val
              let $input = $(el).find('input')
              if ($input[0].type == 'radio') {
                val = $input[0].checked ? $input.eq(0).val() : $input.eq(1).val()
              } else if ($input[0].type == 'text') {
                val = $input.val()
              }
              formData.push({
                id: id,
                rid: rid,
                val: val
              })
            })
            this.$store.commit('setAuditParams', formData)
            this.$emit('doAudit')
          } else {
            console.log('参数为空')
          }
        })
      } else {
        this.$emit('doAudit')
      }
    },
    showChooseParam: function(itemName) {
      this.dialogVisible = true
      this.currentParamName = itemName
    },
    searchParam: function(query) {
      if(query == 'pressEnter'){
        let searchVal = $(this.$el).find('.el-select__input').val()
        if(!searchVal){
          return
        }
        this.loading = true
        this.$http.post(urlStore.queryParamKeyValues, {
          paramName: this.currentParamName,
          key: searchVal
        }, {
          emulateJSON: true
        }).then(res => {
          this.loading = false
          if (res.ok && res.body.status == 'success') {
            this.paramList = res.body.list
            if(!this.paramList.length){
              this.searchTips = '无数据'
            }
          }
        }).catch(err => {
          this.loading = false
        })
      }else{
        this.searchTips = '请按回车键搜索'
      }
    },
    handleClose: function() {
      this.popupSearch = []
      this.paramList = []
    },
    confirmParam: function() {
      console.log()
      if(!this.popupSearch.length){
        this.dialogVisible = false
        return
      }
      let tmpObj = {}
      this.popupSearch.forEach(item => {
        item = item.substring(0, item.length - 1)
        if (tmpObj.item) {
          return
        } else {
          tmpObj[item] = 1
        }
      })
      if (this.formModel[this.currentParamName]) {
        this.formModel[this.currentParamName] += (',' + Object.keys(tmpObj).join(','))
      } else {
        this.formModel[this.currentParamName] = Object.keys(tmpObj).join(',')
      }
      this.dialogVisible = false
    },
    handleSelectChange(val){
      if(!val.length){
        this.dialogVisible = false
        return
      }
      if (this.formModel[this.currentParamName]) {
        this.formModel[this.currentParamName] += (',' + val[0])
      } else {
        this.formModel[this.currentParamName] = val[0]
      }
      $('body .el-select-dropdown').css('display', 'none')
      this.dialogVisible = false
    }
  },
  watch: {
    params: function(newVal) {
      let formModel2 = {}
      if (this.params && this.params.length) {
        this.params.forEach(item => {
          if (item.type == 'date') {
            item.value = new Date(item.value)
          }
          formModel2[item.name] = item.value
        })
      }
      this.formModel = formModel2
    }
  }
}
</script>
<style lang="scss">
.params-container {
  margin-bottom: 10px;
  .execute-button {
    button {
      float: right;
    }
  }
  .date-tooltip {
    background-color: rgb(250, 254, 253);
    color: rgb(151, 190, 188);
  }
  form {
    .el-form-item__content {
      position: relative;
      .right-tooltip {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }
  .input-box {
    position: relative;
    padding-left: 15px;
    .required-param {
      position: absolute;
      color: red;
      left: 0;
      height: 40px;
      display: table;
      i {
        font-style: normal;
        display: table-cell;
        vertical-align: middle;
      }
    }
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .popup-param {
    text-align: center;
    .el-select {
      width: 100%;
    }
  }
}
</style>
