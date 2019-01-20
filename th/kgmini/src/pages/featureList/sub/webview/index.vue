<template>
    <div>
      <web-view v-if="url" :src="url"></web-view>
      <div>
        正在跳转
      </div>
    </div>
</template>

<script>

  export default {

    name: "index",
    data: function() {
      return {
        url: ''
      }
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.url = decodeURIComponent(this.route().query.url);
    }
  };
</script>

<style scoped>

</style>
