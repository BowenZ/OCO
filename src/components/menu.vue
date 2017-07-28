<template>
  <div class="left-bar">
    <nav>
      <ul>
        <li :class="{active: showDrawer(0)}">
          <a href="" title="审计项目" @click.prevent="toggleDrawer(0, $event)">
            <span class="el-icon-menu"></span>
            <span class="nav-title">审计项目</span>
          </a>
        </li>
        <li :class="{active: showDrawer(2)}">
          <a href="" title="基础数据" @click.prevent="toggleDrawer(2, $event)">
            <span class="el-icon-document"></span>
            <span class="nav-title">基础数据</span>
          </a>
        </li>
        <li :class="{active: showDrawer(1)}">
          <a href="" title="个性化分析" @click.prevent="toggleDrawer(1, $event)">
            <span class="el-icon-star-off"></span>
            <span class="nav-title">个性化分析</span>
          </a>
        </li>
        <li :class="{active: showDrawer(6)}">
          <a href="" title="决策分析" @click.prevent="toggleDrawer(6, $event)">
            <span class="el-icon-share"></span>
            <span class="nav-title">决策分析</span>
          </a>
        </li>
        <li :class="{active: showDrawer(5)}">
          <a href="" title="模型维护" @click.prevent="toggleDrawer(5, $event)">
            <span class="el-icon-edit"></span>
            <span class="nav-title">模型维护</span>
          </a>
        </li>
      </ul>
      <ul>
        <li :class="{active: showDrawer(3)}">
          <a href="" title="风格样式" @click.prevent="toggleDrawer(3, $event)">
            <span class="el-icon-picture"></span>
            <span class="nav-title">风格样式</span>
          </a>
        </li>
        <li :class="{active: showDrawer(4)}">
          <a href="" title="登录管理" @click.prevent="toggleDrawer(4, $event)">
            <span class="el-icon-setting"></span>
            <span class="nav-title">登录管理</span>
          </a>
        </li>
        <!-- <li>
          <a href="" title="菜单" @click.prevent="toggleDrawer(5, $event)"><span class="el-icon-share"></span></a>
        </li> -->
      </ul>
    </nav>
    <div class="drawer">
      <transition-group name="drawer-fade" mode="">
        <div class="drawer-pane" :key="'data1'" v-show="showDrawer(0)">
          <v-drawer1></v-drawer1>
        </div>
        <div class="drawer-pane" :key="'data2'" v-show="showDrawer(1)">
          <v-drawer2></v-drawer2>
        </div>
        <div class="drawer-pane" :key="'data3'" v-show="showDrawer(2)">
          <v-drawer3></v-drawer3>
        </div>
        <div class="drawer-pane" :key="'data4'" v-show="showDrawer(3)">
          <v-drawer4></v-drawer4>
        </div>
        <div class="drawer-pane" :key="'data5'" v-show="showDrawer(4)">
          <v-drawer5></v-drawer5>
        </div>
        <div class="drawer-pane" :key="'data6'" v-show="showDrawer(5)">
          <v-drawer6></v-drawer6>
        </div>
        <div class="drawer-pane" :key="'data6'" v-show="showDrawer(6)">
          <v-drawer7></v-drawer7>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
