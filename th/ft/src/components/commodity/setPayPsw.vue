<template>
    <div class="box" v-if="show">

        <div class="content">
            <div class="close" @click="close">
                <i class="iconfont icon-guanbi"></i>
            </div>
            <p class="title">设置支付密码</p>
            <p class="intro">
                您尚未设置支付密码，为了您的资金安全，请先完成支付密码的设置，该密码用于账户U币，余额的支付验证。
            </p>
            <div class="input">
                <input type="tel" ref="phone" placeholder="请输入手机号" v-model="phone">
            </div>
            <div class="input">
                <input type="tel" placeholder="请输入验证码" v-model="code">
                <span class="code-btn" @click="sendCode" v-if="time === 120">获取验证码</span>
                <span class="code-btn" v-else>{{time}}秒后可再次发送</span>
            </div>
            <div class="input">
                <input type="password" placeholder="设置支付密码" v-model="payPsw" @input="payChange">
            </div>
            <p class="tip">密码必须是6位数字！</p>
            <div class="btn" @click="handleSetPsw">
                <span v-if="!load">确定</span>
                <mt-spinner v-else :type="3" color="#ffffff"></mt-spinner>
            </div>
        </div>
    </div>
</template>

<script>
    // 设置支付密码
    import { sendFindPayPasswordCode, updatePayPassworde } from "../../service/forgotPsw";
    import { isPhone } from "../../service/util";
    import { Toast } from 'mint-ui';

    export default {
        name: "set-pay-psw",
        data: function () {
            return {
                phone: '',
                code: '',
                payPsw: '',
                show: false,
                resolve: null,
                reject: null,
                time: 120,
                load: false
            }
        },
        methods: {
            setPayPsw: function () {
                this.show = true;
                this.phone = '';
                this.code = '';
                this.payPsw = '';
                this.time = 120;
                this.load = false;
                this.$nextTick(() => {
                    this.$refs.phone.focus();
                })
                return new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject
                })
            },
            close: function () {
                this.show = false;
                this.reject();
            },
            payChange: function (e) {
                if (isNaN(this.payPsw) || this.payPsw.length > 6) {
                    this.payPsw = this.payPsw.slice(0, this.payPsw.length-1);
                }
            },
            /**
             * 发送验证码
             */
            sendCode: function () {
                if (!isPhone(this.phone)) {
                    Toast('请输入正确的手机号');
                    return;
                }
                sendFindPayPasswordCode({phone: this.phone}).then(
                    res => {
                        if (res.status === '0') {
                            this.CountDown();
                        }
                    }
                );
            },
            /**
             * 倒计时
             */
            CountDown: function () {
                this.time--;
                let inter = setInterval(() => {
                    this.time--;
                    if (!this.time) {
                        this.time = 120;
                        clearInterval(inter);
                    }
                }, 1000)
            },
            /**
             * 设置密码
             */
            handleSetPsw: function () {
                if (!isPhone(this.phone)) {
                    Toast('请输入正确的手机号');
                    return;
                }
                if (!this.code) {
                    Toast('请输入验证码');
                    return;
                }
                if (this.payPsw && this.payPsw.length === 6) {
                    this.load = true;
                    updatePayPassworde({
                        phoneCode: this.code,
                        phone: this.phone,
                        payPassword: hex_md5(this.payPsw),
                        successMsg: '设置成功'
                    }).then(
                        res => {
                            this.load = false;
                            if (res.status === '0') {
                                this.show = false;
                                this.resolve();
                            }
                        }, () => {
                            this.load = false;
                        }
                    );
                } else {
                    Toast('支付密码必须是6位');
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    @import "../../assets/animation";

    .box {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
    }

    .content {
        animation: alert-show .3s ease-out;
        .close {
            position: absolute;
            right: 0;
            top: 0;
            height: rem(40);
            line-height: rem(40);
            width: rem(40);
            font-size: rem(14);
            color: #333333;
            text-align: left;
        }
        padding-bottom: rem(40);
        color: #333333;
        position: absolute;
        width: rem(345);
        background-color: #ffffff;
        left: 50%;
        top: 50%;
        @include translate(-50%, -50%);
        text-align: center;
        .title {
            margin: rem(20) 0 rem(13);
            font-size: rem(16);
        }
        .intro {
            margin: 0 auto;
            width: rem(279);
            font-size: rem(12);
            line-height: rem(20);
            color: #666666;
            text-align: left;
        }
        .input {
            margin: rem(20) auto 0;
            width: rem(291);
            height: rem(48);
            position: relative;
            input {
                width: 100%;
                height: 100%;
                background-color: #F5F5F5;
                text-indent: rem(15);
                font-size: rem(15);
            }
            .code-btn {
                color: #666666;
                font-size: rem(15);
                position: absolute;
                right: rem(15);
                top: 50%;
                @include translate(0, -50%);
            }
        }
        .tip {
            margin-top: rem(10);
            margin-left: rem(33);
            text-align: left;
            font-size: rem(14);
            color: #999999;
        }
        .btn {
            width: rem(256);
            height: rem(43);
            margin: rem(35) auto 0;
            font-size: rem(18);
            border-radius: rem(25);
            color: #ffffff;
            background-color: $them;
            font-weight: bold;
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-center;
        }
    }
</style>