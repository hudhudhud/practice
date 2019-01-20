<template>
  <div class="checkbox" :class="{gray: !check}" @click="checkChange">
    <div class="white">
      <div class="red" v-show="check"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "checkbox",
    props: ["check"],
    methods: {
      checkChange: function() {
        this.$emit("update:check", !this.check);
      }
    }
  };
</script>

<style scoped lang="scss">


  %repeat {
    overflow: hidden;
    border-radius: 50%;
  }

  .checkbox {
    vertical-align: middle;
    @extend %repeat;
    display: inline-block;
    width: rpx(44);
    height: rpx(44);
    background-color: $subThem-red;
  }

  .checkbox.gray {
    background-color: #D7D7D7;
  }

  .white {
    @extend %repeat;
    margin: rpx(6) auto;
    width: rpx(32);
    height: rpx(32);
    background-color: #fff;
  }

  .red {
    @extend %repeat;
    margin: rpx(6) auto;
    background-color: $subThem-red;
    width: rpx(20);
    height: rpx(20);
  }
</style>
