<template>
  <div class="base-param" v-if="baseParamData">
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="text" @click="addParam">
            <i class="el-icon-plus"></i>关键字段
          </el-button>
        </el-col>
        <el-col :span="20">
          <el-form ref="form" label-width="80px">
            <el-form-item label="关系">
              <el-radio-group v-model="operator">
                <el-radio-button label="and"></el-radio-button>
                <el-radio-button label="or"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row class="extra-params" :gutter="40">
        <el-col v-for="(item, index) in sleectedParams" :key="index" :md="12" class="extra-param-item">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-select v-model="item.param" placeholder="参数">
                <el-option v-for="(item, index) in baseParamData.paramList" :key="index" :label="item.name" :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="item.symbol" placeholder="条件">
                <el-option v-for="(item, index) in baseParamData.symbolList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-input-number v-if="item.param && item.param.type=='number'" v-model="item.value"></el-input-number>
              <el-input v-else v-model="item.value" placeholder="请输入内容"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="text" icon="close" @click="removeParam(index)"></el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import urlStore from '@/api/urlStore.js'
export default {
  props: ['baseParamData'],
  data() {
    return {
      paramList: null,
      symbolList: null,
      sleectedParams: [],
      operator: 'and'
    }
  },
  methods: {
    addParam() {
      this.sleectedParams.push({
        param: null,
        symbol: null,
        value: null
      })
    },
    removeParam(index) {
      this.sleectedParams.splice(index, 1)
    },
    getParams() {
      let ret = {
        columnsOperator: this.operator,
        columnConditionVos: []
      }
      this.sleectedParams.forEach(item => {
        if (item.param && item.symbol && item.value) {
          ret.columnConditionVos.push({
            columnName: item.param.name,
            paramValue: item.value,
            operator: item.symbol,
            type: item.param.type
          })
        }
      })
      return ret
    },
    clearParam(){
      this.sleectedParams = []
    }
  }
}

</script>
<style lang="scss">
.base-param {
  .el-form-item__content {
    line-height: normal;
  }
  .extra-params {
    .extra-param-item {
      margin-bottom: 10px;
      .el-col{
        font-size: 0;
        >div{
          font-size: 14px;
        }
      }
    }
  }
  .el-input-number {
    width: 100%;
  }
}

</style>
