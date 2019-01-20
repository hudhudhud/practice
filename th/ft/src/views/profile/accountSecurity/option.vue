<template>
    <div class="page">
        <header>
            <div class="content">
                <div>
                    <img class="head-img" :src="UserInfo.headImgUrl">
                    <p class="CustomerRank">{{CustomerRank}}</p>
                </div>
                <div class="content-center">
                    <div>
                        <div class="nickName">
                            <span>{{UserInfo.nickname}}</span>
                        </div>
                        <p>会员号：{{inviterNumber}}</p>
                    </div>
                    <!--{{CustomerRank}}-->
                </div>

            </div>
        </header>
        <section class="card">
            <div class="logo"></div>
            <div class="tag">期权</div>
            <div class="value">{{data}}</div>
            <!--<div class="js_company">股份公司：杭州火兔信息科技有限公司</div>-->
        </section>
        <p class="intro"></p>
    </div>
</template>

<script>
    // 期权
    import {findShareoPtion} from "../../../service/profile/newProfile";

    export default {
        name: "option",
        data: function () {
            return {
                data: '',
                roles: [
                    '会员',
                    '店主',
                    '一星店主',
                    '二星店主',
                    '三星店主',
                    '三星钻石店主',
                    '三星皇冠店主'
                ]
            }
        },
        activated: function () {
            this.getData();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getData: async function () {
                const res = await findShareoPtion({load: true});
                if (res.status === '0') {
                    this.data = res.data;
                }
            }
        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            }, // inviterNumber
            inviterNumber() {
                return this.$store.state.inviterNumber;
            },
            CustomerRank() {
                return this.roles[this.$store.state.userInfo.rank];
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .content {
        //  height: rem(80);
        color: #ffffff;
        margin-top: rem(7);
        @extend %flex;
        @extend %justify-content-center;
        .head-img {
            display: block;
            margin: 0 auto;
            width: rem(49);
            height: rem(49);
            border-radius: 50%;
            margin-bottom: rem(4);
        }
        .CustomerRank {
            padding: 0 rem(10);
            border: 1px solid $them;
            border-radius: 9px;
            color: $them;
            text-align: center;
        }
        .content-center {
            margin-left: rem(20);
            width: rem(190);
            padding: 0 rem(10);
            @extend %flex;
            @extend %flex-align-center;
            font-size: rem(11);
            color: #333333;
            .nickName {
                margin-bottom: rem(10);
                font-size: rem(15);
                & > * {
                    vertical-align: middle;
                }
            }
        }
    }

    .card {
        position: relative;
        height: rem(152);
        line-height: rem(152);
        margin: rem(30) rem(10) rem(20);
        text-align: center;
        background: url("../../../assets/img/profile/option_back.png") no-repeat center;
        background-size: 100% 100%;
        .logo {
            position: absolute;
            left: rem(18);
            top: rem(15);
            width: rem(59);
            height: rem(13);
            background: url("../../../assets/img/profile/logo_text.png") no-repeat center;
            background-size: 100% 100%;
        }
        .tag {
            position: absolute;
            border-radius: rem(11);
            right: rem(10);
            top: rem(11);
            width: rem(66);
            height: rem(22);
            line-height: rem(22);
            text-align: center;
            font-size: rem(15);
            color: #ffffff;
            background-color: rgba(165, 93, 0, .2);
        }
        .value {
            font-size: rem(55);
            color: #444444;
        }
        .js_company{
            position: absolute;
            left: 0;
            bottom: rem(12);
            width: 100%;
            height: rem(14);
            line-height: rem(14);
            text-align: center;
            color: #333;
        }
    }

    .intro {
        margin: 0 rem(25);
        color: #666;
        font-size: rem(14);
        line-height: rem(22);
    }
</style>