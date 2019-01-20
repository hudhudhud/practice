<template>
    <div id='register' >
        <back-btn></back-btn>
       <div style="width: 100%">
           <div class="head">
               <img :src="userInfo.headImgUrl" alt="">
           </div>
           <div class="nickname">
               {{userInfo.nickname}}
           </div>
           <!--<div class="tip">-->
           <!--验证手机号，完成授权!-->
           <!--</div>-->
           <!--<div class="phone-row">-->
               <!--<i class="iconfont icon-Mobile-phone-no"></i>-->
               <!--&lt;!&ndash;<span>手机号:</span>&ndash;&gt;-->
               <!--<input  @blur='PhoneBlur' placeholder="请输入你的手机号" v-model='inPhone' maxlength='11' type='tel' >-->
           <!--</div>-->
           <!--<div class="code-row">-->
               <!--<i class="iconfont icon-Verification-code"></i>-->
               <!--&lt;!&ndash;<span>验证码:</span>&ndash;&gt;-->
               <!--<input placeholder="请输入验证码" @blur='VerificationCodeBlur' v-model='inVerificationCode' maxlength='6' type='tel'>-->
               <!--<button @click='getCodeClick' v-if='getCodeChoose'>获取验证码</button>-->
               <!--<button v-else>{{countdown}}S后重新获取</button>-->
           <!--</div>-->
           <user-name >
               <template slot="user">
                   <input  @blur='PhoneBlur' placeholder="请输入你的手机号" v-model='inPhone' maxlength='11' type='tel' >
               </template>
               <template slot="pass">
                   <input placeholder="请输入验证码" @blur='VerificationCodeBlur' v-model='inVerificationCode' maxlength='6' type='tel'>
                   <button @click='getCodeClick' v-if='getCodeChoose'>获取验证码</button>
                   <button v-else>{{countdown}}S后重新获取</button>
               </template>
           </user-name>
           <div class="wxBtn" @click='WxLoginClick'>
               确认绑定
           </div>
       </div>
        <div class="sign">
            <label>
                <input type="checkbox" checked>
                同意并接受<span>《火兔商城的注册协议》</span>
            </label>
        </div>


    </div>

</template>

<script>
    import {loginAndBinDing, sendLoginCode} from "../service/login";

    export default {
        name: "wx-register",
        data: function () {
            return {
                inInviterPhone:'',//邀请人手机号
                inPhone:'',//我的手机号
                inVerificationCode:'',//验证码
                getCodeChoose:true,
                countdown:120,//倒计时
                hint:'',//提示信息
                ReferrerChoose:22,
                showCenterDialog:false,//提示框
                InviterRegisterName:'周杰伦',//推荐邀请人姓名
                InviterPhone:'15852154141',//推荐邀请人手机号
                updateInviterPhone:'',//修改
                registerRegulation:'邀请规则',//邀请规则
                userInfo: {}
            }
        },
        activated: function () {
            this.userInfo = JSON.parse(localStorage.getItem('UserInfo'));
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods:{

            /**
             * 点击获取验证码
             */
            getCodeClick:function(){
                const that=this;
                if (that.inPhone){
                    that.countdownClick();
                    that.getCodeChoose=false;
                    sendLoginCode({"phone":that.inPhone}).then(
                        res => {
                            if (res.status==='0') {
                                that.hint='';
                            }
                        }
                    );
                }else {
                    this.$toast('请输入手机号');
                }
            },

            /**
             * 倒计时
             */
            countdownClick: function (e) {
                const that = this;
                let countdown = that.countdown;
                if (that.countdown >= 0) {
                    setTimeout(function(){
                        countdown = countdown - 1;


                        that.countdown= countdown;

                        if (that.countdown == 0) {
                            that.getCodeChoose= !that.getCodeChoose;
                            that.countdown=120;

                            return ;
                            // setTimeout(function () { that.questions() }, 100)
                        }else {
                            that.countdownClick();
                        }


                    }, 1000);

                }
            },

            VerificationCodeBlur:function(){
                const that=this;
                if(that.inVerificationCode){

                }else {
                    that.hint='验证码为空';
                }

            },

            PhoneBlur:function(){
                const that=this;
                var partten = /^1[3-9]\d{9}$/;
                if (!partten.test(that.inPhone)) {
                    that.hint='不是手机号码！'
                    that.inPhone = '';
                    return;
                }
            },

            WxLoginClick:async function(){
                const that=this;
                if (that.inPhone&&that.inVerificationCode){
                  const res = await loginAndBinDing({"phone":that.inPhone,"phoneCode":that.inVerificationCode,"openId":localStorage.openid, "unionId":localStorage.unionId});
                    if (res.status==='0') {
                        localStorage.UserInfo=JSON.stringify(res.data);
                        that.$store.commit('login', res.data);
                        that.$router.push('/');
                    }else if (res.status==='2') {
                        that.$router.push({name: 'register'})
                    }

                }else {
                    that.hint='请将信息填完整';
                }
            },



        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";
   #register{
       position: absolute;
       width: 100%;
       height: 100%;
       top: 0;
       left: 0;
       background-color: white;
       text-align: center;
       @extend %flex;
       @extend %justify-content-space-between;
       @extend %flex-align-center;
       flex-direction: column ;
   }
    .head{
        margin-top: rem(60);
        img{
            display: inline-block;
            width: rem(80);
            height: rem(80);
            border-radius: 50%;
        }
    }
    .nickname{
        margin-top: rem(10);

        font-size: rem(18);
        color: #333333;
        letter-spacing: 0;
    }
    .tip{
        margin-top: rem(10);
        font-size: rem(15);
        color: #FF0000;
        letter-spacing: 0;
    }

    input[type='tel']{
        text-indent: rem(44);
       // margin: 0 rem(20) 0 0;
        height: 100%;
        width: 100%;
     //   border: 1px solid #CCCCCC;

    }

    .wxBtn{
        margin: rem(78) auto 0;
        width: rem(256);
        height: rem(49);
        line-height: rem(49);
        background: #0AB717;
        border-radius: rem(25);
        font-size: rem(18);
        color: #FFFFFF;
        letter-spacing: 0;
    }
    .sign{
        margin-bottom: rem(20);
        width: 100%;
        font-size: rem(13);
        color: #333333;
        span{
            color: $them;
        }
        input{
            -webkit-appearance: checkbox;
            vertical-align: sub;
            width: rem(16);
            height: rem(16);
            color: #CFCFCF;
            border:1px solid #CFCFCF;
        }
    }
    input:focus {
        outline: none;
    }

    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #999;
        opacity: 1;
    }

    ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #999;
        opacity: 1;
    }

    input:-ms-input-placeholder {
        color: #999;
        opacity: 1;
    }

    input::-webkit-input-placeholder {
        color: #999;
        opacity: 1;
    }

</style>