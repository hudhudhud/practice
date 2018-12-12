<template>
    <header :class="{shadow}">
        <div class="bars clearfix">
            <div class="logo fl">
                <router-link to="/">
                    <img src="/img/logo.png" alt="">
                </router-link>
            </div>
            <ul class="fl">
                <li v-for="(item,i) in bars"  :class="{active:$route.name==item.routeName,link:true}" :key="i" >
                    <router-link :to="{name:item.routeName,params:item.params,query:item.query}">
                    	<!-- <i :class="item.icon"></i> -->
                        {{item.name}}
                    </router-link>
                </li>
            </ul>
            <div  v-if="userInfo.id" class="clearfix">
                <div v-if="showPanel" class="hidePanel" @click="showPerson=false;showFeedback=false;showInfo=false;"></div>
            	<ul class="fr">
                    <li class="gzh popPar">
                        <i class="fa fa-qrcode icon" aria-hidden="true"></i>
                        <div class="gzh-pop pop">
                            <img src="/img/qrcode.jpg" alt="">
                            <p>关注公众号：小HIGH说网红</p>
                        </div>
                    </li>
                    <li class="feedback popPar" :style="showFeedback?'z-index:9999':''">
                        <i class="fa fa-pencil-square-o icon" aria-hidden="true" @click="showFeedback=!showFeedback"></i>
                        <div :class="{active:showFeedback,'feedback-pop':true, pop:true}">
                            <p class="title">反馈信息</p>
                            <textarea name="" id=""  placeholder="请输入您的反馈意见" v-model="feedBackContent"></textarea>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="showFeedback = false">取 消</el-button>
                                <el-button type="primary" @click="feedBackSubmit">提交反馈</el-button>
                            </span>
                        </div>
                    </li>
                    <li class="info popPar" :style="showInfo?'z-index:9999':''">
                        <i class="fa fa-comment icon" aria-hidden="true" @click="showInfo=!showInfo"></i>
                        <div :class="{active:showInfo,'info-pop':true, pop:true}">
                            <img src="/img/noMessage.png" alt="">
                            <p class="noMes">暂无消息</p>
                            <div class="msg">
                                <p>您可以根据需要设置</p>
                                <p>消息接收类型</p>
                            </div>
                        </div>
                    </li>
                    <li class="popPar person" :style="showPerson?'z-index:9999':''">
                        <span class="icon" @click="showPerson=!showPerson"><img src="/img/head.png" alt="" class="tx"></span>
                        <span class="icon" @click="showPerson=!showPerson">{{userInfo.nickname}}</span>
                        <div :class="{active:showPerson,'personInfo-pop':true,pop:true}" >
                            <p class="tx"><img src="/img/tx.png" alt=""></p>
                            <p>{{userInfo.nickname}}</p>
                            <p class="grzx"><router-link to="/userCenter/info" target="_blank">进入个人中心 ></router-link></p>
                            <a  @click.prevent="logout" class="logout" href="#">退出登录</a>
                        </div>
                    </li>
            	</ul>
            	<SearchAll class="fr search" @cb="headerSearch" placeholder="输入类目或主播名称" :model="searchValue"/>
            </div>
            <ul class="fr" v-else>
            	<li class="link">
                    <router-link to="/login">登录</router-link>
                </li>
                 <li class="link">
                    <router-link to="/register">注册</router-link>
                </li>
            </ul>
        </div>
    </header>
