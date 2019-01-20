// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from "vue";
import Vuex from "vuex";
import { clearItem, getItem, setItem } from "../../utils/localStorage";
import { loginData } from "../../utils/variable";
import { getUserInfo } from "../../service/auth";
import { defaultOptions } from "../../service/httpRequest";
import { teacherDetail } from "../../service/teacher/main";
import { partnerDetail } from "../../service/tabs/home";
import axios from "axios";


Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loginData: {},//登录信息
    userInfo: {},// 个人详情
    location: getItem('location')||{},// 位置信息
    curriculumOrder: getItem('curriculumOrder'), // 订单-课程信息
    role: "1", // 1家长  2老师
    partnerDetail: {}, // 教育局信息
  },
  mutations: {
    saveLogin: (state, payload) => {
      state.loginData = payload;
      defaultOptions.header.randomKey = payload.userKey;
      axios.defaults.headers.post["token"] = payload.token;
      setItem(loginData, state.loginData);
    },
    saveUser: (state, payload) => {
      state.userInfo = payload||{};
      state.userInfo.widgets = state.userInfo.widgets||[];
     // state.widgets = payload.widgets;
    },
    saveLocation: (state, payload) => {
      state.location = payload;
      setItem('location', payload);
    },
    saveCurriculum: (state, payload) => {
      state.curriculumOrder = payload;
      setItem('curriculumOrder', payload);
    },
    saveRole: (state, payload) => {
      state.role = String(payload);
      setItem('loginRole', payload);
    },
    logout: (state, payload) => {
      state.userInfo = {};
      state.loginData = {};
      state.curriculumOrder = {};
      state.role = '1';
      clearItem(loginData);
      clearItem('curriculumOrder');
     defaultOptions.header.randomKey = '';
    },
    savePartner: (state, payload) => {
      state.partnerDetail = payload;
    }
  },
  actions: {
    /**
     * 获取 个人信息详情
     */
    async getUserInfo({ state, commit, dispatch }, payload) {
      let data  = {}; // teacherDetail
      if(state.role === '1'){
        data = await getUserInfo({ id: state.loginData.userId });
      }else{
        data = await teacherDetail({ id: state.loginData.userId });
      }
      console.log(data);
      commit("saveUser", data);
      console.log({ ...state.loginData, ...state.userInfo });
    },
    /**
     * 获取教育局信息
     */
    async getPartnerDetail({ state, commit, dispatch }, payload) {
      const data = await partnerDetail();
      commit('savePartner', data);
    },
    /**
     * 如果没有绑定子女  ，弹窗 提示
     */
    isBindChild({ state, commit, dispatch }, payload) {
      if (state.userInfo.childCount === undefined) {
        setTimeout(() => {
          dispatch("isBindChild");
        }, 3000);
        return;
      }
      if (!state.userInfo.childCount) {
        Vue.prototype.$showModal({
          title: "绑定子女",
          content: "请绑定子女",
          cancelText: "取消",
          confirmText: "立即绑定",
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/featureList/sub/childManage/searchChild/main"
              });
            }
          }
        });
      }
    }
  }
});

export default store;
