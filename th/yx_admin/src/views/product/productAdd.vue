<template>
    <section class="productAdd">
        <!--<Tinymce ref="editor" :height="400" v-model="editorContext" />-->
        <elm-form ref="myForm" :config="config" :formConfig="formConfig"
                  @form-submit="submit">
            <template slot="proKeyWords" slot-scope="{options}">
                <my-tag :options.sync="proKeywords" :btnTxt="'添加关键字'"></my-tag>
            </template>
            <template slot="addSpec" slot-scope="{options}">
                <select-spec :choosedSpecProp.sync="choosedSpec" @generateSpec="generateSpec"  :isEdit="true"></select-spec>
            </template>
            <template  slot="specList" slot-scope="{options}" >
                <generate-spec :choosedSpec.sync="generateData"  :specListRes.sync="specList"  :isEdit="true" :isNeedInit="false"></generate-spec>
            </template>
            <template slot="addTrans">
                <div style="margin-left:80px">
                    <el-button type="text" @click="addSupplier">新建供应商</el-button>
                    <el-button type="text" @click="addTransTemplate" >新建运费模板</el-button>
                    <el-button type="text" @click="addReturnAddress" >新建退货地址</el-button>
                </div>
            </template>
            <template slot="healthKeyCode"  slot-scope="{options}">
                <my-tag :options.sync="healthKeyCode" :btnTxt="'添加关键字'" :addCb="addHelTag" :removeCb="delHelTag"></my-tag>
                <el-button size="mini" @click="healthDialogVisible=true">选择健康关键字</el-button>
                <HealthTagDialog  :visible.sync="healthDialogVisible" @pushHelTagFromChoose="pushHelTagFromChoose"/>
            </template>
        </elm-form>
        <elm-alert-form ref="addSupplierForm" :config="supplierConfig">
        </elm-alert-form>
        <!--<AddTransTemplate ref="addTransTemplateForm"   />-->
        <elm-alert-form   ref="addReturnAddressForm" :config="returnAddressConfig">
        </elm-alert-form>

        <!--新增运费模板-->
        <elm-alert-form ref="addTransTemplateForm" :config="transTemplateConfig" class="trans-template-form">
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
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    // import Tinymce from '@/components/Tinymce'
    import Tag from '@/components/Tag'
    import GenerateSpec from '@/components/GenerateSpec'
    import SelectSpec from '@/components/SelectSpec'
   // import AddTransTemplate from "@/components/AddTransTemplate"
    import productCommon from "@/mixins/productCommon"
    import {fileUploadUrl} from "@/assets/const.js"
    import {selectDown} from "@/assets/const";
    import {save} from "@/service/module/product"
    import {list as list_supplier} from "@/service/module/supplier"
    import productConfig from "@/assets/formConfig/productConfig"
    import transTemplateConfig from "@/assets/formConfig/transTemplateConfig"
    import HealthTagDialog from "@/components/HealthTagDialog"
    export  default {
        components:{
            //Tinymce,
            'myTag':Tag,
            GenerateSpec,
            SelectSpec,
            //AddTransTemplate,
            HealthTagDialog
        },
        mixins:[productCommon],
        data(){
            return {
                selectDown,
                formConfig:{showCancelButton: true, confirmButtonText: '保存',},
                config: [
                    ...productConfig.baseInfo,
                    ...productConfig.specInfo,
                    //运费
                    new formItem.CustomComponent({
                        key:'addTrans',
                        name: 'addTrans',
                        label: '',
                    }),
                    new formItem.Editor({
                        key: 'detail',
                        label: '商品详情',
                        rules:[
                            {required:true,message:'请输入商品详情',trigger:'blur'},
                        ],
                        url:fileUploadUrl
                    }),
                    //健康
                    ...productConfig.healthInfo
                ],
                proKeywords:[],
                editorContext:'',
                specList:[],//生成的产品规格表
                choosedSpec:[],//[{key:'颜色',value:['红']}],//已经选择的规格数据
                generateData:[],//同choosedSpec，传给规格表组件的数据，不能直接用choosedSpec,否则choosedSpec改变就直接触发表格重新生成
                healthKeyCode:[],
                supplierId:'',
                transTemplateConfig,
                healthDialogVisible:false,
            }
        },
        async created(){
            let self=this;
            this.config.splice(this.config.length-4,0,
                new formItem.Select({
                    key:'supplierId',
                    label:'供应商',
                    options:self.supplierOptions,
                    resKey:'records',
                    labelKey:'name',
                    valueKey:'id',
                    remote:true,
                    filterable:true,
                    services:list_supplier,
                    paramQueryName:'name',
                    otherParams:{current:1,size:10},
                    changeCb:self.changeTransAddress,
                    placeholder:'输入关键字搜索供应商',
                    rules:[
                        {required:true,message:'请选择供应商',trigger:'blur'},
                    ]
                }),
                new formItem.Select({
                    key: 'postageId',
                    label: '运费设置',
                    options: self.transOptions,
                    // resKey:'records',
                    labelKey:'name',
                    valueKey:'id',
                }),
                new formItem.Select({
                    key: 'returnAddress',
                    label: '退货地址',
                    options: self.addressOptions,
                    // resKey:'records',
                    // labelKey:'name',
                    // valueKey:'id',
                }))

            let {records} =await list_supplier({current:1,size:10});
            this.supplierOptions.splice(0,this.supplierOptions.length,...records)
        },
        methods:{
           async submit(form){
                // e['editorContext']=this.editorContext

                let sendForm=JSON.parse(JSON.stringify(form))
                delete sendForm.mainImg
                delete sendForm.images
                //商品类别
                if(form.categoryIds&&form.categoryIds.length){
                    sendForm.categoryId=form.categoryIds[form.categoryIds.length-1]
                }

                //商品图片
                let  imageList=[]
                if(form.images&&form.images.length){
                    imageList=form.images.map(item=>{ return {fileId:item.id,"main":false}})
                }
                //商品主图
                if(form.mainImg && form.mainImg.id){
                    imageList.push({fileId:form.mainImg.id,"main":true})
                }
                sendForm.imageJson=JSON.stringify(imageList)

                //商品关键字
                if(this.proKeywords&&this.proKeywords.length){
                    sendForm.keywordJson=JSON.stringify(this.proKeywords.map(item=>{return {keyword:item}}))
                }
                //商品信息图
                if(form.fileInfo&&form.fileInfo.id){
                    sendForm.fileInfoId=form.fileInfo.id
                }

                if(!this.choosedSpec||!this.choosedSpec.length){
                    this.$message({
                        type:"warning",
                        message:'请添加商品型号！'
                    })
                    return
                }
                 //规格json
                if(this.specList&&this.specList.length){
                    if(!this.specList.every(item=>item.supplyPrice!==null&&item.supplyPrice!==undefined
                        &&item.price!==null&&item.price!==undefined
                        &&item.retailPrice!==null&&item.retailPrice!==undefined
                        &&item.quantity!==null&&item.quantity!==undefined)){
                        this.$message({
                            type:"warning",
                            message:'请输入商品价格与库存！'
                        })
                        return
                    }
                   sendForm.skuJson = JSON.stringify(this.specList.map(item=>{
                       let obj={}
                       obj.skuStr={}
                       let spec=this.generateData.map(item=>item.key)
                       for(let key of spec){
                           obj.skuStr[key]=item[key]
                       }
                       obj.fileId=item.fileId
                       obj.supplyPrice=item.supplyPrice
                       obj.retailPrice=item.retailPrice
                       obj.price=item.price
                       obj.quantity=item.quantity
                       obj.standardSn=item.standardSn
                       return obj
                   }))
                }
                else{
                    this.$message({
                        type:"warning",
                        message:'请添加商品规格！'
                    })
                    return
                }

                //健康标签
                if(this.healthTagIdList&&this.healthTagIdList.length){
                    sendForm.healthTagJson=JSON.stringify(
                        this.healthTagIdList.map(item=>{
                            return {
                                tagId:item.id
                            }
                        })
                    )
                }

               // console.log('submit',sendForm)
                await save(sendForm, {successMsg: '保存成功'})
                this.$router.push('/product/productManage')
            },
            //生成规格表
            generateSpec(){
                this.generateData=JSON.parse(JSON.stringify(this.choosedSpec))
            },

        }
    }
</script>
<style lang="scss" scoped>
    .productAdd{
        .choosed-spec{
            background-color:rgba(0,0,0,0.1)
        }
    }
</style>
