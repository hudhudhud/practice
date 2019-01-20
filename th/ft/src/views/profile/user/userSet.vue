<template>
    <div id="userSet">
        <div class="group">
            <mt-cell title="个人资料" is-link @click.native="linkTo('personalInfo')"></mt-cell>
            <mt-cell title="绑定手机号" :value="info.phone" is-link @click.native="linkTo('updatePhone')"></mt-cell>
            <mt-cell title="登录密码" :value="info.hasLoginPwd?'修改密码':'设置密码'" is-link @click.native="linkTo(info.hasLoginPwd?'updatePsw':'forgetPsw', {id:1})"></mt-cell>
            <mt-cell title="支付密码" :value="info.hasPayPwd?'修改密码':'设置密码'" is-link @click.native="linkTo(info.hasPayPwd?'updatePsw':'forgetPsw', {id:2})"></mt-cell>
        </div>
        <div class="group">
            <mt-cell title="实名认证"  is-link @click.native="linkTo('certification')"></mt-cell>
        </div>
        <div class="group">
            <mt-cell title="最后登录日期" :value="info.lastLoginTime"></mt-cell>
        </div>
        <div class="group">
            <div class="logout" @click="logout">退出</div>
        </div>
    </div>
</template>

<script>
    // 帐号设置
    import {accountAndSafe} from "../../../service/profile/accountInfo";
    import {loginOut} from "../../../service/profile.service";

    export default {
        name: "userSet",
        data: function () {
            return {
                info: {}
            }
        },
        activated: function(){
            this.getAccountSafeInfo();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getAccountSafeInfo: async function () {
                const res = await accountAndSafe();
                if(res.status === '0'){
                    this.info = res.data;
                }
            },
            linkTo(name) {
                if (arguments[1]) {
                    this.$router.push({name: name, query: arguments[1]});
                } else {
                    this.$router.push({name: name});
                }
            },
            logout:async function () {
                await this.confirm('确定退出?');
                let that = this;
                loginOut().then(
                    res => {
                        if (res.status === '0') {
                            let msgList = localStorage.getItem('msgList') || '';
                            localStorage.clear();
                            localStorage.setItem('msgList', msgList);
                            that.$store.commit('login', {});
                            layer.msg('退出登录')
                            setTimeout(function () {
                                that.$router.replace({name: 'login'})
                            }, 100)
                        }
                    }
                );
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .group {
        margin-top: rem(15);
        background-color: #ffffff;
    }
    .logout{
        margin-top: rem(35);
        line-height: rem(39);
        text-align: center;
        font-size: rem(15);
        color: #333333;
        font-weight: bold;
    }
</style>
<style lang="scss">
    #userSet {
        .mint-cell-title {
            color: #333333;
            white-space: nowrap;
        }
        .mint-cell-value {
            color: #666;
        }
    }
</style>