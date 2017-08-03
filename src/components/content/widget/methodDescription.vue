<template>
	<div class="method-descripton">
		<el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2 class="card-title">方法信息</h2>
      </div>
			<p v-html="data" style="margin:0"></p>
    </el-card>
	</div>
</template>
<script>
	export default {
		props: ['description'],
		computed: {
			data: function(){
				return this.description.replace(/\n/ig, '<br>')
			}
		}
	}
</script>
<style lang="scss">
	.method-descripton{
		margin-bottom: 20px;
	}
	.el-card__header{
		padding: 8px 20px;
	}
</style>