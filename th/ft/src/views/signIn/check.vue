<template>
    <div>
        <div class="card">
            <p class="title">确认信息</p>
            <p class="nickname">昵称：{{info.nickname}}</p>
            <p class="phone">手机号：{{info.phone}}</p>
        </div>

        <div class="btns">
            <div class="btn">取消</div>
            <div class="btn active" @click="confirmSign">确定签到</div>
        </div>
    </div>
</template>

<script>
    import { getInfo, confirmSign } from '../../service/signIn'

    export default {
        name: "not-sign-in",
        data: function () {
            return {
                phone: '',
                info: {}
            }
        },
        activated: function () {
            this.phone = this.$route.query.phone;
            this.getInfo();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getInfo: async function () {
                ({data: this.info} = await getInfo({phone: this.phone, load: true}));
            },
            confirmSign: function () {
                confirmSign({phone: this.phone, load: true}).then(
                    res => {
                        if (res.status === '0') {
                            this.$router.push({name: 'signIn', params: {first: '1'}, query: {phone: this.phone}});
                        }
                    }
                );
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .card {
        margin: rem(20) auto 0;
        width: rem(340);
        height: rem(158);
        font-size: rem(18);
        text-align: center;
        color: #ffffff;
        background: url("../../assets/img/signIn/sign_back.png") no-repeat center;
        background-size: 100% 100%;
        overflow: hidden;
        .title {
            margin-top: rem(14);
            font-size: rem(23);
            font-weight: bold;
        }
        .nickname {
            margin-top: rem(17);
            margin-bottom: rem(15);
        }

    }

    .btns {
        margin-top: rem(38);
        @extend %flex;
        @extend %justify-content-center;
        font-size: rem(16);
        .btn {
            width: rem(116);
            height: rem(30);
            line-height: rem(30);
            border-radius: rem(16);
            text-align: center;
            color: #ffffff;
            background-color: #999999;
        }
        .btn:first-of-type {
            margin-right: rem(20);
        }
        .btn.active {
            background-color: $them;
        }
    }

</style>