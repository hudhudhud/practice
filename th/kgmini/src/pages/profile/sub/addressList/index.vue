<template>
  <div>
    <div class="address" v-for="item in list" :key="item.id">
      <div class="address-info">
        <p class="text">杭州市西湖区阿拉盯神瞪大厦</p>
        <p>B座1888号</p>
      </div>
      <div class="icon">
        <img src="/static/img/profile/edit.png" alt="">
      </div>
    </div>

    <div class="submit-btn" @click="add">添加地址</div>
  </div>
</template>

<script>
  import { getAddressList } from "../../../../service/profile/address";

  export default {

    name: "index",
    data: function() {
      return {
        list: []
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
    },
    onShow: function() {
      this.getList();
    },
    methods: {
      getList: async function() {
        ({ list: this.list } = await getAddressList());
      },
      add: function() {
        wx.chooseAddress({
          success (res) {
            console.log(res.userName)
            console.log(res.postalCode)
            console.log(res.provinceName)
            console.log(res.cityName)
            console.log(res.countyName)
            console.log(res.detailInfo)
            console.log(res.nationalCode)
            console.log(res.telNumber)
          }
        })
      }
    }
  };
</script>

<style scoped lang="scss">


  .address {
    background-color: #fff;
    white-space: nowrap;
    font-size: 0;
    padding: rpx(30) 0;
    margin-top: rpx(20);
    .address-info {
      vertical-align: middle;
      display: inline-block;
      width: 70vw;
      box-sizing: border-box;
      padding-left: rpx(30);
      font-size: rpx(26);
      line-height: rpx(26);
      color: #9a9a9a;
      .text {
        margin-bottom: rpx(29);
        font-size: rpx(30);
        line-height: rpx(30);
        color: #313131;
      }
    }
    .icon {
      vertical-align: middle;
      box-sizing: border-box;
      padding-right: rpx(31);
      display: inline-block;
      width: 30vw;
      text-align: right;
      img {
        display: inline-block;
        width: rpx(46);
        height: rpx(46);
      }
    }
  }
</style>
