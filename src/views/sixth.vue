<template>
  <div class="sixth">
    <div class="search">
      <el-form :inline="true" :model="searchData" size="small" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.pname" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份类别">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.sf" placeholder="身份类别"></el-input>
        </el-form-item>
        <el-form-item label="具体住址">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.address" placeholder="具体住址"></el-input>
        </el-form-item>
        <el-form-item label="是否受过产业培训">
          <el-input @keyup.enter.native="onSubmit" v-model="searchData.peixun" placeholder="是否受过产业培训"></el-input>
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
        prop="idh"
        label="户主编号IDH"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.idh }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="pname"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="idp"
        label="个人编号IDP"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="80">
      </el-table-column>
      <el-table-column
        prop="idpf"
        label="身份证号码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="birthday"
        label="出生日期"
        width="120">
      </el-table-column>
      <el-table-column
        prop="degree"
        label="文化程度"
        width="120">
      </el-table-column>
      <el-table-column
        prop="zzmm"
        label="政治面貌"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sf"
        label="身份类别"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="tel"
        label="联系方式"
        width="130">
      </el-table-column>
      <el-table-column
        prop="death"
        label="死亡时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bmoney"
        label="是否致富带头人"
        width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.bmoney == 1">是</span>
          <span v-else-if="scope.row.bmoney == 0">否</span>
          <span v-else-if="scope.row.bmoney == null"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gxi"
        label="与户主关系"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.gxi == 1">户主本人</span>
          <span v-else-if="scope.row.gxi == 2">配偶</span>
          <span v-else-if="scope.row.gxi == 3">儿子</span>
          <span v-else-if="scope.row.gxi == 4">女儿</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="peixun"
        label="是否受过产业培训"
        width="140"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cyjl"
        label="有无创业经历"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="address"
        label="具体住址"
        min-width="200"
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
  name: 'sixth',
  watch: {
      
  },
  data () {
    return {
      tableHeight: window.innerHeight - 200,    // 表格高度自适应
      dataList:[],   // 总数据
      searchData: {   // 搜索
        pname:'',
        sf:'',
        address:'',
        peixun:'',
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
      axios.get('grjbxxTbMapper')
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
      if (this.searchData.pname == "" && this.searchData.sf == "" && this.searchData.address == "" && this.searchData.peixun == "") {
        this.$message({
          message: '查询条件为空显示全部数据！',
          type: 'warning',
          showClose: true,
          duration:2000
        });
      }
      // 向后台发送请求获取查询结果数据
      let formData = {
        "pname":this.searchData.pname,
        "sf":this.searchData.sf,
        "address":this.searchData.address,
        "peixun":this.searchData.peixun,
      };
      var self = this;
      axios.post('grjbxxTbMapper',qs.stringify(formData))
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
　　　　　　const tHeader = ['户主编号IDH', '姓名','个人编号IDP','性别','身份证号码','出生日期','文化程度','政治面貌','身份类别','联系方式','死亡时间','是否致富带头人','与户主关系','是否受过产业培训','有无创业经历','具体住址'];            // 对应表格输出的title
　　　　　　const filterVal = ['idh', 'pname','idp','sex','idpf','birthday','degree','zzmm','sf','tel','death','bmoney','gxi','peixun','cyjl','address'];                             // 对应表格输出的数据
　　　　　　const list = this.dataList;
　　　　　　const data = this.formatJson(filterVal, list);
　　　　　　export_json_to_excel(tHeader, data, '个人基本信息Excel表');                   // 对应下载excel文件的名字
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
