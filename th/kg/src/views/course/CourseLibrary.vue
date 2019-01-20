<template>
  <div id="courselibrary">
    <!--搜索-->
    <div class="form-search">
      <label>所属区域</label>
      <addressSel :addOptions="addOptions" @handelChoose="handleChoose"></addressSel>
      <label>品种</label>
      <courseColumnSel @handelChoose="handleCourseColumnChoose" :model="termTaxonomyIdsSearch"></courseColumnSel>
      <label>名称</label>
      <el-input v-model="name" placeholder="请输入检索名称"></el-input>
      <el-button icon="el-icon-search" @click="show">搜索</el-button>
      <el-button @click="cancelSearch">重置</el-button>
      <el-button type="primary" @click="handleAdd" class="color fr">添加</el-button>
    </div>

    <!--列表-->
    <div class="seek">
      <!--数据表-->
      <el-table ref="singleTable" :data="list" highlight-current-row style="width: 100%" v-loading='loading'>
        <el-table-column property="name" label="课程名称" style="width:20%">
        </el-table-column>
        <el-table-column property="type" label="课程归属" style="width:20%">
          <template slot-scope="scope">
                <span v-if="scope.row.type=='standard'">全国</span>
                <span v-else>本地</span>
          </template>
        </el-table-column>
        <el-table-column property="termTaxonomyPathDesc" label="品种" style="width:10%">
        </el-table-column>
        <el-table-column property="" label="所属区域" style="width:20%">
          <template slot-scope="scope">
              <span>
                  <span v-if="scope.row.provinceName">{{scope.row.provinceName}}</span>
                  <span v-if="scope.row.cityName">{{scope.row.cityName}}</span>
                  <span v-if="scope.row.countyName">{{scope.row.countyName}}</span>
              </span>
          </template>
        </el-table-column>
        <el-table-column property="createdAt" label="创建时间" style="width:20%">
        </el-table-column>
        <el-table-column label="操作" style="width:30%">
          <template slot-scope="scope">
            <a  v-if="orgType=='admin'|| (orgType=='edu_bureau' && scope.row.type!='standard')" @click="handleEdit(scope.row.id)">编辑</a>
          </template>
        </el-table-column>
      </el-table>

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

    <div>
      <!--添加-->
      <el-dialog :title="courseLibraryId?'修改课程库':'添加课程库'" :visible.sync="addDialogVisible" width="50%" >
         <courseLibraryAdd  :subCb="subCb" :canCb="canCb" :courseLibraryId="courseLibraryId"  :showAddress="orgType!='edu_bureau'" />
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import cfg from '../../config/config'
  import services from '../../services'
  import imgUpload from '../../component/imgUpload.vue'
  import addressSel from '../../modulePage/addressSelect.vue'
  import courseColumnSel from '../../modulePage/courseColumnSelect.vue'
  import courseLibraryAdd from '../../component/courseLibraryAdd.vue'
  import pageMix from '../../mixins/pagerList'
  export default {
    name: 'courselibrary',
    mixins:[pageMix],
    components: {
      imgUpload ,
      addressSel,
      courseColumnSel,
      courseLibraryAdd
    },
    data() {
      return {
        addDialogVisible: false,
        name: '',
        input: '',
        searchAddressInfo: {
          province: '',
          city: '',
          county: ''
        },
        termTaxonomyId: '',
        addOptions: {
            size: '',
            address: ""
        },
        pageTotal: '',
        courselibrarys: [],
        imgSrcList: [],
        addOptions2Add: {
          size: '',
          address: ''
        },
        rules: {
          name: [
                    { required: true, message: '请输入课程名称', trigger: 'blur' },
                ]
        },
        termTaxonomyIds:[],
        termTaxonomyIdsSearch:[],
        courseLibraryId:"",
        orgType:""
      }
    },
    created: function(){
      this.orgType=JSON.parse(localStorage.info).orgType

      this.show();
    },
    methods: {
      show: function(pageNo){
        this.courseLibraryId=""
        this.beforeShow(pageNo)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          province: this.searchAddressInfo.province,
          city: this.searchAddressInfo.city,
          county: this.searchAddressInfo.county,
          termTaxonomyId: this.termTaxonomyId,
          name: this.name,
          //subType: self.subType
        };

        services.courselibrary_list(params)
        .then((res) => {
            this.listSuccessCb(res)
        })
        .catch((err) => {
            this.listExceptionCb(err)
        })
      },
      handleChoose (value, status) {
        this.searchAddressInfo.province = value.province;
        this.searchAddressInfo.city = value.city;
        this.searchAddressInfo.county = value.county;
      },
      subCb(){
        this.addDialogVisible = false;
        this.show(this.pageNo);
      },
      canCb(){
        this.addDialogVisible = false;
      },
      handleCourseColumnChoose (value, status) {
        if (value.columnone) {
          this.termTaxonomyId = value.columnone;
        }
        else{
          this.termTaxonomyId=''
        }
        if (value.columntwo) {
          this.termTaxonomyId = value.columntwo;
        }
      },
      handleAdd (){
        this.addDialogVisible = true;
        this.courseLibraryId=""
      },
      handleCancel () {
        this.addDialogVisible = false;
      },
      cancelSearch (){
        this.name = null;
        //this.subType = null;
        this.searchAddressInfo = {
          province: '',
          city: '',
          county: ''
        };
        this.addOptions.address=[]
        this.termTaxonomyIdsSearch=[]
        this.termTaxonomyId=""
        
        this.show();
      },
      handleEdit(id){
        this.courseLibraryId=id
        this.addDialogVisible=true
          
      },
    }
  }
