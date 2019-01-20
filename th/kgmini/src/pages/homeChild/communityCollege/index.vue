<template>
  <div>
    <div class="top">
      <Search :search="search" @searchChange="searchChange"/>
    </div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <div class="selectTip">选择您想要报名的社区</div>
      <siteList :info="item" v-for="item in list" :key="item.id" @toDetail="toDetail" />

    </scroll-view>
  </div>
</template>

<script>
  import Search from "@/components/global/search";
  import siteList from "@/components/global/siteList";
  import { getCommunityCollegeList, getAllCurriculumListLibrary } from "../../../service/home/curriculum";
  import { listFirst } from "../../../service/tabs/nearby";
  import store from "../../store/store";

  export default {

    name: "index",
    components: {
      Search,
      siteList
    },
    data: function() {
      return {
        firstList: [],
        actives: [],
        page: 0,
        size: 10,
        loading: true,
        list: [],
        search: ""
      };
    },
    computed: {
      location: function() {
        return store.state.location;
      }
    },
    watch: {
      actives: function() {
        this.check();
      }
    },
    onShow:function(){
      Object.assign(this.$data, this.$options.data());
    },
    onLoad: function() {
      this.getListFirst();
      this.check();
    },
    methods: {
      getListFirst: async function() {
        const data = await listFirst();
        this.firstList = data.list;
        this.tabs = this.firstList.map(i => {
          return i.termName;
        });

      },
      searchChange: function(s) {
        //this.search = s;
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
        if (!this.location.longitude) {
          this.loading = false;
          return this.$toast("无法获取位置信息");
        }
        try {
          const data = await getCommunityCollegeList({
            pageNo: this.page, pageSize: this.size, name: this.search,
            lng: this.location.longitude, lat: this.location.latitude
          });
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);
          if (!this.list.length) {
            this.$toast("暂无学院");
          }
        } catch (e) {
          this.loading = false;
        }

      },
      toDetail: function(info) {
        this.navigateTo({
          url: "../../featureList/sub/communityCollegeList/main?type=communityCollege&orgId="+info.orgId+"&name="+info.name
        });
      }
    }
  };
</script>
<style>
  page {
    background-color: #EAEAEA;
  }

</style>

<style scoped lang="scss">



  .scroll-view {
    box-sizing: border-box;
    height: 100vh;
    margin-top: rpx(90);
    padding: 0 rpx(30);
  }

  .top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index:1;
  }
  .box {
    background-color:#EAEAEA;
  }
  .selectTip {
    font-size: rpx(26);
    color: #9a9a9a;
    margin-top: rpx(40);
    padding:0 rpx(31);
    box-sizing:border-box;
  }


</style>
