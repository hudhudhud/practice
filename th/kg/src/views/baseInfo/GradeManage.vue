<template>
  <div id="grademanagement">
    <div class="seach form-search">
      <el-input v-model="name" placeholder="请输入年级名称"></el-input>
      <el-button icon="el-icon-search" @click="show">搜索</el-button>
      <el-button @click="cancelSearch">重置</el-button>
      <el-button type="primary" @click="handleAdd" class="fr">添加</el-button>
    </div>

    <!--弹出框-->
    <el-dialog :title="grade.id?'修改年级':'添加年级'" :visible.sync="dialogVisible" width="50%">
      <el-row>
         <el-col :span="14" :offset="1">
             <el-form class="add" :model="grade" :rules="rules" ref="grade" label-width="120px" label-position="right">
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="入学年份" prop="year">
                              <el-select v-model="grade.year" placeholder="请选择">
                                <el-option v-for="item in select.years" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="名称" prop="name">
                              <el-input v-model="grade.name"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="统一升级" prop="graduated">
                              <el-select v-model="grade.graduated" placeholder="请选择">
                                <el-option v-for="item in select.graduatedoptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  
                  <el-form-item>
                      <el-button type="text" @click="handleCancel">取消</el-button>
                      <el-button type="primary" @click="handleSubmit">确定</el-button>
                  </el-form-item>
              </el-form>
          </el-col>
      </el-row>
    </el-dialog>

    <!--表-->
    <base-table v-loading="loading" :columns="columns" :list="list" @handleEdit='handleEdit'>
        <template slot-scope="{scope}" slot='graduated'>
            <span v-if="(scope.row.graduated==0)"><i class="el-icon-close"></i></span>
            <span v-if="(scope.row.graduated==1)"><i class="el-icon-check"></i></span>
        </template>
        <template slot-scope="{scope}" slot="studentList">
            <router-link :to="'/baseInfo/studentmessage?cla='+scope.row.id">学生列表</router-link>
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
  export default {
    mixins: [pageMix],
    name: 'grademanagement',
    data() {
      return {
        dialogVisible: false,
        name: '',
        grade: {
          id: null,
          year: '',
          name: '',
          graduated: ''
        },
        select: {
          graduatedoptions: [
            {label: '是', value: 1},
            {label: '否', value: 0}
          ],
          years: []
        },
        rules: {
          year: [
                    { required: true, message: '请选择入学年份', trigger: 'blur' },
                ],
          name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ]
        },
        columns:[
                { key: 'year', title: '入学年份' },
                { key:'name',title: '名称'},
                { key:'graduated',title: '是否升级',slot:'graduated'},
                {
                      title: '操作', type: 'operate',
                      operates: [
                          {name: '编辑',emitKey: 'handleEdit'}
                      ]
                  }
            ]
      }
    },
    created: function(){
      this.grade = {};
      services.option_listYear().then((res) => {
        this.select.years = res.data.data;
      })
    },
    methods: {
      show(pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.name
        };

        services.grade_list(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleAdd(){
        this.dialogVisible = true;
        this.grade = {};
      },
      handleEdit(row){
        this.dialogVisible = true;
        this.grade =JSON.parse(JSON.stringify(row));
      },
      handleSubmit(){
        this.$refs.grade.validate((valid) => {
          if (valid) {
              let params = JSON.parse(JSON.stringify(this.grade));
              if(!this.grade.id){
                services.grade_save(params)
                .then((data) => {
                    this.dialogVisible = false;
                    this.grade = {};
                    this.show();
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
              }
              else{
                services.grade_update(params)
                .then((data) => {
                    this.dialogVisible = false;
                    this.grade = {};
                    this.show(this.pageNo);
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
              }
             
          } else {
              console.log('error submit!!');
              this.$message({
                  type: 'warning',
                  message: '请填写完整信息'
              });
              return false;
          }
       });
      },
      handleCancel(){
        this.dialogVisible = false;
      },
      handleCancelUpdate(){
        this.dialogVisible = false;
      },
      cancelSearch (){
        this.name = null;
        this.show();
      }
    }
  }
</script>
<style scoped>
  .seach .el-input {
    width: 150px;
  }

</style>
