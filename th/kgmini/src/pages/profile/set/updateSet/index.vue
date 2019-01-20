<template>
  <div class="page">
    <div class="infos">
      <a class="item" @click="navigateTo('/pages/profile/set/aboutMine/main')"><label>关于我们</label><img class="icon-right" src="/static/img/util/iconRight.png" alt=""></a>
      <a class="item" @click="navigateTo('/pages/profile/set/updatePsw2/main?type=1')"><label>修改密码</label><img class="icon-right"
                                                                        src="/static/img/util/iconRight.png" alt=""></a>
      <a class="item"><label>版本号</label><span>1.0.0</span></a>
    </div>
    <div class="logout" @click="logout">
      退出登录
    </div>
  </div>
</template>

<script>
  import { loginout } from "../../../../service/auth";
  import store from '../../../store/store'
    export default {

    name: "index",
    onLoad: function() {

    },
    methods: {
      logout: function() {
        this.$showModal({
          title: "提示",
          content: "是否退出登录?",
          success: async (res) => {
            if (res.confirm) {
              await loginout();
              store.commit('logout');
              this.reLaunch({
                url: "/pages/auth/login/main"
              });
            }
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  .infos {
    padding: 0 rpx(30);
  }

  .icon-right {
    margin-left: rpx(26);
    vertical-align: middle;
    width: rpx(13);
    height: rpx(23);
  }

  .item {
    margin: rpx(35) 0;
    height: rpx(50);
    line-height: rpx(50);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-space-between;
    label {
      color: #313131;
      font-size: rpx(30);
      font-weight: bold;
    }
    span {
      vertical-align: middle;
      font-size: rpx(26);
      color: #9A9A9A;
    }
  }

  .logout {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: $them;
    width: 100%;
    font-weight: bold;
    height: rpx(100);
    line-height: rpx(100);
    text-align: center;
    font-size: rpx(32);
    color: #000;
  }
</style>
<style>
  page {
    background-color: #fff;
  }
</style>
