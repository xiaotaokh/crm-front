/**
 * 所有的组件统一全局注册
 */

import appHeader from './app-header'
import appSidebar from './app-sidebar'
import appSearch from './app-search'
import breadcrumb from './breadcrumb'
import appPagination from './app-pagination'

const Components = {
	install: function (Vue) {
		Vue.component('app-header', appHeader)
		Vue.component('app-sidebar', appSidebar)
		Vue.component('app-search', appSearch)
		Vue.component('app-breadcrumb', breadcrumb)
		Vue.component('app-pagination', appPagination)
	}
}
export default Components
