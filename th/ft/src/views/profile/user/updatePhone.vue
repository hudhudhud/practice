<template>
    <div class="page">
        <div class="item">
            <input type="tel" v-model="phone" placeholder="请输入新的手机号">
        </div>
        <div class="item">
            <input type="tel" v-model="code" placeholder="请输入验证码">
            <span class="code"
                  @click="countdown===120&&sendCode()">{{countdown===120?'获取验证码':(countdown+'秒后可再次获取')}}</span>
        </div>
        <div class="btn" @click="updatePhone">
            确定
        </div>
    </div>
</template>

<script>
    import {sendChangPhoneCode, updatePhone} from "../../../service/profile/accountInfo";
    import {isPhone} from "../../../service/util";

    export default {
        name: "updatePhone",
        data: function () {
            return {
                phone: '',
                code: '',
                countdown: 120
            }
        },
        activated: function () {
            this.setTitle('修改手机号');
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            sendCode: async function () {
                if (!isPhone(this.phone)) {
                    this.$toast('请输入正确的手机号');
                    return
                }
                const res = await sendChangPhoneCode({phone: this.phone, load: true});
                if (res.status === '0') {
                    this.countdownClick();
                }
            },
            updatePhone: async function () {
                if (!isPhone(this.phone)) {
                    this.$toast('请输入正确的手机号');
                    return
                }
                if(!this.code){
                    this.$toast('请输入验证码');
                    return
                }
                const res = await updatePhone({phoneCode: this.code, phone: this.phone, load: true,successMsg: '修改成功'});
                if (res.status === '0') {
                    setTimeout(() => {
                        this.$router.back();
                    }, 1500)
                }
            },
            /**
             * 开始倒计时
             */
            countdownClick: function () {
                if (this.countdown > 0) {
                    this.countdown--;
                    setTimeout(() => {
                        if (this.countdown !== 120) {
                            this.countdownClick();
                        }
                    }, 1000);
                } else {
                    this.countdown = 120;
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .page {
        background-color: #F1F4F3;
    }

    .item {
        font-size: rem(15);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        background-color: #ffffff;
        height: rem(51);
        padding: 0 rem(15);
        & > * {
            flex: 1;
        }
        input {
            height: rem(30);
        }
        .code {
            text-align: right;
            flex: .5;
            color: #666;
            font-size: rem(12);
        }
    }

    .item:first-of-type {
        margin-top: rem(10);
    }

    .btn {
        margin: rem(30) auto;
        background-color: $them;
        text-align: center;
        border-radius: rem(25);
        width: rem(256);
        height: rem(43);
        line-height: rem(43);
        color: #ffffff;
        font-size: rem(18);
    }
</style>