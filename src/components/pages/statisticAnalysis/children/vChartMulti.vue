<template>
  <div class="chart-multi">
    <el-radio-group v-model="chartType" @change="handleChangeType">
      <el-radio-button label="bar">条形图</el-radio-button>
      <el-radio-button label="histogram">柱状图</el-radio-button>
      <el-radio-button label="pie">饼图</el-radio-button>
      <el-radio-button label="line">折线图</el-radio-button>
    </el-radio-group>
    <p>{{levelTable[level]}}</p>
    <el-row :gutter="10" class="chart-container">
      <el-col v-for="(data, index) in chartData" :key="index" :xs="24" :sm="24" :md="12" :lg="8">
        <p>方法名：{{data.methodName}}</p>
        <ve-chart :data="data" :data-index="index" :settings="chartSettings" :legend-visible="false" :events="chartEvents" tooltip-visible></ve-chart>
      </el-col>
    </el-row>
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
      type: Array,
      required: true
    },
    defaultType: {
      type: String
    },
    level: {
      type: Number
    }
  },
  data() {
    return {
      levelTable: ['所有单位', '一级单位', '二级单位', '三级单位'],
      chartType: this.defaultType ? this.defaultType : 'pie',
      chartSettings: {
        type: this.defaultType ? this.defaultType : 'pie'
      },
      chartEvents: {
        click: (event) => {
          let index = event.event.event.path[2].dataset.index
          let target = this.chartData[index].rows[event.dataIndex]
          this.$emit('click', {
            methodId: target.methodId,
            methodName: this.chartData[index].methodName,
            resultCount: event.value,
            unitName: event.name,
            unitCodes: JSON.stringify([{
              unitCode: target.unitCode,
              unitLevel: this.level
            }])
          })
        }
      }
    }
  },
  methods: {
    handleChangeType(val) {
      this.chartSettings.type = val
    }
  }
}

</script>
<style lang="scss"></style>
