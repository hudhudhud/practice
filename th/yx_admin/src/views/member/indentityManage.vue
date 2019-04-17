<template>
    <section>
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <base-table  v-loading="loading" :columns="columns" @handleAudit="handleAudit" :list="list">
        </base-table>
        <div class="pagination" v-if="list&&list.length">
            <el-pagination
                    background
                    :current-page='pageNo'
                    @current-change="show"
                    class="pages"
                    :page-size="pageSize"
                    :layout="pageLayout"
                    :total="pageTotal">
            </el-pagination>
        </div>
        <elm-alert-form ref="auditForm" :config="auditConfig" >
            <template slot="member" >
                <table class="detail_table">
                    <tr>
                        <td class="label">会员编号</td>
                        <td>{{member.sn}}</td>
                        <td class="label">会员昵称</td>
                        <td>{{member.nickName}}</td>
                    </tr>
                    <tr>
                        <td class="label">会员等级</td>
                        <td>{{selectDown.getLabel.bind(selectDown.memberRank)(member.rank)}}</td>
                        <td class="label">邀请人编号</td>
                        <td>{{member.inviteSn}}</td>
                    </tr>
                    <tr>
                        <td class="label">直属上级编号</td>
                        <td>{{member.parentSn}}</td>
                        <td class="label">会员手机号</td>
                        <td>{{member.mobile}}</td>
                    </tr>
                </table>
            </template>
            <template slot="indentity" >
                <table class="detail_table">
                    <tr>
                        <td class="label">真实姓名</td>
                        <td>{{indentity.realname}}</td>
                        <td class="label">年龄</td>
                        <td>{{indentity.age}}</td>
                    </tr>
                    <tr>
                        <td class="label">性别</td>
                        <td>{{indentity.genderName}}</td>
                        <td class="label">身份证编号</td>
                        <td>{{indentity.cardNumber}}</td>
                    </tr>
                    <tr>
                        <td class="label">户籍所在地</td>
                        <td colspan="3">{{indentity.address}}</td>
                    </tr>
                    <tr>
                        <td class="label">银行卡号</td>
                        <td>{{bankInfo.cardNumber}}</td>
                        <td class="label">银行名称</td>
                        <td>{{bankInfo.bankName}}</td>
                    </tr>
                    <tr>
                        <td class="label">所属支行</td>
                        <td colspan="3">{{bankInfo.branchBankName}}</td>
                    </tr>
                    <tr>
                        <td class="label">证件正面照</td>
                        <td>
                            <my-img  :src="indentity.image1" alt="证件正面照"  v-if="indentity.image1" :isNest="true"/>
                            <i class="fa fa-picture-o my-img" aria-hidden="true" v-else title="未上传"></i>
                        </td>
                        <td class="label">证件反面照</td>
                        <td>
                            <my-img  :src="indentity.image2" alt="证件反面照" v-if="indentity.image2" :isNest="true"/>
                            <i class="fa fa-picture-o my-img" aria-hidden="true" v-else title="未上传"></i>
                        </td>
                    </tr>
                </table>
            </template>
            <template slot="protocol">
                <span v-if="!protocols||!protocols.length">无</span>
                <table class="detail_table" v-else>
                    <tr v-for="(item,i) in protocols" :key="i">
                        <td class="label">协议类型</td>
                        <td>{{item.type}}</td>
                        <td class="label">协议编号</td>
                        <td>{{item.code}}</td>
                        <td class="label">电子版确认时间</td>
                        <td>{{item.elecSignTime}}</td>
                    </tr>
                </table>
            </template>
        </elm-alert-form>
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import {list_indentity,view_indentity,audit_indentity,view as view_member,list_protocol,find_salary_card} from "@/service/module/member"
    import {selectDown} from "@/assets/const"
    import MyImg from "@/components/MyImg"
    export default{
        mixins:[pageMix],
        components:{
            MyImg,
        },
        data(){
            return {
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true,},
                auditFormConfig:{showCancelButton:true,cancelButtonText:'关闭',showConfirmButton:false},
                columns:[
                    { key: 'sn', title: '会员编号',},
                    { key: 'rank', title: '会员等级',format:selectDown.getLabel.bind(selectDown.memberRank)},
                    { key:'applicationTime',title: '申请时间'},
                    { key:'status',title: '审核状态',format:selectDown.getLabel.bind(selectDown.memberAuditStatus)},
                    { key:'remark',title: '审核备注'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '审核',emitKey: 'handleAudit',show:1,showKey:'status'},
                            {name: '查看',emitKey: 'handleAudit',show:2,showKey:'status'},
                            {name: '查看',emitKey: 'handleAudit',show:3,showKey:'status'},
                        ]
                    }
                ],
                configSearch:[
                    new formItem.Input({
                        key: 'sn',
                        label: '会员编号',
                    }),
                    new formItem.Select({
                        key: 'status',
                        label: '审核状态',
                        options:selectDown.memberAuditStatus
                    }),
                ],
                auditConfig:[
                    new formItem.CustomComponent({
                        key:'member',
                        name: 'member',
                        label: '基本信息',
                    }),
                    new formItem.CustomComponent({
                        key:'indentity',
                        name: 'indentity',
                        label: '认证信息',
                    }),
                    new formItem.CustomComponent({
                        key:'protocol',
                        name: 'protocol',
                        label: '协议信息',
                    }),
                    new formItem.Radio({
                        key: 'status',
                        label: '审核操作',
                        options: selectDown.memberAuditStatus,
                    }),
                    new formItem.Input({
                        key: 'remark',
                        inputType:'textarea',
                        label: '备注',
                        rows:3,
                    }),
                ],
                selectDown,
                member:{},
                indentity:{},
                protocols:[],
                bankInfo:{}
            }
        },
        methods:{
            async show(pageNo,query){
                this.beforeShow(pageNo)
                let params = {
                    current: this.pageNo,
                    size: this.pageSize,
                    id:this.id,
                };
                if(query){
                    Object.assign(params,query)
                }
                let res = await list_indentity(params);
                this.listSuccessCb(res)
            },
            search(form){
                this.show(1,form)
            },
            resetSearch(){
                let newSet={}
                this.configSearch.forEach(item=>{
                    newSet[item.key]=(item.type==='cascader')?[]:'';
                })
                this.$refs.searchForm.resetFormData(newSet)
                this.search()
            },
             async handleAudit(row){
                let self=this
                let param={id:row.userId}
                this.member = await  view_member(param)
                this.indentity=await view_indentity(param)
                this.protocols=await list_protocol(param)
                this.bankInfo=await find_salary_card(param)
                let formCinfig=row.status!==1?this.auditFormConfig:{}//审核中才显示保存按钮
                this.$nextTick(()=>{
                    this.$refs.auditForm.openAlert(this.indentity, {
                       ...formCinfig,
                        title: '会员审核',
                        customClass:'audit-form',
                        labelWidth: '100px',
                        closeOnClickModal: true,
                        beforeClose:async function (action, instance, done, form) {
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                instance.confirmButtonText = '执行中...';
                                let error=false
                                let {status,remark}=form
                                await audit_indentity({id:row.id,status,remark}).catch(()=>{error=true;})
                                instance.confirmButtonText='确定'
                                instance.confirmButtonLoading = false;
                                if(!error){
                                    self.show(self.pageNo,self.$refs.searchForm.formData)
                                    done();
                                }
                            } else {
                                instance.confirmButtonLoading = false;
                                done();
                            }
                        }
                    });
                })

            }
        }
    }
</script>
<style lang="scss" scope>
    .audit-form{
        width: 60%;
        height: 800px;
        overflow-y: scroll;
    }
    .my-img{
        width:30px;
        height:30px;
        vertical-align: middle;
    }
</style>
