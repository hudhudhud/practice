<template>
  <div class="page">
    <div class="fixed-box" :class="{open: selectStatus}" @click="handleSelectClick({})">
      <div class="fixed-top" @click.stop="">
        <Search :search.sync="name" @searchChange="searchChange"/>
        <ListTab :text="tabs" :status="active" @update:status="selectCheck"/>
      </div>
      <TabSelect :tab-active="active" :selectStatus="selectStatus" @handleClick="handleSelectClick"/>
    </div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
        <InstitutionItem @detail="detail" :info="item" v-for="item in list" :key="item.id"></InstitutionItem>
    </scroll-view>
  </div>
</template>

<script>
  import Search from "@/components/global/search";
  import ListTab from "@/components/style/listTab";
  import InstitutionItem from "@/components/global/institutionItem";
  import TabSelect from "./tabSelect";
  import { nearbyList } from "../../service/tabs/nearby";
  import store from "../store/store";

  export default {

    name: "index",
    components: {
      Search,
      ListTab,
      InstitutionItem,
      TabSelect
    },
    data: function() {
      return {
        tabs: ["附近", "评分", "属性", "筛选"],
        active: 0,
        selectStatus: 0, //
        page: 0,
        size: 10,
        loading: true,
        list: [],
        search: undefined,
        name: ''
      };
    },
    computed: {
      location: function() {
        return store.state.location;
      }
    },
    onHide: function() {
      this.selectStatus = 0;
    },
    destroyed: function(){
      this.selectStatus = 0;
    },
    onLoad: function() {
      this.check();
      this.active = 0;
    },
    methods: {
      searchChange: function(e){
        this.name = e;
        this.check();
      },
      selectCheck: function(n) {
        if ([2, 3].includes(n)) {
          if (([2, 3].includes(this.active) && this.active !== n && this.selectStatus)) {

          } else {
            this.selectStatus = this.selectStatus === 1 ? 0 : 1;
          }

        } else {
          this.selectStatus = 0;
          this.search = null;
          setTimeout(() => {
            this.check();
          })
        }
        this.active = n;
      },
      handleSelectClick: function(data) {
        this.selectStatus = 0;
        if (data.type === "ok") {
          // 得到数据
          this.search = data.search;
          this.check();
        }

      },
      detail: function(id,orgId) {
        this.navigateTo({
          url: "../homeChild/institutionInfo/main?id=" + id+'&orgId='+orgId
        });
      },
      check: function() {
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
        this.nearbyList();
      },
      /**
       * 获取 附近机构列表
       */
      nearbyList: async function() {
        if (!this.location.longitude) {
          this.loading = false;
          return this.$toast("无法获取位置信息");
        }
        try {
          let params = {
            pageNo: this.page, pageSize: this.size, lng: this.location.longitude, lat: this.location.latitude
          };
          if(this.name){
            params.name = this.name;
          }
          if (this.search) {
            params = Object.assign(params, this.search);
          }
          if (this.active === 1) {
            params.commentStarStatus = 1;
          }
          const data = await nearbyList(params);
          if (this.page === 1) {
            this.list = data.list.map(i=>{
              i.star = i.commentStar&&i.commentStar.toFixed(1).toString() || '0.0';
              if(parseInt(i.commentStar) == i.commentStar){
                i.count = 5 - parseInt(i.commentStar)
              }else {
                i.count = 4 - parseInt(i.commentStar);
              }
              i.commentStarNew = parseInt(i.commentStar);
              return i;
            });
            if (!this.list.length) {
              this.$toast("暂无机构");
            }
          } else {
            this.list = this.list.concat(data.list.map(i=>{
              i.star = i.commentStar&&i.commentStar.toFixed(1).toString() || '0.0';
              if(parseInt(i.commentStar) == i.commentStar){
                i.count = 5 - parseInt(i.commentStar)
              }else {
                i.count = 4 - parseInt(i.commentStar);
              }
              i.commentStarNew = parseInt(i.commentStar);
              return i;
            }));
          }

          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }

      }
    },
    onShow:function() {
      Object.assign(this.$data, this.$options.data());
      this.name='';
      this.active = 0;
      this.check();
    }
  };
</script>

<style scoped lang="scss">


  .fixed-box {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
  }

  .fixed-box.open {
    z-index: 100;
    height: 100vh;
    background-color: rgba(0, 0, 0, .5);
  }

  .fixed-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 11;
    background-color: #fff;
    padding-top: 1px;
    height: rpx(188);
  }

  .scroll-view {
    padding-top: rpx(188);
    height: 100vh;
    background-color: #fff;
  }
</style>


