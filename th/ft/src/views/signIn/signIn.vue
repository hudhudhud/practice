<template>
    <div class="page">
        <p class="success-tip" v-if="first">签到成功</p>
        <div class="card">
            <div class="nickname">昵称：{{info.nickname}}</div>
            <div class="phone">手机号：{{info.phone}}</div>
            <div class="time">签到时间：{{info.signInDate}}</div>
        </div>
        <div class="line">
            <div class="text">凭此码进入会场</div>
        </div>
        <div style="text-align: center">
            <div class="code">
                {{info.code}}
                <img src="../../assets/img/signIn/join.png" alt="" v-if="info.status===3">
            </div>
        </div>

    </div>
</template>

<script>
    import { getInfo } from '../../service/signIn'
    export default {
        name: "sign-in",
        data: function () {
            return {
                info: {},
                first: false,
                phone: ''
            }
        },
        activated: function () {
            this.phone = this.$route.query.phone;
            this.first = this.$route.params.first;
            this.getInfo();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getInfo: async function () {
                ({data: this.info} = await getInfo({phone: this.phone, load: true}));
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .success-tip{
        text-align: center;
        margin: rem(23) 0 0;
        font-size: rem(28);
        color: $them;
        font-weight: bold;
    }
    .card{
        overflow: hidden;
        margin: rem(40) auto 0;
        width: rem(340);
        height: rem(160);
        background:url("../../assets/img/signIn/sign_success_back.png") no-repeat center;
        background-size: 100% 100%;
        font-size: rem(18);
        color: #ffffff;
        text-align: center;
        .nickname{
            margin-top: rem(25);
        }
        .phone{
            margin: rem(15) 0 rem(22);
        }
    }
    .line{
        position: relative;
        margin: rem(44) rem(12) 0;
        height: 1px;
        border-bottom: 1px dotted #979797;
        text-align: center;
        .text{
            padding: 0 rem(21);
            display: inline-block;
            background-color: #ffffff;
            font-size: rem(15);
            color: #333333;
            top: 0;
            @include translate(0, -50%);
        }
    }
    .code{
        position: relative;
        display: inline-block;
        padding: 0 rem(24);
        margin-top: rem(41);
        border-radius: 2px;
        height: rem(100);
        line-height: rem(100);
        background-color: #FC1D1D;
        font-size: rem(55);
        color: #ffffff;
        letter-spacing: rem(10);
        img{
            position: absolute;
            right: rem(-36);
            top: rem(-78);
            width: rem(138);
            height: rem(114);
        }
    }
</style>