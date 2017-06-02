<template>
  <div class="drawer-inner drawer4">
    <header>
      <h4>{{title}}</h4>
    </header>
    <section class="drawer-content">
      <div class="drawer-box">
        <p>导航位置</p>
        <el-radio-group v-model="theme" @change="changeTheme">
          <el-radio-button label="put-left">左侧导航</el-radio-button>
          <el-radio-button label="put-top">顶部导航</el-radio-button>
        </el-radio-group>
      </div>
      <div class="drawer-box">
        <p>颜色搭配</p>
        <el-radio-group v-model="color" @change="changeColor">
          <el-radio-button label="theme-default">默认</el-radio-button>
          <el-radio-button label="theme-dark">深色</el-radio-button>
          <el-radio-button label="theme-pale-blue">浅蓝</el-radio-button>
          <el-radio-button label="theme-blue">蓝色</el-radio-button>
          <el-radio-button label="theme-dark-blue">深蓝</el-radio-button>
        </el-radio-group>
      </div>
      <div class="drawer-box">
        <p>背景图片</p>
        <div>
          <el-switch v-model="bgOn" on-text="ON" off-text="OFF" @change="toggleBg"></el-switch>
        </div>
        <div v-show="bgOn">
          <el-radio-group v-model="bg" @change="changeBg">
            <!-- <el-radio-button label="bg-none">无</el-radio-button> -->
            <el-radio-button label="bg1">图1</el-radio-button>
            <el-radio-button label="bg2">图2</el-radio-button>
            <el-radio-button label="bg3">图3</el-radio-button>
            <el-radio-button label="bg4">图4</el-radio-button>
            <el-radio-button label="bg5">图5</el-radio-button>
          </el-radio-group>
          <el-button type="primary" @click="randomBg" :loading="imgLoading">随便来一张</el-button>
        </div>
      </div>
      <div class="drawer-box" v-show="!bgOn">
        <p>背景颜色</p>
        <div>
          <el-color-picker v-model="bgColor" @change="changeBgColor"></el-color-picker>
        </div>
      </div>
      <div class="drawer-box">
        <p>透明度</p>
        <div>
          <div>
            <el-slider v-model="opacity" :min="0" :max="1" :step="0.05" @change="changeOpacity"></el-slider>
          </div>
        </div>
      </div>
      <div class="drawer-box">
        <p>顶部Logo</p>
        <div>
          <el-switch v-model="topLogoOn" on-text="ON" off-text="OFF" @change="toggleLogo"></el-switch>
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
      theme: 'put-left',
      color: 'theme-default',
      bgOn: false,
      bg: 'bg-none',
      bgColorOn: false,
      bgColor: '#d2d5da',
      imgLoading: false,
      opacity: 1,
      topLogo: 'logo-on',
      topLogoOn: true
    }
  },
  mounted() {
    this.$mainContainer = $('.main-container')
    this.$innerContainer = $('.inner-container')
    if (localStorage) {
      if (localStorage.getItem('theme')) {
        this.theme = localStorage.getItem('theme')
      }
      if (localStorage.getItem('color')) {
        this.color = localStorage.getItem('color')
      }
      if (localStorage.getItem('bg')) {
        this.bg = localStorage.getItem('bg')
      }
      if (localStorage.getItem('bgOn')) {
        this.bgOn = !!(localStorage.getItem('bgOn') - 0)
      }
      if (localStorage.getItem('topLogo')) {
        this.topLogo = localStorage.getItem('topLogo')
      }
      if (localStorage.getItem('topLogoOn')) {
        this.topLogoOn = !!(localStorage.getItem('topLogoOn') - 0)
      }
      if (localStorage.getItem('bgColor')) {
        this.$mainContainer.css('background-color', localStorage.getItem('bgColor'))
      }
    }

    $(document.body).attr('class', `${this.theme} ${this.color} ${this.bg} ${this.topLogo}`)
  },
  methods: {
    changeTheme: function(val) {
      $(document.body).attr('class', `${this.theme} ${this.color} ${this.bg} ${this.topLogo}`)
      if (localStorage) {
        localStorage.setItem('theme', val)
      }
    },
    changeColor: function(val) {
      $(document.body).attr('class', `${this.theme} ${this.color} ${this.bg} ${this.topLogo}`)
      if (localStorage) {
        localStorage.setItem('color', val)
      }
    },
    toggleBg: function(val) {
      if (val) {
        this.bg = 'bg1'
      } else {
        this.bg = 'bg-none'
      }
      if (localStorage) {
        localStorage.setItem('bgOn', val - 0)
      }
    },
    changeBg: function(val) {
      this.$mainContainer.removeAttr('style')
      $(document.body).attr('class', `${this.theme} ${this.color} ${this.bg} ${this.topLogo}`)
      if (localStorage) {
        localStorage.setItem('bg', val)
      }
    },
    randomBg: function() {
      let self = this
      self.imgLoading = true
      self.bg = null
      self.$mainContainer.removeAttr('style')
      setTimeout(function() {
        let random = '&' + (Math.floor(Math.random() * 100))
        let url = `https://unsplash.it/1280/900/?random${random}`
        let img = new Image()
        img.onload = function() {
          self.imgLoading = false
        }
        img.src = url
        self.$mainContainer.css('background-image', `url(${url})`)
      }, 10)
    },
    changeBgColor: function(val) {
      this.$mainContainer.css('background-color', val)
      if (localStorage && !this.bgOn) {
        localStorage.setItem('bgColor', val)
      }
    },
    changeOpacity: function(val) {
      this.$innerContainer.css('opacity', val)
    },
    toggleLogo: function(val) {
      if (val) {
        this.topLogo = 'logo-on'
      } else {
        this.topLogo = 'logo-off'
      }
      $(document.body).attr('class', `${this.theme} ${this.color} ${this.bg} ${this.topLogo}`)
      if (localStorage) {
        localStorage.setItem('topLogo', this.topLogo)
        localStorage.setItem('topLogoOn', val - 0)
      }
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
