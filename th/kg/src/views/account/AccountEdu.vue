<template>
    <form  class="edu-account">
        <formInput :item="{label:'区域运营商名称',key:'name',required:true,style:'width:200px;',disabled:true}" :model.sync="accountInfo.name"  ref="name"/>
        <div>
            <label style="padding-right:10px;" class="label">所属省市区</label>
            <addressSel  @handelChoose="handleChoose" :addOptions="area" :disabled="true"/>
        </div>
        <formInput  :item="{label:'固定号码',key:'tellphone',}" :model.sync="accountInfo.tellphone" />
        <formInput  :item="{label:'联系人',key:'contact',required:true,}" :model.sync="accountInfo.contact" ref="contact"/>
        <formInput  :item="{label:'电话号码',key:'phone',required:true,type:'phone'}" :model.sync="accountInfo.phone" ref="phone"/>
        <formInput  :item="{label:'登录用户名',key:'loginname',required:true,disabled:true,}"  :model.sync="accountInfo.loginname"/>
        <formSelect :option="{label:'性别',list:genders,}" :model.sync="accountInfo.gender" />
        <formInput  :item="{label:'举报电话',key:'hotLine',}"  :model.sync="accountInfo.hotLine"/>
        <div class="sub-btns-left" >
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
    </form>
</template>

<script>
import cfg from '../../config/config'
import services from '../../services'
import formInput from '../../component/formInput'
import formSelect from '../../component/formSelect'
import addressSel from '../../modulePage/addressSelect'

export default {
    components: {
        formInput,
        formSelect,
        addressSel,
    },
    data(){
        return {
            area:{address:[]} ,
            accountInfo:{
                id:"",
                name:"",
                address:"",
                contact:"",
                phone:"",
                loginname:"",
                province:"",
                city:"",
                county:"",
                orgId:"",
                tellphone:"",
                gender:"",
                hotLine:""
            },
            genders: [
                {label: '男', value: 0},
                {label: '女', value: 1}
            ]
        }
    },
    created(){
        services.edubureau_detailAccount().then(data=>{
            let res=data.data
            if(res.data){
                Object.keys(this.accountInfo).forEach(key=>{
                        this.accountInfo[key]=res.data[key]
                })
                this.area.address=[res.data.province,res.data.city,res.data.county]
            }
        })
    },
    methods:{
        handleSubmit(){
            let complete = Object.keys(this.accountInfo).every(key=>{
                if(this.$refs[key]&&this.$refs[key].item){
                    return this.$refs[key].check()
                }
                return true
            })
            if(!complete){
                this.$message({
                    type: 'warning',
                    message: '请填写完整信息'
                });
                return
            }
            services.edubureau_update(this.accountInfo)
            .then((data) => {
                let res=data.data
                if(res.status==0){
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                }
                else{
                    this.$message.error(res.msg);
                }
            })
            .catch(function(error){
                console.log('error值：', error)
            })
        },
        handleChoose (value, status) {
            this.accountInfo.province = value.province;
            this.accountInfo.city = value.city;
            this.accountInfo.county = value.county;
        },
    }
}
</script>

<style lang="less" scoped>
.label{
    display: inline-block;
    width:120px;
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
</style>
<style lang="less" >
.edu-account{
    .formInput{
        label{
            width:120px;
        }
        .el-input{
            width:200px;
        }
    }
    .formSelect{
        label{
            width:120px;
        }
        .el-select{
            width:130px;
        }
    }
}

</style>

