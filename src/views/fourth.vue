<template>
  <div class="fourth">
    <div class="search">
      <el-form :inline="true" :model="searchData" size="small" class="demo-form-inline">
        <el-form-item label="创业规模">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.cygm" placeholder="创业规模"></el-input>
        </el-form-item>
        <el-form-item label="带动贫困户规模">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.pkhgm" placeholder="带动贫困户规模"></el-input>
        </el-form-item>
        <el-form-item label="贷款申请额">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.sqed" placeholder="贷款申请额"></el-input>
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
        prop="cygm"
        label="创业规模"
        width="140"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.cygm }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="idp"
        label="个人编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sqed"
        label="贷款申请额"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pname"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="pkhgm"
        label="带动贫困户规模"
        width="120">
      </el-table-column>
      <el-table-column
        prop="idd"
        label="创业项目编号"
        min-width="180"
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
  name: 'fourth',
  watch: {
      
  },
  data () {
    return {
      tableHeight: window.innerHeight - 200,    // 表格高度自适应
      dataList:[],   // 总数据
      searchData: {   // 搜索
        cygm:'',
        pkhgm:'',
        sqed:'',
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
      axios.get('cyxmTbMapper')
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
      if (this.searchData.cygm == "" && this.searchData.pkhgm == "" && this.searchData.sqed == "") {
        this.$message({
          message: '查询条件为空显示全部数据！',
          type: 'warning',
          showClose: true,
          duration:2000
        });
      }
      // 向后台发送请求获取查询结果数据
      let formData = {
        "cygm":this.searchData.cygm,
        "pkhgm":this.searchData.pkhgm,
        "sqed":this.searchData.sqed,
      };
      var self = this;
      axios.post('cyxmTbMapper',qs.stringify(formData))
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
　　　　　　const tHeader = ['创业规模', '个人编号',"贷款申请额",'姓名','带动贫困户规模','创业项目编号'];            // 对应表格输出的title
　　　　　　const filterVal = ['cygm', 'idp',"sqed",'pname','pkhgm','idd'];                             // 对应表格输出的数据
　　　　　　const list = this.dataList;
　　　　　　const data = this.formatJson(filterVal, list);
　　　　　　export_json_to_excel(tHeader, data, '创业项目收益Excel表');                   // 对应下载excel文件的名字
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
