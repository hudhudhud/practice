<template>
  <div class="page">
    <div class="top">
      <Search :search.sync="search" @searchChange="searchChange"/>
      <ListTabbar :actives.sync="actives" :tabs="tabs"/>
    </div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">

      <CurriculumItem :info="item" v-for="item in list" :key="item.id" @toDetail="toDetail" />

    </scroll-view>
  </div>
</template>

<script>
  import Search from "@/components/global/search";
  import ListTabbar from "@/components/home/listTabbar";
  import CurriculumItem from "@/components/global/curriculumItem";
  import { getAllCurriculumList, getAllCurriculumListLibrary } from "../../../service/home/curriculum";
  import { listFirst } from "../../../service/tabs/nearby";

  export default {

    name: "index",
    components: {
      Search,
      ListTabbar,
      CurriculumItem
    },
    data: function() {
      return {
        tabs: [],
        firstList: [],
        actives: {},
        page: 0,
        size: 10,
        loading: true,
        list: [],
        search: ""
      };
    },
    watch: {
      actives: function() {
        this.check();
      }
    },
    onShow:function(){
      this.search = '';
      // this.getListFirst();
      // this.check();
      this.actives = {};
    },
    onLoad: function() {
      this.getListFirst();
      this.actives = {};
      // this.check();
    },
    methods: {
      getListFirst: async function() {
        const data = await listFirst();
        this.firstList = data.list;
        this.tabs = this.firstList.map(i => {
          return i;
        });

      },
      searchChange: function(s) {
       // this.search = s;
        this.check();
      },
      check: function(n = this.actives) {
        this.actives = n;
        this.list = [];
        this.loading = false; // 重新开启监听
        this.page = 0;
        this.loadMore();
      },
      loadMore: function() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        this.page++;
        this.getList();
      },
      getList: async function() {
        try {
          let natures = Object.keys(this.actives);
          natures = natures.filter(i => {
            return this.actives[i];
          }).join(",");
          const data = await getAllCurriculumListLibrary({
            pageNo: this.page, pageSize: this.size, name: this.search,orgType: 0,
            termTaxonomyIds: natures
          });
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);
          if (!this.list.length) {
            this.$toast("暂无课程");
          }
        } catch (e) {
          this.loading = false;
        }

      },
      toDetail: function(id) {
        this.navigateTo({
          url: "../curriculumDetail/main?id="+id
        });
      }
    }
  };
</script>
<style>
  page {
    background-color: #fff;
  }
</style>

<style scoped lang="scss">



  .scroll-view {
    box-sizing: border-box;
    height: 100vh;
    padding-top: rpx(180);
  }

  .top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color:#fff;
  }


</style>
