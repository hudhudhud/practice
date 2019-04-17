<template>
    <section>
        <h4>基本信息</h4>
        <base-table :columns="columnsPro" :list="proList"  @handleManualDelivery="handleManualDelivery">
            <template slot-scope="{scope}" slot='specInfo'>
                <div class="pro-detail">
                    <img :src="scope.row.productImage" alt="" class="row-img" v-if="scope.row.productImage">
                    <i class="fa fa-picture-o" aria-hidden="true"  v-else title="无产品图片"></i>
                    <div class="detail">
                        <p>{{scope.row.productTitle}}</p>
                        <p>{{scope.row.productSpecName}}</p>
                    </div>
                </div>
            </template>
           <template slot="logistics" slot-scope="{scope}">
               <a href="javascript:void(0)" @click="showLogisticsDetail($event,scope.row)" v-if="scope.row.orderStatus>=3">查看详情</a>
               <span v-else>无物流信息</span>
           </template>
        </base-table>
        <h4>订单详情</h4>
        <table class="detail_table">
            <tr >
                <td class="label">主单号</td>
                <td>{{mainOrderInfo.sn}}</td>
                <td class="label">下单日期</td>
                <td>{{mainOrderInfo.createTime}}</td>
                <td class="label">订单状态</td>
                <td>{{mainOrderInfo.statusName}}</td>
                <td class="label">订单总金额</td>
                <td>{{mainOrderInfo.amount}}</td>
                <td class="label">供应商</td>
                <td>{{mainOrderInfo.supplierName}}</td>
            </tr>
            <tr >
                <td class="label">邮费</td>
                <td>{{mainOrderInfo.logisticFee}}</td>
                <td class="label">买家留言</td>
                <td colspan="7">{{mainOrderInfo.userRemark}}</td>
            </tr>
        </table>

        <h4>支付详情</h4>
        <table class="detail_table">
            <tr >
                <div  v-for="item in payInfo">
                    <td class="label">{{item.typeName}}</td>
                    <td>{{item.number}}</td>
                </div>

                <!--<td class="label">余额支付</td>-->
                <!--<td>{{payInfo.number}}</td>-->
                <!--<td class="label">微信支付</td>-->
                <!--<td>{{payInfo.number}}</td>-->
            </tr>
        </table>

        <h4>会员信息</h4>
        <table class="detail_table">
            <tr >
                <td class="label">会员昵称</td>
                <td>{{sellerInfo.name}}</td>
                <td class="label">会员编号</td>
                <td>{{sellerInfo.sn}}</td>
            </tr>
            <tr >
                <td class="label">会员手机号</td>
                <td>{{sellerInfo.mobile}}</td>
                <td class="label">会员等级</td>
                <td>{{sellerInfo.rankName}}</td>
            </tr>
        </table>

        <h4>收货人信息</h4>
        <elm-form ref="recInfoForm" :config="recInfoConfig"    @form-submit="submitRecInfo"  :formConfig="recInfoFormConfig" @form-cancel="editInfo('editRecInfoStatus','getAddress')">
        </elm-form>

        <!--USER_REMARK(1,"用户留言"), SERVICE_REMARK(2,"客服留言"), LOGISTICS_REMARK(3,"后勤留言");-->
        <h4>客服留言</h4>
        <elm-form ref="remarkServiceForm" :config="remarkConfig"    @form-submit="submitServiceRemark"  :formConfig="remarkServiceFormConfig"  @form-cancel="editInfo('editRemarkServiceStatus','getServerRemark')">
        </elm-form>

        <h4>后勤留言</h4>
        <elm-form ref="remarkLogisticsForm" :config="remarkConfig"    @form-submit="submitLogisticsRemark"  :formConfig="remarkLogisticsFormConfig"  @form-cancel="editInfo('editRemarkLogisticsStatus','getLogRemark')">
        </elm-form>

        <el-dialog :visible.sync="logisticsDetailVisible" width="60%">
            <el-form label-position="left"  class="demo-table-expand">
                <el-form-item label="物流公司：">
                    <span>{{ logisticsInfo.expName }}</span>
                </el-form-item>
                <el-form-item label="物流单号：">
                    <span>{{ logisticsInfo.number }}</span>
                </el-form-item>
                <el-form-item label="物流备注：">
                    <span>{{ logisticsInfo.remark }}</span>
                </el-form-item>
                <el-form-item label="物流详情：">
                    <br>
                   <div v-for="item in logisticsInfo.list">
                       <span>{{item.time}}</span><span>{{item.status}}</span>
                   </div>
                </el-form-item>
            </el-form>
       </el-dialog>

        <elm-alert-form ref="deliverForm" :config="deliverConfig" >
        </elm-alert-form>

    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import * as service from "@/service/module/order"
    import {selectDown,remarkType} from "@/assets/const.js"
    import {area_list} from "@/service/module/supplierAddress";
     export default{
        data(){
            return {
                columnsPro:[
                    { key: 'productSn', title: '商品编号',width:'200px'},//主单号+供应商编号
                    { key: '', title: '信息',slot:'specInfo',width:'250px'},
                    { key: 'amount', title: '商品总价'},
                    { key: 'quantity', title: '数量',},
                    { key: 'orderTypeName', title: '订单类型'},
                    { key: 'deliveredTime', title: '发货时间'},
                    { key: 'logisticsId', title: '物流信息',slot:'logistics'},
                    // { key: 'orderStatusName', title: '订单状态'},
                    { key: 'afterSaleStatus', title: '售后状态',format:selectDown.getLabel.bind(selectDown.afterSaleStatus)},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '手动发货',emitKey: 'handleManualDelivery',show:null,showKey:'deliveredTime'},
                        ]
                    }
                ],
                selectDown,
                orderSn:'',
                proList:[],
                logisticsDetailVisible:false,
                deliverConfig:[
                    new formItem.Input({
                        key:'code',
                        label: '物流公司',
                    }),
                    new formItem.Input({
                        key:'sn',
                        label: '物流单号',
                    }),
                    new formItem.Input({
                        key:'remark',
                        label: '物流备注',
                        type:'textarea',
                        rows:3
                    }),
                ],
                recInfoConfig:[
                    new formItem.Input({
                        key:'name',
                        label: '收件人',
                        rules: [
                            {required: true, message: '请输入收件人', trigger: 'blur'},
                        ],
                    }),
                    new formItem.Input({
                        key:'mobile',
                        label: '收件人手机',
                        rules: [
                            {required: true, message: '请输入收件人手机', trigger: 'blur'},
                        ],
                    }),
                    new formItem.Cascader({
                        key:'districtIds',
                        label:'收货地址',
                        services:area_list,
                        filterable:false,
                        remote:true,
                        servicesParamsKey:'parentId',
                        labelKey:'name',
                        valueKey:'id',
                        hasChildrenKey:'childCount',
                        rules: [
                            {required: true, message: '请选择收货地址', trigger: 'blur'},
                        ],
                    }),
                    new formItem.Input({
                        key:'address',
                        label:'详细地址',
                        rules: [
                            {required: true, message: '请输入详细地址', trigger: 'blur'},
                        ],
                    }),
                ],
                remarkConfig:[
                    new formItem.Input({
                        key:'content',
                        label: '留言',
                    }),
                ],
                mainOrderInfo:{},
                payInfo:[],
                sellerInfo:{},
                recAddressInfo:{},
                remarkServiceInfo:{},
                remarkLogisticsInfo:{},
                logisticsInfo:{},
                editRecInfoStatus:false,
                editRemarkServiceStatus:false,
                editRemarkLogisticsStatus:false,
            }
        },
         computed:{
             recInfoFormConfig(){
                 return {cancelButtonText:this.editRecInfoStatus?'取消':'编辑',showConfirmButton:this.editRecInfoStatus, confirmButtonText: '保存',isEdit:this.editRecInfoStatus}
             },
             remarkServiceFormConfig(){
                 return {cancelButtonText:this.editRemarkServiceStatus?'取消':'编辑',showConfirmButton:this.editRemarkServiceStatus, confirmButtonText: '保存',isEdit:this.editRemarkServiceStatus}
             },
             remarkLogisticsFormConfig(){
                 return {cancelButtonText:this.editRemarkLogisticsStatus?'取消':'编辑',showConfirmButton:this.editRemarkLogisticsStatus, confirmButtonText: '保存',isEdit:this.editRemarkLogisticsStatus}
             },
         },
        async created(){
             this.orderSn=this.$route.params.id;
             let param={id:this.orderSn}

            service.find_detail_all(param).then(res=>{
                 this.proList=res
            });
            service.view(param).then(res=>{
                this.mainOrderInfo=res
            })
            service.find_main_payment_detai(param).then(res=>{
                this.payInfo=res
            })

            service.find_seller_info(param).then(res=>{
                this.sellerInfo=res
            })

            //获取表单部分数据
            this.getAddress()
            this.getServerRemark()
            this.getLogRemark()
        },
       methods:{
           handleManualDelivery(){
               let self=this;
               this.$refs.deliverForm.openAlert({}, {
                   title:'物流编辑',
                   labelWidth: '100px',
                   closeOnClickModal: true,
                   confirmButtonText: '确认发货',
                   beforeClose:async function (action, instance, done, form) {
                       if (action === 'confirm') {
                           instance.confirmButtonLoading = true;
                           instance.confirmButtonText = '执行中...';
                           let error=false
                           form.id=self.orderSn
                           await service.shipments(form,{successMsg:'发货成功！'}).catch(()=>{error=true;})
                           if(!error){
                               self.proList = await service.find_detail_all({id:self.orderSn});
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
           async showLogisticsDetail(e,row){
                this.logisticsDetailVisible=true
                this.logisticsInfo=await service.find_logistics({id:row.id})
           },
           submitServiceRemark(form){
               form.id=this.orderSn
               form.type=remarkType.service_remark
               service.save_remark(form,{successMsg:'保存备注成功！'}).then(()=>{
                   this.editRemarkServiceStatus=false
               })
           },
           submitLogisticsRemark(form){
               form.id=this.orderSn
               form.type=remarkType.logistics_remark
               service.save_remark(form,{successMsg:'保存备注成功！'}).then(()=>{
                   this.editRemarkLogisticsStatus=false
               })
           },
           submitRecInfo(form){
               if(form.districtIds.length){
                   form.districtId=form.districtIds[form.districtIds.length-1]
               }
               delete form.districtIds
               form.id=this.orderSn
               service.edit_receiving_address(form,{successMsg:'收货人信息保存成功！'}).then(()=>{
                   this.editRecInfoStatus=false
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
           getAddress(){
              let param={id:this.orderSn}
              return service.find_receiving_address(param).then(res=>{
                   this.recAddressInfo=res
                   this.$refs.recInfoForm.resetFormData(this.recAddressInfo)
               })
           },
           getServerRemark(){
               let param={id:this.orderSn}
               return service.find_remark({...param,"type":remarkType.service_remark}).then(res=>{
                   this.remarkServiceInfo = res
                   this.$refs.remarkServiceForm.resetFormData(this.remarkServiceInfo)
               })
           },
           getLogRemark(){
               let param={id:this.orderSn}
               return service.find_remark({...param,"type":remarkType.logistics_remark}).then(res=>{
                   this.remarkLogisticsInfo = res
                   this.$refs.remarkLogisticsForm.resetFormData(this.remarkLogisticsInfo)
               })
           }

       }
    }
</script>
<style lang="scss" scoped>
    h4{
        margin:20px 0;
    }
    .fa.fa-picture-o{
        font-size:45px;
    }
    .pro-detail{
        display:flex;
        flex-direction: row;
        .detail{
            margin-left:5px;
            display:flex;
            flex-direction: column;
            align-items:stretch;
        }
    }
</style>
