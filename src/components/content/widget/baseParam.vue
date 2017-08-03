<template>
  <div class="base-param">
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="text" @click="addParam">
            <i class="el-icon-plus"></i>增加参数
          </el-button>
        </el-col>
        <el-col :span="20">
          <el-form ref="form" label-width="80px">
            <el-form-item label="关系">
              <el-radio-group v-model="globalRelation">
                <el-radio-button label="and"></el-radio-button>
                <el-radio-button label="or"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row class="extra-params">
        <el-col v-for="(item, index) in sleectedParams" :key="index" class="extra-param-item">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="item.param" placeholder="请选择参数名">
                <el-option v-for="(item, index) in paramList" :key="index" :label="item.name" :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="item.symbol" placeholder="请选择条件">
                <el-option v-for="(item, index) in symbolList" :key="index" :label="item.label" :value="item.value">
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
  data() {
    return {
      paramList: [{
        name: 'a',
        type: 'string'
      }, {
        name: 'b',
        type: 'number'
      }],
      symbolList: [{
        value: 'lg',
        label: '>'
      }, {
        value: 'lt',
        label: '<'
      }, {
        value: 'eq',
        label: '='
      }],
      sleectedParams: [],
      globalRelation: 'and'
    }
  },
  created() {
    // this.$http.get(urlStore)

  },
  methods: {
  	addParam(){
  		this.sleectedParams.push({
  			param: null,
  			symbol: null,
  			value: null
  		})
  	},
  	removeParam(index){
  		this.sleectedParams.splice(index, 1)
  	}
  }
}

</script>
<style lang="scss">
	.base-param{
		.el-form-item__content{
			line-height: normal;
		}
		.extra-params{
			.extra-param-item{
				margin-bottom: 10px;
			}
		}
	}
</style>
