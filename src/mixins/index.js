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

      // 全局添加dialog显示与否
      globalaAddDialogFormVisible: false,

      // 全局编辑dialog显示与否
      globalaEditDialogFormVisible: false,

      // 全局下载文件名
      globalFileName: "",

      // 全局表格行switch
      globalMenuStatusUrl: "",
      globalMenuStatusFormData: {},

      // 存放表格选中项信息
      globalMultipleSelection: [],

      // 表格全局查看详情
      globalViewDetailFormVisible: false,

      // 全局根据id获取用户信息
      globalUserInformation: {},

      // 全局公司信息，根据id查找
      globalCompanyInformation: {},

      // 全局公司下拉框，选公司时候使用 - 获取到状态是启用状态的公司
      globalCompanySelect: [],

      // 全局获取客户列表  客户下拉框，选客户时候使用   获取到状态是启用状态的客户
      globalCustomerSelect: [],

      // 全局获取项目列表  项目下拉框
      globalProductSelect: [],
    }
  },
  created() {

  },
  methods: {
    // 全局获取当前用户信息
    getUserInformationGlobal() {
      let url = "user/getCurrentUser";
      let formData = {};
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.$store.dispatch("setGlobalUserInformation", res.data.data)
            // console.log(this.$store.state.globalUserInformation)  // 打印用户信息
          }
        })
        .catch(err => {
          return err;
        });
    },

    // 获取左边侧边栏slider
    getSliderBarGlobal() {
      var url = "getMenuByUser";
      this.$axios
        .post(url)
        .then(res => {
          this.$store.commit("getGlobalNavList", res.data.data)
        })
        .catch(error => {
          error
        });
    },

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
      let self = this;
      var arr = Object.keys(self.searchForm).map(function (i) {
        return self.searchForm[i]
      })
      var arr_v2 = [];
      for (let j of arr) {
        if (!j) {
          arr_v2.push(j)
        }
      }
      if (arr_v2.length == arr.length) {
        this.$message({
          message: "查询条件为空显示全部数据！",
          type: "warning",
          showClose: true,
          duration: 1000
        });
      }

      this.globalTableLoading = true;
      let url = this.globalSearchUrl;
      let formData = this.globalSearchFormData
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.globalTableLoading = false;
            this.globalTableData = res.data.data;
            this.totalCount = res.data.data.length; // 将数据的长度赋值给totalCount
          }
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
      this.$confirm("此操不可逆, 是否继续?", "删除信息", {
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
    // 表格行全局批量删除
    batchDelGlobal(url) {
      if (this.globalMultipleSelection.length != 0) {
        this.$confirm("此操不可逆, 是否继续?", "删除信息", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            for (var i of this.globalMultipleSelection) {
              this.ids += i.id + ",";
            }
            let formData = {
              ids: this.ids.slice(0, -1)
            };
            this.$axios
              .post(url, formData)
              .then(res => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: res.data.msg
                  });
                  this.getTableData();
                  this.ids = ""; // ids清空
                }
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
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选表格项!"
        });
      }
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

    // 全局编辑显示编辑dialog
    editDialogGlobal() {
      this.globalaEditDialogFormVisible = true
    },

    // 全局编辑取消事件
    editDialogFormCancleGlobal() {
      this.globalaEditDialogFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消编辑!"
      });
    },

    // 分页
    handleSizeChange(val) {
      this.PageSize = val; // 改变每页显示的条数
      this.currentPage = 1; // 注意：在改变每页显示的条数时，要将页码显示到第一页
    },
    handleCurrentChange(val) {
      this.currentPage = val; // 改变默认的页数
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
        accessToken: localStorage.getItem("accessToken")
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

    // 全局修改表格行状态
    globalMenuStatus() {
      this.$axios
        .post(this.globalMenuStatusUrl, this.globalMenuStatusFormData)
        .then(res => {
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: res.data.msg
            });
          }
          this.getTableData();
          this.getUserInformationGlobal(); // 全局同步用户信息
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        });
    },

    // 表格选中项
    handleSelectionChangeGlobal(val) {
      this.globalMultipleSelection = val;
    },

    // 批量启用  请求体字段为 ids status
    batchStartGlobal(url) {
      if (this.globalMultipleSelection.length != 0) {
        for (var i of this.globalMultipleSelection) {
          this.ids += i.id + ",";
        }
        let formData = {
          ids: this.ids.slice(0, -1),
          status: "ACTIVE"
        };
        this.$axios
          .post(url, formData)
          .then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.getTableData();
              this.ids = ""; // ids清空
            }
          })
          .catch(err => {});
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选表格项!"
        });
      }
    },

    // 批量禁用  请求体字段为 ids status
    batchDisableGlobal(url) {
      if (this.globalMultipleSelection.length != 0) {
        for (var i of this.globalMultipleSelection) {
          this.ids += i.id + ",";
        }
        let formData = {
          ids: this.ids.slice(0, -1),
          status: "DEL"
        };
        this.$axios
          .post(url, formData)
          .then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.getTableData();
              this.ids = ""; // ids清空
            }
          })
          .catch(err => {});
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选表格项!"
        });
      }
    },
    // 表格行查看详情全局取消
    viewDetailDialogFormCancleGlobal() {
      this.globalViewDetailFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消查看详情!"
      });
    },
    // 表格行查看详情全局确定
    viewDetailDialogFormSubmitGlobal() {
      this.globalViewDetailFormVisible = false;
    },

    // 全局根据id获取用户信息
    getIdUserInformationGlobal(userId) {
      this.globalUserInformation = {};
      let url = "user/getUserById";
      let formData = {
        id: userId
      }
      this.$axios.post(url, formData).then(res => {
        if (res.data.code == 1) {
          this.globalUserInformation = res.data.data;
          // console.log(this.globalUserInformation)
          this.getCompanyByIdGlobal(this.globalUserInformation.companyId); // 根据公司id查询公司信息
        }
      }).catch(err => {
        return err;
      })
    },

    // 全局获取公司
    getCompanyByIdGlobal(companyId) {
      let url = "company/getCompanyById";
      let formData = {
        id: companyId
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.globalCompanyInformation = res.data.data;
            // console.log(this.globalCompanyInformation)
          }
        })
        .catch(err => {});
    },

    // 全局获取公司下拉框
    getCompanySelectGlobal() {
      let url = "company/getCompanySelectByCurrentUsers";
      this.$axios
        .post(url)
        .then(res => {
          if (res.data.code == 1) {
            this.globalCompanySelect = res.data.data;
          }
        })
        .catch(err => {});
    },

    // 全局获取客户列表  客户下拉框，选客户时候使用   获取到状态是启用状态的客户
    getCustomerSelectGlobal() {
      let url = "customer/getCustomerSelectByCurrentUsers";
      this.$axios
        .post(url)
        .then(res => {
          if (res.data.code == 1) {
            this.globalCustomerSelect = res.data.data;
          }
        })
        .catch(err => {});
    },

    // 全局获取项目列表  项目下拉框
    getProductSelectGlobal() {
      let url = "product/getProductSelectByCurrentUsers";
      this.$axios
        .post(url)
        .then(res => {
          if (res.data.code == 1) {
            this.globalProductSelect = res.data.data;
          }
        })
        .catch(err => {});
    }
  }
}
