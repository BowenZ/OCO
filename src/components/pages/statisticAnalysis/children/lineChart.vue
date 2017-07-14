<template>
  <div class="line-chart">
    <ve-histogram :data="chartData"></ve-histogram>
  </div>
</template>
<script>
import VeHistogram from 'v-charts/lib/histogram'
export default {
  created() {
      this.chartData = {
        columns: ['单位', '问题数'],
        rows: [{
          '单位': '安阳市工商局',
          '问题数': 5
        }, {
          '单位': '濮阳市工商局',
          '问题数': 9
        }, {
          '单位': '河南省财政厅',
          '问题数': 6
        }, {
          '单位': '河南省农业综合开发公司',
          '问题数': 4
        }, {
          '单位': '开封市工商局机关',
          '问题数': 12
        }, {
          '单位': '开封市经济检查支队',
          '问题数': 3
        }]
      }
    },

    components: {
      VeHistogram
    }
}
</script>
<style lang="scss">
</style>
