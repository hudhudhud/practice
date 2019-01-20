<template>
  <div>
    <div class="input-item" v-if="!isNullNumber">
      <input type="text" placeholder="请输入子女验证码" v-model="code">
    </div>
    <div class="infos input-item" v-if="isNullNumber">
      <div class="item"><label>学生名称</label><input type="text" style="text-align: right" placeholder="请输入子女姓名" v-model="nickname"/></div>
    </div>
    <div class="infos input-item" v-if="isNullNumber">
      <div class="item">
        <label>性别</label>
        <div class="sex">
          <div @click="sexChange(0)" :class="{active: sex===0}">男</div>
          <div @click="sexChange(1)" :class="{active: sex===1}">女</div>
        </div>
      </div>
    </div>
    <div class="flow" v-if="!isNullNumber">
      <div class="submit-btn fl" v-if="type !== 'school'" @click="noCode">无验证码</div>
      <div class="submit-btn ri" v-if="type !== 'school'" @click="next(2)">完成</div>
      <div class="submit-btn ri" style="float: none;position: relative;left: 50%;transform: translateX(-50%)" v-if="type === 'school'" @click="next(2)">完成</div>
    </div>
    <div class="submit-btn" v-if="isNullNumber" @click="next(1)">完成</div>
  </div>
</template>

<script>
  import { queryDetailByBindCode, saveStudent} from "../../../../../service/featureList/child";
  import { setItem } from "../../../../../utils/localStorage";

  export default {

    name: "index",
    data: function() {
      return {
        code: "",
        nickname:'',
        sex:0,
        isNullNumber:false,
        type:''
      };
    },
    onShow:function(){
      this.isNullNumber = false;
      this.code='';
      this.sex=0;
      this.nickname = '';
    },
    onLoad: function(){
      Object.assign(this.$data, this.$options.data());
      this.type = this.route().query.type;
    },
    methods: {
      next: async function(index) {
        if(this.isNullNumber && this.nickname === ''){
          this.$toast("请输入子女姓名")
          return
        }
        if(index === 2){
          const data = await queryDetailByBindCode({ bindCode: this.code }, { load: true });
          setItem('childInfo', data);
          this.navigateTo({
            url: "../addChild/main"
          });
        }else {
          const data = await saveStudent({ realname: this.nickname,gender: this.sex}, { load: true });
          setItem('childInfo', data);
          this.navigateTo({
            url: "../main"
          });
        }
      },
      noCode:function(){
        this.isNullNumber = true;
      },
      sexChange: function(n) {
        this.sex = n;
      },
    }
  };
</script>

<style scoped lang="scss">


  .flow {
    width: 100%;
    overflow: hidden;
    margin-top: rpx(120);
    .fl {
      float: left;
    }
    .ri {
      float: right;
    }
    .submit-btn {
      width: 40%;
      margin: 0 5%;
    }
  ;
  }
  .input-item {
    padding: rpx(40) rpx(30);
    margin-top: rpx(20);
    background-color: #fff;
  }
  .infos {
    .sex {
      font-size: 0;
      .active {
        color: #000 !important;
        background-color: $them;
      }
      div {
        margin-left: rpx(20);
        border-radius: rpx(25);
        display: inline-block;
        vertical-align: middle;
        width: rpx(98);
        height: rpx(50);
        line-height: rpx(50);
        font-size: rpx(26);
        color: #9a9a9a;
        text-align: center;
      }
    }
  }

  .item {
    height: rpx(50);
    line-height: rpx(50);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-space-between;
    label {
      color: #313131;
      font-size: rpx(30);
      font-weight: bold;
    }
    span {
      vertical-align: middle;
      font-size: rpx(26);
      color: #9A9A9A;
    }
  }

</style>
