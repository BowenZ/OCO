<template>
  <div class="index-page">
    <div class="index-container">
      <section class="index-carousel">
        <template>
          <el-carousel :interval="5000" trigger="click" type="card" height="400px">
            <el-carousel-item v-for="item in 6" :key="item">
              <h3>{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </template>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  name: 'index-page',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.index-page {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: #d2d5da;
  .index-container {
    margin: 30px;
    .index-carousel {
      .el-carousel__item{
        box-shadow: 0px 3px 10px rgba(0,0,0,.3);
      }
      .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
      }
      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }
      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
      }
    }
  }
}
</style>
