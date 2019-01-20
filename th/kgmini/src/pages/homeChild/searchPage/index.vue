<template>
    <div class="page">
      <div class="top">
       <div class="search-box">
         <div class="content">
           <div class="search">
             <img class="search-icon" src="/static/img/main/search_icon.png" alt="">
             <input v-if="!isH5"  type="text" v-model="searchValue" confirm-type="搜索" focus="true" placeholder="搜索你想要的内容" @confirm="searchData">
             <input v-if="isH5" v-model="searchValue"  type="text" confirm-type="搜索" placeholder="搜索你想要的内容" @keyup.enter="searchData">
           </div>
         </div>
         <!--<button class="btn" @click="handleSearch">取消</button>-->
       </div>

        <ListTab :text="tabsText" :status.sync="type"/>
      </div>


      <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                   lower-threshold="30">
        <template v-if="type===0">
          <CurriculumItem :info="item" v-for="item in list" :key="item.id" @toDetail="toDetail" />
        </template>
        <template v-else-if="type===1">
          <InstitutionItem :info="item" v-for="item in list" :key="item.id" @detail="toDetail" />
        </template>
      </scroll-view>
    </div>
</template>

<script>
  import ListTab from "@/components/style/listTab";
  import CurriculumItem from '@/components/global/curriculumItem'
  import InstitutionItem from '@/components/global/institutionItem'
  import { getAllCurriculumListLibrary } from "../../../service/home/curriculum";
  import { getMechanismList } from "../../../service/tabs/home";
  import store from '../../store/store'
    export default {

    name: "index",
    components: {
      ListTab,
      CurriculumItem,
      InstitutionItem
    },
    computed: {
      location: function() {
        return store.state.location;
      }
    },
    data: function(){
      return {
        searchValue: '',
        tabsText: ["课程", "机构"],
        type: 0,
        page: 0,
        size: 8,
        loading: true,
        list: [],
      }
    },
    watch: {
      type: function() {
        this.check();
      }
    },
    onLoad: function(){
      Object.assign(this.$data, this.$options.data());
      this.searchData();
    },
    methods: {
      searchData: function() {
        this.check();
      },

      check: function() {
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
          let data = {};
          if(this.type === 0){
            data = await getAllCurriculumListLibrary({
              pageNo: this.page, pageSize: this.size, name: this.searchValue,orgType: 0
            });
          }else{
            data = await getMechanismList({
              pageNo: this.page, pageSize: this.size, name: this.searchValue,lng: this.location.longitude, lat: this.location.latitude
            });
          }
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.list = this.list && this.list.map(i=>{
            i.star = i.commentStar&&i.commentStar.toFixed(1).toString() || '0.0';
            if(parseInt(i.commentStar) == i.commentStar){
              i.count = 5 - parseInt(i.commentStar)
            }else {
              i.count = 4 - parseInt(i.commentStar);
            }
            i.commentStarNew = parseInt(i.commentStar);
            return i;
          })
          this.loading = Number(data.list.length) < Number(this.size);
          if (!this.list.length) {
            this.type === 0&&this.$toast("暂无课程");
            this.type === 1&&this.$toast("暂无机构");
          }
        } catch (e) {
          this.loading = false;
        }

      },


      handleCancel: function() {
        this.navigateBack({});
      },
      toDetail: function( id,orgId) {
        switch (this.type) {
          case 0:
            this.navigateTo({
              url: "/pages/homeChild/curriculumDetail/main?id=" + id
            });
            break;
          case 1:
            this.navigateTo({
              url: "/pages/homeChild/institutionInfo/main?id=" + id +'&orgId=' + orgId
            });
            break;
        }
      },
    }
  };
</script>

<style scoped lang="scss">

  .scroll-view {
    box-sizing: border-box;
    height: 100vh;
    padding-top: rpx(180);
    background-color: #fff;
  }
  .top{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background-color: #fff;
    padding-bottom: rpx(20);
  }
  .search-box{
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-space-between;
    padding-top: rpx(20);
    margin-bottom: rpx(20);
  }
  .content {
    margin-left: rpx(30);
    height: rpx(70);
    line-height: rpx(70);
    position: relative;
    width: rpx(690);
    .search {
      border-radius:rpx(35);
      margin:0 auto;
      height: rpx(70);
      width: rpx(690);
      background-color: #FFF9D9;
      @extend %flex;
      @extend %flex-align-center;
      input {
        font-size: rpx(30);
        width: rpx(450);
      }
    }
    .search-icon {
      margin: 0 rpx(30);
      width: rpx(35);
      height: rpx(35);
    }
  }
  .icon {
    display: inline-block;
    width: rpx(30);
    height: rpx(30);
    margin-left: rpx(30);
    margin-right: rpx(22);
    vertical-align: middle;
  }
  span {
    font-size: rpx(32);
    vertical-align: middle;
    font-weight: bold;
  }
  .btn {
    border-radius: rpx(6);
    font-size: rpx(28);
    width: rpx(120);
    height: rpx(54);
    line-height: rpx(54);
    text-align: center;
    float: right;
    margin-right: rpx(30);
    @include gradientToRight()
  }
</style>
