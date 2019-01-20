<template>
  <div>
    <!--<img @click="add" class="add" src="/static/img/feature/show_add.png" alt="" v-if="role==='2'">-->
    <div class="fixed" v-if="role==='1'">
      <Child :index.sync="studentIndex" all="1" @update:student="studentChange" :type1="type1"/>
    </div>
    <scroll-view class="scroll-view" :class="{teacher: role==='2'}" scroll-y="true" enable-back-to-top="true"
                 @scrolltolower="loadMore"
                 lower-threshold="30">
      <ClassroomItem v-for="(item, index) in list" :key="index" :info="item" @detail="detail"
                     :btn="item.id||role==='1'?'查看风采':'添加风采'"></ClassroomItem>
      <div v-if="list.length === 0" style="text-align: center;line-height: 30px;font-size: 28rpx">暂无课程风采</div>
    </scroll-view>

  </div>
</template>

<script>
  import Child from "@/components/global/child";
  import ClassroomItem from "@/components/feature/classroomItem";
  import { getShowList } from "../../../../service/featureList/classroomShow";
  import store from "../../../store/store";

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
      if(this.isH5){
        if (this.role === "2") {
          this.check();
        }
      }
    },
    onShow: function() {
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
          const data = await getShowList({ pageNo: this.page, pageSize: this.size, studentId: this.student.studentId });
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
      detail: function({ id, courseId,courseDate }) {
        if (id || this.role === "1") {
          this.navigateTo({
            url: "../classroomShowDetail/main?id=" + id
          });
        } else {
          this.navigateTo({
            url: "../classroomShowAdd/main?id=" + courseId+'&time='+courseDate
          });
        }
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

  .add {
    z-index: 10;
    background-color: #fff;
    position: fixed;
    right: 0;
    top: 50%;
    @include translate(0, -50%);
    width: rpx(164);
    height: rpx(164);
  }
</style>
