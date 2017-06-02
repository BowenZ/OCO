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
              <el-form-item v-if="item.type=='boolean'" :prop="item.name" :label="item.name" :rules="[{ required: !(item.isNull-0), message: '请输入参数信息', trigger: 'change' }]" :data-id="item.id" :data-rid="item.releventMethodsId && item.releventMethodsId.join(',')">
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
                <el-date-picker @change="changeDate" v-model="formModel[item.name]" type="date" :disabled="disableInput" placeholder="选择日期">
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
      <div class="execute-button clearfix" v-if="showExecuteButton">
        <el-button type="primary" @click="execute" :loading="disableInput">执行审计</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
export default {
  props: ['showExecuteButton', 'multiple', 'disableInput', 'params'],
  data: function() {
    return {
      formModel: null
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
    changeDate: function() {
      // console.log('=========')
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
}
</style>
