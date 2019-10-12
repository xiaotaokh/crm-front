/**
 * 所有的组件统一全局注册
 */

import appHeader from './app-header'
import appSidebar from './app-sidebar'
import appSearch from './app-search'
import breadcrumb from './breadcrumb'

const Components = {
	install: function (Vue) {
		Vue.component('app-header', appHeader)
		Vue.component('app-sidebar', appSidebar)
		Vue.component('app-search', appSearch)
		Vue.component('app-breadcrumb', breadcrumb)
	}
}
export default Components
