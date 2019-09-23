<template>
  <div class="ninth">
    <div class="search">
      <el-form :inline="true" :model="searchData" size="small" class="demo-form-inline">
        <el-form-item label="家庭人数">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.jnumber" placeholder="家庭人数"></el-input>
        </el-form-item>
        <el-form-item label="劳动力数">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.lnumber" placeholder="劳动力数"></el-input>
        </el-form-item>
        <el-form-item label="贫困状态">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.tpct" placeholder="贫困状态"></el-input>
        </el-form-item>
        <el-form-item label="耕地面积">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.cia" placeholder="耕地面积"></el-input>
        </el-form-item>
        <el-form-item label="林地面积">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.lia" placeholder="林地面积"></el-input>
        </el-form-item>
        <el-form-item label="场地投入面积">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.ctia" placeholder="场地投入面积"></el-input>
        </el-form-item>
        <el-form-item label="是否外聘劳动力">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.wpldlp" placeholder="是否外聘劳动力"></el-input>
        </el-form-item>
        <el-form-item label="产品用途">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.cpytp" placeholder="产品用途"></el-input>
        </el-form-item>
        <el-form-item label="销售途径">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.xstjp" placeholder="销售途径"></el-input>
        </el-form-item>
        <el-form-item label="最需要的帮助">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.heipp" placeholder="最需要的帮助"></el-input>
        </el-form-item>
        <el-form-item label="遇到的困难">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.knanp" placeholder="遇到的困难"></el-input>
        </el-form-item>
        <el-form-item label="启动资金获得渠道">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.wmoyp" placeholder="启动资金获得渠道"></el-input>
        </el-form-item>
        <el-form-item label="养殖牲畜种类及数量">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.sczlp" placeholder="养殖牲畜种类及数量"></el-input>
        </el-form-item>
        <el-form-item label="收入来源">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.srlyp" placeholder="收入来源"></el-input>
        </el-form-item>
        <el-form-item label="产业项目劳动力数">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.cyxmp" placeholder="产业项目劳动力数"></el-input>
        </el-form-item>
        <el-form-item label="产业脱贫致富是否有效">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.tpzfp" placeholder="产业脱贫致富是否有效"></el-input>
        </el-form-item>
        <el-form-item label="对于政府安排的特色产业态度">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.tscyp" placeholder="对于政府安排的特色产业态度"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="export2Excel" type="success">导出Excel</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="dataList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      stripe
      :height="tableHeight"
      style="width: 100%"
      v-loading="loading"
      >
      <el-table-column
        label="序号"
        fixed
        width="80" 
        align="center">
        <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
      </el-table-column>
      <el-table-column
        prop="pname"
        label="户主姓名"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="srlyp"
        label="收入来源"
        width="180"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.srlyp }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="heipp"
        label="最需要的帮助"
        show-overflow-tooltip
        width="180">
      </el-table-column>
      <el-table-column
        prop="lia"
        label="林地面积"
        width="120">
      </el-table-column>
      <el-table-column
        prop="ctia"
        label="场地投入面积"
        width="120">
      </el-table-column>
      <el-table-column
        prop="lnumber"
        label="劳动力数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="idd"
        label="认为有特色的农业产业编码IDD"
        width="220">
      </el-table-column>
      <el-table-column
        prop="lrtime"
        label="录入时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="sczlp"
        label="养殖牲畜种类及数量"
        width="160">
      </el-table-column>
      <el-table-column
        prop="tscyp"
        label="对于政府安排的特色产业态度"
        width="200">
      </el-table-column>
      <el-table-column
        prop="knanp"
        label="遇到的困难"
        width="140">
      </el-table-column>
      <el-table-column
        prop="ida"
        label="家庭所属区域编号IDA"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cpytp"
        label="产品用途"
        show-overflow-tooltip
        width="180">
      </el-table-column>
      <el-table-column
        prop="cia"
        label="耕地面积"
        width="100">
      </el-table-column>
      <el-table-column
        prop="wpldlp"
        label="是否外聘劳动力"
        width="140">
      </el-table-column>
      <el-table-column
        prop="tpct"
        label="贫困状态"
        width="120">
      </el-table-column>
      <el-table-column
        prop="tpzfp"
        label="产业脱贫致富是否有效"
        width="180">
      </el-table-column>
      <el-table-column
        prop="jnumber"
        label="家庭人数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="wmoyp"
        label="启动资金获得渠道"
        show-overflow-tooltip
        width="160">
      </el-table-column>
      <el-table-column
        prop="idh"
        label="户主编号IDH"
        width="180">
      </el-table-column>
      <el-table-column
        prop="xstjp"
        label="销售途径"
        show-overflow-tooltip
        width="180">
      </el-table-column>
      <el-table-column
        prop="cyxmp"
        label="产业项目劳动力数"
        width="160">
      </el-table-column>
      <el-table-column
        prop="bddress"
        min-width="180"
        label="家庭具体住址"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:center;margin-top:30px;margin-left:-50px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      prev-text="上一页"
      next-text="下一页"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
