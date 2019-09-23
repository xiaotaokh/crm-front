<template>
  <div class="eighth">
    <div class="search">
      <el-form :inline="true" :model="searchData" size="small" class="demo-form-inline">
        <el-form-item label="公司（合作社）名称">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.gname" placeholder="公司（合作社）名称"></el-input>
        </el-form-item>
        <el-form-item label="注册资本">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.rcapital" placeholder="注册资本"></el-input>
        </el-form-item>
        <!-- <el-form-item label="公司（合作社）类别">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.gcategory" placeholder="输入1：公司 2：合作社"></el-input>
        </el-form-item> -->
        <el-form-item label="公司（合作社）类别">
          <el-select v-model="searchData.gcategory" placeholder="请选择公司（合作社）类别">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="公司" value="1">公司</el-option>
            <el-option label="合作社" value="2">合作社</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营地址名称">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.aname" placeholder="经营地址名称"></el-input>
        </el-form-item>
        <el-form-item label="所属产业基地IDE">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.ide" placeholder="所属产业基地IDE"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否龙头企业">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.lod" placeholder="输入1：是 0：否"></el-input>
        </el-form-item> -->
        <el-form-item label="是否龙头企业">
          <el-select v-model="searchData.lod" placeholder="请选择是否龙头企业">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="是" value="1">是</el-option>
            <el-option label="否" value="2">否</el-option>
          </el-select>
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
        prop="idb"
        label="公司（合作社）IDB编号"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.idb }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gname"
        label="公司（合作社）名称"
        width="240">
      </el-table-column>
      <el-table-column
        prop="rcapital"
        label="注册资本"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.rcapital }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gcategory"
        label="公司（合作社）类别"
        width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.gcategory == 1">公司</span>
          <span v-else-if="scope.gcategory == 2">合作社</span>
          <span v-else-if="scope.row.gcategory == null"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stime"
        label="创立时间"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.stime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="idc"
        label="法人编号IDC"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.idc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="aname"
        label="经营地址名称"
        min-width="200"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.aname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ide"
        label="所属产业基地IDE"
        width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.ide }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lod"
        label="是否龙头企业"
        width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.lod == 1">是</span>
          <span v-else-if="scope.row.lod == 0">否</span>
          <span v-else-if="scope.row.lod == null"></span>
        </template>
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
  name: 'eighth',
  watch: {
      
  },
  data () {
    return {
      tableHeight: window.innerHeight - 200,    // 表格高度自适应
      dataList:[],   // 总数据
      searchData: {   // 搜索
        gname:'',
        rcapital:'',
        gcategory:'',
        aname:'',
        ide:'',
        lod:'',
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
      axios.get('gsxxTbMapper')
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
      if (this.searchData.gname == "" && this.searchData.rcapital == "" && this.searchData.gcategory == "" && this.searchData.aname == "" && this.searchData.ide == "" && this.searchData.lod == "") {
        this.$message({
          message: '查询条件为空显示全部数据！',
          type: 'warning',
          showClose: true,
          duration:2000
        });
      }
      // 向后台发送请求获取查询结果数据
      let formData = {
        "gname":this.searchData.gname,
        "rcapital":this.searchData.rcapital,
        "gcategory":this.searchData.gcategory,
        "aname":this.searchData.aname,
        "ide":this.searchData.ide,
        "lod":this.searchData.lod,
      };
      var self = this;
      axios.post('gsxxTbMapper',qs.stringify(formData))
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
　　　　　　const tHeader = ['公司（合作社）IDB编号', '公司（合作社）名称','注册资本','公司（合作社）类别','创立时间','法人编号IDC','经营地址名称','所属产业基地IDE','是否龙头企业'];            // 对应表格输出的title
　　　　　　const filterVal = ['idb', 'gname','rcapital','gcategory','stime','idc','aname','ide','lod'];                             // 对应表格输出的数据
　　　　　　const list = this.dataList;
　　　　　　const data = this.formatJson(filterVal, list);
　　　　　　export_json_to_excel(tHeader, data, '公司（专业合作社）信息Excel表');                   // 对应下载excel文件的名字
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
