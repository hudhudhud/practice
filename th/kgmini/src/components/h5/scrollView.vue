<template>
    <div
      class="h5-view" :class="{'scroll-y': scrollY==='true', 'scroll-x': scrollX==='true'}"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-immediate-check="false"
      auto-fill="false"
      infinite-scroll-distance="30"
    >
      <slot></slot>
    </div>
</template>

<script>
  export default {
    name: "scrollView",
    props: {
      'scroll-y': String,
      'scroll-x': String,
      'enable-back-to-top': String
    },
    methods: {
      loadMore: function() {
        this.$emit('scrolltolower');
      }
    }
  };
</script>

<style scoped lang="scss">

  .h5-view{

  }
  .scroll-y{
    overflow-y: auto;
  }
  .scroll-x{
    overflow-x: scroll;
  }
</style>
