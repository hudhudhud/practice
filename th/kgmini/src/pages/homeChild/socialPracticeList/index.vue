<template>
  <div>
    <div class="top">
      <Search :search.sync="search" @searchChange="searchChange"></Search>
      <ListTabbar :actives.sync="actives" :tabs="tabs"/>
    </div>

    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <div class="relative" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
        <div class="item">
          <img class="main-img" :src="item.logoUrl || defaultSrc" alt="">
          <div style="flex:1" class="info">
            <p class="name flow">{{item.name}}</p>
            <p class="intro">{{item.briefIntro}}</p>
            <p class="address">
              <img src="/static/img/util/distance.png" alt="">
              <span>{{item.address}}</span>
              <!--<span class="price">¥ 1220</span>-->
            </p>
          </div>
        </div>
        <div class="school-label" :class="types[item.board]" v-if="item.board">{{item.board}}</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import Search from "@/components/global/search";
  import ListTabbar from "@/components/home/listTabbar";
  import { listActivityTypes, practiseBaseList } from "../../../service/home/socialPractice";

  export default {

    name: "index",
    components: {
      ListTabbar,
      Search
    },
    data: function() {
      return {
        types: {
          "红榜": "red",
          "黑榜": "black",
          "白榜": "white"
        },
        activityType: [],
        search: "",
        actives:{},
        tabs: [],
        page: 0,
        size: 10,
        loading: true,
        list: [],
      };
    },
    computed: {
      screenAll: function() {
        return this.activityType.map(i => {
          return i.label;
        });
      },
      defaultSrc:function() {
        return this.getDefaultImg('practiseLogo')
      }
    },
    watch: {
      actives: function() {
        this.check();
      }
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.getActivityType();
      this.check();
    },
    methods: {
      searchChange: function(s) {
        //this.search = s;
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
        let natures = Object.keys(this.actives);
        natures = natures.filter(i => {
          return this.actives[i];
        }).join(",");
        let params = { pageNo: this.page, pageSize: this.size,
          typeIds: natures };
        if(this.search){
          params.name = this.search;
        }
        try {
          const data = await practiseBaseList(params);
          if (this.page === 1) {
            this.list = data.list;
            if (!this.list.length) {
              return this.$toast("暂无实践基地");
            }
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      },
      toDetail: function(id) {
        this.navigateTo({
          url: "../socialPracticeInfo/main?id="+id
        });
      },
      getActivityType: async function() {
        this.activityType = await listActivityTypes();
        if(this.activityType.length){
          this.tabs = this.activityType.map(i => {
            i.termName = i.label;
            i.id = i.value
            return i;
          });
        }
      },
    }
  };
</script>

<style scoped lang="scss">



  .screen {
    height: rpx(70);
    @extend %flex;
    @extend %justify-content-center;
    @extend %flex-align-center;
    .screen-item {
      margin: 0 rpx(65);
    }
    font-size: rpx(26);
    color: #5c5c5c;
  }

  .top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 100;
  }

  .scroll-view {
    box-sizing: border-box;
    height: 100vh;
    padding-top: rpx(185);
    background-color: #fff;
  }
  .item {
    box-sizing: border-box;
    padding: rpx(40) 0;
    margin: 0 rpx(30);
    border-bottom: 1px solid $border;
    @extend %flex;
    @extend %flex-align-center;
    .name {
      font-size: rpx(30);
      line-height: rpx(30);
      color: #313131;
      font-weight: bold;
    }
    .flow {
      max-width:rpx(400);
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      word-break:keep-all;
      display:block;
    }
    .intro {
      margin-top: rpx(20);
      margin-bottom: rpx(20);
      width: rpx(400);
      max-height: rpx(108);
      font-size: rpx(22);
      line-height: rpx(27);
      color: #9A9A9A;
      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
    }
    .date {
      font-size: rpx(22);
      line-height: rpx(22);
      margin-bottom: rpx(20);
      color: #5C5C5C;
    }
    .address {
      width: 100%;
      img {
        width: rpx(22);
        height: rpx(26);
        margin-right: rpx(11);
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
      }
      line-height: rpx(22);
      font-size: rpx(22);
      color: #5C5C5C;
      .price {
        float: right;
        font-size: rpx(30);
        color: $subThem-red;
      }
    }
  }

  .school-label {
    top: rpx(40);
  }

  .main-img {
    width: rpx(160);
    height: rpx(160);
    margin-right: rpx(20);
  }

  .relative:last-of-type {
    .item {
      border-bottom: none;
    }
  }

</style>
