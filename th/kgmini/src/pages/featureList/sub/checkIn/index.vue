<template>
  <div style="padding-bottom: 115rpx;" >
    <div class="card">
      <div class="title">
        <span class="tag"></span>
        <span>{{info.className}}</span>
        <!--<span class="label3">二级目录</span>-->
        <span class="right">{{info.studentNum}}/{{info.maxNumber}}人</span>
      </div>
      <div class="info">
        <p>开课时间：{{info.startDate}}~{{info.endDate}}</p>
        <p>上课时间：周{{info.week}} {{info.startTime+"-"+info.endTime}}</p>
        <p class="name">{{info.orgName}}</p>
        <p class="address">地址：{{info.address}}</p>
      </div>
    </div>
    <div class="card">
      <div class="title" v-if="role==='1'">
        <span class="tag" style="background: #756EFD"></span>
        <span>班级评价</span>
        <!--<span class="label3">二级目录</span>-->
        <!--<span class="right">{{info.studentNum}}/{{info.maxNumber}}人</span>-->
      </div>
      <div class="input">
        <textarea :disabled="disabled || role === '1'" v-model.lazy="evaluate" placeholder="请输入班级评价内容"/>
      </div>
      <div class="btn-area" v-if="!disabled && role==='2'">
        <div class="btn" @click="contentClick">确定</div>
      </div>
    </div>
    <!--<div class="tip">-->
      <!--<img src="/static/img/util/distance.png" alt=""><span>请先定位当前位置</span>-->
    <!--</div>-->
    <div class="card">
      <scroll-view class="scroll-view" scroll-y="true" @scrolltolower="loadMore"
                   lower-threshold="30">
        <table>
          <thead>
          <tr>
            <td>学生姓名</td>
            <td>班级</td>
            <td>到课</td>
            <td>迟到</td>
            <td>请假</td>
            <td>未到</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in studentList" :key="item.id">
            <td>{{item.realname}}</td>
            <td>{{item.className}}</td>
            <td> <div class="radius" :class="{active: item.status===1||!item.status, isdisabled: role === '1'}" @click="changeStatus(index,1)"></div></td>
            <td> <div class="radius" :class="{active: item.status===2, isdisabled: role === '1'}" @click="changeStatus(index,2)"></div></td>
            <td> <div class="radius" :class="{active: item.status===3, isdisabled: role === '1'}" @click="changeStatus(index,3)"></div></td>
            <td> <div class="radius" :class="{active: item.status===4, isdisabled: role === '1'}" @click="changeStatus(index,4)"></div></td>
          </tr>
          </tbody>
        </table>
      </scroll-view>
      <div class="all">
        <div class="all-btn" @click="allDone" v-if="role === '2'">全部到课</div>
      </div>
    </div>
    <div class="card">
      <div class="title">
        <span class="tag" style="background-color: #F73C49"></span>
        <span>备注</span>
      </div>
      <div class="remarks">
        <div v-for="item in leaveStudentList" :key="item.studentId">
          <div class="remark-title">
            <span>{{item.createdAt}}</span>
            <span>{{item.realname}}</span>
          </div>
          <div class="remark-sub-title">
            {{item.reason}}
          </div>
        </div>

      </div>
    </div>

    <div class="button" @click="checkIn" v-if="role === '2'">提交点名</div>
  </div>
</template>

