<template>
  <div id="hello" class="hello-page">
    <section class="hello-img">
      <div class="hello-message">
        <h1>{{title}}</h1>
        <router-link :to="{name: 'project'}">进入主页</router-link>
      </div>
    </section>
    <section class="hello-card">
    </section>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      title: 'THIS IS CRAIG'
    }
  }
}
</script>
<style lang="scss">
@import url(../assets/scss/base.scss);
.hello-page {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #2e2e2e;
  color: #636363;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 2px;
  .hello-img {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    // background-image: linear-gradient(180deg, rgba(46, 46, 46, 0) 60%, #2e2e2e 90%), url(../assets/img/bg.jpg);
    min-height: 380px;
    padding-top: 235px;
    background-position: center;
    background-attachment: scroll, fixed;
    background-size: auto, cover;
    .hello-message {
      text-align: center;
    }
  }
  .hello-card {
    min-height: 800px;
  }
}
</style>