</script>
<style scoped lang="less">
  .el-select {
    width: 100px;
  }

  .el-input {
    width: 15%
  }

  .seek {
    margin-top: 20px;
  }

  .input-right {
    float: right;
  }

  .class_type {
    margin-top: 20px;
  }

  .class_type .el-select {
    width: 300px
  }

  .class_name .el-input {
    width: 400px;
    height: 36px;
    line-height: 36px;
  }

  .linkage_rank {
    margin-top: 20px;
  }

  .linkage_rank .el-select {
    width: 140px
  }

  .add_type {
    margin-top: 20px
  }

  .add_type .el-select {
    width: 400px;
  }

  .class_rank_one {
    margin-top: 20px;
  }

  .class_rank_one .el-select {
    width: 430px;
  }

  .center {
    text-align: center
  }

  .host_sort {
    margin-top: 20px
  }

  .host_sort .el-input {
    width: 400px;
  }

  .class_intro {
    margin-top: 20px
  }

  .class_intro .el-input {
    width: 400px
  }

  .class_lightspot {
    margin-top: 20px;
  }

  .class_lightspot .el-input {
    width: 78px
  }

  .cover {
    margin-top: 40px;
    position: relative;
  }

  .cover_position {
    position: absolute;
    left: 200px;
    top: -20px
  }

  .img_up {
    position: relative;
    margin-top: 40px
  }

  .block {
    margin-top: 35px;
    text-align: right
  }

  .pages{margin: 0 auto; padding: 0;}

  .img{
    vertical-align: top;
    text-align: center;
    margin-right: 10px;
    line-height: 100px;
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px dashed #eee;
    img{
      max-width: 100px;
      max-height: 120px;
      vertical-align: middle;
    }
  }

  .up_img{
    display: inline-block;
    width: 100px;
    height: 100px;
    background: url(../../assets/img/btn_import@2x.png);
    background-size: contain;
    position: relative;
  }

  .up_input{
      cursor: pointer;
      position: absolute;
      top: 0;
      display: inline-block;
      width: 100px;
      height: 100px;
      opacity: 0;
  }

  .coll_list {
    margin-top: 15px;
    width: 93%;
    padding: 15px 50px 18px;
    overflow: auto;
  }

  .coll_list li {
    list-style-type: none;
    float: left;
    width: 120px;
    height: 120px;
    margin: 0 40px 40px 0;
    text-align: center;
  }

  .pictures {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 120px;
    height: 120px;
    border: 1px solid #c0ccda;
    > img {
        overflow: hidden;
        max-width: 118px;
        max-height: 118px;
    }
  }
</style>
<style lang="less" >
  .subType{
    height: 40px;
    &.el-select{
      width:120px;
    }
    .el-input{
      font-size:14px;
    }
    .el-input--mini .el-input__inner{
      height: 40px;
      line-height: 40px;
    }
  }
</style>
