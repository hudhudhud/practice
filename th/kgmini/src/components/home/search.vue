<template>
  <div class="search-box">
    <div class="address" :class="{open: searchShow}">
      <div class="content">
        <template v-if="!searchShow">
          <img class="icon" src="/static/img/main/raduis.png" alt="">
          <span>{{partner.eduBureauName}}</span>
        </template>

        <!--<div class="search" :class="{hide: !searchShow}">-->
          <!--<img class="search-icon" src="/static/img/main/search_icon.png" alt="">-->
          <!--<input v-if="searchShow" type="text" v-model="searchValue" confirm-type="搜索" focus="true" placeholder="搜索你想要的内容" @confirm="searchData">-->
        <!--</div>-->
      </div>
      <button class="btn" @click="handleSearch">{{searchShow?"取消":"搜索"}}</button>
    </div>
   <!-- <scroll-view scroll-y="true" @scrolltolower="loadMore"
                 lower-threshold="30" class="result search-fixed" :class="{open: searchShow}">
      <CurriculumItem v-for="item in list" :key="item.id" :info="item" @toDetail="toDetail(0,$event)"/>
    </scroll-view>-->
  </div>

</template>

<script>
  import { searchInfo } from "../../service/tabs/home";
  import CurriculumItem from "@/components/global/curriculumItem";
  import store from "../../pages/store/store";

  export default {
    name: "search",
    components: {
      CurriculumItem
    },
    data: function() {
      return {
        searchShow: 0, // 0 未搜索， 1 是搜索状态
        searchValue: "",
        page: 0,
        size: 7,
        loading: true,
        list: []
      };
    },
    onHide: function(){
      this.searchShow = 0;
    },
    computed: {
      partner: function() {
        return this.$store.state.partnerDetail;
      }
    },
    methods: {
      toDetail: function(type, id) {
        switch (type) {
          case 0:
            this.navigateTo({
              url: "/pages/homeChild/curriculumDetail/main?id=" + id
            });
            break;
          case 1:
            this.navigateTo({
              url: "/pages/homeChild/institutionInfo/main?id=" + id
            });
            break;
        }
      },
      searchData: function() {
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
          const data = await searchInfo({ pageNo: this.page, pageSize: this.size });
          console.log(data);
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      },
      handleSearch: function() {
        //修改
       /* if (!this.searchShow) {
          Object.assign(this.$data, this.$options.data());
          this.searchShow = 1;
        } else {
          this.searchShow = 0;
        }*/
       this.navigateTo({
         url: '/pages/homeChild/searchPage/main'
       })
      }
    }
  };
</script>

<style scoped lang="scss">

  @import "../../utils/animation";

  .search-box {
    height: rpx(100);
  }

  .search-fixed {
    padding-top: rpx(100);
    display: none;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    background-color: #fff;
  }

  .search-fixed.open {
    display: block;
  }

  .address.open {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 51;
  }
  .result {
    animation: result-show .3s ease-out;
  }
  .address {
    margin-top: rpx(30);
    height: rpx(70);
    color: #000;
    @extend %flex;
    @extend %flex-align-center;
    .content {
      height: rpx(70);
      line-height: rpx(70);
      position: relative;
      width: rpx(600);
      .search {
        height: rpx(70);
        overflow: hidden;
        @include transition(width .3s ease-out);
        z-index: 10;
        position: absolute;
        right: rpx(30);
        top: 0;
        width: rpx(540);
        background-color: #FFF9D9;
        border-radius: rpx(35);
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
      .search.hide {
        width: 0;
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
  }
</style>
