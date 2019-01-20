import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'flex.css'
import 'element-ui/lib/theme-chalk/index.css'
import HtAdmin from 'htadmin-form'

Vue.use(HtAdmin);
Vue.use(ElementUI);
Vue.config.productionTip = false


axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
axios.defaults.headers.post['Content-Type'] = 'application/json';

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
