<template>
  <div>
    <ChildManage btn="确认添加" @btnClick="add" :info="info"></ChildManage>
  </div>
</template>

<script>
  import ChildManage from "@/components/feature/childManage"
  import { getItem } from "../../../../../utils/localStorage"
  import { bindParent } from "../../../../../service/featureList/child"
  import store from '@/pages/store/store'
    export default {

    name: "index",
    components: {
      ChildManage
    },
    data: function(){
      return {
        info: {}
      }
    },
    onLoad: function(){
      Object.assign(this.$data, this.$options.data());
     this.info =  getItem('childInfo');
    },
    methods: {
      add:async function() {
        await bindParent({id: this.info.id}, {load: true,successMsg:'绑定成功'});
        store.dispatch('getUserInfo');
       setTimeout(() => {
         this.navigateBack({
           delta: 2
         });
       }, 1500)
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
