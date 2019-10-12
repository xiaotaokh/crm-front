import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    // 全局管理的状态  定义
    state: { 
      store: 0,   // 测试store
    },
    // 获取
    getters: {
        // 测试store
        getStore(state) {
            return state.store
        }
    },
    // 修改
    mutations: {
        // 测试store
        addStore (state,num) {
            state.store = state.store + num;
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
