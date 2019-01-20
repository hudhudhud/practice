<template>
  <div>
    <Child add="1" @update:student="studentChange" v-if="role==='1'" :index.sync="studentIndex" :type1="type1" all="1"/>
    <!--  <view class="pageH5">
        <web-view src="https://v.cheyou18.com/baoxian/prod/general/detail/78609148?p=101032&t=1539078173854&u=0146314&s=34B5617F033DC718756B65CA12CB0E0A"></web-view>
      </view>-->
    <div class="tac" v-for="item in list" :key="item.id">
      <div>
        <p>{{item.prodname}}</p>
        <p v-if="item.orderid" class="time">生效时间：{{item.effstartdate}} ~ {{item.effenddate}}</p>
      </div>
      <div v-if="!item.orderid" class="btn" @click="toDetail(item.prodid)">可购买</div>
      <div v-if="item.orderid" class="btn gray">已生效</div>
    </div>
    <!-- <div class="tac">
       <div>
         <p>意外伤害险</p>
         <p class="time">生效时间：{{item.effstartdate}} ~ {{item.effenddate}}</p>
       </div>
       <div class="btn gray">已生效</div>
     </div>-->
  </div>
</template>

<script>
  import Child from "@/components/global/child";
  import { getInsuranceListOrder } from "../../../../service/featureList/policy";
  import store from '../../../store/store';
  import md5 from '../../../../utils/md5.js';
    export default {

    name: "index",
    components: {
      Child
    },
    computed: {
      role: function() {
        return store.state.role;
      },
      userId:function() {
        return store.state.loginData.userId
      }
    },
    data: function() {
      return {
        list: [],
        type1:'',
        student:'',
        studentIndex:0
      };
    },
   /* onShow: function() {
      this.getList();
    },*/
    onLoad: function(){
      this.type1 = this.route().query.type1;
      if(this.role === '2'){
        this.getList()
      }
        // this.getList();

    },
    methods: {
      getList: async function() {
        let pramas = {};
        if(this.role === '1'){
          pramas.userId = this.student.id
        }else {
          pramas.userId = this.userId
        }
        this.list = await getInsuranceListOrder(pramas);
      },
      studentChange: function(stu) {
        this.student = stu;
        this.activeChange();
      },
      activeChange: function(n = this.active) {
        this.loading = false; // 重新开启监听
        this.page = 0;
        this.list = [];
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
      toDetail: function(prodid) {
        let timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        let userId = this.role === '1'?this.student.id:this.userId;
        let sign = "partnerid=101032&prodid="+prodid+"&timestamp="+timestamp+"&userid="+userId+"acb96571ba23a46d76dh8253d5c6ed12";
        let signMd5 = md5(sign).toLocaleUpperCase();
        console.log("md5：" + signMd5);
        let URL = "page/component/pages/product/product?partnerid=101032&prodid=" + prodid + "&timestamp="+timestamp+"&userid="+userId+"&sign="+signMd5;
        console.log(URL);
        if(this.isH5){
         // location.href = URL;
        }else{
          wx.navigateToMiniProgram({
            appId: 'wx90f838924f83e70d',
            path: URL,
            envVersion: 'release',
            success(res) {
              console.log(res);
            }
          })
        }

      }
    }
  };
</script>

<style scoped lang="scss">


  .tac {
    margin: rpx(30) auto 0;
    @extend %flex;
    @extend %justify-content-space-between;
    @extend %flex-align-center;
    width: rpx(690);
    height: rpx(166);
    font-size: rpx(32);
    line-height: rpx(32);
    color: #313131;
    font-weight: bold;
    border-radius: rpx(20);
    background-color: #fff;
    overflow: hidden;
    box-sizing: border-box;
    padding-left: rpx(31);
    .btn {
      background-color: $them;
      width: rpx(166);
      height: rpx(166);
      line-height: rpx(166);
      text-align: center;
    }
    .btn.gray {
      background-color: #c5c5c5 !important;
      color: #fff !important;
    }
    .time {
      font-weight: normal;
      font-size: rpx(26);
      line-height: rpx(26);
      margin-top: rpx(29);
      color: #9A9A9A;
    }
  }
</style>
