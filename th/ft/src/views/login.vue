<template>
    <div id='login'>
        <back-btn></back-btn>
        <div class="registerTitle">
            <div><img class="logo" src="../assets/images/logo.jpg"></div>
        </div>

        <div class='examineeName'>
            <!--<img class="inPhone" src="../assets/img/LoginRegistration/Invite.png">-->
            <i class="inPhone iconfont icon-Mobile-phone-no"></i>
            <input class='exaName' v-model='inPhone' placeholder='请输入您的手机号' maxlength='11'
                   type='tel'/></div>

        <div class='examineeName' v-if='!loginChoose'>
            <i class="inPhone iconfont icon-Verification-code"></i>
            <input class='exaName' v-model='inPwd' placeholder='请输入密码' @keyup.enter="GoLoginClick" type='password'/>
        </div>

        <div class='examineeName' v-if='loginChoose'>
            <i class="inPhone iconfont icon-Verification-code"></i>
            <input class='exaNameCode' v-model='inVerificationCode' placeholder='请输入验证码'
                   maxlength='6' type='tel'/>

            <div class='getCode' @click='getCodeClick' v-if='getCodeChoose'> 获取验证码</div>


            <div class='getCode' v-if='!getCodeChoose'>
                {{countdown}}<span class="time">S后重新获取...</span>
            </div>

        </div>

        <div class="hint LR">
            <span v-if='loginChoose' @click='loginClick'>账号登录</span>
            <span v-if='!loginChoose' @click='loginClick'>验证码登录</span><span
                @click='GoregisterClick'>快速注册</span></div>

        <div class='btn' @click='GoLoginClick'>
            <span>登录</span></div>
        <div class='btn wx' @click='WXLoginClick'>
            <span>微信登录</span></div>
        <div class="hint" v-if='!loginChoose' @click='forgetPwdClick'>忘记密码?</div>
        <div style="height: 50px;"></div>
        <div class="hint">{{hint}}</div>

    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    import {Indicator} from 'mint-ui'
    import {
        getWxLoginAddress,
        loginByPassword,
        loginByPhoneCode,
        sendLoginCode,
        wxLoginCallBack
    } from "../service/login";

    export default {
        name: "login",
        data: function () {
            return {
                inPwd: '',//邀请人手机号
                inPhone: '',//我的手机号
                inVerificationCode: '',//验证码
                getCodeChoose: true,
                countdown: 120,//倒计时
                hint: '',//提示信息
                // ReferrerChoose:22,
                loginChoose: false,//提示框
                name: ''
            }
        },
        beforeRouteEnter: function (to, {name}, next) {
            next(vm => {
                vm.name = name;
            });
        },
        mounted: function () {
            this.onReady();
            localStorage.UserInfo = '';
            this.$store.commit('login', {});
        },
        methods: {

            getUrlParam: function (name) {
                let r = window.location.href.match(/[\?&]\w+=\w+/g);
                if (!r) {
                    return null;
                }
                const data = r.find(i => {
                    return i.substr(1).split('=')[0] === name;
                })
                if (data) {
                    return data.split('=')[1];
                }
                return null;
            },

            /**
             * 点击获取验证码
             */
            getCodeClick: function () {
                var partten = /^1[3-9]\d{9}$/;
                if (!partten.test(this.inPhone)) {
                    layer.msg('不是手机号码');
                    return;
                }
                const that = this;
                if (that.inPhone) {
                    sendLoginCode({"phone": that.inPhone}).then(
                        res => {
                            if (res.status === '0') {
                                that.countdownClick();
                                that.getCodeChoose = false;
                            }
                        }
                    );
                } else {
                    layer.msg('请输入手机号');
                }
            }
            ,

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
            }
            ,

            PhoneBlur: function () {
                const that = this;
                if (that.inPwd) {

                } else {
                    layer.msg('请填写密码')
                }
            }
            ,
            InviterPhoneBlur: function () {
                const that = this;
                var partten = /^1[3-9]\d{9}$/;
                if (!partten.test(that.inPhone)) {
                    layer.msg('不是手机号码')
                    that.inInviterPhone = '';
                    return;
                }
            }
            ,

            loginClick: function () {
                const that = this;

                that.loginChoose = !that.loginChoose;

            }
            ,

            /**登录*/
            GoLoginClick: function () {

                var partten = /^1[3-9]\d{9}$/;
                if (!partten.test(this.inPhone)) {
                    layer.msg('不是手机号码');
                    return;
                }


                const that = this;

                if (that.loginChoose) {

                    if (that.inPhone && that.inVerificationCode) {
                        let inviterNumber = localStorage.getItem('appKey') || '';
                        loginByPhoneCode({
                            "phone": that.inPhone,
                            "phoneCode": that.inVerificationCode,
                            inviterNumber: inviterNumber,
                            load: true
                        }).then(
                            res => {
                                if (res.status === '0') {
                                    localStorage.UserInfo = JSON.stringify(res.data);
                                    that.$store.commit('login', res.data);
                                    if (that.name) {
                                        that.$router.back();
                                    } else {
                                        that.$router.push('/')
                                    }
                                    layer.msg('登录成功');
                                }
                            }
                        );

                    } else {
                        layer.msg('请输入手机号');
                    }

                } else {
                    if (that.inPhone && that.inPwd) {
                        loginByPassword({"phone": that.inPhone, "password": that.inPwd, load: true}).then(
                            res => {
                                if (res.status === '0') {
                                    let appKey = localStorage.getItem('appKey') || '';
                                    let msgList = localStorage.getItem('msgList') || '';
                                    localStorage.clear();
                                    localStorage.setItem('appKey', appKey);
                                    localStorage.setItem('msgList', msgList);
                                    localStorage.UserInfo = JSON.stringify(res.data);
                                    that.$store.commit('login', res.data);
                                    if (that.name) {
                                        that.$router.back();
                                    } else {
                                        that.$router.push('/')
                                    }
                                }
                            }
                        );

                    } else {
                        layer.msg('请将信息填写完整');
                    }

                }

            }
            ,

            /**忘记密码*/
            forgetPwdClick: function () {
                //  const that = this;
                //  location.href = '../forget_password_phone/forget_password_phone.html?id=1'
                this.$router.push({name: 'forgetPsw', query: {id: 1}})
            }
            ,

            // 获取微信登录授权
            WXLoginClick: function () {
                getWxLoginAddress().then(
                    res => {
                        if (res.status === '0') {
                            location.href = res.data;
                        }
                    }
                );
            }
            ,


            onReady: async function () {
                const that = this;

                let code = this.getUrlParam('code');
                if (code) {
                    wxLoginCallBack({id: code,errorMsg:false}).then(
                        res => {
                            if (res.status === '0') {
                                if (res.data.status === '0') {
                                    // 保存key
                                    let appKey = localStorage.getItem('appKey') || '';
                                    let msgList = localStorage.getItem('msgList') || '';
                                    localStorage.clear();
                                    localStorage.setItem('appKey', appKey);
                                    localStorage.setItem('msgList', msgList);
                                    localStorage.UserInfo = JSON.stringify(res.data);
                                    //  location.href = '../index/index.html';
                                    //   that.$router.push('/')
                                    location.replace('/');
                                } else if (res.data.status === '2') {
                                    localStorage.UserInfo = JSON.stringify(res.data);
                                    localStorage.openid = res.data.openId;
                                    localStorage.unionId = res.data.unionId;
                                    location.replace(location.origin + '/#/wxRegister');
                                }

                            } else {
                                that.$store.commit('maskChange', false);
                            }
                        }, () => {
                            that.$store.commit('maskChange', false);
                        }
                    );

                } else {
                    this.$store.commit('maskChange', false);
                }
            }
            ,


            GoregisterClick: function () {
                // const that = this;
                // location.href = '../register/register.html'
                this.$router.push({name: 'register'})
            }
            ,

        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";

    #login {
        background-color: white;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .time {
        font-size: tran(30);
        color: #333333;
    }

    .registerTitle {
        /*	  display: flex;
          justify-content: space-around;*/
        // font-weight: bold;
        padding-top: tran(100);
        margin-bottom: tran(70);
        color: #333333;
        font-size: rem(24);
        text-align: center;
    }

    .logo {
        width: rem(156);
        height: rem(145);
        //border-radius: tran(15);
    }

    .exaNameCode {
        margin-left: tran(40);
        height: tran(90);
        line-height: tran(90);
        width: tran(350);
        font-size: rem(15);
        color: #333333;
    }

    .inPhone {
        margin-left: tran(20);
        color: #666666;
        font-size: rem(22);
    }

    button {
        padding-left: 0;
        padding-right: 0;
        box-sizing: border-box;
        font-size: 18px;
        background: none;
        border: none;
    }

    button::after {
        border: none;
    }

    .getCode {
        color: #333333;
    }

    .hint {
        text-align: center;
        color: #333333;
    }

    .LR {
        margin: 0 rem(35);
        color: #333333;
        @extend %flex;
        @extend %justify-content-space-between;
        /*margin:  0 20px;*/
    }

    .examineeName {
        display: flex;
        width: 80%;
        height: tran(110);
        line-height: tran(100);
        padding-left: tran(20);
        margin: auto;
        margin-bottom: tran(40);
        font-size: tran(40);
        align-items: center;
        /*background-color:transparent;*/
        border: solid 2px #E1E1E1;
        border-radius: tran(60);
    }

    .btn {
        margin: rem(30) auto 0;
        border-radius: rem(25);
        width: rem(256);
        height: rem(49);
        line-height: rem(49);
        font-size: rem(18);
        text-align: center;
        color: #ffffff;
        background-color: $them;
    }

    .btn.wx {
        margin-top: rem(20);
        background-color: #0AB717;
        margin-bottom: rem(20);
    }

    .exaName {
        margin-left: tran(40);
        height: tran(90);
        line-height: tran(90);
        width: tran(525);
        font-size: tran(40);
        color: #333333;

    }

    input {
        background: transparent;
        outline: none;
        border: 0px;
    }

    input:focus {
        outline: none;
    }

    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #333;
        opacity: 1;
    }

    ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #333;
        opacity: 1;
    }

    input:-ms-input-placeholder {
        color: #333;
        opacity: 1;
    }

    input::-webkit-input-placeholder {
        color: #333;
        opacity: 1;
    }
</style>