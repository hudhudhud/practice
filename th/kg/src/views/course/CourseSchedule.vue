<template>
  <div id="courseschedule">
    <div class="form-search">
      <el-button type="primary" @click.native="goBack" v-if="this.$route.params.courseid">返回</el-button>
    </div>
    <!--表-->
    <el-table ref="singleTable" :data="list" highlight-current-row style="width: 100%" v-loading='loading'>
      <el-table-column property="sectionName" label="课次" style="width:20%">
      </el-table-column>
      <el-table-column property="" label="上课时间" style="width:20%">
        <template slot-scope="scope">
          {{scope.row.courseDate}} {{scope.row.startTime}}至{{scope.row.endTime}}
        </template>
      </el-table-column>
      <el-table-column property="teacherNames" label="上课老师" style="width:10%">
      </el-table-column>
      <el-table-column property="teachAddress" label="上课地址" style="width:10%">
      </el-table-column>
      <el-table-column property="createdAt" label="创建时间" style="width:20%">
      </el-table-column>
      <el-table-column property="statusDesc" label="状态" style="width:20%">
      </el-table-column>
    </el-table>

    <!--分页-->
      <div class="pagination" v-if="list&&list.length">
          <el-pagination
              :current-page='pageNo'
              @current-change="show"
              class="pages"
              :page-size="pageSize"
              :layout="pageLayout"
              :total="pageTotal">
          </el-pagination>
      </div>
  </div>
</template>

<script>
  import services from '../../services'
  import pageMix from '../../mixins/pagerList'
  export default {
    mixins:[pageMix],
    name: 'courseschedule',
    data() {
      return {
      }
    },
    created: function(){},
    methods: {
      goBack(){
        window.history.go(-1)
      },
      show: function(pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          courseId: this.$route.params.courseid
        };

        services.course_listschedules(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
    }
  }
</script>
<style scoped>
  .seach .el-input {
    width: 150px;
  }

  .center {
    text-align: center
  }

  .margin-top {
    margin-top: 30px;
  }

  .float-right {
    float: right;
  }

  .list {
    text-align: center
  }

  .block {
    margin-top: 40px;
    text-align: right
  }

  .add .el-input {
    width: 300px;
  }

  .add .el-select {
    width: 300px;
  }

  .pages{margin: 0 auto; padding: 0;}
</style>