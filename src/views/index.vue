<template>
  <div class="index">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/appMain/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>dashboard</el-breadcrumb-item>
    </el-breadcrumb>-->

    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <el-row :gutter="20" class="card">
        <!-- 总销售额 -->
        <el-col :span="6">
          <el-card class="box-card" :mouseover="addActive" :mouseout="removeActive">
            <div class="card-name">
              <span class="card-name-span">总销售额</span>
            </div>
            <div class="card-number">
              <span class="card-number-span">¥ 126,560</span>
            </div>
            <div class="card-figure">
              <span>周同比</span>
              <span>12%</span>
              <i class="iconfont iconzengchang"></i>
              <span>日同比</span>
              <span>11%</span>
              <i class="iconfont iconxiajiang"></i>
            </div>
            <div class="card-bot">
              <span>日销售额</span>
              <span>￥12423</span>
            </div>
          </el-card>
        </el-col>
        <!-- 访问量 -->
        <el-col :span="6">
          <el-card class="box-card">
            <div class="card-name">
              <span class="card-name-span">访问量</span>
            </div>
            <div class="card-number">
              <span class="card-number-span">8846</span>
            </div>
            <div class="card-figure"></div>
            <div class="card-bot">
              <span>日访问量</span>
              <span>1234</span>
            </div>
          </el-card>
        </el-col>
        <!-- 支付笔数 -->
        <el-col :span="6">
          <el-card class="box-card">
            <div class="card-name">
              <span class="card-name-span">支付笔数</span>
            </div>
            <div class="card-number">
              <span class="card-number-span">6560</span>
            </div>
            <div class="card-figure">
              <span>周同比</span>
              <span>12%</span>
              <i class="iconfont iconzengchang"></i>
              <span>日同比</span>
              <span>11%</span>
              <i class="iconfont iconxiajiang"></i>
            </div>
            <div class="card-bot">
              <span>转化率</span>
              <span>60%</span>
            </div>
          </el-card>
        </el-col>
        <!-- 运营活动效果 -->
        <el-col :span="6">
          <el-card class="box-card">
            <div class="card-name">
              <span class="card-name-span">运营活动效果</span>
            </div>
            <div class="card-number">
              <span class="card-number-span">78%</span>
            </div>
            <div class="card-figure">
              <el-progress :percentage="78" :format="format"></el-progress>
            </div>
            <div class="card-bot">
              <span>周同比</span>
              <span>12%</span>
              <i class="iconfont iconzengchang"></i>
              <span>日同比</span>
              <span>11%</span>
              <i class="iconfont iconxiajiang"></i>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 访问量area图 -->
      <div id="mini-area"></div>
    </div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
// import dataSet from "../plugin/data-set";
export default {
  name: "index",
  computed: {},
  watch: {},
  data() {
    return {
      data: [
        {
          year: "1",
          value: 11
        },
        {
          year: "2",
          value: 12
        },
        {
          year: "3",
          value: 32
        },
        {
          year: "4",
          value: 47
        },
        {
          year: "5",
          value: 5
        },
        {
          year: "6",
          value: 16
        },
        {
          year: "7",
          value: 76
        },
        {
          year: "8",
          value: 38
        },
        {
          year: "9",
          value: 29
        }
      ]
    };
  },
  methods: {
    // 指示板统计信息移入移出事件
    addActive($event) {
      // $event.currentTarget.className="box-card active";  // 设置类名
    },
    removeActive() {},
    format(percentage) {
      return percentage === 100 ? "完成" : `${percentage}%`;
    },
    // mini area chart
    miniArea() {
      // var ds = new DataSet();
      // var dv = ds.createView().source(this.data);
      // Step 1: 创建 Chart 对象
      var chart = new G2.Chart({
        container: "mini-area",
        forceFit: true,
        height: 300
      });
      // Step 2: 载入数据源
      // chart.source(dv);
      chart.source(this.data);
      chart.axis("value", {
        label: {
          // formatter: function formatter(val) {
          //   return (val / 10000).toFixed(1) + "k";
          // }
        }
      });
      chart.tooltip({
        crosshairs: {
          type: "line"
        }
      });
      // Step 3：创建图形语法，绘制折线区域图
      chart
        .area()
        .position("year*value")
        .shape("smooth"); // 折线使用曲线
      chart
        .line()
        .position("year*value")
        .size(1)
        .shape("smooth");
      // Step 4: 渲染图表
      chart.render();
    },
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.miniArea();
  }
};
</script>

<style scoped>
.index {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
/* 面包屑 */
.index .el-breadcrumb {
  padding: 13px 0 10px 10px;
  border-bottom: 1px solid #eaeaea;
}
/* 统计卡片 */
.index .card {
  width: 100%;
  padding: 10px;
}
.index .card .box-card {
  transition: transform 0.1s;
}
.index .card .box-card:hover {
  cursor: pointer;
  /* 上移 */
  transform: translate(0, -3px);    
  /* 放大 */
  /* transform: scale(1.03); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
}
.index .card .box-card .card-name {
  margin-bottom: 10px;
}
.index .card .box-card .card-name .card-name-span {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}
.index .card .box-card .card-number {
  margin-bottom: 10px;
}
.index .card .box-card .card-number .card-number-span {
  font-size: 24px;
}
.index .card .box-card .card-figure {
  width: 100%;
  height: 40px;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.index .card .box-card .card-figure span {
  font-size: 14px;
}
/* 增长 */
.index .card .box-card .iconzengchang {
  color: #67c23a;
}
/* 下降 */
.index .card .box-card .iconxiajiang {
  color: #f56c6c;
}
.index .card .box-card .card-bot span {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
