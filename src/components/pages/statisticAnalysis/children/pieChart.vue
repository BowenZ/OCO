<template>
	<div class="pie-chart">
		<ve-pie :data="chartData"></ve-pie>
	</div>
</template>
<script>
import VePie from 'v-charts/lib/pie'
export default {
  created() {
      this.chartData = {
        columns: ['审计方法', '问题数'],
        rows: [{
          '审计方法': '部门预算执行总体情况和执行率',
          '问题数': 15
        }, {
          '审计方法': '预算项目执行情况',
          '问题数': 29
        }, {
          '审计方法': '年底向宾馆培训中心招待所等大额转款',
          '问题数': 36
        }, {
          '审计方法': '工会经费实际支出超预算',
          '问题数': 14
        }, {
          '审计方法': '福利费支出超预算',
          '问题数': 12
        }, {
          '审计方法': '财政供养人员经商办企业',
          '问题数': 3
        }]
      }
    },

    components: {
      VePie
    }
}
</script>
<style lang="scss"></style>