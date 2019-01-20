<template>
  <div id="schoolsemester">
    <div class="seach form-search">
      <el-input v-model="name" placeholder="请输入学期名称"></el-input>
      <el-button icon="el-icon-search" @click="show">搜索</el-button>
      <el-button @click="cancelSearch">重置</el-button>
      <el-button type="primary" @click="handleAdd" class="fr">添加</el-button>
    </div>

    <!--弹出框-->
    <el-dialog :title="yearterm.id?'修改学年学期':'添加学年学期'" :visible.sync="dialogVisible" width="50%">
      <el-row>
         <el-col :span="14" :offset="1">
             <el-form class="add" :model="yearterm" :rules="rules" ref="yearterm" label-width="120px" label-position="right">
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="名称" prop="name">
                              <el-input v-model="yearterm.name"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="起始日期" prop="startDate">
                              <el-date-picker v-model="yearterm.startDate" type="date" placeholder="选择日期">
                              </el-date-picker>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                        <el-form-item label="结束日期" prop="endDate">
                            <el-date-picker v-model="yearterm.endDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="当前学年" prop="active">
                              <el-select v-model="yearterm.active" placeholder="请选择">
                                <el-option v-for="item in select.activeoptions" :key="item.value" :label="item.label" :value="item.value">
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
        <template slot-scope="{scope}" slot='active'>
            <span v-if="(scope.row.active==0)"><i class="el-icon-close"></i></span>
            <span v-if="(scope.row.active==1)"><i class="el-icon-check"></i></span>
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
    name: 'schoolsemester',
    mixins: [pageMix],
    data() {
      return {
        dialogVisible: false,
        name: '',
        yearterm: {
          id: null,
          name: '',
          startDate: '',
          endDate: '',
          active: ''
        },
        select: {
          activeoptions: [
            {label: '是', value: 1},
            {label: '否', value: 0}
          ]
        },
        rules: {
          name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
          startDate: [
                    { required: true, message: '请选择起始日期', trigger: 'blur' },
                ],
          endDate: [
                    { required: true, message: '请选择结束日期', trigger: 'blur' },
                ],
          active: [
                    { required: true, message: '请选择当前学年', trigger: 'blur' },
                ]
        },
        columns:[
            { key: 'name', title: '名称' },
            { key:'startDate',title: '起始日期'},
            { key:'active',title: '当前学年',slot:'active'},
            { key:'createdAt',title: '创建时间'},
            {
                  title: '操作', type: 'operate',
                  operates: [
                      {name: '编辑',emitKey: 'handleEdit'}
                  ]
              }
        ]
      }
    },
    created(){

    },
    methods: {
      show(pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.name
        };
        services.yearterm_list(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleAdd(){
        this.dialogVisible = true;
        this.yearterm = {};
      },
      handleEdit(row){
        this.dialogVisible = true;
        this.yearterm =  JSON.parse(JSON.stringify(row));
      },
      handleSubmit(){
        this.$refs.yearterm.validate((valid) => {
          if (valid) {
              let params = JSON.parse(JSON.stringify(this.yearterm));
              if(this.yearterm.startDate){
                params.startDate = Date.parse(this.yearterm.startDate);
              }
              if(this.yearterm.endDate){
                params.endDate = Date.parse(this.yearterm.endDate);
              }

              if(!this.yearterm.id){
                services.yearterm_save(params)
                .then((data) => {
                    this.dialogVisible = false;
                    this.yearterm = {};
                    this.show();
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
              }
              else{
                    services.yearterm_update(params)
                    .then((data) => {
                        this.dialogVisible = false;
                        this.yearterm = {};
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
        this.editDialogVisible = false;
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
