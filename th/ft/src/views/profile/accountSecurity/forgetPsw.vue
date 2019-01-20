<template>
    <div id='password' class="page">
        <back-btn></back-btn>
        <div class="title-logo">
            <div><img class="logo" src="../../../assets/images/logo.jpg"></div>
        </div>
        <user-name >
            <template slot="user">
                <input class="phone_number" type="tel" @blur='PhoneBlur' v-model='inPhone' placeholder="请输入您的手机号"/>
            </template>
            <template slot="pass">
                <input class="Verification_code_input" @blur='VerificationCodeBlur' v-model='inVerificationCode' type="tel"
                       placeholder="请输入验证码"/>
                <button @click='getCodeClick' v-if='getCodeChoose'>获取验证码</button>
                <button v-else><span>{{countdown}}</span>S后重新获取</button>
            </template>
        </user-name>

        <div @click='forgetPasswordClick' class="Retrieve_password">验证手机号</div>
    </div>

</template>

<script>
    import { Toast  } from 'mint-ui';
    import {
        sendFindPayPasswordCode,
        sendFindPayPasswordCode2,
        checkFindPasswordCode,
        checkFindPasswordCode2
    } from '../../../service/profile/forgetPsw'
    export default {
        name: "forget-psw",
        data: function () {
            return {
                UserInfo: [],//用户信息
                id: null,
                inPhone: '',//我的手机号
                inVerificationCode: '',//验证码
                getCodeChoose: true,
                countdown: 120,//倒计时;
                hint: '',
            }
        },
        activated: function () {
            this.id = this.$route.query.id;
            try {
                this.UserInfo = JSON.parse(localStorage.UserInfo);

            }catch (e){

            }
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {

            getCodeClick: function () {
                const that = this;
                // if (that.inPhone){
                if (that.inPhone) {
                    this.sendFindPayPasswordCode(this.id)
                } else {
                    Toast('请输入手机号');
                }
            },
            sendFindPayPasswordCode:async function (id) {
                const that = this;
                const res = id==1?await sendFindPayPasswordCode2({"phone": this.inPhone}):await sendFindPayPasswordCode({"phone": this.inPhone});
                if(res.status === '0'){
                    that.countdownClick();
                    that.getCodeChoose = false;
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
                    Toast( '不是手机号码！')
                    return;
                }
            },


            forgetPasswordClick: function () {
                const that = this;
                //
                if (that.inVerificationCode) {
                    this.checkFindPasswordCode(that.id)
                } else {
                    Toast('验证码为空')
                }
            },
            checkFindPasswordCode:async function (id) {
                const that = this;
                const res =id==1? await checkFindPasswordCode2({"phone": that.inPhone, "phoneCode": that.inVerificationCode}):await checkFindPasswordCode({"phone": that.inPhone, "phoneCode": that.inVerificationCode});
                if(res.status === '0'){
                    let token = res.data?res.data.token:'';
                    // localStorage.token = token;
                    that.$router.replace({name: 'forgetPsw2', query: {id: that.id, phone: that.inPhone, code: that.inVerificationCode}, params: {token: token}})
                }
            }
        },

    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";
    input {
        padding-left: rem(15);
        border-radius: 3px;
    }
    .sign{
        margin:  rem(10);
        @extend %flex;
        @extend %flex-align-center;
        & > * {
            flex: 1;
        }

    }
    .phone_number {
        outline-color: invert;
        outline-style: none;
        outline-width: 0px;
        border: none;
        border-style: none;
        text-shadow: none;
        -webkit-appearance: none;
        -webkit-user-select: text;
        outline-color: transparent;
        box-shadow: none;
        height: 43px;
        width: 90%;
        margin: auto;
    }

    .Verification_code_input {
        outline-color: invert;
        outline-style: none;
        outline-width: 0px;
        border: none;
        border-style: none;
        text-shadow: none;
        -webkit-appearance: none;
        -webkit-user-select: text;
        outline-color: transparent;
        box-shadow: none;
        height: rem(43);
        width: 65%;
        margin: auto;
    }

    .Verification_code {
        text-align: center;
        width: 35%;
        border: 1px solid #FF6161;
        margin-left: 3%;
      //  padding: 6px 10px 6px 10px;
        height: rem(35);
        line-height: rem(35);
        background: #FF6161;
        color: #FFFFFF;
        font-size: rem(14);
        border-radius: 3px;
    }

    .forget_password_phone {
        width: 90%;
        margin: auto;
        margin-top: 120px;
        line-height: 60px;
        text-align: left;
    }

    .Retrieve_password {
        width: 90%;
        margin: auto;
        margin-top: 60px;
        height: 40px;
        background: #FF6161;
        border: 1px solid #FF6161;
        text-align: center;
        font-size: 14px;
        border-radius: 3px;
        line-height: 40px;
        text-align: center;
        color: white;
    }
</style>