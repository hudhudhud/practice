<template>
  <div id="coursecolumntwo">
    <div class="search form-search">
      <label>一级品种</label>
      <el-select  style="width:160px;" clearable placeholder="一级品种检索" v-model="parentId">
       <el-option v-for="item in select.coursecolumns" :label="item.termName" :value="item.id" :key="item.id">
       </el-option>
      </el-select>
      <el-input v-model="name" placeholder="请输入检索名称"></el-input>
      <el-button icon="el-icon-search" @click="show">搜索</el-button>
      <el-button @click="cancelSearch">重置</el-button>
      <el-button type="primary" @click="handleAdd" class="float-right">添加</el-button>
    </div>

    <div>
      <!--表-->
      <el-table ref="singleTable" :data="list" highlight-current-row style="width: 100%" v-loading='loading'>
        <el-table-column property="parentName" label="一级品种名称" style="width:30%">
        </el-table-column>
        <el-table-column property="termName" label="二级品种名称" style="width:30%">
        </el-table-column>
        <el-table-column property="createdAt" label="创建时间" style="width:30%">
        </el-table-column>
        <el-table-column label="操作" style="width:40%">
          <template slot-scope="scope">
            <a  @click="handleEdit(scope.row)">编辑</a>
          </template>
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

    <el-dialog :title="coursecolumn.id?'修改二级品种':'添加二级品种'" :visible.sync="dialogVisible" width="30%">
      <el-row>
          <el-col :span="14" :offset="1">
              <el-form class="add" :model="coursecolumn" :rules="rules" ref="coursecolumn" label-width="120px" label-position="right">
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="一级品种" prop="parentTermId">
                              <el-select  style="width:160px;" clearable placeholder="一级品种检索" v-model="coursecolumn.parentId">
                                <el-option v-for="item in select.coursecolumns" :label="item.termName" :value="item.id" :key="item.id">
                                </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="24" class="top">
                      <el-col :span="30">
                          <el-form-item label="二级品种" prop="termName">
                              <el-input v-model="coursecolumn.termName" style="width:240px;"></el-input>
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
  </div>
</template>

<script>
  import services from '../../services'
  import pageMix from '../../mixins/pagerList'
  export default {
    mixins:[pageMix],
    name: 'coursecolumntwo',
    data() {
      return {
        dialogVisible: false,
        coursecolumns: [],
        parentId: '',
        name: '',
        coursecolumn: {
          id: null,
          parentId: '',
          termName: '',
        },
        select: {
          coursecolumns: []
        },
        rules: {
          parentId: [
                    { required: true, message: '请选择一级品种', trigger: 'blur' },
                ],
          termName: [
                    { required: true, message: '请输入二级品种名称', trigger: 'blur' },
                ]
        },
      }
    },
    created: function(){
      services.coursecolumn_listFirst({queryAll: true}).then((res) => {
        this.select.coursecolumns = res.data.data.list;
      })

      this.show();
    },
    methods: {
      show: function(pageNo){
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          parentId: this.parentId,
          name: this.name
        };

        services.coursecolumn_listSecond(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleAdd: function(){
        this.dialogVisible = true;
        this.coursecolumn = {};
      },
      handleEdit: function(row){
        this.dialogVisible = true;
        this.coursecolumn =  JSON.parse(JSON.stringify(row));
      },
      handleSubmit: function(){
        this.$refs.coursecolumn.validate((valid) => {
          if (valid) {
              let params = JSON.parse(JSON.stringify(this.coursecolumn));
              params.parentTermId = this.coursecolumn.parentId;

              if(!this.coursecolumn.id){
                services.coursecolumn_save(params)
                .then((data) => {
                    this.dialogVisible = false;
                    this.coursecolumn = {};
                    this.show();
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
              }
              else{
                services.coursecolumn_update(params)
                .then((data) => {
                    this.dialogVisible = false;
                    this.coursecolumn = {};
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
      handleCancel: function(){
        this.dialogVisible = false;
      },
      cancelSearch (){
        this.parentId = null;
        this.name = null;
        
        this.show();
      }
    }
  }
</script>

<style scoped>
  .search .el-input {
    width: 150px;
  }

  .el-input {
    width: 20%
  }

  .el-input {
    width: 190px;
  }

  .float-right {
    float: right;
  }

  .input-right>span {
    display: inline-block;
    padding: 0 12px;
  }


  .color {
    color: #ffffff
  }

  .has-gutter>.el-table_1_column_5>.cell {
    text-align: right;
  }

  .el-dialog__title {
    text-align: left
  }



  .label-1 {
    display: inline-block;
    position: absolute;
    left: 111px;
    top: 10px
  }

  .input-two,
  .input-three {
    width: 217px;
    height: 35px;
    line-height: 35px;
  }

  .input-two {
    margin-right: 28px;
  }

  .type-label {
    padding: 20px 0
  }

  .select,
  .type-label,
  .order {
    text-align: center
  }

  .select {
    padding-left: 28px;
    position: relative;
  }

  .pages{margin: 0 auto; padding: 0;}
</style>