</template>
<script>
import SearchAll from '@/components/SearchAll.vue'
import myaxios from '../assets/js/myaxios';
import common from '../assets/js/common'
import {mapState,mapMutations} from 'vuex';
import {
 Dialog,
 Button,
 Message,
 MessageBox,
} from "element-ui";
export default {
	components:{
        SearchAll,
        elDialog:Dialog,
        elButton:Button,
    },
    props:{
        shadow:{
            type:Boolean,
            default:true,
        }
    },
	data:function(){
		return {
			// bars:[
			// 	// {name:"首页",routeName:"home",icon:"fa fa-home fa-lg"},
			// 	{name:"行情概览",routeName:"catg",params:{from:0},query:{catgs:common.defaultCatg.join(','),from:common.defaultDate.from,to:common.defaultDate.to},icon:"fa fa-tasks"},
			// 	{name:"主播匹配",routeName:"rank",query:{catgs:common.defaultCatg.join(','),from:common.defaultDate.from,to:common.defaultDate.to},icon:"fa fa-user"}
            // ],
            feedBackVisible: false,
            feedBackContent:'',
            showPerson:false,
            showFeedback:false,
            showInfo:false,
            // userInfo:this.$store.state.userInfo
		}
    },
    computed: {
            ...mapState([
                'searchObj',
                'userInfo'
            ]),
            searchValue(){
                return this.searchObj.label
            },
            showPanel(){
                return this.showPerson||this.showFeedback||this.showInfo
            },
            bars(){
                var ary=[
                    // {name:"首页",routeName:"home",icon:"fa fa-home fa-lg"},
                    {name:"行情概览",routeName:"catg",query:{catgs:common.defaultCatg.join(','),from:common.defaultDate.from,to:common.defaultDate.to},icon:"fa fa-tasks"},
                    {name:"主播匹配",routeName:"rank",query:{catgs:common.defaultCatg.join(','),from:common.defaultDate.from,to:common.defaultDate.to},icon:"fa fa-user"}
                ]
               
                if(this.$route.name=="rank"||this.$route.name=="catg"){
                    ary.forEach(item=>{
                        item.query=this.$route.query
                    })
                }
                
                return ary
            }
    },
	mounted:function(){
        //console.log("header loading",this.$store.state.userInfo)
	},
	methods:{
        ...mapMutations([
            'setSearchObj'
        ]),
		headerSearch(payload){
            if(payload.route=="rank"){
                 //this.$router.push(`/${payload.route}?catgs=${payload.value}`)
                 let from=common.defaultDate.from
                 let to=common.defaultDate.to
                 if(this.$route.query.from&&this.$route.query.to){
                     from=this.$route.query.from
                     to=this.$route.query.to
                 }
                 this.$router.push({name:payload.route,query:{catgs:payload.value,from,to,fromHead:1}})
            }
            else{
                  this.$router.push(`/${payload.route}/${payload.value}`)
            }
			
        },
        logout(){
            myaxios.post("/web/logout").then(res=>{
                res=res.data
                if(res.code==0){
                    this.$store.commit('setUserInfo',{})
                    this.$router.push('/login')
                }
            })
        },
        feedBackSubmit(){
            //axios提交数据
            myaxios.post('/web/user/submitProposal',{proposal:this.feedBackContent}).then(data=>{
                    this.showFeedback=false
                    Message({
                        message: '感谢您的反馈，我们会尽快处理！',
                        type: 'success',
                        customClass:"feedBackMsg",
                        //duration:0
                    });
            })
        },
	}
}
</script>
<style lang="less" scoped>
header {
    &.shadow{
        box-shadow: 3px 3px 5px rgba(0,0,0,.25);
    }
    position: fixed;
    top: 0;
    width: 100%;
    min-width: @contentWidth;
    height: @headerHeight;
    background:@mainColor;
    background:linear-gradient(90deg,rgba(245,121,131,1),rgba(244,57,116,1));
    z-index: 9999;
   
    .bars {
        height: 100%;
        width: @contentWidth;
        margin: auto;
        .logo{
            line-height: @headerHeight;
            margin-right: 10px;
            img{
                border:none;
                opacity: 0.72;
                vertical-align: middle;
            }
        }
        ul {
            height: @headerHeight;
            li {
                height: 100%;
                .icon{
                    display: inline-block;
                    line-height: @headerHeight;
                    img.tx{
                        vertical-align: middle;
                    }
                }
                display: inline-block;
                transition: all .1s linear;
                margin: 0 15px 0 15px;
                &.link{
                    &.active,&:hover{
                        a{   
                            color:#fff;
                            border-bottom:2px solid #fff;
                        }
                    }
                    margin-top:30px;
                    margin-right: 10px;
                    a {
                        font-size:14px;
                        display: inline-block;
                        color:#fddae1;
                        opacity: 0.72;
                        i{
                            padding-right: 5px;
                        }
                    }
                }
                box-sizing: border-box;
                cursor: pointer;
                &.popPar{
                    position:relative;
                    display: inline-block;
                    vertical-align: top;
                    i{
                        font-size:22px;
                        color:#fff;
                    }
                    margin-left:10px;
                    .pop{
                        border-radius: 2px;
                        position:absolute;
                        top:@headerHeight;
                        background-color: #fff;
                        font-size:13px;
                        transition: height .2s linear;
                        overflow: hidden;
                        text-align: center;
                        height: 0;
                        z-index: 2;
                        &.active{
                            box-shadow:1px 2px 5px 1px rgba(0, 0, 0, 0.25);
                        }
                    }
                }
                &.person{
                     &>span{
                         color:#fff;
                     }
                    .personInfo-pop{
                        width:130px;
                        &.active{
                            height: 180px;
                        }
                        .grzx{
                            a{
                                color:#000;
                                opacity:0.54;
                            }
                        }
                        .tx{
                            margin:auto;
                            margin-top:10px;
                            width:50px;
                            height: 50px;
                            border-radius: 100%;
                            background-color:#e1e1e1;
                            text-align: center;
                            line-height: 50px;
                        }
                        p{
                           padding:5px;
                        }
                    }
                }
                &.feedback{
                     .feedback-pop{
                        left:-130px;
                        width:260px;
                        &.active{
                            height: 186px;
                        }
                        line-height:1em;
                        .title{
                            padding:10px;
                            font-size:14px;
                        }
                        textarea{
                            margin-top:10px;
                            width:240px;
                            height:80px;
                            border:1px solid #E1E1E1;
                            resize:none;
                            outline: none;
                        }
                        .el-button{
                            color:@mainColor;
                            border-color: @mainColor;
                            margin-top:10px;
                            width:100px;
                            height:30px;
                            padding:0;
                            line-height: 30px;
                        }
                        .el-button--primary{
                            background-color: @mainColor;
                            border-color: @mainColor;
                            color:#fff;
                        }
                       
                    }
                }
                &.info{
                    .info-pop{
                        left:-40px;
                        width:130px;
                        &.active{
                            height: 181px;
                        }
                        img{
                            margin-top:36px;
                        }
                        .msg{
                            margin-top:18px;
                            line-height: 1.2em;
                        }
                        p{
                            font-size:12px;
                            opacity:0.54;
                            &.noMes{
                                margin-top:18px;
                                font-size:14px;
                                opacity:1;
                            }
                        }
                    }
                }
                &.gzh{
                    .gzh-pop{
                        width:200px;
                        height: 0px;
                        left:-80px;
                        img{
                            margin-top:10px;
                        }
                        p{
                            line-height: 1em;
                            font-size:12px;
                        }
                    }
                    &:hover{
                        .gzh-pop{
                            height: 180px;
                        }
                    }
                }
            }
        }
       
        .logout{
            margin-top:10px;
            display: inline-block;
            color:#ccc;
            width:100px;
            height: 30px;
            background-color:@mainColor;
            text-align: center;
            line-height: 30px;
            color:#fff;
            border-radius: 4px;
        }
    }
}
</style>
<style lang="less">
    .search{
        margin-right: 20px;
        line-height: @headerHeight;
        .el-input .el-input__inner{
            width:210px;
            height: 30px;
            line-height:30px;
            border:1px solid #fff;
            border-radius:15px;
            background-color:transparent;
            color:#fff;
            outline:none;
        }
        .el-input.is-focus .el-input__inner{
            border-color:#fff
        }
    }
</style>
