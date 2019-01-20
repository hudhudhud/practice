<template>
  <div id="schoolsemester">
    <div class="search form-search">
      <label>供应商</label>
      <formSelectRemote  :option="{label:'',placeholder:'请输入供应商名称',clearable:true}"
                         :remote="supplierRemoteSearch"  :model.sync="supplierId"
                         :kv="{k:'name',v:'id'}"  style="display:inline-block;"
                      />
      <el-button icon="el-icon-search" @click.native="show">搜索</el-button>
      <el-button @click="cancelSearch">重置</el-button>
    </div>

    <!--表-->
    <base-table v-loading="loading" :columns="columns" :list="list" class="table-row-elli" >
        <template slot-scope="{scope}" slot='comment'>
            <span :title="scope.row.comment">{{scope.row.comment}}</span>
        </template>
    </base-table>
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
  import formSelectRemote from '../../component/formSelectRemote'
  export default {
    mixins:[pageMix],
    components:{
      formSelectRemote,
    },
    data() {
      return {
        comment:{
        },
        supplierRemoteSearch:{},
        supplierId:'',
        columns:[
                  { key: 'studentName', title: '学生姓名',width:'150px' },
                  { key:'loginname',title: '用户账号',width:'200px'},
                  { key:'supplierName',title: '点评对象',width:'150px'},
                  { key:'createdAt',title: '点评时间',width:'200px'},
                  { key:'scoreStr',title: '打分',width:'300px'},
                  { key:'comment',title: '内容',slot:'comment'},
              ]
      }
    },
    created: function(){
      this.supplierRemoteSearch={
        func:'supplier_list',
        key:'supplierName'
      }
    },
    methods: {
      show(pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          supplierId:this.supplierId,
        };

        services.lunchcomment_list(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      cancelSearch(){
        this.supplierId=''
        this.show()
      }
    }
  }
</script>
<style scoped lang='less'>

</style>
