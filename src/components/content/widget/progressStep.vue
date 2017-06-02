<template>
  <div class="step-container">
    <div class="step">
      <el-steps :space="100" :active="currentStep" finish-status="success">
        <el-step v-for="(step, index) in steps" :title="step" :key="index">
          <div slot="icon">
            <el-progress v-if="showProgress" type="circle" :percentage="25" :width="80"></el-progress>
            <span v-else>{{currentStep+1}}</span>
          </div>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      active: 0
    }
  },
  props: ['steps', 'currentStep', 'showProgress', 'progress', 'progressMsg']
}
</script>
<style lang="scss">
.step-container {
  background-color: #fff;
  position: relative;
  padding: 5px 0;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, .1), 0px 0px 2px 0px rgba(0, 0, 0, .03);
  border-radius: 2px;
  overflow: hidden;
  .step {
    text-align: center;
    position: relative;
    left: 50px;
    .el-step {
      display: inline-block;
      vertical-align: bottom;
      min-width: 150px;
      .el-step__title.is-success {
        font-weight: normal;
      }
      .el-step__title.is-process {
        font-weight: normal;
      }
    }
  }
  .el-step__icon{
        line-height: 36px;
  }
  .el-step__head{
    width: 80px;
    height: 80px;
  }
  .el-progress{
        transform: translate3d(-2px,-2px,0);
  }
}
</style>
