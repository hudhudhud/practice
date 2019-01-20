<template>
  <div>
    <div class="fixed-top" id="top">
      <Child :add="1" @update:student="studentChange" :type1="type1" :index.sync="studentIndex" />
      <div class="gray-box"></div>
      <div class="week">
        <div @click="activeChange(0)" :class="{active: active===0}"><span>日</span></div>
        <div @click="activeChange(1)" :class="{active: active===1}"><span>一</span></div>
        <div @click="activeChange(2)" :class="{active: active===2}"><span>二</span></div>
        <div @click="activeChange(3)" :class="{active: active===3}"><span>三</span></div>
        <div @click="activeChange(4)" :class="{active: active===4}"><span>四</span></div>
        <div @click="activeChange(5)" :class="{active: active===5}"><span>五</span></div>
        <div @click="activeChange(6)" :class="{active: active===6}"><span>六</span></div>
      </div>
      <div class="selectTime" v-if="timeType!=='不在选课时间'">{{timeType}}：{{time}}</div>
      <div class="selectTime" v-if="timeType==='不在选课时间'">{{timeType}}</div>
      <ListTab :text="auths" :status.sync="tabsStatus" />
    </div>
    <scroll-view class="scroll-view" scroll-y="true" enable-back-to-top="true" @scrolltolower="loadMore"
                 lower-threshold="30">
      <div>
      <OrderItem v-for="item in list" :key="item.id" @detail="toDetail" :info="item"></OrderItem>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import Child from "@/components/global/child";
  import ListTab from "@/components/style/listTab";
  import OrderItem from "@/components/profile/courseItem";
  import { getCourseList } from "../../../../service/featureList/curriculum";
  import store from '../../../store/store'
    export default {

    name: "index",
    components: {
      Child,
      ListTab,
      OrderItem
    },
    data: function() {
      return {
        tabs: ["社团课", "拓展课", "校内托管"],
        tabsStatus: 0,
        active: 0,
        page: 0,
        size: 6,
        loading: false,
        list: [],
        student: null,
        studentIndex: 0,
        type1:'',
        timeType:'',
        time:'',
        selectStatus:''
      };
    },
    onLoad: function() {
      this.active = new Date().getDay();
      this.type1 = this.route().query.type1;
      console.log(this.type1);
    //  this.activeChange();
    },
    computed: {
      auths: function() {
        return store.state.userInfo.widgets.find(i => {
          return i.url==='/pages/featureList/main'
        }).children.map(i => {
          return i.name;
        });
      }
    },
    watch: {
      tabsStatus: function() {
        this.activeChange();
      }
    },
    methods: {
      toDetail: function(item) {
        this.navigateTo({
          url: "../selectClassDetail/main?id=" + item.id+'&studentIndex='+this.studentIndex+'&selectStatus='+this.selectStatus
        });
      },
      studentChange: function(stu) {
        this.student = stu;
        this.activeChange();
      },
      activeChange: function(n = this.active) {
        this.active = n;
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
      getList: async function() {
        try {
          const data = await getCourseList({
            pageNo: this.page,
            pageSize: this.size,
            day: this.active || 7,
            orgType: 1,
            orgId: this.student.orgId,
            classroomType: this.tabsStatus+1,
            grades:this.student.gradeId
          });
          this.selectStatus = data.courseListTimeVo.status;
          if(data.courseListTimeVo.status === 0){
              this.timeType = '选课开始时间'
              this.time = data.courseListTimeVo.startTime;
          }else if(data.courseListTimeVo.status === 1){
              this.timeType = '选课截止时间'
              this.time = data.courseListTimeVo.endTime;
          }else {
              this.timeType = '选课已结束'
              this.time = ""
          }
          if (this.page === 1) {
            this.list = data.list;
          } else {
            this.list = this.list.concat(data.list);
          }
          this.loading = Number(data.list.length) < Number(this.size);

        } catch (e) {
          this.loading = false;
        }
      }
    }
  };
</script>

<style scoped lang="scss">


  .fixed-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: rpx(480);
    background-color: #fff;
  }

  .selectTime {
    text-align: center;
    margin: rpx(20) 0;
    font-size: rpx(28);
  }

  .scroll-view {
    box-sizing: border-box;
    height: 100vh;
    padding-top: rpx(480);
    background-color: #fff;
  }

  .week {
    padding: rpx(30) rpx(20) 0;
    font-size: rpx(28);
    color: #5B5B5B;
    @extend %flex;
    text-align: center;
    line-height: rpx(52);
    > div {
      flex: 1;
    }
    .active span {
      border-radius: 50%;
      display: inline-block;
      width: rpx(52);
      height: rpx(52);
      color: #fff;
      background-color: #756EFD;
    }
  }
</style>
