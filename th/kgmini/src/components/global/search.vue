<template>
    <div class="box">
        <div class="search">
          <img src="/static/img/component/saerch.png" alt="">
          <input v-if="!isH5" :value="search"  type="text" confirm-type="搜索" placeholder="搜索你想要的内容" @confirm="searchChange">
          <input v-if="isH5" :value="search"  type="text" confirm-type="搜索" placeholder="搜索你想要的内容" @keyup.enter="searchChange">
        </div>
    </div>
</template>

<script>
  export default {
    name: "search",
    props: {
      search: {
        type: String,
        default: ''
      },
    },
    data: function() {
      return {

      }
    },
    onShow:function(){
      this.search = '';
      Object.assign(this.$data, this.$options.data());
    },
    methods: {
      searchChange: function(e) {
      //  this.search = e.target.value;
        this.$emit('update:search', e.target.value);
        this.$emit('searchChange', e.target.value);
      }
    }
  };
</script>

<style scoped lang="scss">

  .box{
    padding: rpx(20) 0;
    background-color: #fff;
  }
  .search{
    border-radius: rpx(35);
    margin: 0 auto;
    width: rpx(690);
    height: rpx(70);
    background-color: #FFF9D9;
    @extend %flex;
    @extend %flex-align-center;
    img{
      margin: 0 rpx(30);
      width: rpx(35);
      height: rpx(35);
    }
    input{
      font-size: rpx(30);
    }
  }
</style>
