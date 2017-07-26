<template>
  <div class="dril-table">
  	<p>根据 <strong>{{levelTable[drillLevel]}}</strong> <strong>{{drillParent.unitName}}</strong>钻取其下属所有 <strong>{{levelTable[drillLevel + 1]}}</strong></p>
    <el-table ref="resultTable" v-if="tableData && tableData.length" :data="tableData" border style="width: 100%" height="100%">
      <el-table-column fixed prop="methodName" label="方法名" show-overflow-tooltip width="140">
        <template scope="scope">
          <span>{{scope.row.methodName}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(unit, index) in tableData[0].units" :key="index" :prop="'company-'+unit.unitCode" :label="unit.unitName">
        <template scope="scope">
          <span>{{scope.row.units[index].resultCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="resultCount" fixed="right" label="汇总" show-overflow-tooltip width="150">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ['data', 'drillParent', 'drillLevel'],
  data: function(){
  	return {
  		levelTable: [,'一级单位','二级单位','三级单位']
  	}
  },
  computed: {
    tableData: function() {
    	if(!this.data || !this.data.length){
    		return null
    	}
    	return this.data
      // let ret = []
      // this.data.forEach(dataItem => {
      // 	let obj = {
      // 		methodName: dataItem.methodName,
      // 		resultCount: dataItem.resultCount
      // 	}
      	
      // })
    }
  }
}

</script>
<style lang="scss">


</style>