import qs from 'qs'
// 导出excel
require('script-loader!file-saver');                    //保存文件用
require('script-loader!vendor/Blob');                   //转二进制用
require('script-loader!xlsx/dist/xlsx.core.min');       //xlsx核心
const axios = require('axios');
export default {
  name: 'ninth',
  watch: {
      
  },
  data () {
    return {
      tableHeight: window.innerHeight - 200,    // 表格高度自适应
      dataList:[],   // 总数据
      searchData: {   // 搜索
        jnumber:'',
        lnumber:'',
        tpct:'',
        cia:'',
        lia:'',
        ctia:'',
        wpldlp:'',
        cpytp:'',
        xstjp:'',
        heipp:'',
        knanp:'',
        wmoyp:'',
        sczlp:'',
        srlyp:'',
        cyxmp:'',
        tpzfp:'',
        tscyp:'',
      },
      currentPage: 1,  // 当前页数
      pageSize:10,   // 每页数
      totalCount:200,  // 总条数
      pageSizes:[10, 20, 50, 100],  // 页数
      loading: true,    // 懒加载
    }
  },
  methods: {

    // 获取表格数据
    getTableData() {
      var self = this;
      axios.get('hzjtqk1TbMapper')
      .then(function (response) {
        self.dataList = response.data.data;  // 数据dataList
        
        self.totalCount = response.data.data.length  // 将数据的长度赋值给totalCount
        
        // 关闭loading
        self.loading = false;
      })
      .catch(function (error) {
        
      });
    },

    // 查询
    onSubmit() {
      // 判断查询条件是否为空
      if (this.searchData.jnumber == "" && this.searchData.lnumber == "" && this.searchData.tpct == "" && this.searchData.cia  == "" && this.searchData.lia == "" && this.searchData.ctia == ""
       && this.searchData.wpldlp == "" && this.searchData.cpytp == "" && this.searchData.xstjp == "" && this.searchData.heipp == "" && this.searchData.knanp == "" && this.searchData.wmoyp == ""
        && this.searchData.sczlp == "" && this.searchData.srlyp == "" && this.searchData.cyxmp == "" && this.searchData.tpzfp == "" && this.searchData.tscyp == "") {
        this.$message({
          message: '查询条件为空显示全部数据！',
          type: 'warning',
          showClose: true,
          duration:2000
        });
      }
      // 向后台发送请求获取查询结果数据
      let formData = {
        "jnumber":this.searchData.jnumber,
        "lnumber":this.searchData.lnumber,
        "tpct":this.searchData.tpct,
        "cia":this.searchData.cia,
        "lia":this.searchData.lia,
        "ctia":this.searchData.ctia,
        "wpldlp":this.searchData.wpldlp,
        "cpytp":this.searchData.cpytp,
        "xstjp":this.searchData.xstjp,
        "heipp":this.searchData.heipp,
        "knanp":this.searchData.knanp,
        "wmoyp":this.searchData.wmoyp,
        "sczlp":this.searchData.sczlp,
        "srlyp":this.searchData.srlyp,
        "cyxmp":this.searchData.cyxmp,
        "tpzfp":this.searchData.tpzfp,
        "tscyp":this.searchData.tscyp,
      };
      var self = this;
      axios.post('hzjtqk1TbMapper',qs.stringify(formData))
      .then(res=>{
        self.dataList = res.data.data;  // 数据dataList
        self.totalCount = res.data.data.length  // 将数据的长度赋值给totalCount        
      })
    },

    // 分页 pageSize 改变时会触发
    handleSizeChange(val) {
      // 改变每页显示的条数 
      this.pageSize=val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage=1
    },
    // 分页 currentPage 改变时会触发
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage=val
    },
    // 导出excel
    export2Excel() {
　　　　require.ensure([], () => {
　　　　　　const { export_json_to_excel } = require('../vendor/Export2Excel');  // 新建文件夹下的Export2Excel.js文件
　　　　　　const tHeader = ['户主姓名', '收入来源',"最需要的帮助",'林地面积','场地投入面积','劳动力数','认为有特色的农业产业编码IDD','录入时间','养殖牲畜种类及数量','对于政府安排的特色产业态度','遇到的困难','家庭所属区域编号IDA','产品用途','耕地面积','是否外聘劳动力','贫困状态','产业脱贫致富是否有效','家庭人数','启动资金获得渠道','户主编号IDH','销售途径','产业项目劳动力数','家庭具体住址'];            // 对应表格输出的title
　　　　　　const filterVal = ['pname', 'srlyp',"heipp",'lia','ctia','lnumber','idd','lrtime','sczlp','tscyp','knanp','ida','cpytp','cia','wpldlp','tpct','tpzfp','jnumber','wmoyp','idh','xstjp','cyxmp','bddress'];                             // 对应表格输出的数据
　　　　　　const list = this.dataList;
　　　　　　const data = this.formatJson(filterVal, list);
　　　　　　export_json_to_excel(tHeader, data, '户主家庭情况1Excel表');                   // 对应下载excel文件的名字
　　　　})
　　},
　　formatJson(filterVal, jsonData) {
　　　　return jsonData.map(v => filterVal.map(j => v[j]))
　　}
  },
  mounted(){
    this.getTableData();
  }
}
</script>

<style>
  .app-search .search{
    width: 100%;
    height: 60px;
    border-radius: 5px;
  }
</style>
