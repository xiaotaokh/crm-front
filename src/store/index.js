import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  // 全局管理的状态  定义
  state: {
    store: 0, // 测试store
    breadcrumb: [], // 面包屑
    tableLoading: true, // 表格全局loading加载
    postTableData: [], // 全局post请求 数据
    searchForm: {
        name:"1234"
    }, // 全局搜索对象
  },
  // 获取
  getters: {
    // 测试store
    getStore(state) {
      return state.store
    },
    // 获取面包屑
    getBreadcrumb(state) {
      return state.breadcrumb
    },
    // 获取search
    getSearchForm(state) {
      return state.searchForm
    }
  },
  // 修改
  mutations: {
    // 测试store
    addStore(state, num) {
      state.store = state.store + num;
    },
    // 修改面包屑breadcrumb
    editBreadcrumb(state, breadcrumb) {
      state.breadcrumb = breadcrumb;
    },
    // 修改tableLoading
    editTableLoading(state, tableLoading) {
      state.tableLoading = tableLoading;
    },
    // 全局postTableData请求  表格
    postTableData(state, url, formData) {
      state.tableLoading = true;
      Vue.prototype.$axios.post(url, formData).then(res => {
        setTimeout(() => {
          state.tableLoading = false;
        }, 400)
        state.postTableData = res.data.data;
      })
    },
    // 修改tableData数据
    setPostTableData(state,list) {
      state.postTableData = list
    }
  },
  // 修改  判断commit哪个mutations
  actions: {
    // 全局post请求
    postTableData({
      commit
    }, url, formData) {
      commit('postTableData', url, formData)
    },
  }
})


// this.$store.commit("addStore",1)   // 修改全局状态
// console.log(this.$store.state.store) // 获取全局状态
// console.log(this.$store.getters.getStore) // 获取全局状态
