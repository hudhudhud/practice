<template>
  <div>

    <div class="date-select">
      <Child :index.sync="studentIndex" @update:student="getStudent" all="1" brief="1" :type1="type1" v-if="role==='1'"/>
      <h-date :initDate="time" @change="dateChange" v-if="!isH5"></h-date>
      <div v-if="isH5" id="h5Date" style="width: 100%;"></div>
    </div>
    <scroll-view class="scroll-view" :class="{teacher: role==='2'}" scroll-y="true" enable-back-to-top="true"
                 @scrolltolower="loadMore"
                 lower-threshold="30">
      <div v-for="(item,index) in list" :key="item.id">
        <CellItem v-if="type==='check'" :info="item" @action="stopTodayCourse($event, index)"></CellItem>
        <div class="card" v-else>
          <div class="date">
            <div class="month">{{item.month}}</div>
            <div class="line"></div>
            <div>周{{item.week}}</div>
          </div>
          <div class="info">
            <p class="name">{{item.className}}</p>
            <p>{{item.startTime}}——{{item.endTime}}</p>
          </div>
          <div class="icon-right" @click="getDetail(item.id)"><img src="/static/img/util/icon_back_right.png" alt="">
          </div>
        </div>
      </div>
      <div class="no-list" style="margin-top: 20px" v-if="!list.length">暂无</div>

    </scroll-view>
    <div class="alert" v-if="alert">
      <div class="alert-box card">
        <div class="alert-content">
          <div class="title">提示</div>
          <div class="text">
            <div class="item">
              <label>课程介绍：</label>
              <span>{{detail.briefIntro||""}}</span>
            </div>
            <div class="item">
              <label>课程名称：</label>
              <span>{{detail.name}}</span>
            </div>
            <div class="item">
              <label>授课机构：</label>
              <span>{{detail.orgName}}</span>
            </div>
            <div class="item">
              <label>上课教室：</label>
              <span>{{detail.address}}</span>
            </div>
            <div class="item">
              <label>上课老师：</label>
              <span>{{detail.realname||""}}</span>
            </div>
            <div class="item">
              <label>上课时间：</label>
              <span>{{detail.startTime}}——{{detail.endTime}}</span>
            </div>
            <div class="item">
              <label>开课时间：</label>
              <span>{{detail.startDate}}</span>
            </div>
          </div>
        </div>
        <div class="btns">
          <div class="btn" :class="{isdisable:isDisable}" @click="alertCancel" v-if="role==='1'">{{courseState}}</div>
          <div class="btn" @click="alertConfirm">确定</div>
        </div>
      </div>
    </div>
    <div class="alert" v-if="reasonShow">
      <div class="alert-box card">
        <div class="alert-content">
          <div class="title">请填写{{role==="1"?"请假":"停课"}}原因</div>
          <div class="alert-input">
            <textarea v-model.lazy="reason"/>
          </div>
        </div>
        <div class="btns">
          <div class="btn" @click="alertConfirm">取消</div>

          <div class="btn" @click="confirmReason">确定</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {
    courseTableDetail,
    list2Student,
    list2Teacher,
    saveCourseTable
  } from "../../../../service/featureList/schoolSelect";
  import Child from "@/components/global/child";
  import { weekText } from "../../../../service/config";
  import store from "../../../store/store";
  import CellItem from "@/components/style/CellItem";
  import { stopTodayCourse } from "../../../../service/teacher/main";

  export default {
    name: "index",
    components: {
      Child,
      CellItem
    },
    data: function() {
      return {
        // 弹窗
        alert: 0,
        reasonShow: 0,
        reason: "",
        // 时间
        time: "",
        maxDate: "",
        minDate: "",
        // 列表
        page: 0,
        size: 5,
        loading: false,
        list: [],
        detail: {},
        student: {},
        studentIndex: 0,
        type: "", //  check 代表上课点名
        checkIndex: -1,
        courseState: "请假",
        courseStateUrl: "",
        isDisable: false,
        type1: ""
      };
    },
    computed: {
      role: function() {
        return store.state.role;
      }
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.type = this.route().query.type;
      let now = new Date();
      this.time = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0");

      // h5Date
      // laydate.path = '/static/js/laydate'; //laydate.js 所在目录
      if(this.isH5){
        laydate.render({
          elem: "#h5Date",
          position: "static",
          value: this.time,
          change: (value, date) => { //监听日期被切换
            // console.log(value);
            this.dateChange({ mp: { detail: value } });
          },
          showBottom: false,
          theme: "#3F90FD",
          calendar: true,
          ready: (date) => {
            //  console.log(date); //得到初始的日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
            // this.dateChange({mp:{detail: date.year.toString()+'-'+ date.month.toString().padStart(2, '0')+'-'+date.date.toString().padStart(2, '0')}});
          }
        });
      }
    },
    onShow: function() {
      this.type1 = this.route().query.type1;
      if (this.role === "2") {
        // 如果是教师
        this.check();
      }
    },
    methods: {
      /**
       * 停课操作 : 教师
       * e 2 点名
       * */
      stopTodayCourse: async function(e, index) {
        switch (e) {
          case 1:
            this.reasonShow = 1;
            this.checkIndex = index;
            //   const data = await stopTodayCourse({courseId: this.list[index].courseId})
            break;
          case 2:
            this.navigateTo({
              url: "../checkIn/main?id=" + this.list[index].id + "&time=" + this.time + "&courseScheduleId=" + this.list[index].courseScheduleId
            });
            break;
        }
      },
      /**
       * 学生改变 : 家长
       * @param stu
       */
      getStudent: function(stu) {
        this.student = stu;
        this.check();
      },
      /**
       * 查询课程详情
       * */
      getDetail: async function(id) {
        this.detail = await courseTableDetail({ id: id, courseDate: this.time });
        if (!this.detail) {
          return this.$toast("没有数据");
        }
        switch (this.detail.status) {
          case "committed":
            this.courseState = "请假";
            this.isDisable = false;
            break;
          case "stopped":
            this.courseState = "停课";
            this.isDisable = true;
            break;
          case "finished":
            this.courseState = "查看点名";
            this.courseStateUrl = "/pages/featureList/sub/checkIn/main?id=" + this.detail.id + "&time=" + this.detail.courseDate + "&courseScheduleId=" + this.detail.courseScheduleId;
            this.isDisable = false;
            break;
        }
        this.alert = 1;
      },
      alertCancel: function() {
        // saveCourseTable
        if (this.detail.status === "finished") {
          this.navigateTo({
            url: this.courseStateUrl
          });
        } else {
          this.reasonShow = 1;
        }
        this.alert = 0;
      },
      alertConfirm: function() {
        this.alert = 0;
        this.reasonShow = 0;
      },
      confirmReason: function() {

        setTimeout(async () => {
          if (!this.reason) {
            return this.$toast("请输入原因");
          }
          if (this.role === "1") {
            await saveCourseTable({
              reason: this.reason,
              scheduleId: this.detail.courseScheduleId,
              studentId: this.student.studentId
            }, { successMsg: true, load: true });

          } else {
            await stopTodayCourse({
              courseId: this.list[this.checkIndex].id,
              courseDate: this.time,
              reason: this.reason
            }, { successMsg: true, load: true });

          }
          this.check();
          this.reason = "";
          this.reasonShow = 0;

        }, 200);
      },
      /**
       * 时间改变
       * @param e
       */
      dateChange: function(e) {
        this.time = e.mp.detail;
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
          let data = {}, params = {
            pageNo: this.page,
            pageSize: this.size,
            courseDate: this.time
          };
          if (this.role === "1") {
            params.studentId = this.student.studentId || this.student.id;
            data = await list2Student(params);
          } else {
            data = await list2Teacher(params);
          }
          if (this.page === 1) {
            this.list = data.list.map(i => {
              i.month = i.courseDate.substring(5, 10);
              i.week = weekText[new Date(i.courseDate).getDay()];
              return i;
            });
          } else {
            this.list = this.list.concat(data.list.map(i => {
              i.month = i.courseDate.substring(5, 10);
              i.week = weekText[new Date(i.courseDate).getDay()];
              return i;
            }));
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


  .alert-input {
    background-color: #f2f2f2;
    margin: rpx(20) rpx(30);
    text-align: left;
    padding: rpx(10) rpx(30);
    box-sizing: border-box;
  }

  textarea {
    width: 100%;
  }

  .alert {
    div {
      display: block;
    }
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    @extend %flex;
    @extend %flex-align-center;
    @extend %justify-content-center;
    .alert-box {
      display: block;
      padding-bottom: rpx(60);
      text-align: center;
    }
    .text {
      text-align: left;
      padding: rpx(40) rpx(30) 0;
      font-size: rpx(28);
      color: #6C6C6C;
      .item {
        margin-bottom: rpx(40);
      }
      label {
        font-size: rpx(30);
        color: #000;
        font-weight: bold;
      }
    }
    .title {
      font-size: rpx(30);
      font-weight: bold !important;
    }
    .btns {
      width: 100%;
      font-size: 0;
      text-align: center;
      color: #000;
      .btn {
        width: rpx(260);
        border-radius: rpx(44);
        display: inline-block;
        font-size: rpx(32);
        line-height: rpx(88);
        background-color: #756EFD;
      }
      .btn:last-of-type {
        @include gradientToRight(#FFEB00, #FEBF00);
        margin-left: rpx(70);
      }
      .isdisable {
        pointer-events: none;
        background: gray;
      }
    }

  }

  .date-select {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: rpx(562);
    //  background-color: #3F90FD;
  }

  .scroll-view {
    height: 100vh;
    box-sizing: border-box;
    padding-top: rpx(800);
    padding-bottom: rpx(20);
  }

  .scroll-view.teacher {
    padding-top: rpx(670);
  }

  .card {
    position: relative;
    @extend %flex;
    @extend %flex-align-center;
    .date {
      @extend %flex;
      @extend %flex-column;
      @extend %flex-align-center;
      @extend %justify-content-center;
      height: rpx(160);
      line-height: rpx(32);
      width: rpx(176);
      font-size: rpx(32);
      color: #000;
      font-weight: bold;
      background-color: $them;
    }
    .icon-right {
      position: absolute;
      right: rpx(30);
      top: 50%;
      @include translate(0, -50%);
      img {
        width: rpx(40);
        height: rpx(40);
      }
    }

    .info {
      margin-left: rpx(40);
      font-size: rpx(26);
      line-height: rpx(26);
      color: #9A9A9A;
      .name {
        margin-bottom: rpx(39);
        font-size: rpx(32);
        line-height: rpx(32);
        font-weight: bold;
        color: #313131;
      }
    }
    .line {
      margin: rpx(25) 0;
      width: rpx(74);
      height: rpx(4);
      background-color: rgba(255, 255, 255, .5);
    }
  }
</style>
