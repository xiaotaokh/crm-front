
export default {
    install (Vue, options) {
        // 全局获取表格数据
        Vue.prototype.$aaa = function (url, formData) {
            console.log(123)
        }
    }
}

// 使用：this.$aaa