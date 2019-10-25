export const myMixins = {
  data() {
    return {
      globalSearchUrl: "", // 全局搜索url
      globalSearchFormData: {}, // 全局搜索form表单

      globalTableData: [], // 全局表格数据
      globalGetTableDataUrl: "", // 全局获取表格数据url
      globalGetTableDataFormData: "", // 全局获取表格数据form表单
      globalTableLoading: false, // 全局表格loading

      btnLoading: false, // 提交按钮loading

      // 分页
      currentPage: 1, // 默认显示第几页
      pageSizes: [10, 20, 50, 100], // 个数选择器（可修改）
      PageSize: 20, // 默认每页显示的条数（可修改）
      totalCount: 1, // 总条数，根据接口获取数据长度(注意：这里不能为空)

      // 全局删除
      globalDeleteUrl: "",
      globalDeleteFormData: {},

      // 全局添加
      globalaAddDialogFormVisible: false,

      // 全局下载文件名
      globalFileName:"",


    }
  },
  created() {

  },
  methods: {
    // 全局监听页面高度 赋值给tableHeight
    globalListenHeight() {
      var self = this;
      window.onresize = () => {
        self.tableHeight = document.body.clientHeight - 300;
      };
    },

    // 全局搜索
    searchSubmitGlobal() {
      // 判断查询条件是否为空
      for (var key in this.searchForm) {
        if (!this.searchForm[key]) {
          this.$message({
            message: "查询条件为空显示全部数据！",
            type: "warning",
            showClose: true,
            duration: 1000
          });
        }
      }
      this.globalTableLoading = true;
      let url = this.globalSearchUrl;
      let formData = this.globalSearchFormData
      this.$axios
        .post(url, formData)
        .then(res => {
          this.globalTableLoading = false;
          this.globalTableData = res.data.data;
          this.totalCount = res.data.data.length; // 将数据的长度赋值给totalCount
        })
        .catch(err => {
          return;
        });
    },

    // 全局获取表格信息
    getTableDataGlobal() {
      this.globalTableLoading = true;
      this.$axios
        .post(this.globalGetTableDataUrl, this.globalGetTableDataFormData)
        .then(res => {
          this.globalTableData = res.data.data; // 获取表格数据
          this.globalTableLoading = false;
          this.totalCount = res.data.data.length; // 将数据的长度赋值给totalCount
        })
        .catch(err => {});
    },

    // 表格行全局删除事件
    handleDeleteGlobal(index, row) {
      this.$confirm("此操不可逆, 是否继续?", "删除角色", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$axios
            .post(this.globalDeleteUrl, this.globalDeleteFormData)
            .then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
              }
              this.getTableData();
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除!"
          });
        });
    },

    // 全局添加
    addGlobal() {
      this.globalaAddDialogFormVisible = true;
    },

    // 添加取消
    addDialogFormCancleGlobal() {
      this.globalaAddDialogFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消添加!"
      });
      this.addReset();
    },

    /* 下载方法 */
    downFile(blob, fileName) {
      // 非IE下载
      if ("download" in document.createElement("a")) {
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob); // 创建下载的链接
        link.download = fileName; // 下载后文件名
        link.style.display = "none";
        document.body.appendChild(link);
        link.click(); // 点击下载
        window.URL.revokeObjectURL(link.href); // 释放掉blob对象
        document.body.removeChild(link); // 下载完成移除元素
      } else {
        // IE10+下载
        window.navigator.msSaveBlob(blob, fileName);
      }
    },
    downloadFile(url, data) {
      let requestData = Object.assign({}, data, {
        accessToken: sessionStorage.getItem("accessToken")
      });

      // 响应类型：arraybuffer, blob
      this.$axios
        .post(url, requestData, {
          responseType: "blob"
        })
        .then(resp => {
          let headers = resp.headers;
          let contentType = headers["content-type"];
          if (!resp.data) {
            return false;
          } else {
            const blob = new Blob([resp.data], {
              type: contentType
            });

            const contentDisposition = resp.headers["content-disposition"];
            let fileName = this.globalFileName; // this.globalFileName 从后台获取的文件名字
            if (contentDisposition) {
              fileName = window.decodeURI(
                resp.headers["content-disposition"].split("=")[1]
              );
            }
            this.downFile(blob, fileName);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  }
}
