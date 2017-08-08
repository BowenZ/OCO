<template>
  <div class="method-descripton">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2 class="card-title">方法信息</h2>
      </div>
      <p v-if="description" v-html="data" class="description-copy" style="margin:0"></p>
      <div v-if="descriptions" class="description-list">
        <div class="description-item" v-for="(des, index) in descriptions" :key="index">
          <h3>{{des.title}}</h3>
          <p v-html="des.description" class="description-copy"></p>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: ['description', 'descriptions'],
  computed: {
    data: function() {
      return this.description.replace(/\n/ig, '<br>')
    }
  }
}

</script>
<style lang="scss">
.method-descripton {
  margin-bottom: 20px;
  .description-list {
    max-height: 300px;
    overflow: auto;
  }
  .description-copy {
    font-size: 14px;
  }
}

.el-card__header {
  padding: 8px 20px;
}

</style>
