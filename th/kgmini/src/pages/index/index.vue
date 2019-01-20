<template>
    <div></div>
</template>

<script>
  import { getItem } from "../../utils/localStorage";
  import { loginData } from "../../utils/variable";
  import { defaultOptions } from "../../service/httpRequest";

  export default {

    name: "index",
    onLoad: function() {
      const data = getItem(loginData);
      if (data) {
        const role = getItem('loginRole');
        this.$store.commit("saveLogin", data);
        this.$store.commit('saveRole', role);
        if(!this.isH5)
        this.$store.dispatch('getUserInfo');
        if (String(role)==='2') {
          this.reLaunch({
            url: "/pages/teacher/profile/main"
          });
        }else {
          this.reLaunch({
            url: "/pages/home/main"
          });
        }
      } else {
        this.reLaunch({
          url: "/pages/auth/login/main"
        });
      }
      // 获取用户信息

    }
  };
</script>

<style lang="scss">

  page{
    background-color: #fff;
  }
</style>
