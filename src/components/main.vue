<template>
  <div class="main-container">
    <div class="inner-container">
      <div class="content-container" v-show="currentIndex == 0">
        <v-content1></v-content1>
      </div>
      <div class="content-container" v-show="currentIndex == 1">
        <v-content2></v-content2>
      </div>
      <div class="content-container" v-show="currentIndex == 2">
        <v-content3></v-content3>
      </div>
      <div class="content-container" v-show="currentIndex == 5">
        <v-content4></v-content4>
      </div>
      <div class="content-container" v-show="currentIndex == 6">
        <v-content5></v-content5>
      </div>
    </div>
    <transition name="view-fade">
      <router-view class="view-fade"></router-view>
    </transition>
  </div>
</template>
<script>
import vContent1 from './content/content1'
import vContent2 from './content/content2'
import vContent3 from './content/content3'
import vContent4 from './content/content4'
import vContent5 from './pages/statisticAnalysis/statisticAnalysis'
export default {
  components: {
    vContent1,
    vContent2,
    vContent3,
    vContent4,
    vContent5
  },
  data: function() {
    return {

    }
  },
  computed: {
    currentIndex: function() {
      return this.$store.state.currentDrawerIndex
    }
  }
}
</script>
<style lang="scss">
div {
  box-sizing: border-box;
}

.view-fade {
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
}

.view-fade-enter,
.view-fade-leave-active {
  opacity: 0;
}

.main-container {
  position: absolute;
  padding: 20px;
  top: 0;
  bottom: 0;
  left: 80px;
  right: 0;
  // z-index: 10;
  overflow: auto;
  background-color: #d2d5da;
  transition: all .4s;
  transition-timing-function: cubic-bezier(.694, .0482, .335, 1);
  background-size: cover;
  background-position: center;
  &.active {
    left: 380px;
  }
  &.hide-scrollbar {
    overflow: hidden;
  }
  .inner-container {
    width: 100%;
    height: 100%;
    position: relative;
    // max-width: 1000px;
    margin: 0 auto;
    .content-container {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      .content {
        position: relative;
        height: 100%;
        .el-carousel {
          height: 100%;
          height: 100%;
          .el-carousel__container {
            height: 100%;
          }
          .el-carousel__item.is-active {
            overflow: auto;
          }
        }
        .content-block {
          position: absolute!important;
          top: 80px;
          bottom: 0;
          left: 0;
          right: 0;
        }
        h2.card-title {
          padding-left: 10px;
          border-left: 4px solid #1abc9c;
          font-size: 18px;
          line-height: 40px;
          font-weight: normal;
          margin: 0;
        }
      }
    }
  }
}
</style>
