<template>
  <div>
    <div class="fixed">
      <Child :index.sync="studentIndex" all="1" v-if="role==='1'" :type1="type1" @update:student="studentChange"/>
    </div>
    <scroll-view class="scroll-view" :class="{teacher: role==='2'}" scroll-y="true" enable-back-to-top="true"
                 @scrolltolower="loadMore" lower-threshold="30">
      <!--<ClassroomItem  v-for="item in 5" :key="item" @detail="detail" btn="查看评价"></ClassroomItem>-->
      <ClassroomItem v-for="item in list" :key="item"
                     :info="{courseDate: item.createdAt,
                     courseId:item.courseId,
                     id: item.id,
                     orgName: item.orgName,
                     className: item.className,
                     courseLogoUrl: item.teacherCommentImgs?item.teacherCommentImgs[0].fileUrl:''}"
                     @detail="detail" btn="查看评价"></ClassroomItem>
      <div v-if="list.length === 0" style="text-align: center;line-height: 30px;font-size: 28rpx">暂无课程评价</div>
    </scroll-view>
  </div>
</template>

<script>
  import Child from "@/components/global/child";
  import ClassroomItem from "@/components/feature/classroomItem";
  import store from "../../../store/store";
  import { commentListCourse } from "../../../../service/featureList/evaluate";

  export default {

    name: "index",
    components: {
      ClassroomItem,
      Child
    },
    computed: {
      role: function() {
        return store.state.role;
      }
    },
    data: function() {
      return {
        page: 0,
        size: 7,
        loading: true,
        list: [],
        student: {},
        type1:'',
        studentIndex: 0
      };
    },
    onLoad: function() {
      Object.assign(this.$data, this.$options.data());
      this.type1 = this.route().query.type1;
      if (this.role === "2") {
        this.check();
      }
    },
    methods: {
      studentChange: function(e) {
        this.student = e;
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
          const data = await commentListCourse({
            pageNo: this.page,
            pageSize: this.size,
            studentId: this.student.studentId
          });
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
      detail: function({ courseId: id }) {
        this.navigateTo({
          url: "../classroomEvaluateDetail/main?id=" + id + "&studentId=" + this.student.studentId
        });
      }
    }
  };
</script>

<style scoped lang="scss">


  .scroll-view {
    padding-top: rpx(190);
    background-color: #fff;
    height: 100vh;
  }

  .scroll-view.teacher {
    padding-top: 0;
  }

  .fixed {
    z-index: 50;
    background-color: #fff;
  }
</style>
