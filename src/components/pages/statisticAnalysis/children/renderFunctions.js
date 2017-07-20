export default {
	renderHeaderFunction(h, { column, $index }){
		// console.log(h, column, $index)
		// return (<span>{column.label}</span>)
		let id = column.property.split('-').pop()
		return (
			<el-tooltip class="item" effect="dark" content={column.label} placement="top">
				<span class="header-wrapper">
			    <span data-id={id} on-click={ () => this.drillingData(id, 1)}>{column.label}</span>
				</span>
		  </el-tooltip>
			)
	},
	renderHeaderFunction2(h, { column, $index }){
		// console.log(h, column, $index)
		// return (<span>{column.label}</span>)
		let id = column.property.split('-').pop()
		return (
			<span class="header-wrapper">
	  		<el-button type="text" icon="search" on-click={ () => this.showSearchCompany(column, $index) }></el-button>
				<el-tooltip class="item" effect="dark" content={column.label} placement="top-start">
			    <span data-id={id} on-click={ () => this.drillingData(this.tableData[0].companies[$index].subCompany.id, this.tableData[0].companies[$index].subCompany.level)}>{column.label}</span>
			  </el-tooltip>
		  </span>)
	}
}
