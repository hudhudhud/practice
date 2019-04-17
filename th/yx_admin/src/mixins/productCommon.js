import supplierConfig from "../assets/formConfig/supplierConfig"
import returnAddressConfig from "../assets/formConfig/returnAddressConfig"
import {add as addSup} from '../service/module/supplier'
import {add as addAddress} from '../service/module/supplierAddress'
import {add as addTrans} from '../service/module/transTemplate'
import {list as list_returnAddress} from "../service/module/supplierAddress"
import {list as list_transTemp} from "../service/module/transTemplate"
import {add as add_tag,del as del_tag} from "@/service/module/tag"
let productCommon={
    data(){
        return {
            supplierConfig,
            returnAddressConfig,
            supplierId:"",
            transOptions:[],//[{id:1,name:"2"}],
            addressOptions:[],//[{label:"1",value:2}],
            supplierOptions:[],//[{id:1,name:"2"}],
            healthTagIdList:[],

            //新增运费模板
            feeList:[],//所有数据
            defaultFee:{defaultNumber:null,defaultPostage:null,addNumber:null,addPostage:null},
            otherFeeList:[],
            noAddressIdList:[],
        }
    },
    methods:{
        //新增供应商/退货地址/运费模板
        addSupplier(){
            let self=this;
            this.$refs.addSupplierForm.openAlert({}, {
                title:'添加供应商',
                labelWidth: '100px',
                closeOnClickModal: true,
                beforeClose:async function (action, instance, done, form) {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中...';
                        let error=false
                        let id=await addSup(form).catch(()=>{error=true;})

                        if(!error&&id){
                            //添加结束后返回添加的供应商编号
                            self.supplierOptions.push({id:id,name:form.name})
                            self.supplierId=id
                            //重置当前选中的供应商
                            if(self.$refs.transportInfoForm){//修改产品
                                self.$refs.transportInfoForm.resetFormData({supplierId: id});
                            }
                            else if(self.$refs.myForm){//新增产品
                                self.$refs.myForm.resetFormData({supplierId: id});
                            }
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    } else {
                        instance.confirmButtonLoading = false;
                        done();
                    }
                }
            });
        },
        addReturnAddress(){
            if(!this.supplierId){
                this.$message({
                    type:"warning",
                    message: '请先选择供应商！',
                })
                return
            }
            let self=this;
            this.$refs.addReturnAddressForm.openAlert({}, {
                title:'添加退货地址',
                labelWidth: '100px',
                closeOnClickModal: true,
                beforeClose:async function (action, instance, done, form) {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中...';

                        let formSend=JSON.parse(JSON.stringify(form))
                        if(formSend.districtIds&&formSend.districtIds.length){
                            formSend.districtId=formSend.districtIds[formSend.districtIds.length-1]
                        }
                        delete formSend.districtIds
                        if(formSend.districtId&&formSend.districtId.length){
                            formSend.districtId=formSend.districtId[formSend.districtId.length-1]
                        }
                        formSend.defaultStatus=formSend.defaultStatus?1:0
                        formSend.supplierId=self.supplierId

                        let error=false
                        //添加结束后返回添加的供应商编号
                        let id=await addAddress(formSend).catch(()=>{error=true;})

                        if(!error&&id){
                           //更新数据源
                            self.changeAddress()
                            //重置当前选中的退货地址
                            if(self.$refs.transportInfoForm) {//修改产品
                                self.$refs.transportInfoForm.resetFormData({returnAddress: id});
                            }
                            else if(self.$refs.myForm){//新增产品
                                self.$refs.myForm.resetFormData({returnAddress: id});
                            }
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    } else {
                        instance.confirmButtonLoading = false;
                        done();
                    }
                }
            });
        },
        addTransTemplate(){
            if(!this.supplierId){
                this.$message({
                    type:"warning",
                    message: '请先选择供应商！',
                })
                return
            }

            let obj={address:[]};
            let self=this;
            this.$refs.addTransTemplateForm.openAlert(obj, {
                title:'运费模板',
                customClass:'trans-template-form',
                labelWidth: '100px',
                closeOnClickModal: true,
                beforeClose: async function (action, instance, done, form) {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中...';
                        let error=false

                        let sendForm={}
                        sendForm.supplierId=self.supplierId
                        sendForm.name=form.name
                        //let feeList=Array.of(self.$refs.addTransTemplateForm.defaultFee,...self.$refs.addTransTemplateForm.otherFeeList)
                        let feeList=Array.of(self.defaultFee,...self.otherFeeList)
                        sendForm.postageTemplateDetail=JSON.stringify(feeList)
                        if(form.noDeliverDistrictIdList){
                            sendForm.noDeliverDistrictIdList=form.noDeliverDistrictIdList.join()
                        }
                        let id=await addTrans(sendForm).catch(()=>{error=true;})
                        if(!error&&id){
                            //添加结束后返回添加的供应商编号
                            self.transOptions.push({id,name:form.name})
                            //重置当前选中的退货地址
                            if(self.$refs.transportInfoForm) {//修改产品
                                self.$refs.transportInfoForm.resetFormData({postageId: id});
                            }
                            else if(self.$refs.myForm){//新增产品
                                self.$refs.myForm.resetFormData({postageId: id});
                            }
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    } else {
                        instance.confirmButtonLoading = false;
                        done();
                    }
                }
            });
        },
        //供应商改变联动退货地址与运费模板,下拉回调函数
        changeTransAddress(val){
            this.supplierId=val
            if(this.$refs.transportInfoForm) {//修改产品
                this.$refs.transportInfoForm.resetFormData({postageId: '',returnAddress:''});
            }
            else if(this.$refs.myForm){//新增产品
                this.$refs.myForm.resetFormData({postageId: '',returnAddress:''});
            }
            this.changeTrans()
            this.changeAddress()
        },
        async changeTrans(){
            let {records:transList}=await list_transTemp({supplierId:this.supplierId,queryAllFlag:true})
            if(transList&&transList.length){
                this.transOptions.splice(0,this.transOptions.length,...transList)
            }
            else{
                this.transOptions.splice(0,this.transOptions.length)
            }
        },
        async changeAddress(){
            let {records}=await list_returnAddress({supplierId:this.supplierId,queryAllFlag:true})
            if(records&&records.length){
                records=records.map(item=>{
                    let obj={
                        value:item.id,
                        label:item.zone+item.street
                    }
                    return obj
                })
                this.addressOptions.splice(0,this.addressOptions.length,...records)
            }
            else{
                this.addressOptions.splice(0,this.addressOptions.length)
            }
        },

        //新建运费模板 新增费用
        addNewFee(){
            this.otherFeeList.push({districtId:""})
        },
        deleteFee(i){
            this.otherFeeList.splice(i,1)
        },

        //健康标签
        pushHelTagFromChoose(rows){
          rows.forEach(item=>{
              this.healthTagIdList.push({id:item.id,name:item.name})
              this.healthKeyCode.push(item.name)
          })
        },
        addHelTag(val){
             return add_tag({name:val,type:1})
                 .then((res)=>{
                     this.healthTagIdList.push({id:res,name:val})
                 })
                 .catch(e=>Promise.resolve(e))
        },
        async  delHelTag(val){
            let item=this.healthTagIdList.find(item=>item.name===val)
            //只是移除，不是删除
           // await del_tag({id:item.id})//健康标签
            this.healthTagIdList.splice(this.healthTagIdList.indexOf(item),1)
        },


    }
}
export default productCommon;
