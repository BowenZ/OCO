<template>
  <div id="app">
    <transition name="view-fade">
      <router-view class="view-fade"></router-view>
    </transition>
  </div>
</template>
<script>
import vHello from './components/Hello.vue'
import vProject from './components/Project.vue'
export default {
  components: {
    vHello,
    vProject
  },
  data: function() {
    return {
      transitionName: 'view-slide-left'
    }
  }
}
</script>
<style lang="scss">
@import url(./assets/scss/base.scss);
html {
  font-family: '微软雅黑';
}

body {
  margin: 0;
}

.view-fade {
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
}

.view-fade-enter,
.view-fade-leave-active {
  opacity: 0;
}

#app .el-card {
  border-radius: 2px;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, .1), 0px 0px 2px 0px rgba(0, 0, 0, .03);
}

.el-card__header{
  padding: 8px 20px;
}

body.theme-default {
  .el-input-group__append .el-button--primary {
    color: #fff;
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: rgb(197, 200, 206);
  }
  .el-button--primary {
    background-color: #20a0ff;
    border-color: #20a0ff;
    &:hover {
      background: #4db3ff;
      border-color: #4db3ff;
      &:active {
        background: #1d90e6;
        border-color: #1d90e6;
      }
    }
  }
  .main-container .inner-container .content-container .content h2.card-title {
    border-left: 4px solid #20a0ff;
  }
  .el-step__head.is-text.is-success {
    background-color: #20a0ff;
    border-color: #20a0ff;
  }
  .el-step__title.is-success {
    color: #20a0ff;
  }
  .el-step__head.is-text.is-wait {
    color: #bfcbd9;
    background-color: #fff;
    border-color: #bfcbd9;
  }
  .el-step__head.is-text.is-process {
    color: #fff;
    background-color: #bfcbd9;
    border-color: #bfcbd9;
  }
  .el-step__head.is-text.is-process {
    color: #fff;
    background-color: #bfcbd9;
    border-color: #bfcbd9;
  }
  .el-step__title.is-wait {
    font-weight: 400;
    color: #97a8be;
  }
  .el-step__line {
    position: absolute;
    border-color: inherit;
    background-color: #bfcbd9;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #20a0ff;
    border-color: #0190fe;
  }
  .el-tree-node__content:hover {
    background: #c5c8ce;
  }
  .left-bar .drawer .drawer-inner .el-tree .el-tree-node__content:hover {
    background: #c5c8ce;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
    box-shadow: -1px 0 0 0 #20a0ff;
  }
  .el-slider__bar {
    background-color: #20a0ff;
  }
  .el-switch__core {
    border: 1px solid #bfcbd9;
    background: #bfcbd9;
  }
  .el-switch__input:checked+.el-switch__core {
    border-color: #20a0ff;
    background-color: #20a0ff;
  }
  .el-slider__button {
    background-color: #20a0ff;
  }
  .el-slider__runway {
    background-color: #e4e8f1;
  }
  .content4 .current-title {
    color: #20a0ff;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #20a0ff;
    background: #20a0ff;
  }
  .el-input__inner {
    border: 1px solid #bfcbd9;
  }
  .el-input__inner:focus {
    outline: none;
    border-color: #20a0ff;
  }
  .el-select:hover .el-input__inner {
    border-color: #8391a5;
  }
  .el-select-dropdown__item.hover {
    background-color: #e4e8f1;
  }
  .el-select-dropdown__item.selected {
    color: #fff;
    background-color: #20a0ff;
  }
  .import-container .download-template {
    color: #20a0ff;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fbfdff;
    color: #97a8be;
    border: 1px solid #bfcbd9;
  }
  .el-input-group__append {
    border-left: 0;
  }
  .el-progress-bar__inner {
    background-color: #20a0ff;
  }
  .el-progress-bar__outer {
    background-color: #e4e8f1;
  }
  .el-collapse-item__wrap {
    background-color: #fbfdff;
    border-bottom: 1px solid #dfe6ec;
  }
  .el-loading-spinner .el-loading-text {
    color: #20a0ff;
  }
  .el-loading-spinner .path {
    stroke: #20a0ff;
  }
  .main-container {
    background-color: #f4f6f9;
  }
  .drawer1 {
    .new-project {
      color: #48576a;
      p {
        &:hover {
          color: lighten(#48576a, 15%);
        }
      }
    }
    .project-list {
      .project-item {
        .tree-content .el-tree {
          color: #48576a;
        }
        .tree-title {
          &:hover {
            color: #48576a;
          }
          .open-tree {
            color: #48576a;
            &:hover {
              color: lighten(#48576a, 15%);
            }
          }
          .title-copy {
            color: #48576a;
            &.active {
              color: #20a0ff;
            }
            &:hover {
              color: lighten(#48576a, 15%);
            }
          }
        }
      }
    }
  }
  .drawer2 {
    .drawer-content {
      color: #48576a;
    }
    .audit-methods {
      li {
        a {
          color: #48576a;
          &.active {
            color: #20a0ff;
          }
        }
      }
    }
  }
  .drawer3 {
    .drawer-content {
      color: #48576a;
    }
    .audit-methods {
      li {
        a {
          color: #48576a;
          &.active {
            color: #20a0ff;
          }
        }
      }
    }
  }
  .drawer4 {
    .drawer-box {
      >p {
        color: #48576a;
      }
    }
  }
  .drawer6 {
    .new-audit-category {
      a {
        color: #48576a;
        &:hover {
          color: #48576a;
        }
      }
    }
    .el-tree {
      color: #48576a;
      &.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background-color: #c5c8ce;
      }
    }
  }
}

body.theme-blue {
  .search-input input[type="text"] {
    background-color: #0589bf;
  }
  .left-bar {
    nav {
      background: #3fb3e4;
      ul {
        li {
          border-bottom: 1px solid #fff;
          a {
            color: #fff;
          }
          &.active {
            background-color: #009bdb;
            a {
              color: #fff;
            }
          }
        }
      }
    }
    .drawer {
      background-color: #009bdb;
      h3,
      h4,
      h5 {
        color: #fff;
      }
      h4 {
        background-color: #0589bf;
      }
      .drawer-inner .el-tree {
        color: #fff;
        .el-tree-node__content:hover {
          background: #0589bf;
        }
      }
    }
    .drawer1 {
      .new-project {
        color: #fff;
        p:hover {
          color: #fff;
        }
      }
      .project-list .project-item .tree-title {
        .open-tree {
          color: #fff;
          &:hover {
            color: #fff;
          }
        }
        .title-copy {
          &.active {
            color: #8fffe9;
          }
          &:hover {
            color: #8fffe9;
          }
        }
      }
    }
    .drawer2 {
      .audit-methods {
        li {
          a {
            color: #fff;
            &.active {
              color: #8fffe9;
            }
          }
        }
      }
    }
  }
  .drawer6 .el-tree.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #0589bf;
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: rgb(5, 137, 191);
  }
}

body.theme-dark {
  .search-input input[type="text"] {
    background-color: #262b3a;
  }
  .left-bar {
    nav {
      background: #2b3245;
      ul {
        li {
          border-bottom: 1px solid #5d6370;
          a {
            color: #9a9a9a;
          }
          &.active {
            background-color: #323a4d;
            a {
              color: #1abc9c;
            }
          }
        }
      }
    }
    .drawer {
      background-color: #323a4d;
      h3,
      h4,
      h5 {
        color: #d8e3ff;
      }
      h4 {
        background-color: #262b3a;
      }
      h5 {
        border-bottom: 1px solid #424650;
      }
      .drawer-inner .el-tree {
        color: #d8e3ff;
        .el-tree-node__content:hover {
          background: #2b3245;
        }
      }
      .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background-color: rgb(45, 50, 64);
      }
    }
    .drawer1 {
      .new-project {
        color: #d8e3ff;
        p:hover {
          color: #e2e6ef;
        }
      }
      .project-list .project-item .tree-title {
        .open-tree {
          color: #b9b9b9;
          &:hover {
            color: #e4e4e4;
          }
        }
        .title-copy {
          color: #b9b9b9;
          &.active {
            color: #1abc9c;
          }
          &:hover {
            color: #1abc9c;
          }
        }
      }
    }
    .drawer2 {
      .audit-methods {
        li {
          a {
            color: #d8e3ff;
            &.active {
              color: #1abc9c;
            }
          }
        }
      }
    }
  }
  .drawer6 .el-tree.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #2b3245;
  }
}


.ie .el-textarea__inner {
  min-height: 80px;
  max-height: 300px;
}
</style>
