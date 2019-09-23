<template>
  <div class="figures">
    <span class="selectTitle">请选择特色产业：</span>
    <el-select v-model="region" placeholder="请选择特色产业">
        <el-option @click.native ="clickSelect(item)" v-for="item in regionList" :key="item" :label="item" :value="item"></el-option>
    </el-select>
    <!-- <el-dropdown trigger="click" split-button type="primary" @command="handleCommand">
        {{ region }}
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in regionList" :key="item" :command="item">{{item}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown> -->
    <div class="content">
        <div class="title1">
            <span>{{ region }}产值-Top10</span>
        </div>
        <!-- 特色 -->
        <div id="figures1"></div>
        <div class="title2">
            <span>{{ region }}带动贫困户数-Top10</span>
        </div>
        <div id="figures2"></div>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
import G2 from '@antv/g2';
export default {
  name: 'figures',
  watch: {
      
  },
  data () {
    return {
        // 下拉菜单
        region:"优质稻",  // 下拉菜单默认优质稻
        regionList: [],   // 下拉菜单list
        
        dataObj1:{},   // 第一个图表数据对象  特色产业产值Top10
        dataObj2:{},   // 第二个图表数据对象  特色产业贫困村数Top10

        dataList1:[],   // dataList1 特色产业产值Top10
        dataList2:[],    // dataList2 特色产业贫困村数Top10
    }
  },
  methods: {
    // 获取下拉菜单
    getDataSelect() {
      var self = this;
      axios.get('option')
      .then(function (response) {
        self.regionList = response.data;  // 数据dataList
      })
      .catch(function (error) {
        
      });
    },
    // 获取特色产业产值数据
    getData() {
      var self = this;
      axios.get('topTen')
      .then(function (response) {
        self.dataObj1 = response.data;  // 数据dataList
        
        var selector = self.region;    // 获取当前下拉菜单选项
        
        // 开始整理数据
        self.dataList1 = self.dataObj1[selector];
        // console.log(self.dataList1)

        // --------------- 以下是产值数据处理
        var productionList = []; // 用于存放产值数据

        // 求出产值top10 数组
        var arrTop10 = []; 

        // 遍历数组求出产值数组
        for(var item of self.dataList1) {
            productionList.push(item.number)
        }
        // console.log(productionList)
        
        // 从大到小排序
        productionList.sort(function(a,b){return b-a})
        // console.log(productionList)

        var productionList = productionList.slice(0,10);  // 抛出前10
        // console.log(productionList)
        
        // 再次遍历数组，对比产值数组
        for(var i of self.dataList1) {
            for(var j of productionList) {
                if(i.number == j) {
                    arrTop10.push(i);
                }
            }
        }
        
        // 对数据进行大小排序
        arrTop10.sort( self.compare( 'number', true ) )

        // 数组去重
        var x = new Set(arrTop10);
        arrTop10 = [...x];

        // console.log(arrTop10)   

        // --------------- 以下是带动贫困户户数数据处理
        var poorList = []; // 用于存放贫困户数据

        // 求出贫困户top10 数组
        var pooraArrTop10 = []; 

        // 遍历数组求出产值数组
        for(var item of self.dataList1) {
            poorList.push(item.ddpkh)
        }
        // console.log(poorList)
        
        // 从大到小排序
        poorList.sort(function(a,b){return b-a})
        // console.log(poorList)

        var poorList = poorList.slice(0,10);  // 抛出前10
        // console.log(poorList)
        
        // 再次遍历数组，对比产值数组
        for(var i of self.dataList1) {
            for(var j of poorList) {
                if(i.ddpkh == j) {
                    pooraArrTop10.push(i);
                }
            }
        }
        
        // 对数据进行大小排序
        pooraArrTop10.sort( self.compare( 'ddpkh', true ) )

        // 数组去重
        var x = new Set(pooraArrTop10);
        pooraArrTop10 = [...x];

        // console.log(pooraArrTop10);


        // 第一个柱状图
        // Step 1: 创建 Chart1 对象
        const chart1 = new G2.Chart({
            container: 'figures1', // 指定图表容器 ID
            forceFit: true, // 指定图表宽度
            height : 300, // 指定图表高度
        });
        
        // Step 2: 载入数据源
        chart1.source(arrTop10);
        
        // chart1.scale('cygmp',  {
        //     min:0,  // Y轴最小刻度
        //     linear:{
        //         nice:true
        //     }
        // });

        // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
        chart1.interval().position('county*cygmp').color('county').size(40) // size 柱状图宽度

        // Step 4: 渲染图表
        chart1.render();



        // 第二个柱状图
        // Step 1: 创建 Chart2 对象
        const chart2 = new G2.Chart({
            container: 'figures2', // 指定图表容器 ID
            forceFit: true, // 指定图表宽度
            height : 300 // 指定图表高度
            // height: window.innerHeight,
        });

        // Step 2: 载入数据源
        chart2.source(pooraArrTop10);

        // 提示信息
        chart2.tooltip({
            // itemTpl: '<li>地区: {county}</li><li>贫困户数（户）: {ddpkh}</li>'
            itemTpl:'<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}：{value} 户</li>'
        });

        // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
        chart2.interval().position('county*ddpkh').color('county')
        .tooltip('county*ddpkh', (county, ddpkh) => {
            // ddpkh = ddpkh + '(户)';
            return {
                name: county,
                value: '<span style="color: #1890ff;">' + ddpkh + '</span>'
            };
        }).size(40) // size 柱状图宽度
        
        // Y轴自定义
        chart2.axis('ddpkh', {
            label: {
                formatter(text, item, index) {
                    return text + "户";
                },
            },
            
        });

        // Step 4: 渲染图表
        chart2.render();

      })
      .catch(function (error) {
        
      });
    },

    // 下拉菜单事件
    clickSelect(item) {
        this.region = item;    // 获取到当前值

        document.getElementById("figures1").remove();   // 移除第一个图表dom层
        var str1 = document.getElementsByClassName("title1");  // 获取第一个图表标题
        var obj1 = document.createElement("div");  // 创建新的第一个图表
        obj1.setAttribute('id','figures1');   // 设置第一个图表标签属性
        str1[0].after(obj1);  // title1之后插入第一个图表div


        document.getElementById("figures2").remove();   // 移除第一个图表dom层
        var str2 = document.getElementsByClassName("title2");  // 获取第一个图表标题
        var obj2 = document.createElement("div");  // 创建新的第一个图表
        obj2.setAttribute('id','figures2');   // 设置第一个图表标签属性
        str2[0].after(obj2);  // title1之后插入第一个图表div

        this.getData();   // 重新获去数据渲染
    },

    // 数组根据某个键值的值进行升降排序
    compare( property, desc ) {
        return function ( a, b ) {
            var value1 = a[ property ];
            var value2 = b[ property ];
            if ( desc == true ) {                    //排序升序排列                   
                return value1 - value2;           
            } else {                     
                return value2 - value1;
            }
        }
    },
  },
  mounted(){
    this.getData();   // 获取产值数据

    this.getDataSelect();      // 下拉菜单数据
  }
}
</script>

<style scoped>
.figures {
  width: 100%;
  height: 100%;
  position: relative;
}
/* 下拉菜单 */
.figures .selectTitle {
    font-size: 15px;
    font-weight: 700;
    color: #333;
}
/* 图标名称 */
.figures .title1 {
    display: flex;
    justify-content: space-around;
    padding: 30px 0;
    color: #333;
    font-weight: 700;
    font-size: 20px;
}
.figures .title2 {
    display: flex;
    justify-content: space-around;
    padding: 30px 0;
    color: #333;
    font-weight: 700;
    font-size: 20px;
}
/* 主题区域 */
.figures .content {
    width: 80%;
}
</style>