// import drawer1 from "./drawer1"
import $ from 'webpack-zepto'
export default {
  computed: {
    currentIndex: function(){
      return this.$store.getters.currentDrawerIndex
    }
  },
  methods: {
    toggleDrawer: function(index, event) {
      this.currentIndex = index
      if (index != 3) {
        this.$store.commit('updateCurrentDrawerIndex', index)
      }
      let $targetLi = $(event.target).parents('li')
      if ($targetLi.hasClass('active') && this.$store.getters.drawerIsOpened) {
        this.$store.commit('closeDrawer')
      } else {
        this.$store.commit('openDrawer')
      }
      index!=6 && this.$router.push({path: '/'})
      return false
    },
    showDrawer(index) {
      return index === this.currentIndex
    }
  },
  components: {
    vDrawer1: require('./drawers/drawer1.vue'),
    vDrawer2: require('./drawers/drawer2.vue'),
    vDrawer3: require('./drawers/drawer3.vue'),
    vDrawer4: require('./drawers/drawer4.vue'),
    vDrawer5: require('./drawers/drawer5.vue'),
    vDrawer6: require('./drawers/drawer6.vue'),
    vDrawer7: require('./drawers/drawer7.vue')
  }
}
</script>
<style lang="scss">
@import "../assets/scss/variables.scss";
.left-bar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  nav {
    // background: #2b3245;
    background-color: #ECEFF5;
    width: 80px;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        padding: 0;
        margin: 0;
        // border-bottom: 1px solid #5d6370;
        border-bottom: 1px solid #5d6370;
        position: relative;
        transition: background .1s ease-out;
        &:first-of-type{
          border-top: 1px solid #5d6370;
        }
        a {
          text-decoration: none;
          display: block;
          line-height: 50px;
          text-align: center;
          width: 80px;
          position: relative;
          -webkit-box-shadow: none;
          box-shadow: none;
          padding: 0;
          margin: 0;
          text-shadow: none;
          // color: #797979;
          color: #48576a;
          font-size: 28px;
          font-weight: 200;
          transition: color .1s ease-out;
          .nav-title {
            font-size: 12px;
            display: block;
            line-height: 1;
            margin-bottom: 10px;
          }
        }
        &.active {
          // background-color: #323a4d;
          background-color: #d9dce2;
          a {
            color: #20a0ff;
          }
          /* &:nth-of-type(1) a {
            color: $flat-green;
          }
          &:nth-of-type(2) a {
            color: $flat-yellow;
          }
          &:nth-of-type(3) a {
            color: $flat-blue;
          } */
        }
        /* &:nth-of-type(1) a:hover {
          color: $flat-green;
        }
        &:nth-of-type(2) a:hover {
          color: $flat-yellow;
        }
        &:nth-of-type(3) a:hover {
          color: $flat-blue;
        } */
      }
      &:nth-of-type(2) {
        position: absolute;
        bottom: 0;
        li {
          /* &.active {
            &:nth-of-type(1) a {
              color: $flat-purple;
            }
            &:nth-of-type(2) a {
              color: $flat-red;
            }
            &:nth-of-type(3) a {
              color: $flat-white;
            }
          } */
          &:nth-of-type(1) {
            border-top: 1px solid #5d6370;
            /* a:hover {
              color: $flat-purple;
            } */
          }
          /* &:nth-of-type(2) a:hover {
            color: $flat-red;
          }
          &:nth-of-type(3) a:hover {
            color: $flat-white;
          } */
        }
      }
    }
  }
  .drawer {
    position: absolute;
    top: 0;
    left: 80px;
    width: 300px;
    height: 100%;
    // background-color: #323a4d;
    background-color: #d9dce2;
    .drawer-pane {
      overflow: auto;
    }
    .drawer-inner {
      min-height: 100%;
      padding: 0 0 42px;
      box-sizing: border-box;
      .drawer-content {
        padding-right: 20px;
      }
      h3,
      h4,
      h5 {
        position: relative;
        // color: #d8e3ff;
        color: #48576a;
        font-weight: 700;
        padding: 0 24px;
        margin: 0;
        text-align: start;
        box-sizing: border-box;
        font-weight: normal;
      }
      h4 {
        // background-color: #262b3a;
        background-color: #c5c8ce;
        font-size: 17px;
        height: 71px;
        line-height: 71px;
      }
      h5 {
        padding: 0;
        line-height: 39px;
        font-size: 13px;
        margin-top: 12px;
        margin-left: 18px;
        margin-bottom: 12px;
        // border-bottom: 1px solid #424650;
        border-bottom: 1px solid #fff;
      }
      .el-tree {
        background-color: transparent;
        border: none;
        .el-tree-node__content:hover {
          background: #b6d6d0;
        }
      }
    }
    .drawer-pane {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .drawer-fade-enter-active,
    .drawer-fade-leave-active {
      transition: all .3s ease-out;
    }
    .drawer-fade-enter {
      transform: translateX(-30px);
    }
    .drawer-fade-enter,
    .drawer-fade-leave-active {
      opacity: 0;
    }
  }
}
</style>
