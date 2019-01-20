<template>
  <div class="card" :class="{all: all}">
    <div class="load" v-if="load">
      <img src="/static/img/util/load.gif" alt="">
    </div>
    <div class="user" :class="{border: border,brief: brief}">
      <div class="head-img">
        <img class="img"
             :src="child.avatarUrl?(imageUrl+child.avatarUrl):'http://image.zhi-you.net/avatar_default.jpg'" alt="">
        <img class="six" :src="child.gender?'/static/img/main/girl.png':'/static/img/main/boy.png'" alt="">
        <!--<img class="six" src="/static/img/main/boy.png" alt="">-->
      </div>
      <div v-if="brief" class="user-info">
        <span class="name">{{child.realname}}</span>
      </div>
      <div class="user-info" v-else>
        <p>
          <span class="name">{{child.realname}}</span>
          <span>{{child.className}}</span>
        </p>
        <p>{{child.schoolName}}</p>
      </div>
    </div>
    <template v-if="!hide">
      <img v-if="list.length >1" class="change" :class="{brief: brief}" src="/static/img/component/change.png" alt="" @click="changeChild">
      <img v-else class="add" :class="{brief: brief}" src="/static/img/component/add.png" alt="" @click="addChild">
    </template>

  </div>
</template>

<script>
  // 子女
  import { childListByParentId } from "../../service/featureList/child";
  import store from "../../pages/store/store";
  import { imageUrl } from "../../service/config";

  export default {
    name: "user",
    props: {
      border: null,
      all: null,
      hide: null,
      brief: null,
      index: {
        type: Number,
        default: 0
      },
      type1:''
    },
    data: function() {
      return {
        list: [],
        imageUrl: imageUrl,
        load: true,
      };
    },
    computed: {
      userInfo: function() {
        return this.$store.state.userInfo;
      },
      child: function() {
        if (this.list[this.index]) {
          return this.list[this.index];
        } else {
          return {};
        }
      },
      childCount: function() {
        return this.$store.state.userInfo.childCount;
      },
      role: function() {
        return this.$store.state.role;
      },
    },
    onShow: function(){
      this.pageOnShow();
    },
    onLoad: function() {
      if (this.userInfo.childCount > this.list.length) {
        this.getList();
      }
    },
    methods: {
      pageOnShow: function(){
        if (this.userInfo.childCount > this.list.length) {
          this.getList();
        }else{
          try {
            this.$nextTick(() => {
              this.$emit('update:student', this.list[this.index]);
              this.$emit('update:index', this.index);
            })
          }catch (e) {
            console.log(e);
          }
        }
      },
      addChild: function(){
        this.navigateTo({
          url: "/pages/featureList/sub/childManage/searchChild/main?type="+this.type1 || ''
        });
      },
      changeChild: function() {
        let index = this.index +1;
        if (index === this.list.length) {
          index = 0;
        }
        this.$emit('update:student', this.list[index]);
        this.$emit('update:index', index);
      },
      getList: async function() {
        this.load = true;
        let data = await childListByParentId({ parentId: this.userInfo.id });
        if(this.role === "1" && this.type1 === 'school'){
          let arr = [];
          for(var i = 0;i < data.list.length;i++){
            if(data.list[i].schoolId){
              arr.push(data.list[i]);
            }
          }
          data.list = arr;
        }
        this.list = data.list;
        this.load = false;
        this.$emit('update:student', this.list[this.index]);
        this.$emit('update:index', this.index);
      }
    }
  };
</script>

<style scoped lang="scss">


  .all {
    margin: 0;
    width: 100%;
    border-radius: 0;
  }

  .card {
    position: relative;
    background-color: #fff;
    .add, .change {
      position: absolute;
      top: 50%;
      right: rpx(36);
      transform: translateY(-50%);
    }
    .change {
        width: rpx(40);
        height: rpx(36);
      }
      .add {
        width: rpx(35);
        height: rpx(35);
      }
    }
    .load{
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(255,255,255,.8);
      z-index: 10;
      img{
        position: absolute;
        top: 50%;
        left: 50%;
        @include translate(-50%,-50%);
        width: rpx(60);
        height: rpx(60);
      }
    }
    /*.change {*/
    /*position: absolute;*/
    /*width: rpx(40);*/
    /*height: rpx(36);*/
    /*right: rpx(31);*/
    /*top: rpx(38);*/
  /*}*/
  /*.change.brief{*/
    /*top: rpx(20);*/
    /*width: rpx(30);*/
    /*height: rpx(27);*/
  /*}*/

  /*.add {*/
    /*position: absolute;*/
    /*width: rpx(70);*/
    /*height: rpx(70);*/
    /*right: rpx(31);*/
    /*top: rpx(60);*/
  /*}*/
  /*.add.brief{*/
    /*width: rpx(35);*/
    /*height: rpx(35);*/
    /*top: rpx(45);*/
  /*}*/

  .border.user {
    border-bottom: 1px solid $border;
  }
  .user.brief{
    height: rpx(128);
    .head-img {
      .img{
        width: rpx(48);
        height: rpx(48);
      }
      .six{
        display: none;
      }
    }
  }
  .user {
    margin-left: rpx(30);
    width: rpx(630);
    height: rpx(190);
    @extend %flex;
    @extend %flex-align-center;
    .head-img {
      position: relative;
      .img {
        display: block;
        width: rpx(110);
        height: rpx(110);
        border-radius: 50%;
      }
      .six {
        position: absolute;
        width: rpx(36);
        height: rpx(36);
        bottom: 0;
        right: 0;
      }
    }
  }

  .user-info {
    margin-left: rpx(30);
    font-size: rpx(28);
    color: #9A9A9A;
    line-height: rpx(28);
    .name {
      line-height: rpx(31);
      margin-right: rpx(31);
      font-size: rpx(32);
      color: #313131;
    }
    p:first-of-type {
      margin-bottom: rpx(39);
    }
  }
</style>
