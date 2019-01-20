<template>
    <div class="pwd-edit">
        <formInput  :item="{label:'原密码',required:true,type:'password',placeholder:'6-20个字符',key:'oldPassword',rule:'^.{6,20}$',errorMsg:'6-20个字符'}" :model.sync="pwd.oldPassword"  ref='oldPassword'/>
        <formInput  :item="{label:'新密码',required:true,type:'password',placeholder:'6-20个字符',key:'newPassword',rule:'^.{6,20}$',errorMsg:'6-20个字符'}" :model.sync="pwd.newPassword" ref='newPassword'/>
        <formInput  :item="{label:'确认新密码',required:true,type:'password',placeholder:'6-20个字符',key:'repPNewPassword'}" :model.sync="repPNewPassword"/>
        <div class="sub-btns-left" >
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
import cfg from '../../config/config'
import services from '../../services'
import formInput from '../../component/formInput'
export default {
    components: {
        formInput
    },
    data(){
        return {
            pwd:{
                oldPassword:"",
                newPassword:"",
            },
            repPNewPassword:""
        }
    },
    methods:{
        handleSubmit(){
            if(!this.$refs['oldPassword'].check() || !this.$refs['newPassword'].check()){
                this.$message({
                    type: 'warning',
                    message: '填写信息有误'
                });
                return
            }
            if(this.pwd.newPassword!=this.repPNewPassword){
                this.$message({
                    type: 'warning',
                    message: '确认密码与新密码不一样！'
                });
                return
            }
            services.user_updatePassword(this.pwd).then(data=>{
                let res=data.data
                if(res.status==0){
                    this.$alert('请重新登录', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                          services.user_loginout().then((res) => {
                                if (res.data.status == 0) {
                                    this.$router.push('/login');
                                }
                            })
                        }
                    });
                }
                else{
                    this.$message.error(res.msg);
                }
            })
        }
    }
}
</script>
<style lang="less">
.pwd-edit{
    .formInput{
        label{
            width:120px;
        }
        .el-input{
            width:200px;
        }
    }
}
</style>


