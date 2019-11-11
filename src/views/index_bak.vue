<template>
  <div class="index">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/appMain/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>dashboard</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <el-row :gutter="20" class="card">
        <!-- 总销售额 -->
        <el-col :span="6">
          <el-card class="box-card">
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
            <div class="card-figure">
            </div>
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
              <div id="myChart" :style="{width: '100%', height: '100px'}"></div>
    </div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
import shine from "@/plugin/shine.js"
export default {
  name: "index",
  computed: {},
  watch: {},
  data() {
    return {
      data: {
        xData: [
          "2019-10-1",
          "2019-10-2",
          "2019-10-3",
          "2019-10-4",
          "2019-10-5",
          "2019-10-6",
          "2019-10-7",
          "2019-10-8",
          "2019-10-9",
          "2019-10-10",
          "2019-10-11",
          "2019-10-12",
          "2019-10-13",
          "2019-10-14",
          "2019-10-15",
          "2019-10-16",
          "2019-10-17",
          "2019-10-18",
          "2019-10-19"
        ],
        yData: [
          1,
          21,
          13,
          4,
          12,
          6,
          7,
          18,
          9,
          10,
          11,
          4,
          56,
          1,
          15,
          16,
          16,
          8,
          3
        ]
      }
    };
  },
  methods: {
    
      format(percentage) {
        return percentage === 100 ? '完成' : `${percentage}%`;
      },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"),'shine');
      // 绘制图表
      myChart.setOption({
        tooltip: {},
        xAxis: {
          show: false,
          data: this.data.xData,
          splitLine: {
            show: false
          }
        },
        yAxis: [
          {
            show: false,
            type: "category",
            boundaryGap: false,
            //y轴
            axisLine: {
              show: false
            },
            axisTick: {
              //y轴刻度线
              show: false
            },
            //网格线
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "访问量",
            type: "line",
            data: this.data.yData,
             areaStyle: {}
          }
        ]
      });
    }
  },
  mounted() {
    this.drawLine();
  }
};
</script>

<style scoped>
#myChart {
  border:1px solid #000;
}
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
