let levelTable = [,'一级单位','二级单位','三级单位']
export default {
	renderHeaderFunction(h, { column, $index }){
		// console.log(h, column, $index)
		// return (<span>{column.label}</span>)
		let id = column.property.split('-').pop()
		return (
			<el-tooltip class="item" effect="dark" content={column.label} placement="top">
				<span data-id={id} data-index={$index-1} class="header-wrapper">
			    <span data-id={id} data-index={$index-1} on-click={ () => this.drillingData(id, 1)}>{column.label}</span>
				</span>
		  </el-tooltip>
			)
	},
	renderHeaderFunction2(h, { column, $index }){
		// console.log(h, column, $index)
		// return (<span>{column.label}</span>)
		let id = column.property.split('-').pop()
		return (
			<span data-id={id} data-index={$index} class="header-wrapper">
	  		<el-button type="text" icon="search" on-click={ () => this.showSearchCompany(column, $index) }></el-button>
				<el-tooltip class="item" effect="dark" content={column.label} placement="top-start">
			    <span data-id={id} data-index={$index} on-click={ () => this.drillingData(this.tableData[0].companies[$index].subCompany.unitCode, this.tableData[0].companies[$index].subCompany.unitLevel)}>{column.label}</span>
			  </el-tooltip>
		  </span>)
	}
}
