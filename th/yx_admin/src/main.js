import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'flex.css'
import 'element-ui/lib/theme-chalk/index.css'
import HtAdmin from 'htadmin-form'
import baseTable from './components/baseTable'
import 'font-awesome/css/font-awesome.css'

Vue.use(HtAdmin);
Vue.use(ElementUI);
Vue.use(baseTable);
Vue.config.productionTip = false


axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout=5000

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
