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
          v-show="sec.third"
          :index="sec.route"
        >
          <template slot="title">{{ sec.navName }}</template>
          <el-menu-item v-for="(thi,k) in sec.third" :key="k" :index="thi.route">{{ thi.navName }}</el-menu-item>
        </el-submenu>
        <!-- 三级标题不存在 -->
        <el-menu-item
          v-for="(m,n) in item.second"
          :key="'B'+n"
          v-show="!m.third"
          :index="m.route"
        >{{ m.navName }}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "app-sidebar",
  computed: {},
  data() {
    return {
      navList: [
        {
          route: "/appMain/customerManage",
          navName: "客户管理",
          icon: "iconziyuan",
          second: [
            {
              route: "/appMain/customerManage/salesTarget",
              navName: "销售目标",
              third: [
                {
                  route:
                    "/appMain/customerManage/salesTarget/salesTargetManage",
                  navName: "销售目标管理"
                },
                {
                  route:
                    "/appMain/customerManage/salesTarget/salesTargetStatistic",
                  navName: "销售目标统计"
                }
              ]
            },
            {
              route: "",
              navName: "公海客户"
            },
            {
              route: "",
              navName: "我的客户"
            },
            {
              route: "",
              navName: "跟进记录"
            },
            {
              route: "",
              navName: "商机管理"
            },
            {
              route: "",
              navName: "呼叫中心"
            },
            {
              route: "",
              navName: "客户服务"
            },
            {
              route: "",
              navName: "预约管理"
            },
            {
              route: "",
              navName: "售后工单"
            }
          ]
        },
        {
          route: "/appMain/systemManage/systemManage",
          navName: "系统管理",
          icon: "iconxitongguanli",
          second: [
            {
              route: "/appMain/systemManage/userManage",
              navName: "用户管理"
            },
            {
              route: "/appMain/systemManage/roleManage",
              navName: "角色管理"
            }
          ]
        }
      ]
    };
  },
  methods: {},
  mounted() {
    // console.log(this.$route.route)
    var url = "getMenuByUser";
    this.$axios
      .get(url)
      .then(res => {
        console.log(res.data);
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
