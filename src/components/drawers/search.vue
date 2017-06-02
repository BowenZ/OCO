<template>
  <div class="search-input">
    <h4 class="search-title">{{title}}</h4>
    <form action="" autocomplete="on">
      <input name="search" type="text" placeholder="请输入内容，按回车搜索" autocomplete="off" @keydown.enter.prevent="submit($event)">
      <a href="javascript: void(0)" class="search-btn el-icon-search"></a>
    </form>
  </div>
</template>
<script>
import {
  Message
} from 'element-ui'
import urlStore from '../../api/urlStore.js'
export default {
  data: function() {
    return {

    }
  },
  props: ['title'],
  methods: {
    submit() {
      this.$emit('changeLoading')
      let searchVal = event.target.value
      this.$http.get(urlStore.findMethods + '?methodName=' + searchVal).then(res => {
        this.$emit('changeLoading')
        if (res.body.status == 'success') {
          this.$store.commit('setSingleMethods', res.body.data)
        } else {
          Message({
            message: '未搜索出正确结果，' + res.body.msg,
            type: 'warning',
            duration: 2000,
            showClose: true
          })
        }
      }, res => {
        this.$emit('changeLoading')
        Message({
          message: '搜索超时',
          type: 'warning',
          duration: 2000,
          showClose: true
        })
      })
    }
  }
}
</script>
<style lang="scss">
.search-input {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 50px;
  form {
    position: absolute;
    top: 16px;
    width: 100%;
  }
  input[type="text"] {
    position: absolute;
    height: 40px;
    font-size: 14px;
    display: inline-block;
    color: #fff;
    width: 0;
    top: 0;
    right: 0;
    border: none;
    outline: none;
    background-color: #0589bf;
    background-clip: content-box;
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 40px;
    transition: width .4s cubic-bezier(0.000, 0.795, 0.000, 1.000);
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0);
    z-index: 3;
    &:focus:hover {
      border-bottom: 1px solid #bbb;
    }
    &:focus {
      border-bottom: 1px solid #bbb;
      cursor: text;
      width: 100%;
      &+.search-btn {
        z-index: 4;
      }
    }
  }
  .search-btn {
    font-size: 22px;
    line-height: 50px;
    padding: 0 5px;
    text-align: center;
    color: #aaa;
    text-decoration: none;
    height: 30px;
    width: 30px;
    display: inline-block;
    z-index: 2;
    border: none;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity .4s ease;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
