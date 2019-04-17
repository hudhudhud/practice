<template>
    <section class="member-edit">
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
                            <my-img  :src="identity.image1" alt="证件正面照"  v-if="identity.image1" />
                            <i class="fa fa-picture-o my-img" aria-hidden="true" v-else title="未上传"></i>
                        </td>
                        <td class="label">证件反面照</td>
                        <td>
                            <my-img  :src="identity.image2" alt="证件正面照" v-if="identity.image2" />
                            <i class="fa fa-picture-o m-img" aria-hidden="true" v-else title="未上传"></i>
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
        <elm-alert-form ref="editMemberRankForm" :config="editMemberRankConfig">
        </elm-alert-form>
        <el-dialog title="查看人员"  :visible.sync="detailDialogTeamDetail"  custom-class="">
            <memberTeamDetail :id="memberIdTeamDetail" :teamType="teamType"></memberTeamDetail>
        </el-dialog>
    </section>
</template>
<script>
    import * as formItem from "htadmin-form";
    import {list,update_rank,view,view_indentity,list_rank,find_user_team_number,fing_by_invite_id,fing_by_parent_id,
        find_user_account,list_account_log,update_user_status,find_salary_card} from "@/service/module/member"
    import {selectDown} from "@/assets/const"
    import memberOrder from "@/components/member/memberOrder"
    import memberRankLog from "@/components/member/memberRankLog"
    import memberTeamDetail from "@/components/member/memberTeamDetail"
    import memberAccountLog from "@/components/member/memberAccountLog"
    import MyImg from '@/components/MyImg'
    export default{
        components:{
            memberOrder,
            memberRankLog,
            memberTeamDetail,
            memberAccountLog,
            MyImg
        },
        data(){
            return{
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
        async mounted(){
            this.currentRowUserId=parseInt(this.$route.params.id)
            await this.tabClick()
            this.memberSnPath.push({id:this.currentRowUserId,sn:this.detail.sn})
        },
        methods:{
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
                        if(!this.memberIdAccount || this.memberIdAccount!==this.currentRowUserId){
                            this.memberIdAccount=this.currentRowUserId
                            let res=await find_user_account(param)
                            this.account = (res.data===undefined?res:res.data) || []
                        }
                        break
                    }
                    case "relation":{
                        if(!this.memberIdToRank || this.memberIdToRank!==this.currentRowUserId) {
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
                this.memberIdTeamDetail=this.currentRowUserId
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
                                // let res= await  view({id:self.currentRowUserId})
                                // Object.assign(self.detail,res)

                                self.detail.userId=''
                                self.tabClick()
                                done();
                            }
                        } else {
                            instance.confirmButtonLoading = false;
                            done();
                        }
                    }
                });
            },
            pathClick(i,item){
                this.memberSnPath.splice(i+1,this.memberSnPath.length-i-1)
                this.currentRowUserId=item.id
                this.tabClick()
            },
            inviteSnClick(){
                if(this.detail.inviteId&&this.detail.inviteId!==this.currentRowUserId){
                    this.memberSnPath.push({sn:this.detail.inviteSn,id:this.detail.inviteId});
                    this.currentRowUserId=this.detail.inviteId;
                    this.tabClick()
                }
            },
            parentSnClick(){
                if(this.detail.parentId&&this.detail.parentId!==this.currentRowUserId) {
                    this.memberSnPath.push({sn: this.detail.parentSn, id: this.detail.parentId});
                    this.currentRowUserId = this.detail.parentId;
                    this.tabClick()
                }
            }
        }
    }
</script>
<<style lang="scss">
    .member-edit{
        .tit{
            @include clearfix;
            margin:10px 0;
        }
        .app-breadcrumb{
            margin:10px;
        }
        .my-img{
            width:30px;
            height: 30px;
            vertical-align: middle;
        }
    }
</style>
