<template>
  <div class="app-sidebar" :style="'width:'+this.$store.state.sliderWidth+'px;transition: all .15s'">
    <el-menu
      :default-active="this.$route.path"
      router
      unique-opened
      background-color="#155B74"
      text-color="#fff"
      active-text-color="#1BD5E7"
      class="el-menu-vertical-demo"
      @select="handleSelect"
      :collapse="this.$store.state.sliderIsCollapse"
    >
      <el-submenu v-for="(item,i) in this.$store.state.globalNavList" :key="i" :index="item.route">
        <template slot="title">
          <i class="iconfont" :class="item.icon"></i>
          <span slot="title">{{ item.navName }}</span>
        </template>
        <!-- 三级标题存在 -->
        <el-submenu
          v-for="(sec,j) in item.second"
          :key="'A'+j"
          v-show="sec.third.length != 0"
          :index="sec.route"
        >
          <span slot="title">{{ sec.navName }}</span>
          <el-menu-item v-for="(thi,k) in sec.third" :key="k" :index="thi.route">
            <span slot="title">{{ thi.navName }}</span>
          </el-menu-item>
        </el-submenu>
        <!-- 三级标题不存在 -->
        <el-menu-item
          v-for="(m,n) in item.second"
          :key="'B'+n"
          v-show="m.third.length == 0"
          :index="m.route"
        >
          <span slot="title">{{ m.navName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { myMixins } from "@/mixins/index";
export default {
  mixins: [myMixins],
  name: "app-sidebar",
  data() {
    return {
      id: "" // 菜单ID
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 激活菜单事件
    handleSelect(key, keyPath) {
      // 遍历slider数组  激活菜单返回当前菜单id
      for (var i of this.$store.state.globalNavList) {
        if (i.second.length == 0) {
          if (key == i.route) {
            this.id = i.id;
          }
        } else {
          for (var j of i.second) {
            if (j.third.length == 0) {
              if (key == j.route) {
                this.id = j.id;
              }
            } else {
              for (var k of j.third) {
                if (key == k.route) {
                  this.id = k.id;
                }
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    this.getSliderBarGlobal(); // 获取左边侧边栏slider
  }
};
</script>

<style scoped>
.app-sidebar {
  position: relative;
}
.app-sidebar .el-submenu__title i {
  color: #fff;
  font-size: 18px;
}
/* 侧边栏展开关闭 */
.app-sidebar .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
.app-sidebar .el-menu--collapse {
  width: 64px;
}
</style>
