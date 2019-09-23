<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>/*Fixing iframe window.innerHeight 0 issue in Safari*/document.body.clientHeight;</script>
<script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.g2-3.5.1/dist/g2.min.js"></script>
<script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.data-set-0.10.1/dist/data-set.min.js"></script>
<script src="https://gw.alipayobjects.com/os/antv/assets/lib/jquery-3.2.1.min.js"></script>
<script src="https://gw.alipayobjects.com/os/antv/assets/lib/lodash-4.17.4.min.js"></script>
<script src="https://webapi.amap.com/maps?v=1.4.1&key=0d78256ea89beeb8c25d1cd047549d1f"></script>
<script src="https://webapi.amap.com/ui/1.0/main.js?v=1.0.11"></script>
<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
