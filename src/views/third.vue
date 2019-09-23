<template>
  <div class="third">
    <div class="search">
      <el-form :inline="true" :model="searchData" size="small" class="demo-form-inline">
        <el-form-item label="产业基地名称">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.iname" placeholder="产业基地名称"></el-input>
        </el-form-item>
        <el-form-item label="经营地址名称">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.aname" placeholder="经营地址名称"></el-input>
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
        prop="ide"
        label="产业基地编号"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.ida }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="iname"
        label="产业基地名称"
        show-overflow-tooltip
        width="240">
      </el-table-column>
      <el-table-column
        prop="rcapital"
        label="注册资本"
        width="150">
      </el-table-column>
      <el-table-column
        prop="idc"
        label="法人编号"
        width="160">
      </el-table-column>
      <el-table-column
        prop="ida"
        label="经营地所属区域编号IDA"
        width="180">
      </el-table-column>
      <el-table-column
        prop="aname"
        label="经营地址名称"
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
  name: 'third',
  watch: {
      
  },
  data () {
    return {
      tableHeight: window.innerHeight - 200,    // 表格高度自适应
      dataList:[],   // 总数据
      searchData: {   // 搜索
        iname:'',
        aname:''
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
      axios.get('cyjdxxTbMapper')
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
      if (this.searchData.iname == "" && this.searchData.aname == "") {
        this.$message({
          message: '查询条件为空显示全部数据！',
          type: 'warning',
          showClose: true,
          duration:2000
        });
      }
      // 向后台发送请求获取查询结果数据
      let formData = {
        "iname":this.searchData.iname,
        "aname":this.searchData.aname
      };
      var self = this;
      axios.post('cyjdxxTbMapper',qs.stringify(formData))
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
　　　　　　const tHeader = ['产业基地编号', '产业基地名称',"注册资本","法人编号","经营地所属区域编号IDA","经营地址名称"];            // 对应表格输出的title
　　　　　　const filterVal = ['ide', 'iname',"rcapital","idc","ida","aname"];                             // 对应表格输出的数据
　　　　　　const list = this.dataList;
　　　　　　const data = this.formatJson(filterVal, list);
　　　　　　export_json_to_excel(tHeader, data, '产业基地信息Excel表');                   // 对应下载excel文件的名字
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