<script>
  import { courseTableDetail } from "../../../../service/featureList/schoolSelect";
  import { weekText } from "../../../../service/config";
  import { listCourseLeave, listStudent, saveStudentCall } from "../../../../service/teacher/main";
  import store from '../../../store/store'
    export default {

    name: "index",
    data: function() {
      return {
        id: "",
        courseScheduleId: "",
        evaluate: "",
        info: {},
        studentList: [],
        leaveStudentList: [],
        disabled: false
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.courseScheduleId = this.route().query.courseScheduleId;
      this.time = this.route().query.time;
      this.getInfo();
      this.getStudentData();
      //  this.getStudentList();
      //  this.listCourseLeave();
    },
    computed: {
      user: function() {
        return store.state.userInfo;
      },
      role: function() {
        return store.state.role;
      }
    },
    methods: {
      getStudentData: async function() {
        await Promise.all([this.getStudentList(), this.listCourseLeave()]);
        this.leaveStudentList.forEach((stu) => {
          let index = this.studentList.findIndex((i) => {
            return i.studentId = stu.studentId;
          });
          this.studentList[index].status = 3;
          this.$set(this.studentList, index, this.studentList[index]);
        })
      },
      changeStatus: function(index, status){
        this.studentList[index].status = status;
        this.$set(this.studentList, index, this.studentList[index]);
      },
      allDone: function(){
        this.studentList = this.studentList.map(i => {
          i.status = 1;
          return i;
        })
      },
      checkIn:async function(){
        await saveStudentCall({courseScheduleId: this.courseScheduleId,courseId: this.info.id,studentCallJson: JSON.stringify(this.studentList.map(i => {
            return {studentId: i.studentId,status: i.status||1}
          })),comment: this.evaluate}, {load: true,successMsg: true});
        setTimeout(() => {
          this.navigateBack({});
        }, 1500)
      },
      getStudentList: function() {
        return new Promise((resolve, reject) => {
          listStudent({ courseId: this.id }).then(data => {
            this.studentList = data.list;
            resolve();
          }).catch(reject);
        });
      },
      /**
       * 获得请假的学生列表
       * @returns {Promise<void>}
       */
      listCourseLeave: async function() {
        return new Promise((resolve, reject) => {
          listCourseLeave({ scheduleId: this.courseScheduleId }).then(data => {
            this.leaveStudentList = data.list;
            resolve();
          }).catch(reject);
        });
      },
      getInfo: async function() {
        this.info = await courseTableDetail({ id: this.id, courseDate: this.time });
        this.info.week = weekText[new Date(this.info.courseDate).getDay()];
        if(this.role === "1"){
          this.evaluate = this.info.classComment || "";
        }
      },
      contentClick: function() {
        setTimeout(() => {
          this.disabled = true;
        }, 100)
      }
    }
  };
</script>

<style scoped lang="scss">


  .button {
    position: fixed;
    bottom: 0;
    left: 0;
    height: rpx(100);
    width: 100%;
    background-color: $them;
    text-align: center;
    line-height: rpx(100);
    color: #000;
    font-size: rpx(32);
  }
  .isdisabled {
    pointer-events: none;
  }
  .radius{
    margin: rpx(3) auto;
    box-sizing: border-box;
    border: rpx(5) solid #D7D7D7;
    width: rpx(40);
    height: rpx(40);
    border-radius: 50%;
  }
  .radius.active{
    border-color: $subThem-red;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAgVBMVEUAAAD3PEn3PEn4Okn/Pkb3PEj9Pkj4PEn3PEn3PEr3PEn2PEn3PUjyOkf4PEn3PEn3PEj3O0n4O0n3O0n2PEj3PEn3PEj2PEj3PUf3PEj2O0n3Pkn3PEn3PEn3PEn3PUn4PEn3PEn4PEj5PEn3PEj3PEn3PUn1O0r4PEr4OUf3PElXgM62AAAAKnRSTlMA/ZpGBTwNp/fY1JMwE+/LxnxtWRqvd3VMPzgf6efj24yHaSy3tqA0JiRUt8wRAAABHUlEQVRIx6XV527DMAwE4JMlr3jFjrNXk+57/wes4LqFXQ8x6Pf7RJASIGJEluqd9o8GbnW1PvNbtLwdMEu/KvZctwGm+AWH8q3BmMBTHLV4x9BzzCnRfdhIzhlP6NtHnJX0O8npsOlOGdNFafzy6HbK0PIVBTy0CkqoFA1NmRCNF8qoI6xaUaiEdadUAWtNKRXY+JliGggoVwEp5RJgT7kQ2FFuDejHqh8o5wFHypWAiSi2ArCk2KeN3yh1gXV4ZFLrSiG/iW8ps0AjyMX30tjIips2bmK6qT1+pO1TSX/Vii5Lg46E8+IMPd58usYfpZrpJMPA7sRxKjEYkY3vsoWPCWmoBuGVwbR6U3ROXDwfLoGukrcw9MrVB/7rC9C49KolC7UTAAAAAElFTkSuQmCC") no-repeat center;
    background-size: rpx(20) rpx(20);
  }

  .remarks {
    .remark-title {
      @extend %flex;
      @extend %justify-content-space-between;
      @extend %flex-align-center;
      height: rpx(46);
      padding: 0 rpx(31) 0 rpx(41);
      color: #FEAA16;
      font-size: rpx(24);
      background-color: #FFF9D9;
    }
    .remark-sub-title {
      padding: rpx(29) rpx(41);
      font-size: rpx(28);
      color: #313131;
      box-sizing:border-box;
      word-wrap:break-word;
    }
  }

  .scroll-view {
    max-height: rpx(340);
  }

  .all {
    height: rpx(100);
    .all-btn {
      margin-top: rpx(30);
      float: right;
      width: rpx(156);
      height: rpx(47);
      background-color: #FFF9D9;
      border-radius: rpx(23) 0 0 rpx(23);
      color: #313131;
      font-size: rpx(21);
      text-align: center;
      line-height: rpx(47);
    }
  }

  table {
    width: 100%;
    font-size: rpx(26);
    color: #313131;
    text-align: center;
    thead {
      td {
        font-size: rpx(28);
        height: rpx(90);
      }
    }

  }

  .tip {
    margin: rpx(30) 0 0 rpx(30);
    font-size: rpx(26);
    color: #9A9A9A;
    img {
      margin-right: rpx(11);
      width: rpx(22);
      height: rpx(26);
    }
  }

  .title .right {
    float: right;
    font-size: rpx(26);
    color: #9D9D9D;
    margin-right: rpx(26);
    font-weight: normal;
  }

  .label3 {
    width: rpx(100);
    height: rpx(32);
    font-size: rpx(20) !important;
    margin-left: rpx(29);
  }

  .info {
    color: #313131;
    font-size: rpx(28);
    line-height: rpx(28);
    padding: rpx(31) rpx(41);
    .name {
      margin-top: rpx(43);
      margin-bottom: rpx(24);
    }
    p:first-of-type {
      margin-bottom: rpx(22);
    }
    .address {
      color: #9D9D9D;
    }
  }

  .input {
    padding: rpx(29) rpx(10) 0 rpx(31);
    font-size: rpx(26);
    textarea {
      height: rpx(180);
    }
  }

  .btn-area {
    height: rpx(121);
    width: rpx(630);
    margin: 0 auto;
    border-top: 1px solid #EAEAEA;
    .btn {
      float: right;
      background-color: $them;
      line-height: rpx(60);
      height: rpx(60);
      padding: 0 rpx(41);
      font-size: rpx(30);
      color: #000;
      border-radius: rpx(30);
      margin-top: rpx(30);

    }
  }

</style>
