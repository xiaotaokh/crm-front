import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  // 全局管理的状态  定义
  state: {
    store: 0, // 测试store
    sliderIsCollapse:false,  // 侧边栏是否收起
    sliderWidth:220,  // 侧边栏宽度
    appContentWidth:220,  // app-content width
    isHeaderLogo:true,  // 是否显示logo
    globalNavList:[], // 侧边栏slider列表数据
    breadcrumb: [], // 面包屑
    tableLoading: true, // 表格全局loading加载
    postTableData: [], // 全局post请求 数据
    globalHeaderColor: "#fff", // 头部背景色
    globalSliderColor: "#155B74", // 侧边栏背景色
    globalTagsViewBreadcrumb: true, // 是否显示面包屑
    globalSliderLogo: true, // 是否显示LOGO

    // 全局当前用户信息
    globalUserInformation: {
      userName: "",
      status: "ACTIVE",
      rolesId:"",
      companyId:"",
      phoneNumber:"",
      name:""
    },
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
    // 全局当前用户信息
    getGlobalUserInformation(state) {
      return state.globalUserInformation
    }
  },
  // 修改
  mutations: {
    // 测试store
    addStore(state, num) {
      state.store = state.store + num;
    },
    // 侧边栏是否收起
    setsLiderIsCollapse(state,val) {
      state.sliderIsCollapse = val;
    },
    // 侧边栏宽度跟随侧边栏变化
    setSliderWidth(state,val) {
      state.sliderWidth = val;
    },
    // 设置头部背景色
    setHeaderColor(state,val) {
      state.globalHeaderColor = val;
    },
    // 设置侧边栏背景色
    setSliderColor(state,val) {
      state.globalSliderColor = val;
    },
    // 设置面包屑是否显示
    setTagsViewBreadcrumbGlobal(state,val) {
      state.globalTagsViewBreadcrumb = val;
    },
    // 设置是否显示LOGO
    setSliderLogoGlobal(state,val) {
      state.globalSliderLogo = val;
    },
    // app-content 主体区域跟随侧边栏变化
    setAppContentWidth(state,val) {
      state.appContentWidth = val;
    },
    // 设置头部logo显示隐藏
    setIsHeaderLogo(state,val) {
      state.isHeaderLogo = val;
    },
    // 侧边栏slider列表数据
    getGlobalNavList(state,list) {
      state.globalNavList = list;
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
        state.postTableData = res.data.data;
        setTimeout(() => {
          state.tableLoading = false;
        }, 500)
      })
    },
    // 修改tableData数据
    setPostTableData(state, list) {
      state.postTableData = list
    },

    // 修改全局当前用户信息
    setGlobalUserInformation(state, obj) {
      if (obj) {
        state.globalUserInformation = obj;
      }
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
    // 修改全局当前用户信息
    setGlobalUserInformation({
      commit
    }, obj) {
      commit('setGlobalUserInformation', obj)
    },
  }
})


// this.$store.commit("addStore",1)   // 修改全局状态
// console.log(this.$store.state.store) // 获取全局状态
// console.log(this.$store.getters.getStore) // 获取全局状态
