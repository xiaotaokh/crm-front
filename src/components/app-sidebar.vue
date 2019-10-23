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
      @select="handleSelect"
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
      id: "" // 菜单ID
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 激活菜单事件 
    handleSelect(key, keyPath) {
      // 遍历slider数组  激活菜单返回当前菜单id
      for (var i of this.navList) {
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

      // 清空全局表格数据
      // var list = [];
      // this.$store.commit("setPostTableData",list)
      // console.log(this.$store.state.postTableData)
    }
  },
  mounted() {
    var url = "getMenuByUser";
    this.$axios
      .post(url)
      .then(res => {
        this.navList = res.data.data;
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
