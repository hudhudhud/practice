<template>
    <div id='register'>
        <back-btn></back-btn>
      <div style="width: 100%">
          <div class="registerTitle">
              <div><img class="logo" src="../assets/images/logo.jpg"></div>
          </div>

          <!--<div class='examineeName'>-->
          <!--<i class="iconfont icon-account"></i>-->
          <!--<input class='exaName' @blur.prevent='InviterPhoneBlur' v-model='inInviterPhone' placeholder='请输入邀请人手机号' maxlength='11' type='tel' /></div>-->

          <div class='examineeName'>
              <i class="iconfont icon-Mobile-phone-no"></i>
              <input class='exaName' @blur='PhoneBlur' v-model='inPhone' placeholder='请输入您的手机号' maxlength='11'
                     type='tel'/></div>

          <div class='examineeName'>
              <i class="iconfont icon-Verification-code"></i>
              <input class='exaNameCode' @blur='VerificationCodeBlur' v-model='inVerificationCode' placeholder='请输入验证码'
                     maxlength='6' type='tel'/>

              <div class='getCode' @click='getCodeClick' v-if='getCodeChoose'> 获取验证码</div>


              <div class='getCode' v-if='!getCodeChoose'>
                  {{countdown}}<span class="time">S后重新获取...</span>
              </div>

          </div>

          <div class="hint">{{hint}}</div>

          <div class='btn' @click='nextClick'><span>下一步</span></div>
      </div>
        <div class="agreement">
            <Check :check.sync="agree" />
            <span>请仔细阅读并勾选同意</span>
            <a class="them" href="https://zy-image.oss-cn-hangzhou.aliyuncs.com/word/%E5%95%86%E5%9F%8E%E6%B3%A8%E5%86%8C%E5%8D%8F%E8%AE%AE%281989%29.docx">《火兔商城客户注册协议》</a>
        </div>

    </div>
</template>

<script>
    import { MessageBox, Toast } from 'mint-ui';
    import { registByPhone, updatePassword } from '../service/register.service'
    import Check from '@/components/check'
    import {sendRegistCode} from "../service/login";
    export default {
        name: "register",
        components: {
            Check
        },
        data: function () {
            return {
                inInviterPhone: '',//邀请人手机号
                inPhone: '',//我的手机号
                inVerificationCode: '',//验证码
                getCodeChoose: true,
                countdown: 120,//倒计时
                hint: '',//提示信息
                ReferrerChoose: 22,
                showCenterDialog: false,//提示框
                InviterRegisterName: '',//推荐邀请人姓名
                InviterPhone: '',//推荐邀请人手机号
                updateInviterPhone: '',//修改
                pwd: '',//密码
                verificationPwd: '',//验证密码
                loginUser: [],
                registerRegulation: '邀请规则',//邀请规则
                agree: true
            }
        },
        methods: {


            GetRequest: function () {
                return this.$route.query;
            },

            /**
             * 点击获取验证码
             */
            getCodeClick: function () {
                const that = this;
                if (that.inPhone) {
                    sendRegistCode({"phone": that.inPhone}).then(
                        res => {
                            if (res.status === '0') {
                                that.countdownClick();
                                that.getCodeChoose = false;
                                that.hint = '';
                            }
                        }
                    );
                } else {
                    that.hint = '请输入手机号';
                }
            },

            /**
             * 倒计时
             */
            countdownClick: function (e) {
                const that = this;
                let countdown = that.countdown;
                if (that.countdown >= 0) {
                    setTimeout(function () {
                        countdown = countdown - 1;


                        that.countdown = countdown;

                        if (that.countdown == 0) {
                            that.getCodeChoose = !that.getCodeChoose;
                            that.countdown = 120;

                            return;
                            // setTimeout(function () { that.questions() }, 100)
                        } else {
                            that.countdownClick();
                        }


                    }, 1000);

                }
            },

            VerificationCodeBlur: function () {
                const that = this;
                if (that.inVerificationCode) {

                } else {
                    that.hint = '验证码为空';
                }

            },

            PhoneBlur: function () {
                const that = this;
                var partten = /^1[3-9]\d{9}$/;
                if (!partten.test(that.inPhone)) {
                    that.hint = '不是手机号码！'
                    that.inPhone = '';
                    return;
                }
            },

            /**注册  新*/
            nextClick: async function () {
                if(!this.agree){
                    Toast('请同意火兔商城用户协议');
                    return;
                }
                let inviterNumber = localStorage.getItem('appKey') || '';
                const {status, data} = await registByPhone({
                    phone: this.inPhone,
                    inviterNumber: inviterNumber,
                    phoneCode: this.inVerificationCode,
                    load: true
                });

                if (status === '0') {
                    // 注册成功 保存  信息
                    localStorage.UserInfo = JSON.stringify(data);
                    this.$store.commit('login', data);
                    let psw;
                    while (true) {
                        try {
                            psw = (await this.prompt('请输入密码', '设置登录密码', {cancelButtonText: '暂不设置'})).value;

                        } catch (e) {
                            setTimeout(() => {
                                this.$router.push('/');
                            }, 500)
                            return;
                        }

                        if (!/^[0-9A-Za-z]+$/.test(psw)) {
                            layer.msg('支付密码设置不正确')
                        } else {
                            break;
                        }
                    }
                    updatePassword({password: hex_md5(psw), load: true, successMsg: '设置成功'}).then(
                        res => {
                            if (res.status === '0') {
                                setTimeout(() => {
                                    this.$router.push('/');
                                }, 1000)
                            }
                        }
                    );
                }

            },


            /**复制手机号*/
            jsCopy: function () {
                var e = document.getElementById("InviterPhoneText");//对象是copy-num1
                e.select(); //选择对象
                document.execCommand("Copy"); //执行浏览器复制命令
                layer.msg("复制成功");
            },

        }

    }
