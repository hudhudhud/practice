<template>
  <div id="importStudentParent">
    <div>
      <span style="color:red;font-size:16px">excel批量导入可将整校的用户批量导入到系统中</span>

      <pre>
        第一步：<a :href="downloadUrl">单击这里下载excel表格（学生家长信息导入）</a>。
        第二步：填写好信息后（班级名称为创建的班级名称，如：一年级(101)，性别为：男、女），通过上传按钮上传excel。
        第三步：系统会对excel数据进行验证，按提示操作。
        第四步：验证完成后，系统会开始导入数据。
        注意：单次导入最多500条数据。
      </pre>

      <el-button type="primary"  @click="importInfo">导入学生家长信息</el-button>
      <form id="importForm" enctype="multipart/form-data" v-show="false">
          <input @change="submitFile" v-show="false" id="fileInp" type="file" name="file">
      </form>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import axios from 'axios'
  import cfg from '../../config/config'
  import services from '../../services'

  export default {
    name: 'importStudentParent',
    data() {
      return {
        downloadUrl: ''
      }
    },
    created: function() {
      this.downloadUrl = cfg.baseUrl + "download/getParentImp";
    },
    methods: {
      importInfo () {
        document.getElementById('fileInp').click();
      },
      submitFile () {
          let self = this;
          let frm = document.getElementById('importForm');
          let frmData = new FormData(frm);
          let uri = cfg.baseUrl + "import/importStudentParent";

          let config = {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          }
          
          axios.post(uri, frmData, config)
          .then(function(res){
              let resData = res.data;
              if(resData.success){
                  self.$message.success("导入成功");

                  self.$router.push('/baseInfo/studentMessage');
              }else{
                  self.$message.warning((resData.msg&&resData.msg[0])?resData.msg[0].errorInfo:'上传失败');
              }
          })
          .catch(function(error){
              self.$message.warning(error);
              console.log('error值：', error)
          })
      }
    }
  }
</script>
<style scoped lang="less">
  #importStudentParent{
    font-size:14px;
    line-height: 2em;
    color:#606266;
    font-family: "Microsoft YaHei";
    pre{
      font-family: "Microsoft YaHei";
    }
  }
</style>
