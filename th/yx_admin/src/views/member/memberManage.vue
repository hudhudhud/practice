<template>
    <section class="member-manage">
        <elm-form ref="searchForm" :config="configSearch" :formConfig="formConfig"  class="search-form"
                  @form-submit="search"
                  @form-cancel="resetSearch">
        </elm-form>
        <base-table v-loading="loading" :columns="columns" :list="list"    @handleEdit='edit'
                    @handleUpdateStatus="handleUpdateStatus" >
            <template slot-scope="{scope}" slot='avatar'>
                <img class='avatar' :src="scope.row.imageUrl" alt="会员头像" v-if="scope.row.imageUrl" >
                <i class="fa fa-picture-o" aria-hidden="true" v-else title="用户未上传"></i>
            </template>
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
        <el-dialog title="会员详情"  :visible.sync="detailDialogVisible"  custom-class="" @close="detailDialogClose">
            <el-breadcrumb class="app-breadcrumb" separator=">" v-if="memberSnPath.length>1">
                <el-breadcrumb-item v-for="(item,i) in memberSnPath" :key="item.path">
                    <a href="javascript:void(0)" @click="pathClick(i,item)" >{{item.sn}}</a>
                </el-breadcrumb-item>
            </el-breadcrumb>
            <el-tabs type="border-card"  @tab-click="tabClick"  v-model="currentTab">
                <el-tab-pane label="会员信息" name="info">
                    <div class="tit">
                        <h4 class="fl">基本信息</h4>
                        <!--<el-button class="fr">重置密码</el-button>-->
                    </div>
                    <table class="detail_table">
                        <tr>
                            <td class="label">会员编号</td>
                            <td>{{detail.sn}}</td>
                            <td class="label">注册时间</td>
                            <td>{{detail.registerTime}}</td>
                        </tr>
                        <tr>
                            <td class="label">手机号</td>
                            <td>{{detail.mobile}}</td>
                            <td class="label">会员等级</td>
                            <td><a href="javascript:void(0)" @click="editMemberRank" title="点击修改用户等级">{{detail.rankName}}</a></td>
                        </tr>
                        <tr>
                            <td class="label">头像</td>
                            <td>
                                <img class='avatar' :src="detail.imageUrl" alt="会员头像"  v-if="detail.imageUrl">
                                <i class="fa fa-picture-o avatar" aria-hidden="true" v-else title="未上传"></i>
                            </td>
                            <td class="label">最后登录时间</td>
                            <td>{{detail.registerTime}}</td>
                        </tr>
                        <tr>
                            <td class="label">邀请人编号</td>
                            <td><a href="javascript:void(0)" @click="inviteSnClick" title="点击查看该会员信息">{{detail.inviteSn}}</a></td>
                            <td class="label">上级编号</td>
                            <td><a href="javascript:void(0)" @click="parentSnClick" title="点击查看该会员信息">{{detail.parentSn}}</a></td>
                        </tr>
                    </table>
                    <div class="tit">
                        <h4>实名信息</h4>
                    </div>
                    <table class="detail_table">
                        <tr>
                            <td class="label">真实姓名</td>
                            <td>{{identity.realname}}</td>
                            <td class="label">年龄</td>
                            <td>{{identity.age}}</td>
                        </tr>
                        <tr>
                            <td class="label">性别</td>
                            <td>{{identity.genderName}}</td>
                            <td class="label">身份证编号</td>
                            <td>{{identity.cardNumber}}</td>
                        </tr>
                        <tr>
                            <td class="label">户籍所在地</td>
                            <td colspan="3">{{identity.address}}</td>
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
                                <img class='avatar' :src="identity.image1" alt="证件正面照"  v-if="identity.image1">
                                <i class="fa fa-picture-o avatar" aria-hidden="true" v-else title="未上传"></i>
                            </td>
                            <td class="label">证件反面照</td>
                            <td>
                                <img class='avatar' :src="identity.image2" alt="证件正面照" v-if="identity.image2">
                                <i class="fa fa-picture-o avatar" aria-hidden="true" v-else title="未上传"></i>
                            </td>
                        </tr>
                    </table>
                </el-tab-pane>
                <el-tab-pane label="会员订单" name="order">
                    <member-order :id="memberId"></member-order>
                </el-tab-pane>
                <el-tab-pane label="会员资金"  name="money">
                    <table class="detail_table">
                        <tr v-for="(item,i) in account" :key="i">
                            <td class="label">余额</td>
                            <td>{{item.amount}}</td>
                            <td class="label">待结算</td>
                            <td>{{item.currency}}</td>
                        </tr>
                    </table>
                    <memberAccountLog :id="memberIdAccount" ></memberAccountLog>
                </el-tab-pane>
                <el-tab-pane label="会员关系"  name="relation">
                    <div class="tit">
                        <h4>会员团队</h4>
                    </div>
                    <base-table :columns="columnsTeam"  :list="detail.teamList" @handleViewTeam="handleViewTeam">
                    </base-table>
                    <div class="tit">
                        <h4>会员等级变化</h4>
                    </div>
                    <memberRankLog :id="memberIdToRank"></memberRankLog>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <elm-alert-form ref="editMemberRankForm" :config="editMemberRankConfig">
        </elm-alert-form>
        <el-dialog title="查看人员"  :visible.sync="detailDialogTeamDetail"  custom-class="">
            <memberTeamDetail :id="memberIdTeamDetail" :teamType="teamType"></memberTeamDetail>
        </el-dialog>

    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import pageMix from '@/mixins/pagerList'
    import {list,update_rank,view,view_indentity,list_rank,find_user_team_number,fing_by_invite_id,fing_by_parent_id,
        find_user_account,list_account_log,update_user_status,find_salary_card} from "@/service/module/member"
    import {list_order_detail} from "@/service/module/order"
    import {selectDown} from "@/assets/const"
    import memberOrder from "@/components/member/memberOrder"
    import memberRankLog from "@/components/member/memberRankLog"
    import memberTeamDetail from "@/components/member/memberTeamDetail"
    import memberAccountLog from "@/components/member/memberAccountLog"
    export default{
        mixins:[pageMix],
        components:{
            memberOrder,
            memberRankLog,
            memberTeamDetail,
            memberAccountLog
        },
        data(){
            return{
                configSearch:[
                    new formItem.Input({
                        key: 'sn',
                        label: '会员编号',
                    }),
                    new formItem.Input({
                        key: 'mobile',
                        label: '会员手机号',
                    }),
                    new formItem.Input({
                        key: 'parentSn',
                        label: '上级编号',
                    }),
                    new formItem.Input({
                        key: 'inviteSn',
                        label: '邀请人编号',
                    }),
                    new formItem.Select({
                        key: 'rank',
                        label: '会员等级',
                        options:selectDown.memberRank
                    }),
                    new formItem.SingDate({
                        key: 'registerTimeBegin',
                        label: '注册开始时间',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                    }),
                    new formItem.SingDate({
                        key: 'registerTimeEnd',
                        label: '-',
                        format:'yyyy-MM-dd HH:mm:ss',
                        valueFormat:'yyyy-MM-dd HH:mm:ss',
                    }),
                    new formItem.Select({
                        key: 'status',
                        label: '账号状态',
                        options:selectDown.userStatus
                    }),
                ],
                formConfig:{showCancelButton: true,cancelButtonText:'重置', confirmButtonText: '查询',inline:true},
                columns:[
                    { key: 'avatar', title: '头像',slot:'avatar'},
                    { key: 'sn', title: '会员编号'},
                    { key:'nickName',title: '会员昵称'},
                    { key:'rankName',title: '会员等级'},
                    { key:'mobile',title: '会员手机号',},
                    { key:'parentSn',title: '上级编号',},
                    { key:'inviteSn',title: '邀请人编号',},
                    { key:'status',title: '状态',format:selectDown.getLabel.bind(selectDown.userStatus)},
                    { key:'registerTime',title: '注册时间',},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '编辑',emitKey: 'handleEdit'},
                            {name:'激活',emitKey:'handleUpdateStatus',show:1,showKey:'status'},
                            {name:'冻结',emitKey:'handleUpdateStatus',show:0,showKey:'status'},
                        ]
                    }
                ],
                columnsTeam:[
                    { key: 'type', title: '类型',format:selectDown.getLabel.bind(selectDown.memberTeamNumType)},
                    { key: 'num', title: '数量(人)'},
                    {
                        title: '操作', type: 'operate',
                        operates: [
                            {name: '查看人员',emitKey: 'handleViewTeam'},
                        ]
                    }
                ],
                editMemberRankConfig:[
                    new formItem.Select({
                        key: 'rank',
                        label: '会员等级',
                        options:selectDown.memberRank
                    }),
                ],
                selectDown,
                detailDialogVisible:false,
                detailDialogTeamDetail:false,
                detailDialogRank:false,
                currentMemberRow:null,
                currentRowUserId:'',
                detail:{teamList:[],},
                identity:{},
                account:[],
                bankInfo:{},
                memberId:"",
                memberIdToRank:"",
                memberIdTeamDetail:"",
                memberIdAccount:"",
                teamType:"",
                currentTab:"info",
                memberSnPath:[]
            }
        },
        methods:{
            async show(pageNo,query){
                this.beforeShow(pageNo)
                let params = {
                    current: this.pageNo,
                    size: this.pageSize,
                };
                if(query){
                    Object.assign(params,query)
                }
                let res = await list(params);
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
            edit(row){
                this.currentMemberRow=row
                this.currentRowUserId=row.userId
                // this.tabClick()
                // this.detailDialogVisible=true
                // this.memberSnPath.push({sn:row.sn,id:row.userId})
                //弹窗改成跳转页面，若后续不再需要弹框，再去掉弹窗部分代码
                this.$router.push('/member/edit/'+this.currentRowUserId)
            },
            handleUpdateStatus(row){
                let msg='是否确认冻结该会员？'
                let successMsg='冻结成功！'
                let status=1
                if(row.status===1){
                    msg='是否确认激活该会员？'
                    successMsg='激活成功！'
                    status=0
                }
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await update_user_status({userId:row.id,status})
                    this.show(this.pageNo,this.$refs.searchForm.formData)
                    this.$message({
                        type: 'success',
                        message: successMsg
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            async tabClick(){
                //有变化才重新获取
                let param = {id: this.currentRowUserId}
                switch (this.currentTab) {
                    case "info":{
                        if(!this.detail.userId||this.detail.userId!==this.currentRowUserId){
                            let res = await  view(param)
                            Object.assign(this.detail,res)
                            view_indentity(param).then(res=>{
                                this.identity=res
                            })
                            find_salary_card(param).then(res=>{
                                this.bankInfo=res
                            })
                        }
                        break
                    }
                    case "order":{
                        this.memberId=this.currentRowUserId
                        break
                    }
                    case "money":{
                        if(!this.memberIdAccount || this.memberIdAccount!==this.currentMemberRow.userId){
                            this.memberIdAccount=this.currentRowUserId
                            let res=await find_user_account(param)
                            this.account = (res.data===undefined?res:res.data) || []
                        }
                        break
                    }
                    case "relation":{
                        if(!this.memberIdToRank || this.memberIdToRank!==this.currentMemberRow.userId) {
                            this.memberIdToRank = this.currentRowUserId
                            let numbers = await find_user_team_number(param)
                            let res = Object.keys(numbers).map(key => {
                                return {type: key, num: numbers[key]}
                            })
                            this.$set(this.detail, 'teamList', res)
                        }
                        break
                    }
                }
            },
            handleViewTeam(row){
                this.memberIdTeamDetail=this.currentMemberRow.userId
                this.detailDialogTeamDetail=true
                this.teamType=row.type
            },
            editMemberRank(){
                let self=this
                let obj={id:this.detail.id,rank:this.detail.rank}
                this.$refs.editMemberRankForm.openAlert(obj, {
                    title: '修改会员等级',
                    labelWidth: '100px',
                    closeOnClickModal: true,
                    beforeClose:async function (action, instance, done, form) {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            let error=false
                            await update_rank(form,{successMsg:'更新成功！'}).catch(()=>{error=true;})
                            instance.confirmButtonText='确定'
                            instance.confirmButtonLoading = false;
                            if(!error){
                                //直接赋值界面不更新，不知道原因
                                // let res= await  view({id:self.currentMemberRow.userId})
                                // Object.assign(self.detail,res)
                                // self.currentMemberRow.rankName=self.detail.rankName

                                self.detail.userId=''
                                self.tabClick()
                                self.show(self.pageNo,self.$refs.searchForm.formData)
                                done();
                            }
                        } else {
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    }
                });
            },
            detailDialogClose(){
                this.currentTab='info'
                this.detail.userId=""
                this.memberSnPath=[]
            },
            pathClick(i,item){
                this.memberSnPath.splice(i+1,this.memberSnPath.length-i-1)
                this.currentRowUserId=item.id
                this.tabClick()
            },
            inviteSnClick(){
                if(this.detail.inviteId!==this.currentRowUserId){
                    this.memberSnPath.push({sn:this.detail.inviteSn,id:this.detail.inviteId});
                    this.currentRowUserId=this.detail.inviteId;
                    this.tabClick()
                }
            },
            parentSnClick(){
                if(this.detail.parentId!==this.currentRowUserId) {
                    this.memberSnPath.push({sn: this.detail.parentSn, id: this.detail.parentId});
                    this.currentRowUserId = this.detail.parentId;
                    this.tabClick()
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.tit{
    @include clearfix;
    margin:10px 0;
}
.avatar{
    width:30px;
    height: 30px;
    vertical-align: middle;
}
</style>
<style lang="scss">
    .member-manage{
        .app-breadcrumb{
            margin:10px;
        }
    }
</style>
