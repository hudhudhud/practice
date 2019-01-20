<template>
    <div id='password' class="page">
        <back-btn></back-btn>
        <div class="title-logo">
            <div><img class="logo" src="../../../assets/images/logo.jpg"></div>
        </div>
        <div class="password">
            <input placeholder="旧密码" @blur='oldPwdblur' v-model='oldPwd' type='password'>
            <input placeholder="新密码" v-model='newPwd' type='password'>
            <input placeholder="确认密码" v-model='confirmPwd' type='password'>
        </div>
        <div class="affirm" @click='affirmClick'>
            <span class="affirm_Css">确认</span>
        </div>
        <p class="forget_password" @click='forgetPasswordClick'>忘记旧密码?</p>

    </div>

</template>

<script>
    import {Toast} from 'mint-ui'
    import {
        updatePasswordByOld,
        updatePayPasswordByOld
    } from '../../../service/profile/updatePsw.service'

    export default {
        name: "update-psw",
        data: function () {
            return {
                UserInfo: [],//用户信息
                WaterSingle: [],
                id: null,
                oldPwd: '',//旧密码
                newPwd: '',//新密码
                confirmPwd: '',//确认密码
            }
        },
        activated: function () {
            this.id = this.$route.query.id;
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {

            forgetPasswordClick: function () {
                this.$router.replace({name: 'forgetPsw', query: {id: this.id}})
            },

            oldPwdblur: function () {
                const that = this;

                // if(that.oldPwd){

                // let url= (that.id==1?"/rest/customer/checkPasswordRight":"/rest/customer/checkPayPasswordRight");

                // var body = {"token":that.UserInfo.token,"password":that.newPwd,}
                // var reqJson = {"head":head, "body":body};

                //  $.ajax({
                //   url: https+ url,
                //   data:JSON.stringify(reqJson),
                //   type:"post",
                //   dataType:"json",
                //   contentType:"application/json;charset=UTF-8",

                //   success: function (res) {
                //
                //     // if(res.msg=="系统会话过期重新登录！"){
                //     //      location.href='../login/login.html'
                //     //    }
                //    if(res.status==1){
                //     layer.msg(res.msg);
                //     that.oldPwd='';
                //    }else if (res.status==0) {

                //    }
                //   },
                // })

                // }


            },

            affirmClick: function () {
                if (this.oldPwd === this.newPwd) {
                    Toast('新密码不能与旧密码相同');
                    return;
                }
                const that = this

                that.UserInfo = JSON.parse(localStorage.UserInfo)

                if (that.oldPwd && that.newPwd && that.confirmPwd) {

                    if (that.newPwd == that.confirmPwd) {
                        this.updatePassword(that.id)
                    } else {
                        layer.msg('两次密码输入不一致');
                    }
                } else {
                    layer.msg('请将信息填写完整');
                }
            },
            updatePassword: async function (id) {
                const that = this;
                const res = id == 1 ? await updatePasswordByOld({
                    "password": hex_md5(that.newPwd),
                    "oldPassword": hex_md5(that.oldPwd)
                }) : await updatePayPasswordByOld({
                    "payPassword": hex_md5(that.newPwd),
                    "oldPayPassword": hex_md5(that.oldPwd)
                });
                if (res.status == 0) {
                    layer.msg('修改成功！')

                    setTimeout(function () {
                        window.history.back();
                    }, 1000);
                }
            },

        },

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
        width: 70%;
    }

    .new_password {
        width: 20%;
        font-size: 15px;
    }

    .affirm_password {
        width: 20%;
        font-size: 15px;
    }

    .password {
        input{
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
        margin:auto;
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

    .forget_password {
        line-height: 35px;
        text-align: center;
        font-size: rem(13);
        color: #333333;
    }


</style>