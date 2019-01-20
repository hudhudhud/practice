import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store'
import axios from 'axios';

// 先全局引入 后面改成按需
import {Indicator, Toast, Lazyload, InfiniteScroll, MessageBox} from 'mint-ui'
import 'mint-ui/lib/style.css';

Vue.use(Lazyload);
Vue.use(InfiniteScroll);

// import fastclick from 'fastclick'
// fastclick.attach(document.body)

Vue.config.productionTip = false
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
// require("echarts/lib/chart/line");
// require("echarts/lib/chart/bar");
require("echarts/lib/chart/pie");
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
window.https = process.env.VUE_APP_BASE_API;


// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

Vue.prototype.$echarts = echarts;
Vue.prototype.$toast = Toast;
Vue.prototype.$messagebox = MessageBox;

import qs from 'qs';
function getRequestData(data, key) {
    let obj = {};
    try {
        obj = qs.parse(data);
    } catch (e) {
    }
        return obj[key] || ''
}

//http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.status === '-1') {
            router.replace({name: 'login'});
        }
        if (response.data.status === '-2') {
            store.commit('showAgreement', true);
        }
        let successMsg = getRequestData(response.config.data, 'successMsg');
        if (response.data.status === '0' && successMsg) {
            Toast(successMsg);
        }
        if (!getRequestData(response.config.data, 'load-always')) {
            Indicator.close();
        }
        return response;
    },
    error => {
        Indicator.close();
        return Promise.reject(error)
    }
)
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        // 聚焦元素
        el.focus()
    }
})
// 定义一个混入对象
export let utilMixin = {
    methods: {
        inputTypeOnlyNumber: function (e) {
            if (!/\w/.test(e.data)) {
                e.target.value = ((e.target.value || '').match(/\w+/) || [''])[0]
            }
        }
    }
}

import {
    Loadmore,
    Cell,
    Swipe,
    SwipeItem,
    Search,
    DatetimePicker,
    Actionsheet,
    Checklist,
    Radio,
    Picker,
    CellSwipe,
    Spinner,
    TabContainer,
    TabContainerItem,
    Tabbar,
    TabItem,
} from 'mint-ui';
import Back from '@/components/global/back'
import Username from '@/components/global/username'
import ToTop from '@/components/global/toTop'
import Fw from '@/components/global/followWe'

Vue.component(Loadmore.name, Loadmore);
Vue.component(Cell.name, Cell);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Search.name, Search);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Checklist.name, Checklist);
Vue.component(Radio.name, Radio);
Vue.component(Picker.name, Picker);
Vue.component(CellSwipe.name, CellSwipe);
Vue.component(Spinner.name, Spinner);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component('back-btn', Back);
Vue.component('user-name', Username);
Vue.component('to-top', ToTop)
Vue.component('f-w', Fw)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
