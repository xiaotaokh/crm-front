<template>
  <div
    class="app-sidebar"
    :style="'width:'+this.$store.state.sliderWidth+'px;transition: all .15s'"
  >
    <el-menu
      :default-active="this.$route.path"
      router
      unique-opened
      :background-color="this.$store.state.globalSliderColor"
      :text-color="sliderTextColor"
      active-text-color="#1BD5E7"
      class="el-menu-vertical-demo"
      @select="handleSelect"
      :collapse="this.$store.state.sliderIsCollapse"
    >
      <el-submenu v-for="(item,i) in this.$store.state.globalNavList" :key="i" :index="item.route">
        <template slot="title">
          <i class="iconfont" :class="item.icon" :style="'font-size:24px;color:'+sliderTextColor"></i>
          <span slot="title">&nbsp;{{ item.navName }}</span>
        </template>
        <!-- 三级标题存在 -->
        <el-submenu
          v-for="(sec,j) in item.second"
          :key="'A'+j"
          v-show="sec.third.length != 0"
          :index="sec.route"
        >
          <span slot="title">&nbsp;&nbsp;&nbsp;&nbsp;{{ sec.navName }}</span>
          <el-menu-item v-for="(thi,k) in sec.third" :key="k" :index="thi.route">
            <span slot="title">&nbsp;{{ thi.navName }}</span>
          </el-menu-item>
        </el-submenu>
        <!-- 三级标题不存在 -->
        <el-menu-item
          v-for="(m,n) in item.second"
          :key="'B'+n"
          v-show="m.third.length == 0"
          :index="m.route"
        >
          <span slot="title">&nbsp;&nbsp;&nbsp;&nbsp;{{ m.navName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <!-- 侧边栏下边（项目左下角）区域 -->
    <div class="slider-control" v-if="this.$store.state.sliderIsCollapse">
      <el-tooltip
        class="item"
        @click="this.drawer = true"
        effect="dark"
        content="系统布局配置"
        placement="right"
      >
        <el-button type="primary" size="mini" class="control-btn" plain @click="drawer = true">
          <i class="iconfont iconicon-test1 slider-control"></i>
        </el-button>
      </el-tooltip>
    </div>
    <div class="slider-control" v-if="!this.$store.state.sliderIsCollapse">
      <el-button type="primary" @click="drawer = true" plain style="width:100%">
        <i class="iconfont iconicon-test1"></i>系统布局配置
      </el-button>
    </div>
    <el-drawer title="系统布局配置" :modal="false" :visible.sync="drawer" size="240px">
      <div class="dra-con">
        <ul>
          <li>
            <span>主题色</span>
            <span>
              <el-color-picker v-model="mainColor" size="small" @change="drawMainColor"></el-color-picker>
            </span>
          </li>
          <li>
            <span>头部颜色</span>
            <span>
              <el-color-picker
                v-model="headerColor"
                size="small"
                @change="drawHeaderColor"
              ></el-color-picker>
            </span>
          </li>
          <li>
            <span>开启面包屑</span>
            <span>
              <el-switch @change="handleTagsViewBreadcrumb" v-model="tagsViewBreadcrumb"></el-switch>
            </span>
          </li>
          <li>
            <span>侧边栏Logo</span>
            <span>
              <el-switch v-model="sliderLogo" @change="handlesliderLogo"></el-switch>
            </span>
          </li>
          <li>
            <span>侧边栏颜色</span>
            <span>
              <el-color-picker v-model="sliderColor" size="small" @change="drawSliderColor"></el-color-picker>
            </span>
          </li>
        </ul>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { myMixins } from "@/mixins/index";
export default {
  mixins: [myMixins],
  name: "app-sidebar",
  data() {
    return {
      id: "", // 菜单ID
      drawer: false, // 系统布局配置抽屉
      mainColor: "#409EFF", // 主题色
      headerColor: "#fff", // 头部背景色
      sliderColor: "#155B74", // 侧边栏背景色
      sliderTextColor:"#fff",  // 侧边栏字体颜色
      tagsViewBreadcrumb: true, // 面包屑
      sliderLogo: true // 侧边栏logo
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
    },
    // 系统布局配置抽屉 主题色
    drawMainColor() {
      
    },
    // 系统布局配置抽屉 头部背景色
    drawHeaderColor() {
      this.$store.commit("setHeaderColor", this.headerColor);
    },
    // 系统布局配置抽屉 侧边栏背景色
    drawSliderColor() {
      this.$store.commit("setSliderColor", this.sliderColor);
      if(this.sliderColor == "#FFFFFF") {
        this.sliderTextColor = "#303133";
      }else {
        this.sliderTextColor = "#fff";
      }
    },
    // 是否显示面包屑
    handleTagsViewBreadcrumb() {
      this.$store.commit("setTagsViewBreadcrumbGlobal",this.tagsViewBreadcrumb)
    },
    // 是否显示logo
    handlesliderLogo() {
      this.$store.commit("setSliderLogoGlobal",this.sliderLogo)
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
/* 侧边栏下边（项目左下角）区域  */
.app-sidebar .slider-control {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.app-sidebar .slider-control .el-button--primary.is-plain {
  border: none;
  height: 40px;
  width: 100%;
  border-radius: 0;
}
.app-sidebar .slider-control .el-button--primary.control-btn i {
  height: 27px;
}
.app-sidebar .slider-control .slider-control {
  font-size: 22px;
}
/* draw 系统设置抽屉 */
.dra-con ul li {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 5px;
  padding: 0 10%;
  position: relative;
}
.dra-con ul li span:nth-child(1) {
  font-size: 14px;
}
.dra-con ul li span:nth-child(2) {
  float: right;
  position: absolute;
  right: 10%;
}
</style>