</script>


<style scoped lang="scss">
    @import "../assets/public";
    .agreement{
        margin-bottom: rem(20);
        text-align: center;
        font-size: rem(12);
        & > * {
            vertical-align: middle;
        }
        span:first-of-type{
            margin-left: rem(13);
        }
    }
    #register {
        /*background: url('http://pauw5hcqh.bkt.clouddn.com/background.png');*/
        /*background-size: 100%100%;*/
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        color: #666666 !important;
        background-color: #ffffff;
        @extend %flex;
        @extend %justify-content-space-between;
        @extend %flex-align-center;
        flex-direction: column ;
    }

    .registerTitle {
        /*	  display: flex;
          justify-content: space-around;*/
        font-weight: bold;
        padding-top: tran(100);
        margin-bottom: tran(70);
        font-size: tran(60);
        text-align: center;
    }

    .logo {
        width: rem(156);
        height: rem(145);
        border-radius: tran(15);
    }

    .time {
        font-size: tran(30);
        color: #333333;
    }

    .examineeName {
        display: flex;
        width: 80%;
        height: tran(110);
        line-height: tran(100);
        padding-left: tran(20);
        margin: auto;
        margin-bottom: tran(40);
        font-size: tran(48);
        align-items: center;
        background-color: transparent;
        border: solid 1px #E1E1E1;
        border-radius: tran(60);
        .iconfont {
            font-size: rem(22);
            margin-left: rem(10);
        }
    }
    .btn{
        border-radius: rem(25);
        margin: rem(80) auto 0;
        width: rem(256);
        height: rem(43);
        line-height: rem(43);
        font-size: rem(18);
        text-align: center;
        color: #ffffff;
        background-color: $them;
    }

    .exaName {
        margin-left: tran(40);
        height: tran(90);
        line-height: tran(90);
        width: tran(525);
        font-size: tran(40);
        color: #666666;

    }

    .exaNameCode {
        margin-left: tran(40);
        height: tran(90);
        line-height: tran(90);
        width: tran(350);
        font-size: tran(40);
        color: #333333;
    }

    input {
        border-width: 0rem;
        border-style: inset;
        border-color: initial;
        border-image: initial;
        background-color: transparent;
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

    .inPhone {
        width: tran(54);
        height: tran(54);
        margin-left: tran(20);
    }

    button {
        padding-left: 0;
        padding-right: 0;
        box-sizing: border-box;
        font-size: tran(18);
        background: none;
        border: none;
    }

    button:after {
        border: none;
    }

    .getCode {
        color: #666666;
        font-size: rem(15);
    }

    .hint {
        text-align: center;
        color: #fff;
    }

    .InviterReferrerPage {
        width: 80%;
        border-radius: tran(20);
    }

    .InviterReferrerTitle {
        /*width: 100%;*/
        background: url('http://pauw5hcqh.bkt.clouddn.com/top.png');
        width: 100%;
        height: tran(150);
        /*-webkit-background-size: 100%;*/
        background-size: 100% 100%;
        font: normal bold tran(20) "微软雅黑";
        font-size: tran(50);
        text-align: center;
        color: #fff;
        border-top-right-radius: tran(20);
        border-top-left-radius: tran(20);
        line-height: tran(150);
    }

    .InviterReferrerInfoList {
        background: #fff;
        padding: tran(30);
    }

    .registerName {
        font-size: tran(40);
        font-weight: bold;
        margin-top: tran(40);
    }

    .InviterPhone {
        display: flex;
        justify-content: space-between;
    }

    .RegulationTitle {
        font-size: tran(36);
        color: #666666;
        margin-top: tran(70);
        margin-bottom: tran(30);
    }

    .RegulationInfo {
        font-size: tran(32);
        color: #999999;
        line-height: tran(50);

    }

    #InviterPhoneText {
        font-size: tran(36);
        width: tran(250);
    }

    .copeClick {
        font-size: tran(38);
        font-weight: bold;
    }

    .Referrer22 {
        background: #ff6666;
    }

    .Referrer12 {
        background: #999999;
    }

    .updateReferrer {
        display: flex;
        width: 80%;
        height: tran(110);
        line-height: tran(110);
        border-radius: 5px;
    }

    .InviterReferrerInfoList input:focus {
        outline: none;
    }

    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #999999;
        opacity: 1;
    }

    .InviterReferrerInfoList ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #999999;
        opacity: 1;
    }

    .InviterReferrerInfoList input:-ms-input-placeholder {
        color: #999999;
        opacity: 1;
    }

    .InviterReferrerInfoList input::-webkit-input-placeholder {
        color: #999999;
        opacity: 1;
    }

    .updateexaName {
        font-size: tran(40);
        color: #000;
    }
</style>