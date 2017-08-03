<template>
  <header class="top-logo">
    <div class="logo">
      <img src="../assets/img/logo.png" alt="">
    </div>
  </header>
</template>
<style lang="scss">
.top-logo {
  width: 100%;
  height: 60px;
  // background-image: url(../assets/img/logobg.jpg);
  background-size: cover;
  background-position-x: 100%;
  background-position-y: center;
  .logo {
    position: absolute;
    top: 0;
    left: 6px;
    width: 71px;
    img {
      width: 100%;
    }
  }
}
</style>
