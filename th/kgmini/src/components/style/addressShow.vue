<template>
  <div class="address">
    <div class="info">
      <div class="address-test" @click="toMap">
        <img src="/static/img/util/distance.png" alt="">
        <span>{{address}}</span>
      </div>
      <div>
        <span class="arrow-right vertical-align">优惠</span>
        <span class="vertical-align">免费试听（详情请咨询）</span>
      </div>
    </div>
    <div class="icon" @click="callPhone">
      <img src="/static/img/util/callPhone.png" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: "addressShow",
    props: ['address', 'phone',"info"],
    methods: {
      callPhone: function() {
        this.makePhone(this.phone)
      },
      toMap:function() {
        this.$emit("map",this.address,this.info.lat,this.info.lng,this.info.name);
      }
    }
  };
</script>

<style scoped lang="scss">

.address {
  height: rpx(166);
  background-color: #fff;
  margin-top: rpx(20);
  @extend %flex;
  @extend %flex-align-center;
  @extend %justify-content-space-between;
  font-size: rpx(28);
  line-height: rpx(28);
  color: #5B5B5B;
  padding: 0 0 0 rpx(30);
  .address-test {
    margin-bottom: rpx(28);
    font-size: rpx(32);
    line-height: rpx(32);
    color: #313131;
    img {
      vertical-align: middle;
      width: rpx(22);
      height: rpx(26);
    }
    span {
      vertical-align: middle;
    }
  }
  .icon {
    border-left: rpx(4) solid #F2F2F2;
    border-radius: rpx(2) 0 0 rpx(2);
    width: rpx(130);
    height: rpx(80);
    img {
      margin: rpx(15) auto;
      display: block;
      width: rpx(46);
      height: rpx(51);
    }
  }
}
</style>
