<template>
  <div>
    <div class="fixed flow">
      <div class="left" :class="{active:selectIndex === 1}" @click="select(1)">
        <picker @change="pickerOrgTypeChange" :range="orgType">
          <div class="picker">
            当前选择：{{orgType[index]}}
          </div>
        </picker>
      </div>
      <div class="left" :class="{active:selectIndex === 2}" @click="select(2)">
        <picker @change="pickerOrderTypeChange" :range="orderType">
          <div class="picker">
            当前选择：{{orderType[count]}}
          </div>
        </picker>
      </div>
      <!--<ListTab :text="tabsText" :status.sync="status"/>-->

    </div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <OrderItem @detail="toDetail" v-for="item in list" :isHideLeve="orgtype" :isHideOrg="true" @evaluation="evaluation" :info="item" :key="item.id"></OrderItem>
      <div class="no-list"style="margin-top: 20px" v-if="!list.length">暂无订单</div>
    </scroll-view>
  </div>
</template>

<script>
  import ListTab from "@/components/style/listTab";
  import OrderItem from "@/components/profile/orderItem";
  import { getOrderList } from "../../../../service/profile/order";
  import { orderStatusText } from "../../../../service/config";

  export default {

    name: "index",
    components: {
      ListTab,
      OrderItem
    },
    watch: {
      status: function() {
        this.check();
      }
    },
    data: function() {
      return {
        tabsText: ["全部", "待付款", "已付款", "待退款", "待评价"],
        page: 0,
        size: 10,
        loading: true,
        list: [],
        status: 0,
        index:0,
        count:0,
        orgtype:'',
        orgType:["全部","校园课程","社区课程","社会实践","机构课程"],
        orgTypeState:["all","school","community","practise_base","mechanism"],
        orderType:["全部", "待付款", "已付款", "已关闭", "待评价"],
        orderTypeState:["all","committed","paid","cancelled","evaluation"],
        ordertype:'',
        selectIndex:1
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      let status = this.route().query.status;
      if (status !== undefined) {
        this.status = +status;
      }
     if(this.isH5){
       this.check();
     }
    },
    onShow:function(){
      this.index = 0;
      this.count = 0;
      this.selectIndex = 1;
      this.orgtype = ''
      this.check();
    },
    methods: {
      check: function() {
        this.list = [];
        this.loading = false; // 重新开启监听
        this.page = 0;
        this.loadMore();
      },
      select:function(index){
        this.selectIndex = index;
      },
      pickerOrgTypeChange:function(e){
        this.index = Number(e.target.value);
        this.orgtype = this.orgTypeState[this.index];
        this.check()
      },
      pickerOrderTypeChange:function(e){
        this.count = Number(e.target.value);
        this.ordertype = this.orderTypeState[this.count]
        this.check()
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
        let that = this;
        let status = this.status;
        let param = { pageNo: this.page, pageSize: this.size, status: this.ordertype,type:this.orgtype };
        if(this.index === 0){
          delete param.type
        }
        if(this.count === 0){
          delete param.status
        }
        try {
          const data = await getOrderList(param);
          if (this.status !== status) {
            return;
          }

          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.list = this.list.map(function(item) {
            item.orderType1 = that.orderType[that.orderTypeState.indexOf(item.status)];
            item.orgType1 = that.orgType[that.orgTypeState.indexOf(item.type)];
            return item
          });
          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      },
      toDetail: function(item) {
        console.log(item);
        this.navigateTo({
          url: "./orderDetail/main?type="+'detail&id='+item.courseId+'&orderId='+item.id+'&orgType='+item.orgType1
        });
      },
      evaluation: function(item) {
        this.navigateTo({
          url: "./evaluation/main?id="+item.id
        })
      }
    }
  };
</script>

<style scoped lang="scss">

  .picker{
    height: rpx(100);
    line-height: rpx(100);
    text-align: center;
  }
  .flow {
    overflow: hidden;
    width: 100%;
    height: rpx(100);
    background-color: #fff;
    .left {
      width: 50%;
      float: left;
      height: rpx(100);
      border-top:rpx(8) solid #ddd;
      border-bottom:rpx(8) solid #ddd;
      box-sizing:border-box;
      picker {
        text-align: center;
        line-height: rpx(84);
        font-size: rpx(24);
      }
    }
    .active {
      border-bottom:rpx(8) solid red;
    }
  }
  .scroll-view {
    padding-top: rpx(106);
    height: 100vh;
    background-color: #fff;
  }
</style>
<style>
  page {
    background-color: #fff;
  }
</style>
