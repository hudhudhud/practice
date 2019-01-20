<template>
    <div class="page">
      <EvaluateList :tabs="['全部','评价最高', '评价最低']" hideTitle="1" type="3" />
    </div>
</template>

<script>
  import EvaluateList from '@/components/global/evaluateList'
    export default {

    name: "index",
    components: {
      EvaluateList
    },
    data: function(){
      return {

      }
    },
    methods: {

    }
  };
</script>

<style scoped>

</style>
<style>
  page {
    background-color: #fff;
  }
</style>
