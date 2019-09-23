<template>
  <div class="eleventh">
    <div class="search">
      <el-form :inline="true" :model="searchData" size="small" class="demo-form-inline">
        <el-form-item label="县类别">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.ccategory" placeholder="县类别"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否特色产业">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.sftsp" placeholder="输入1：是  0：否"></el-input>
        </el-form-item> -->
        <el-form-item label="是否特色产业">
          <el-select v-model="searchData.sftsp" placeholder="请选择是否特色产业">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="是" value="1">是</el-option>
            <el-option label="否" value="0">否</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营产业方式">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.jyfsp" placeholder="经营产业方式"></el-input>
        </el-form-item>
        <el-form-item label="产业规模">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.cygmp" placeholder="产业规模"></el-input>
        </el-form-item>
        <el-form-item label="总产量">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.zcl" placeholder="总产量"></el-input>
        </el-form-item>
        <el-form-item label="产值（万元）">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.cz" placeholder="产值（万元）"></el-input>
        </el-form-item>
        <el-form-item label="占当地农业经济产值比例%">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.jjcz" placeholder="占当地农业经济产值比例%"></el-input>
        </el-form-item>
        <el-form-item label="参与新型经营主体数量">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.ztsl" placeholder="参与新型经营主体数量"></el-input>
        </el-form-item>
        <el-form-item label="覆盖贫困村（个）">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.fg" placeholder="覆盖贫困村（个）"></el-input>
        </el-form-item>
        <el-form-item label="有产业贫困户数（户）">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.cypk" placeholder="有产业贫困户数（户）"></el-input>
        </el-form-item>
        <el-form-item label="贫困户产业覆盖率（%）">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.cyfgl" placeholder="贫困户产业覆盖率（%）"></el-input>
        </el-form-item>
        <el-form-item label="产业覆盖人口">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.cyfgrk" placeholder="产业覆盖人口"></el-input>
        </el-form-item>
        <el-form-item label="人均收入">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.rjsr" placeholder="人均收入"></el-input>
        </el-form-item>
        <el-form-item label="带动总农户户数（户）">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.dd" placeholder="带动总农户户数（户）"></el-input>
        </el-form-item>
        <el-form-item label="其中带动贫困户户数（户）">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.ddpkh" placeholder="其中带动贫困户户数（户）"></el-input>
        </el-form-item>
        <el-form-item label="其中带动贫困户人数（人）">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.ddpkr" placeholder="其中带动贫困户人数（人）"></el-input>
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
        prop="cname"
        label="县(村)名称"
        min-width="280"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="dd"
        label="带动总农户户数（户）"
        width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.dd }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fg"
        label="覆盖贫困村（个）"
        width="130">
      </el-table-column>
      <el-table-column
        prop="cygmp"
        label="产业规模"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cypk"
        label="有产业贫困户数（户）"
        width="160">
      </el-table-column>
      <el-table-column
        prop="ddpkh"
        label="其中带动贫困户户数（户）"
        width="180">
      </el-table-column>
      <el-table-column
        prop="jjcz"
        label="占当地农业经济产值比例%"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cz"
        label="产值（万元）"
        width="120">
      </el-table-column>
      <el-table-column
        prop="yname"
        label="产业名称"
        width="140"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="rjsr"
        label="人均收入"
        width="100">
      </el-table-column>
      <el-table-column
        prop="idd"
        label="产业编号IDD"
        width="140">
      </el-table-column>
      <el-table-column
        prop="sftsp"
        label="是否特色产业"
        width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.sftsp == 0">否</span>
          <span v-else-if="scope.row.sftsp == 1">是</span>
          <span v-else-if="scope.row.sftsp == null"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ida"
        label="地域编号IDA"
        width="150">
      </el-table-column>
      <el-table-column
        prop="cyfgl"
        label="贫困户产业覆盖率（%）"
        width="170">
      </el-table-column>
      <el-table-column
        prop="cyfgrk"
        label="产业覆盖人口"
        width="100">
      </el-table-column>
      <el-table-column
        prop="ddpkr"
        label="其中带动贫困户人数（人）"
        width="180">
      </el-table-column>
      <el-table-column
        prop="ztsl"
        label="参与新型经营主体数量"
        width="160">
      </el-table-column>
      <el-table-column
        prop="lrtime"
        label="录入时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="ccategory"
        label="县类别"
        width="80">
      </el-table-column>
      <el-table-column
        prop="zcl"
        label="总产量"
        width="110"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="jyfsp"
        label="经营产业方式"
        width="120"
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
  name: 'eleventh',
  watch: {
      
  },
  data () {
    return {
      tableHeight: window.innerHeight - 200,    // 表格高度自适应
      dataList:[],   // 总数据
      searchData: {   // 搜索
        ccategory:'',
        sftsp:'',
        jyfsp:'',
        cygmp:'',
        zcl:'',
        cz:'',
        jjcz:'',
        ztsl:'',
        fg:'',
        cypk:'',
        cyfgl:'',
        cyfgrk:'',
        rjsr:'',
        dd:'',
        ddpkh:'',
        ddpkr:'',
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
      axios.get('tscygmTbMapper')
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
      if (this.searchData.ccategory == "" && this.searchData.sftsp == "" && this.searchData.jyfsp == "" && this.searchData.cygmp == "" && this.searchData.zcl == ""
          && this.searchData.cz == "" && this.searchData.jjcz == "" && this.searchData.ztsl == "" && this.searchData.fg == "" && this.searchData.cypk == ""
          && this.searchData.cyfgl == "" && this.searchData.cyfgrk == "" && this.searchData.rjsr == "" && this.searchData.dd == "" && this.searchData.ddpkh == "" 
          && this.searchData.ddpkr == "") {
        this.$message({
          message: '查询条件为空显示全部数据！',
          type: 'warning',
          showClose: true,
          duration:2000
        });
      }
      // 向后台发送请求获取查询结果数据
      let formData = {
        "ccategory":this.searchData.ccategory,
        "sftsp":this.searchData.sftsp,
        "jyfsp":this.searchData.jyfsp,
        "cygmp":this.searchData.cygmp,
        "zcl":this.searchData.zcl,
        "cz":this.searchData.cz,
        "jjcz":this.searchData.jjcz,
        "ztsl":this.searchData.ztsl,
        "fg":this.searchData.fg,
        "cypk":this.searchData.cypk,
        "cyfgl":this.searchData.cyfgl,
        "cyfgrk":this.searchData.cyfgrk,
        "rjsr":this.searchData.rjsr,
        "dd":this.searchData.dd,
        "ddpkh":this.searchData.ddpkh,
        "ddpkr":this.searchData.ddpkr,
      };
      var self = this;
      axios.post('tscygmTbMapper',qs.stringify(formData))
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
　　　　　　const tHeader = ['县类别', '是否特色产业','经营产业方式','产业规模','总产量','产值（万元）','占当地农业经济产值比例%','参与新型经营主体数量','覆盖贫困村（个）','有产业贫困户数（户）','贫困户产业覆盖率（%）','产业覆盖人口','人均收入','带动总农户户数（户）','其中带动贫困户户数（户）','其中带动贫困户人数（人）','其中带动贫困户人数（人）'];            // 对应表格输出的title
　　　　　　const filterVal = ['ccategory', 'sftsp','jyfsp','cygmp','zcl','cz','jjcz','ztsl','fg','cypk','cyfgl','cyfgrk','rjsr','dd','ddpkh','ddpkr','ddpkr'];                             // 对应表格输出的数据
　　　　　　const list = this.dataList;
　　　　　　const data = this.formatJson(filterVal, list);
　　　　　　export_json_to_excel(tHeader, data, '特色产业规模信息Excel表');                   // 对应下载excel文件的名字
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
