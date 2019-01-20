<template>
    <div class="page">
        <div class="logo">
            <img src="../../assets/img/signIn/logo.png" alt="">
        </div>
        <p class="tip">为防止账号被他人使用，需进行手机号验证</p>
        <div class="input">
            <input type="tel" placeholder="请输入手机号" v-model="phone">
            <span class="code" @click="sendCode()">{{time===120?'获取验证码':time+'秒后可再次获取'}}</span>
        </div>
        <div class="input">
            <input type="tel" placeholder="请输入验证码" v-model="code">
        </div>
        <div class="next" @click="next">下一步</div>
    </div>
</template>

<script>
    import { sendCode, checkCode } from '../../service/signIn'
    import { isPhone } from '../../service/util'
    import { Toast } from 'mint-ui'

    export default {
        name: "validation-phone",
        data: function () {
            return {
                time: 120,
                phone: '',
                code: ''
            }
        },
        activated: function () {
            this.code = '';
            this.time = 120;
        },
        methods: {
            sendCode: async function () {
                if (!isPhone(this.phone)) {
                    Toast('请输入正确的手机号');
                    return;
                }
                const res = await  sendCode({phone: this.phone});
                if (res.status === '0') {
                    this.countDown();
                }
            },
            countDown: function () {
                this.time--;
                if (this.time) {
                    setTimeout(() => {
                        this.countDown();
                    }, 1000)
                } else {
                    this.time = 120;
                }
            },
            next: async function () {
                if (!isPhone(this.phone)) {
                    Toast('请输入正确的手机号');
                    return;
                }
                if (!this.code) {
                    Toast('请输入验证码');
                    return;
                }
                const res = await  checkCode({phoneCode: this.code, phone: this.phone});
                if (res.status === '0') {
                    this.$router.push({name: 'check', query: {phone: this.phone}});
                } else {
                    setTimeout(() => {
                        this.$router.push({name: 'signError'});
                    }, 1500)
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .logo {
        margin: rem(29) auto;
        width: rem(136);
        height: rem(141);
        img {
            width: 100%;
            height: 100%;
        }
    }

    .tip {
        margin-top: rem(30);
        margin-bottom: rem(20);
        text-align: center;
        font-size: rem(14);
        color: #333333;
    }

    .input {
        position: relative;
        margin: rem(20) auto 0;
        width: rem(286);
        input {
            border-bottom: 1px solid #979797;
            line-height: rem(30);
            width: 100%;
            text-indent: rem(10);

        }
        .code {
            position: absolute;
            font-size: rem(14);
            color: #333333;
            white-space: nowrap;
            right: rem(10);
            top: rem(4);
        }
    }

    .next {
        margin: rem(37) auto 0;
        width: rem(255);
        height: rem(40);
        line-height: rem(40);
        background-color: #7DB728;
        border-radius: rem(20);
        color: #ffffff;
        font-size: rem(15);
        text-align: center;
    }
</style>