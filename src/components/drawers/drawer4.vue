<template>
  <div class="drawer-inner drawer4">
    <header>
      <h4>{{title}}</h4>
    </header>
    <section class="drawer-content">
      <div class="drawer-box">
        <p>颜色搭配</p>
        <el-radio-group v-model="color" @change="changeColor">
          <el-radio-button label="theme-default">默认</el-radio-button>
          <el-radio-button label="theme-dark">深色</el-radio-button>
          <!-- <el-radio-button label="theme-pale-blue">浅蓝</el-radio-button> -->
          <el-radio-button label="theme-blue">蓝色</el-radio-button>
          <!-- <el-radio-button label="theme-dark-blue">深蓝</el-radio-button> -->
        </el-radio-group>
      </div>
      <div class="drawer-box">
        <p>背景颜色</p>
        <div>
          <el-color-picker v-model="bgColor" @change="changeBgColor"></el-color-picker>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
export default {
  data: function() {
    return {
      $mainContainer: null,
      $innerContainer: null,
      title: '风格样式',
      color: 'theme-default',
      bgColorOn: false,
      bgColor: '#d2d5da'
    }
  },
  mounted() {
    this.$mainContainer = $('.main-container')
    this.$innerContainer = $('.inner-container')
    if (localStorage) {
      if (localStorage.getItem('color')) {
        this.color = localStorage.getItem('color')
      }
      if (localStorage.getItem('bgColor')) {
        this.$mainContainer.css('background-color', localStorage.getItem('bgColor'))
      }
    }

    $(document.body).attr('class', `${this.theme} ${this.color} ${this.bg} ${this.topLogo}`)
  },
  methods: {
    changeColor: function(val) {
      $(document.body).attr('class', `${this.theme} ${this.color} ${this.bg} ${this.topLogo}`)
      if (localStorage) {
        localStorage.setItem('color', val)
      }
    },
    changeBgColor: function(val) {
      this.$mainContainer.css('background-color', val)
      localStorage.setItem('bgColor', val)
    }
  }
}
</script>
<style lang="scss">
.drawer4 {
  .drawer-content {
    padding: 0!important;
  }
  .drawer-box {
    text-align: center;
    margin-bottom: 30px;
    .el-radio-group {
      margin: 20px auto;
      display: block;
    }
    >p {
      text-align: left;
      padding-left: 20px;
      color: #fff;
      margin: 10px 0 5px;
    }
  }
  .el-slider {
    width: 60%;
    margin: 10px auto
  }
}
</style>
