<template>
  <div id="classmanagement">
    <div class="search form-search">
      <label>年级</label>
      <el-select  style="width:160px;" clearable placeholder="年级检索" v-model="gradeId">
           <el-option v-for="item in select.grades" :label="item.name" :value="item.id" :key="item.id">
           </el-option>
      </el-select>
      <label>班级</label>
      <el-select  style="width:160px;" clearable placeholder="班级检索" v-model="number">
           <el-option v-for="item in select.classNos" :label="item.label" :value="item.value" :key="item.value">
           </el-option>
      </el-select>
      <el-button icon="el-icon-search" @click="show">搜索</el-button>
      <el-button @click="cancelSearch">重置</el-button>
      <el-button type="primary" @click="handleAdd" class="fr">添加</el-button>
    </div>

    <!--弹出框-->
    <el-dialog :title="classinfo.id?'修改班级':'添加班级'"  :visible.sync="dialogVisible"  width="50%">
      <el-row>
         <el-col :span="14" :offset="1">
             <el-form class="add" :model="classinfo" :rules="rules" ref="classinfo" label-width="120px" label-position="right">
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="所属年级" prop="gradeId">
                              <el-select v-model="classinfo.gradeId" placeholder="请选择">
                                <el-option v-for="item in select.grades" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="选择班级" prop="number">
                              <el-select v-model="classinfo.number" placeholder="请选择">
                                <el-option v-for="item in select.classNos" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="名称" prop="name">
                              <el-input v-model="classinfo.name"></el-input>
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
        <template slot-scope="{scope}" slot='number'>
             {{scope.row.number}}班
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
    name: 'classmanagement',
    data() {
      return {
        dialogVisible: false,
        gradeId: '',
        number: '',
        classinfo:{},
        select: {
          grades: [],
          classNos: []
        },
        rules: {
          gradeId: [
                    { required: true, message: '请选择所属年级', trigger: 'blur' },
                ],
          number: [
                    { required: true, message: '请选择班级', trigger: 'blur' },
                ]
        },
        columns:[
                { key: 'gradeName', title: '年级' },
                { key:'number',title: '班级',slot:'number'},
                { key:'name',title: '班级名称'},
                { key:'',title: '学生列表',slot:'studentList'},
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
      this.classInfoInit();
      services.grade_list().then((res) => {
        this.select.grades = res.data.data.list;
      })
      services.option_listClassNo().then((res) => {
        this.select.classNos = res.data.data;
      })
    },
    methods: {
      classInfoInit(){
        this.classinfo={
          id:'',
          gradeId: '',
          number: ''
        }
      },
      show(pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          gradeId: this.gradeId,
          number: this.number
        };

        services.class_list(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleAdd(){
        this.dialogVisible = true;
        this.classInfoInit();
      },
      handleEdit(row){
        this.dialogVisible = true;
        this.classinfo =JSON.parse(JSON.stringify(row));
      },
      handleSubmit(){
        this.$refs.classinfo.validate((valid) => {
          if (valid) {
              let params = JSON.parse(JSON.stringify(this.classinfo));
              if(!this.classinfo.id){
                services.class_save(params)
                .then((data) => {
                    this.dialogVisible = false;
                    this.classInfoInit();
                    this.show();
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
              }
              else{
                services.class_update(params)
                .then((data) => {
                    this.dialogVisible = false;
                    this.classInfoInit();
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
      cancelSearch (){
        this.gradeId = null;
        this.number = null;
        this.show();
      }
    }
  }
</script>
<style scoped>
 
</style>