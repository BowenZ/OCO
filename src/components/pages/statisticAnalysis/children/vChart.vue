<template>
  <div class="v-chart">
    <p>{{levelTable[level]}}</p>
  	<el-radio-group v-model="chartType" @change="handleChangeType">
      <el-radio-button label="bar">条形图</el-radio-button>
      <el-radio-button label="histogram">柱状图</el-radio-button>
      <el-radio-button label="pie">饼图</el-radio-button>
      <el-radio-button label="line">折线图</el-radio-button>
    </el-radio-group>
    <el-button type="primary" style="float:right" @click="$emit('search')">其他</el-button>
    <ve-chart ref="chart" :data="chartData" :settings="chartSettings" :legend-visible="legendVisible && chartSettings.type != 'pie'" :events="chartEvents" tooltip-visible></ve-chart>
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
    },
    level: {
      type: Number,
      default: 0
    },
    legendVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      levelTable: ['所有单位', '一级单位', '二级单位', '三级单位'],
    	chartType: this.defaultType?this.defaultType:'pie',
      chartSettings: {
        type: this.defaultType?this.defaultType:'pie'
      },
      chartEvents: {
      	click: (event) => {
          this.$emit('click', {
            name: event.name,
            value: event.value
          }, event.dataIndex)
      	}
      }
    }
  },
  created(){
    this.changeSettings()
  },
  methods: {
    changeSettings(){
      if ((this.chartType == 'bar' || this.chartType == 'histogram') && this.level == 0 && this.chartData.type == 'company') {
        this.chartSettings = {
          type: this.chartType,
          metrics: ['一级单位', '二级单位', '三级单位'],
          area: true,
          stack: {
            '总问题数': ['一级单位', '二级单位', '三级单位']
          }
        }
      } else {
        this.chartSettings = {
          type: this.chartType,
          metrics: ['总问题数'],
        }
      }
    },
  	handleChangeType(val){
      this.chartType = val
      this.changeSettings()
  	}
  },
  watch: {
    level(val){
      this.changeSettings()
    },
    chartData(){
      this.$refs.chart.echarts.resize()
    }
  }
}

</script>
<style lang="scss"></style>
