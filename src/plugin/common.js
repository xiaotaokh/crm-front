
export default {
    install (Vue, options) {
        // 全局获取表格数据
        Vue.prototype.$aaa = function (a, b) {
            console.log(a+b)
        }
    }
}

// 使用：this.$aaa