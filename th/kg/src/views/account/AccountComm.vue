<template>
    <form class="sch-account">
        <formInput :item="{label:'社区名称',key:'name',required:true,style:'width:200px;',disabled:true}" :model.sync="accountInfo.name"  ref="name"/>
        <div class="form-line">
            <label style="padding-right:10px;" class="form-label">所属省市区</label>
            <addressSel  @handelChoose="handleChoose" :addOptions="area" :disabled="true"/>
        </div>
        <formInput  :item="{label:'地址',key:'address',style:'width:310px'}" :model.sync="accountInfo.address" class="address"/>
        <formInput  :item="{label:'联系人',key:'contact',required:true,}" :model.sync="accountInfo.contact" ref="contact"/>
        <formInput  :item="{label:'电话号码',key:'phone',required:true,type:'phone'}" :model.sync="accountInfo.phone" ref="phone"/>
        <formInput  :item="{label:'用户名',key:'loginname',required:true,disabled:true,}"  :model.sync="accountInfo.loginname"/>
        <div class="sub-btns-left" >
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
    </form>
</template>

<script>
import cfg from '../../config/config'
import services from '../../services'
import formInput from '../../component/formInput'
import addressSel from '../../modulePage/addressSelect'

export default {
    components: {
        formInput,
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
            }
        }
    },
    created(){
        services.school_detailAccount()
        .then((res) => {
            var res = res.data;
            if(res.data){
                Object.keys(this.accountInfo).forEach(key=>{
                    this.accountInfo[key]=res.data[key]
                })
                this.area.address=[res.data.province,res.data.city,res.data.county]
            }
        })
        .catch(function(error){
            console.log('error值：', error)
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
             
            services.school_update(this.accountInfo)
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


</style>
<style lang="less">
.sch-account{
    .formInput:not(.address){
        .el-input .el-input__inner{
            width:130px;
        }
    }
}
</style>
