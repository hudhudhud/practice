<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { setItem } from "./utils/localStorage";

  export default {
    name: "App",
    created: function() {
      let address = this.getUrlParam("address");
      if (address) {
        address = decodeURIComponent(address);
      } else {
        address = "浙江省_杭州市_滨江区";
      }
      setItem("re-address", address);
    },
    methods: {
      getUrlParam: function(name) {
        let r = window.location.href.match(/[\?&]\w+=[%\w]+/g);
        if (!r) {
          return null;
        }
        const data = r.find(i => {
          return i.substr(1).split("=")[0] === name;
        });
        if (data) {
          return data.split("=")[1];
        }
        return null;
      }
    }
  };
</script>

<style lang="scss">
  @import "utils/public.scss";

  * {
    margin: 0;
    padding: 0;
    border: none;
  }

  body {
    font-family: PingFangSC-Medium, "Microsoft YaHei";
    //  font-weight: 100;
    font-size: rpx(12);
    background-color: #EFEFEF;
    overflow-y: auto;
    color: #999999;
  }

  h1 {
    font-weight: 200;
  }

  html,
  body,
  div,
  p, h1 {
    border: 0;
    margin: 0;
    padding: 0;
  }

  input, select {
    -webkit-appearance: none;
  }

  strong {
    font-weight: normal;
  }

  button {
    display: block;
  }

  em,
  i {
    font-style: normal;
  }

  ul,
  ol,
  li {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  @import "./App.scss";

  .page {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
    background-color: #fff;
  }

  input {
    height: rpx(45);
    background-color: transparent;
  }
  textarea{
    width: 100%;
    min-height: rpx(250);
    background-color: transparent;
  }

  a {
    text-decoration: none;
    display: block
  }

  .layui-laydate {
    width: 100%;
    //height: rpx(664);
    .layui-laydate-main {
      width: 100%;
    }
    table {
      width: 100%;
      height: rpx(530);
    }
  }

  /**
   * 上下出现转场
   */
  .material-transition {
    box-sizing: border-box;
  }

  .material-transition-enter-active {
    z-index: 100;
    pointer-events: none;
    -webkit-animation: pageFromBottomToCenter .3s ease-out;
    animation: pageFromBottomToCenter .3s ease-out;
  }

  .material-transition-leave-active {

  }

  @keyframes pageFromBottomToCenter {
    from {
      opacity: 0;
      transform: translate3d(0, 56px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes pageFromCenterToBottom {
    from {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
    to {
      opacity: 0;
      transform: translate3d(0, 56px, 0);
    }
  }
</style>
