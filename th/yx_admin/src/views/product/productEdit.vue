<template>
    <section class="productEdit">
        <div class="base-info">
            <h3 class="block-title">基础信息</h3>
            <elm-form ref="baseInfoForm" :config="baseInfoConfig" :formConfig="formBaseInfoConfig"   @form-submit="submitBase"   @form-cancel="editInfo('editBaseStatus','getBaseInfo')" >
                <template slot="proKeyWords" slot-scope="{options}">
                    <my-tag :options.sync="proKeywords" :btnTxt="'添加关键字'" :closable="editBaseStatus" :showBtn="editBaseStatus"></my-tag>
                </template>
            </elm-form>
        </div>
        <div class="spec-info">
            <h3  class="block-title">规格信息</h3>
            <elm-form ref="specInfo" :config="specInfoConfig" :formConfig="formSpecConfig"   @form-submit="submitSpec"   @form-cancel="editInfo('editSpecStatus','getSpecInfo')">
                <template slot="addSpec" slot-scope="{options}">
                    <select-spec :choosedSpecProp.sync="choosedSpec" @generateSpec="generateSpec" :isEdit="editSpecStatus"></select-spec>
                </template>
                <template  slot="specList" slot-scope="{options}" >
                    <generate-spec :choosedSpec="generateData"  :specListRes.sync="specList"  :isEdit="editSpecStatus" :isNeedInit="isNeedInit" ></generate-spec>
                </template>
            </elm-form>
        </div>
        <div class="trans-info">
            <h3  class="block-title">运费及商品详情</h3>
            <elm-form ref="transportInfoForm" :config="transportInfoConfig" :formConfig="formTransConfig"
                      @form-submit="submitTrans"   @form-cancel="editInfo('editTransStatus','getTransInfo')">
                <template slot="addTrans" slot-scope="{options}">
                    <div style="margin-left:80px" v-if="editTransStatus">
                        <el-button type="text" @click="addSupplier">新建供应商</el-button>
                        <el-button type="text" @click="addTransTemplate">新建运费模板</el-button>
                        <el-button type="text" @click="addReturnAddress">新建退货地址</el-button>
                    </div>
                </template>
            </elm-form>
        </div>
        <div class="health-info">
            <h3  class="block-title">健康信息</h3>
            <elm-form ref="healthInfoForm" :config="healthInfoConfig" :formConfig="formHealthConfig"
                       @form-submit="submitHealth"   @form-cancel="editInfo('editHealthStatus','getHealthInfo')" >
                <template slot="healthKeyCode"  slot-scope="{options}">
                    <my-tag :options.sync="healthKeyCode" :btnTxt="'添加关键字'" :addCb="addHelTag" :removeCb="delHelTag" :closable="editHealthStatus" :showBtn="editHealthStatus"></my-tag>
                    <el-button size="mini" @click="healthDialogVisible=true" v-show="editHealthStatus">选择健康关键字</el-button>
                    <HealthTagDialog  :visible.sync="healthDialogVisible" @pushHelTagFromChoose="pushHelTagFromChoose"/>
                </template>
            </elm-form>
        </div>
        <elm-alert-form ref="addSupplierForm" :config="supplierConfig">
        </elm-alert-form>
        <!--<AddTransTemplate ref="addTransTemplateForm" />-->
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
    import {view_base_by_id,update_base,view_price_stock_by_id,update_price_stock,view_detail_by_id,update_detail,view_health_by_id,update_health} from '@/service/module/product'
    import {list as list_supplier} from "@/service/module/supplier"
    import productConfig from "@/assets/formConfig/productConfig"
    import transTemplateConfig from "@/assets/formConfig/transTemplateConfig"
    import {fileUploadUrl} from "@/assets/const.js"
    import HealthTagDialog from "@/components/HealthTagDialog"
    export  default {
        components:{
            //Tinymce,
            'myTag':Tag,
            GenerateSpec,
            SelectSpec,
            HealthTagDialog
            //AddTransTemplate,
        },
        mixins:[productCommon],
        computed:{
            formBaseInfoConfig(){
                return {cancelButtonText:this.editBaseStatus?'取消':'编辑',showConfirmButton:this.editBaseStatus, confirmButtonText: '保存',isEdit:this.editBaseStatus}
            },
            formSpecConfig(){
                return {cancelButtonText:this.editSpecStatus?'取消':'编辑',showConfirmButton:this.editSpecStatus, confirmButtonText: '保存',isEdit:this.editSpecStatus}
            },
            formTransConfig(){
                return {cancelButtonText:this.editTransStatus?'取消':'编辑',showConfirmButton:this.editTransStatus, confirmButtonText: '保存',isEdit:this.editTransStatus}
            },
            formHealthConfig(){
                return {cancelButtonText:this.editHealthStatus?'取消':'编辑',showConfirmButton:this.editHealthStatus, confirmButtonText: '保存',isEdit:this.editHealthStatus}
            },
        },
        data(){
            return {
                baseInfoConfig: productConfig.baseInfo,
                specInfoConfig:productConfig.specInfo,
                transportInfoConfig:[
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
                ],
                transportInfoViewConfig:[
                    new formItem.CustomComponent({
                        key:'show',
                        name: 'show',
                        label: '',
                    }),
                ],
                healthInfoConfig:productConfig.healthInfo,
                healthInfoViewConfig:[],
                productId:'',
                detail:{},
                proKeywords:[],
                healthKeyCode:[],
                editorContext:'123321',
                specList:[],//生成的产品规格表
                choosedSpec:[],//[{key:'颜色',value:['红','黄']},{key:'数量',value:['四袋装','六袋装']}],//已经选择的规格数据
                generateData:[],//同choosedSpec，传给规格表组件的数据，不能直接用choosedSpec,否则choosedSpec改变就直接触发表格重新生成
                editBaseStatus:false,
                editSpecStatus:false,
                editTransStatus:false,
                editHealthStatus:false,
                isNeedInit:true,
                transTemplateConfig,
                healthDialogVisible:false,
            }
        },
        async created(){
            this.productId=this.$route.params.id
            let self=this

            this.transportInfoConfig.splice(1,0,
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
                    modelText:"supplierName",
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
                }))

            //获取数据信息
            this.getBaseInfo()
            this.getSpecInfo()
            this.getTransInfo()
            this.getHealthInfo()
        },
        mounted(){
            this.generateData =JSON.parse(JSON.stringify(this.choosedSpec))
        },
        methods:{
            submit(e){
                e['editorContext']=this.editorContext
            },
            //生成规格表
            generateSpec(payload){
                this.generateData=JSON.parse(JSON.stringify(this.choosedSpec))
            },
            submitBase(form){
                let sendForm=JSON.parse(JSON.stringify(form))
                delete sendForm.mainImg
                delete sendForm.categoryIds
                delete sendForm.images
                delete sendForm.fileInfo

                sendForm.id=this.productId
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

                update_base(sendForm, {successMsg: '保存基础信息成功！'}).then(()=>{
                    this.editBaseStatus=false
                })
            },
            submitSpec(form){
                if(!this.editSpecStatus){
                    this.$message({
                        type:"warning",
                        message:'请先点击编辑按钮！'
                    })
                    return
                }
                if(!this.choosedSpec||!this.choosedSpec.length){
                    this.$message({
                        type:"warning",
                        message:'请添加商品型号！'
                    })
                    return
                }
                if(!this.specList || !this.specList.length){
                    this.$message({
                        type:"warning",
                        message:'请添加商品规格！'
                    })
                    return
                }
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

                let sendForm=JSON.parse(JSON.stringify(form))
                sendForm.id=this.productId
                //规格json
                if(this.specList&&this.specList.length){
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
                        //obj.skuId=item.skuId
                        return obj
                    }))
                }
                update_price_stock(sendForm, {successMsg: '保存规格信息成功！'}).then(()=>{
                    this.editSpecStatus=false
                })
            },
            submitTrans(form){
                form.id=this.productId
                update_detail(form, {successMsg: '保存运费及商品详情成功！'}).then(()=>{
                    this.editTransStatus=false
                })
            },
            submitHealth(form){
                let sendForm=JSON.parse(JSON.stringify(form))
                delete sendForm.healthTag
                sendForm.id=this.productId
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
                update_health(sendForm, {successMsg: '保存健康信息成功！'}).then(res=>{
                    this.editHealthStatus=false
                })
            },
            editInfo(statusName,funcName){
                if(this[statusName]){
                    this[funcName]().then(()=>{
                        this[statusName]=false
                    })
                }
                else{
                    this[statusName]=true
                }
            },
            //基础信息
            getBaseInfo(){
                let params={id:this.productId}
                return view_base_by_id(params).then(res=>{
                    this.detail=res
                    if(this.detail.keywords){
                        this.proKeywords.splice(0,this.proKeywords.length,...this.detail.keywords.split(','))
                    }
                    let imgs=this.detail.images.map(item=>{
                        let obj={}
                        obj.id=item.file.id
                        obj.url=item.file.url
                        obj.main=item.main
                        return obj
                    })
                    this.detail.images=imgs.filter(item=>!item.main)
                    this.detail.mainImg=imgs.find(item=>item.main)
                    this.$refs.baseInfoForm.resetFormData(this.detail);
                });
            },
            //规格
            getSpecInfo(){
                let params={id:this.productId}
                return view_price_stock_by_id(params).then(res=>{
                    this.detail.specInfo=res.skuStocks?res.skuStocks:[]
                    let choosedSpecObj={}
                    //构建sku列表
                    this.specList=this.detail.specInfo.map(item=>{
                        let obj={}
                        obj.price=item.price
                        obj.quantity=item.quantity
                        obj.retailPrice=item.retailPrice
                        obj.supplyPrice=item.supplyPrice
                        obj.fileUrl=''
                        obj.fileId=''
                        if(item.file){
                            obj.fileUrl=item.file.url
                            obj.fileId=item.file.id
                        }
                        obj.standardSn=item.standardSn
                        //obj.skuId=item.skuId
                        let skuInfo=JSON.parse(item.skuStr)
                        Object.assign(obj,skuInfo)

                        //构建选择的sku值
                        Object.keys(skuInfo).forEach(key=>{
                            if(!(key in choosedSpecObj)){
                                choosedSpecObj[key]=[skuInfo[key]]
                            }
                            else{
                                if((choosedSpecObj[key]).indexOf(skuInfo[key])===-1)
                                    choosedSpecObj[key].push(skuInfo[key])
                            }
                        })
                        return obj
                    })

                    this.choosedSpec=Object.keys(choosedSpecObj).map(key=>{
                        return {
                            key,
                            value:choosedSpecObj[key]
                        }
                    })
                    this.generateData=JSON.parse(JSON.stringify(this.choosedSpec))
                })
            },
            //供应商退货地址
            getTransInfo(){
                let params={id:this.productId}
                return view_detail_by_id(params).then(async (res)=>{
                    this.detail.addAndTrans=res
                    this.$refs.transportInfoForm.resetFormData(this.detail.addAndTrans);
                    this.supplierId= this.detail.addAndTrans.supplierId
                    let {records} =await list_supplier({current:1,size:10,name:this.detail.addAndTrans.supplierName});
                    this.supplierOptions.splice(0,this.supplierOptions.length,...records)
                    this.changeTrans()
                    this.changeAddress()
                })
            },
            //健康信息
            getHealthInfo(){
                let params={id:this.productId}
                return view_health_by_id(params).then(res=>{
                    this.detail.healthInfo=res
                    this.$refs.healthInfoForm.resetFormData(this.detail.healthInfo);
                    if(this.detail.healthInfo.healthTag&&this.detail.healthInfo.healthTag.length){
                        this.healthKeyCode=this.detail.healthInfo.healthTag.map(item=>item.name)
                        this.healthTagIdList.push(...this.detail.healthInfo.healthTag)
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .productEdit{
        .block-title{
            padding:10px
        }
        .pro-img{
            width:148px;
            height: 148px;
        }
    }
</style>
