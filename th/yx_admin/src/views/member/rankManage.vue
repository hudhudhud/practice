<template>
    <section>
        <table class="detail_table">
            <tr>
                <td>等级</td>
                <td>等级名称</td>
                <td>升级条件</td>
                <td>降级条件</td>
                <td>描述</td>
            </tr>
            <tr>
                <td>等级1</td>
                <td>普通会员</td>
                <td>注册</td>
                <td>无</td>
                <td><el-input  v-model="detail[0].description"/></td>
            </tr>
            <tr>
                <td>等级2</td>
                <td>店主</td>
                <td>普通会员购买礼包 </td>
                <td>无</td>
                <td><el-input  v-model="detail[1].description"/></td>
            </tr>
            <tr>
                <td>等级3</td>
                <td>一星店主</td>
                <td>店主直推 <el-input-number v-model="detail[2].value"  controls-position="right"></el-input-number> 个店主</td>
                <td>无</td>
                <td><el-input  v-model="detail[2].description"/></td>
            </tr>
            <tr>
                <td>等级4</td>
                <td>二星店主</td>
                <td>一星店主直推 <el-input-number v-model="detail[3].value"  controls-position="right"></el-input-number> 个一星店主</td>
                <td>无</td>
                <td><el-input  v-model="detail[3].description"/></td>
            </tr>
            <tr>
                <td>等级5</td>
                <td>三星店主</td>
                <td>后台手动调整</td>
                <td>无</td>
                <td><el-input  v-model="detail[4].description"/></td>
            </tr>
        </table>
        <el-button type="primary" @click="submit">保存</el-button>
    </section>
</template>
<script>
    import {find_user_rank_upgrade_config as view,save_rank_upgrade_config as save} from "@/service/module/member"
    export default{
        data(){
            return {
                detail:[
                    {type:'V0_UPGRADE', description:''},
                    {type:'V0_UPGRADE_V1_SIZE', description:'' },
                    {type:'V1_UPGRADE_V2_SIZE', description:'' },
                    {type:'V2_UPGRADE_V3_SIZE', description:'' },
                    {type:'V3_UPGRADE_V4_SIZE', description:'' },
               ]
            }
        },
        async created(){
            let res=await view()
            if(res&&res.length){
                this.detail=res
            }
        },
        methods:{
            submit(){
                console.log(this.detail)
                save({configJson:JSON.stringify(this.detail)},{successMsg:"保存成功!"})
            }
        }
    }
</script>
<style>

</style>
