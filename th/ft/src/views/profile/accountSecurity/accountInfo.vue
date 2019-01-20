<template>
    <div id='accountSecurity' class="accountSecurity">
        <div class="accountSecurity-one">
            <div class="accountSecurity-one00">
                <div class="accountSecurity-one01">
                    <span class="accountSecurity-one02">绑定的手机号</span>
                </div>
                <div class="accountSecurity-one03">
                    <span class="accountSecurity-one04">{{mineInfo.phone}}</span>
                </div>
            </div>
        </div>


        <div class="accountSecurity-two">
            <div class="accountSecurity-two00"  @click='loginPwdClick' >
                <div class="accountSecurity-two01">
                    <span class="accountSecurity-two02">登录密码</span>
                </div>
                <div class="accountSecurity-two03">
                    <img class="accountSecurity-two04-img" src="../../../assets/images/enter2.png"/>
                    <span class="accountSecurity-two04">{{mineInfo.hasLoginPwd?"修改":"设置"}}密码</span>
                </div>
            </div>
        </div>


        <div class="accountSecurity-three">
            <div class="accountSecurity-three00" @click='PayPwdClick' >
                <div class="accountSecurity-three01">
                    <span class="accountSecurity-three02">支付密码</span>
                </div>
                <div class="accountSecurity-three03">
                    <img class="accountSecurity-three04-img" src="../../../assets/images/enter2.png"/>
                    <span class="accountSecurity-three04">{{mineInfo.hasPayPwd?"修改":"设置"}}密码</span>
                </div>
            </div>
        </div>



        <div class="accountSecurity-four">
            <div class="accountSecurity-four00">
                <div class="accountSecurity-four01">
                    <span class="accountSecurity-four02">上次登录时间</span>
                </div>
                <div class="accountSecurity-four03">
                    <!-- <span class="accountSecurity-four04">2018-02-09</span> -->
                    <span style="width: 100%;" class="accountSecurity-four05">{{mineInfo.lastLoginTime}}</span>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import {accountAndSafe} from '../../../service/profile/accountInfo'
    export default {
        name: "account-info",
        data: function () {
            return {
                UserInfo:[],//用户信息
                mineInfo:[],//我的信息;
            }
        },
        activated: function () {
            this.accountAndSafe();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {


            GetRequest: function () {
                return this.$route.query;
            },

            wdqbClick: function () {
                const that = this;

                location.href = '../wdqb/wdqb.html';

            },

            ServicerClick: function () {
                const that = this;

                location.href = '../mineServicer/mineServicer.html';

            },

            accountSecurityClick: function () {
                const that = this;
                top.location = '../accountSecurity/accountSecurity.html';
            },
            accountAndSafe:async function () {
                const res = await accountAndSafe();
                if(res.status === '0'){
                    this.mineInfo = res.data;
                }
            },
            loginPwdClick: function () {
                const that = this;

                if (that.mineInfo.hasLoginPwd == true) {
                   this.$router.push({name: 'updatePsw', query: {id: 1}});
                } else {
                    this.$router.push({name: 'forgetPsw', query: {id: 1}});

                }

            },

            PayPwdClick: function () {
                const that = this;

                if (that.mineInfo.hasPayPwd == true) {
                    this.$router.push({name: 'updatePsw', query: {id: 2}});
                } else {
                    this.$router.push({name: 'forgetPsw', query: {id: 2}});
                }
            }

        },
    }
</script>

<style scoped>

    .accountSecurity{
        width: 100%;
        height: 400px;
        display: flex;
        flex-direction: column;
    }
    /*绑定的手机号顶部*/
    .accountSecurity-one{
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        background: #ffffff;
    }
    .accountSecurity-one00{
        width: 92%;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #EFEFEF;
        margin-left: 4%;
    }
    .accountSecurity-one01{
        width: 70%;
        font-size: 14px;
        display: flex;
        align-items: center;
        margin-left: 5%;
    }
    .accountSecurity-one02{

    }
    .accountSecurity-one03{
        width: 30%;
        display: flex;
        align-items: center;
        margin-right: 2%;
    }
    .accountSecurity-one04{
        width: 40%;
        font-size: 12px;
        color: #DBDBDB;
        display: flex;
        align-items: center;
    }
    /*登录密码部分*/
    .accountSecurity-two{
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        background: #ffffff;
    }
    .accountSecurity-two00{
        width: 92%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px solid #EFEFEF;
        margin-left: 4%;
    }
    .accountSecurity-two01{
        width: 50%;
        font-size: 13px;
        display: flex;
        align-items: center;
        margin-left: 5%;
    }
    .accountSecurity-two02{

    }
    .accountSecurity-two03{
        width: 32%;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        margin-right: 2%;
    }
    .accountSecurity-two04{
        width: 77%;
        font-size: 15px;
        color: #DBDBDB;
        display: flex;
        align-items: center;
    }
    .accountSecurity-two04-img{
        width: 16%;
        font-size: 14px;
        color: #BDBDBD;
        display: flex;
        align-items: center;
    }
    /*支付密码部分*/
    .accountSecurity-three{
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        background: #ffffff;
    }
    .accountSecurity-three00{
        width: 92%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px solid #EFEFEF;
        margin-left: 4%;
    }
    .accountSecurity-three01{
        width: 50%;
        font-size: 13px;
        display: flex;
        align-items: center;
        margin-left: 5%;
    }
    .accountSecurity-three02{

    }
    .accountSecurity-three03{
        width: 32%;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        margin-right: 2%;
    }
    .accountSecurity-three04{
        width: 77%;
        font-size: 15px;
        color: #DBDBDB;
        display: flex;
        align-items: center;
    }
    .accountSecurity-three04-img{
        width: 16%;
        font-size: 14px;
        color: #BDBDBD;
        display: flex;
        align-items: center;
    }
    /*绑定手机号底部*/
    .accountSecurity-four{
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        background: #ffffff;
    }
    .accountSecurity-four00{
        width: 92%;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #EFEFEF;
        margin-left: 4%;
    }
    .accountSecurity-four01{
        width: 50%;
        font-size: 13px;
        display: flex;
        align-items: center;
        margin-left: 5%;
    }
    .accountSecurity-four02{

    }
    .accountSecurity-four03{
        width: 58%;
        display: flex;
        align-items: center;
        margin-right: 2%;
    }
    .accountSecurity-four04{
        width: 100%;
        font-size: 12px;
        color: #DBDBDB;
        display: flex;
        align-items: center;
    }
    .accountSecurity-four05{
        width: 62%;
        font-size: 14px;
        color: #DBDBDB;
        display: flex;
        align-items: center;
    }

</style>