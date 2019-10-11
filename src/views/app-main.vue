<template>
  <div class="app-main">
    <!-- 头部 -->
    <app-header></app-header>
    <!-- 侧边栏 -->
    <app-sidebar></app-sidebar>
    <!-- 内容区 -->
    <div class="app-content">
      <!-- 具体页面 -->
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-main',
  watch: {
      
  },
  data () {
    return {
      
    }
  },
  methods: {
    
  },
  created() {
    
  }
}
</script>

<style>
#app {
  height: 100%;
}
#app .app-main { 
  position: relative;   
  width: 100%;
  height: 100%;
}
#app .app-header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  z-index: 3;
  box-shadow: 0 3px 3px rgba(189,189,189, .3);
}

#app .app-sidebar {
  position: absolute;
  top: 60px;
  left: 0;
  z-index: 2;
  width: 240px;
  /* overflow: auto; */
  height: calc(100% - 60px);
  box-shadow: 3px 0 3px rgba(189,189,189, .15);
  /* overflow-x:hidden; */
}
/* 二级菜单滚动 */
#app .app-sidebar>ul {
  height: calc(100% - 40px);
  overflow: auto;
}
#app .app-content {
  position: absolute;
  top: 60px;
  left: 240px;
  box-sizing: border-box;
  width: calc(100% - 240px);
  height: calc(100% - 60px);
  z-index: 1;
  padding: 15px;
  overflow: auto;
}

/* 过度动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
