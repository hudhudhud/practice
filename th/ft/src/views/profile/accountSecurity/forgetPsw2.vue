<template>
    <div id='password' class="page">
        <back-btn></back-btn>
        <div class="title-logo">
            <div><img class="logo" src="../../../assets/images/logo.jpg"></div>
        </div>
        <div class="password">
            <input v-model='oldPwd' type='password' placeholder="设置新密码">
            <input v-model='newPwd' type='password' placeholder="确认密码">
        </div>
        <div @click='affirmClick' class="affirm">
            <span class="affirm_Css">确认</span>
        </div>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui';
    import {
        updatePassword,
        updatePasswordByPhoneCode,
        updatePayPassword
    } from "../../../service/profile/updatePsw.service";

    export default {
        name: "forget-psw2",
        data: function () {
            return {
                token: '',//用户信息
                id: null,
                oldPwd: '',//旧密码
                newPwd: '',//新密码
                confirmPwd: '',//确认密码
            }
        },
        activated: function () {
            this.id = this.$route.query.id;
            this.token = this.$route.params.token;
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {

            affirmClick: async function () {
                const that = this

                if (that.oldPwd && that.newPwd) {

                    if (that.newPwd == that.oldPwd) {
                        let res;
                        if (that.id == 1) {
                            if (that.UserInfo.token) {
                                res = await updatePassword({password: hex_md5(that.newPwd)});
                            } else {
                                res = await updatePasswordByPhoneCode({
                                    phone: that.$route.query.phone,
                                    phoneCode: that.$route.query.code,
                                    password: hex_md5(that.newPwd)
                                });
                            }
                        } else {
                            res = await updatePayPassword({payPassword: hex_md5(that.newPwd)});
                        }
                        if (res.status === '0') {
                            Toast('修改成功！')

                            setTimeout(function () {
                                if (that.UserInfo.token) {
                                    that.$router.replace({name: 'accountInfo'})
                                } else {
                                    that.$router.replace({name: 'login'})
                                }
                            }, 1000);
                        }
                    } else {
                        Toast('两次密码输入不一致')
                    }
                } else {
                    Toast('请将信息填写完整')
                }

            },

        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    input {
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
        height: 35px;
        width: 65%;
    }

    .new_password {
        width: 25%;
        font-size: 15px;
    }

    .affirm_password {
        width: 25%;
        margin-left: 5%;
        font-size: 15px;
    }

    .password {
        input {
            border-radius: rem(25);
            border: 1px solid #E1E1E1;
            margin: rem(20) auto 0;
            width: rem(325);
            height: rem(49);
            display: block;
            text-indent: rem(20);
        }
    }

    .affirm {
        width: rem(255);
        height: rem(40);
        line-height: rem(40);
        margin: auto;
        margin-top: rem(43);
        background: $them;
        text-align: center;
        font-size: rem(15);
        color: #ffffff;
        border-radius: rem(20);
    }

    .affirm_Css {
        line-height: 35px;
        text-align: center;
        color: #fff;
    }


</style>