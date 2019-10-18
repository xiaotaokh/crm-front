import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    // 全局管理的状态  定义
    state: { 
      store: 0,   // 测试store
      breadcrumb: [],   // 面包屑
      tableLoading: true,   // 表格全局loading加载
      postTableData:[],    // 全局post请求 数据
    },
    // 获取
    getters: {
        // 测试store
        getStore(state) {
            return state.store
        },
        // 测试store
        getBreadcrumb(state) {
            return state.breadcrumb
        }
    },
    // 修改
    mutations: {
        // 测试store
        addStore (state,num) {
            state.store = state.store + num;
        },
        // 修改面包屑breadcrumb
        editBreadcrumb (state,breadcrumb) {
            state.breadcrumb = breadcrumb;
        },
        // 修改tableLoading
        editTableLoading (state,tableLoading) {
            state.tableLoading = tableLoading;
        },
        // 全局post请求
        postTableData(state,url,formData) {
            state.tableLoading = true;
            Vue.prototype.$axios.post(url,formData).then(res => {
                setTimeout(()=> {
                    state.tableLoading = false;
                },300)
                state.postTableData = res.data;
            })
        }
    },
    // 修改  判断commit哪个mutations
    actions: {
        // 全局post请求
        postTableData({ commit },url,formData) {
            commit('postTableData',url,formData)
        },
    }
})


// this.$store.commit("addStore",1)   // 修改全局状态
// console.log(this.$store.state.store) // 获取全局状态
// console.log(this.$store.getters.getStore) // 获取全局状态
