import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    // 全局管理的状态  定义
    state: { 
      store: 0,   // 测试store
      breadcrumb: [],   // 面包屑
      tableLoading: false,   // 表格全局loading加载
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
        // 修改面包屑breadcrumb
        editTableLoading (state,tableLoading) {
            state.tableLoading = tableLoading;
        }
    },
    // 修改  判断commit哪个mutations
    actions: {
        // 测试store
        addStore(context) {
            setTimeout(() => {
                context.commit('addStore')
            }, 1000)
        },
    }
})


// this.$store.commit("addStore",1)   // 修改全局状态
// console.log(this.$store.state.store) // 获取全局状态
// console.log(this.$store.getters.getStore) // 获取全局状态
