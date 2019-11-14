<template>
  <div class="app-search" :style="'height:' + hetghtSearch + 'px'" ref="appSearch">
    <!-- 搜索 -->
    <el-row type="flex" justify="start">
      <el-col :span="24">
        <slot></slot>
      </el-col>
    </el-row>
    <!-- 条目过多，是否展开 -->
    <div class="isunfold" v-if="isUnfoldExpand">
      <el-tooltip class="item" effect="dark" content="展开搜索项" placement="top">
        <el-button type="text" @click="searchIsUnfold">
          <i class="iconfont iconzhankai-search"></i>
        </el-button>
      </el-tooltip>
    </div>
    <!-- 展开之后，是否关闭 -->
    <div class="isunfold" v-if="isUnfoldClose">
      <el-tooltip class="item" effect="dark" content="关闭搜索项" placement="top">
        <el-button type="text" @click="searchIsUnfoldClose">
          <i class="iconfont iconguanbi-search"></i>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { myMixins } from "@/mixins/index";
export default {
  mixins: [myMixins],
  name: "app-search",
  props: [
    "isUnfold", // 条目过多，是否展开
    "searchNum" // 接收搜索条目数，计算search高度
  ],
  computed: {},
  watch: {},
  data() {
    return {
      searchWidth: "", // 搜索宽度
      hetghtSearch: "52",
      isUnfoldExpand: false, // 是否展开
      isUnfoldClose: false // 是否显示关闭
    };
  },
  methods: {
    // 展开
    searchIsUnfold() {
      this.hetghtSearch = (this.searchNum / (this.searchWidth / 360) + 1) * 60;
      this.isUnfoldExpand = false;
      this.isUnfoldClose = true;
    },
    // 关闭
    searchIsUnfoldClose() {
      this.isUnfoldExpand = true;
      this.isUnfoldClose = false;
      this.hetghtSearch = "52";
    },
    // 监听搜索宽度
    getDocuWidth() {
      this.searchWidth = this.$refs.appSearch.clientWidth;
      window.onresize = () => {
        return (() => {
          this.searchWidth = this.$refs.appSearch.clientWidth;
          if (this.isUnfoldExpand) {
            this.hetghtSearch =
              (this.searchNum / (this.searchWidth / 360) + 1) * 60;
          }
        })();
      };
    }
  },
  mounted() {
    this.isUnfoldExpand = this.isUnfold;
    this.getDocuWidth();
  }
};
</script>

<style>
/* 搜索 */
.app-search {
  width: 100%;
  padding: 10px 90px 0 10px;
  overflow: hidden;
  position: relative;
}
.app-search .isunfold {
  position: absolute;
  right: 10px;
  bottom: 5px;
}
.app-search .search-submit {
  position: absolute;
  right: -50px;
  top:0;
}
</style>
