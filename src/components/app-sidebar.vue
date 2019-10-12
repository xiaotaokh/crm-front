<template>
  <div class="app-sidebar">
    <el-menu
      :default-active="this.$route.path"
      router
      unique-opened
      background-color="#155B74"
      text-color="#fff"
      active-text-color="#1BD5E7"
      class="el-menu-vertical-demo"
    >
      <el-submenu v-for="(item,i) in navList" :key="i" :index="item.route">
        <template slot="title">
          <i class="iconfont" :class="item.icon"></i>
          {{ item.navName }}
        </template>
        <!-- 三级标题存在 -->
        <el-submenu
          v-for="(sec,j) in item.second"
          :key="'A'+j"
          v-show="sec.third.length != 0"
          :index="sec.route"
        >
          <template slot="title">{{ sec.navName }}</template>
          <el-menu-item v-for="(thi,k) in sec.third" :key="k" :index="thi.route">{{ thi.navName }}</el-menu-item>
        </el-submenu>
        <!-- 三级标题不存在 -->
        <el-menu-item
          v-for="(m,n) in item.second"
          :key="'B'+n"
          v-show="m.third.length == 0"
          :index="m.route"
        >{{ m.navName }}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "app-sidebar",
  data() {
    return {
      navList: [], // 拿到的后台列表数据
    };
  },
  computed: {
    
  },
  watch: {
    
  },
  methods: {},
  mounted() {
    var url = "getMenuByUser";
    this.$axios
      .post(url)
      .then(res => {
        this.navList = res.data.data;
        // console.log(JSON.stringify(res.data))
      })
      .catch(error => {});
  }
};
</script>

<style scoped>
.app-sidebar {
  position: relative;
}
.app-sidebar .el-submenu__title i {
  color: #fff;
}
</style>
