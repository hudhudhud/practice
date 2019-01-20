<template>
  <div class="page">
    <table>
      <thead>
      <tr>
        <td>班级</td>
        <td>学生姓名</td>
        <td>家长姓名</td>
        <td>期末评价</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in list" :key="item.id">
        <td>{{item.className}}</td>
        <td>{{item.realname}}</td>
        <td>{{item.parentName}}</td>
        <td>
          <div class="ela" @click="evaluateStudent(item.studentId)">评价</div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { commentListStudent } from "../../../../service/teacher/main";

  export default {

    name: "index",
    data: function() {
      return {
        id: "",
        list: []
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.id = this.route().query.id;
      this.getList();
    },
    methods: {
      getList: async function() {
        ({ list: this.list } = await commentListStudent({ courseId: this.id }));
      },
      evaluateStudent: function(studentId) {
        this.navigateTo({
          url: "../evaluateStudentAdd/main?studentId=" + studentId + "&id=" + this.id
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  table {
    text-align: center;
    margin: 0 auto;
    width: rpx(690);
    color: #5B5B5B;
    font-size: rpx(30);
    thead {
      td {
        color: #313131;
      }
    }
    tbody {
      td {
        border-top: 1px solid $border;
      }
    }
    td {
      line-height: rpx(100);
    }
  }

  .ela {
    display: inline-block;
    width: rpx(120);
    height: rpx(60);
    line-height: rpx(60);
    vertical-align: middle;
    background-color: $them;
    border-radius: rpx(30);
    text-align: center;
    color: #000;
  }
</style>
<style>
  page {
    background-color: #fff;
  }
</style>
