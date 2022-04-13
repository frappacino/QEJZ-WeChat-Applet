import Vue from 'vue'
import App from './App'

// 自己挂载到全局
import {myRequest} from './util/api.js'
Vue.prototype.$myRuquest = myRequest

import {formatDate} from './util/date.js'
Vue.prototype.$myformatDate = formatDate

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
