<template>
    <elm-alert-form ref="addForm" :config="transTemplateConfig" class="trans-template-form">
        <template slot-scope="{scope}" slot="defaultFee" >
            <div class="temp-line">
                <el-input-number v-model="defaultFee.defaultNumber"  controls-position="right"></el-input-number>件内<el-input-number v-model="defaultFee.defaultPostage" :precision="1" :step="0.1" controls-position="right"></el-input-number>元，每增加<el-input-number v-model="defaultFee.addNumber" controls-position="right"></el-input-number>件，运费增加<el-input-number v-model="defaultFee.addPostage" :precision="1" :step="0.1" controls-position="right"></el-input-number>元
            </div>
        </template>
        <template slot-scope="{options}" slot="datailVoList" >
            <el-button type="text" @click="addNewFee">添加指定地区运费</el-button>
            <div v-for="(item,i) in otherFeeList" :key="i"  class="area-fee">
                <div class="clearfix">
                    <el-select v-model="item.districtId" placeholder="请选择区域"
                               :multiple="false"
                               :filterable="true">
                        <el-option :label="item.name"
                                   :value="item.id"
                                   v-for="(item, index) in options"
                                   :key="index"
                        ></el-option>
                    </el-select>
                    <el-button type="text" @click="deleteFee(i)" class="fr" >删除</el-button>
                </div>
                <div class="temp-line" >
                      <el-input-number v-model="item.defaultNumber"  controls-position="right"></el-input-number>件内<el-input-number v-model="item.defaultPostage" :precision="1" :step="0.1" controls-position="right"></el-input-number>元，每增加<el-input-number v-model="item.addNumber" controls-position="right"></el-input-number>件，运费增加<el-input-number v-model="item.addPostage" :precision="1" :step="0.1" controls-position="right"></el-input-number>元
                </div>
            </div>
        </template>
    </elm-alert-form>
</template>
<script>
    import transTemplateConfig from "@/assets/formConfig/transTemplateConfig"
    import {view} from "@/service/module/transTemplate"
    export default{
        props:{
            id:{
                type:[String,Number],
            },
        },
       watch:{
         async id(val){
             if(val){
                 //接口获取该运费模板详情
                 let {datailVoList,noDeliverDistrictVoList}=await view({id:val})
                 this.feeList=datailVoList
                 this.otherFeeList=this.feeList.filter(item=>item.districtId)
                 let item=this.feeList.find(item=>!item.districtId)
                 this.defaultFee=item?item:{};
                 this.noAddressIdList=noDeliverDistrictVoList.map(item=>item.districtId)
                 this.$refs.addForm.$refs[this.$refs.addForm.id].resetFormData({'noDeliverDistrictIdList':this.noAddressIdList})
             }
             else{
                 this.feeList=[]
                 this.otherFeeList=[]
                 this.defaultFee={}
                 this.noAddressIdList=[]
             }
         }
       },
        data(){
            return {
                transTemplateConfig,
                feeList:[],//所有数据
                defaultFee:{},//{defaultNumber:null,defaultPostage:null,addNumber:null,addPostage:null},
                otherFeeList:[],
                noAddressIdList:[1],
            }
        },
        methods:{
            addNewFee(){
                this.otherFeeList.push({districtId:""})
            },
            deleteFee(i){
                this.otherFeeList.splice(i,1)
            }
        }
    }
</script>
<style lang="scss" >
    .trans-template-form{
        width: 1000px;
        .temp-line{
            margin-top:10px;
            .el-input-number{
                width:120px;
                margin:0 10px;
            }
        }
        .area-fee{
            border:1px solid $borderColor;
            padding:5px;
            margin-top:10px;
        }
    }
</style>
