<template>
  <div class="v-chart">
  	<el-radio-group v-model="chartType" @change="handleChangeType">
      <el-radio-button label="bar">条形图</el-radio-button>
      <el-radio-button label="histogram">柱状图</el-radio-button>
      <el-radio-button label="pie">饼图</el-radio-button>
      <el-radio-button label="line">折线图</el-radio-button>
    </el-radio-group>
    <ve-chart :data="chartData" :settings="chartSettings" :events="chartEvents" tooltip-visible legend-visible></ve-chart>
  </div>
</template>
<script>
import VeChart from 'v-charts/lib/chart'
export default {
  components: {
    VeChart
  },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    defaultType: {
      type: String
    }
  },
  data() {
    return {
    	chartType: this.defaultType?this.defaultType:'pie',
      chartSettings: {
        type: this.defaultType?this.defaultType:'pie'
      },
      chartEvents: {
      	click: (event) => {
          console.log('=====event===', event)
          this.$emit('click', {
            name: event.name,
            value: event.value
          }, event.dataIndex)
      	}
      }
    }
  },
  methods: {
  	handleChangeType(val){
  		this.chartSettings.type = val
  	}
  }
}

</script>
<style lang="scss"></style>
