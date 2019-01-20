<template>
    <div class="agreement">
        <div class="content">
            <div class="top">
                <img src="../assets/img/agreement.png" alt="">
                <div class="close" @click="handleHide">
                    <i class="iconfont icon-guanbi"></i>
                </div>
            </div>
            <div>
                <p class="title">
                    尊敬的用户，您正在进行账户的激活操作，系统检测到您的账户为正常状态，签署以下协议，即可完成账户激活！
                </p>
                <div class="item" v-for="(item, index) in list">
                    <Check :check.sync="item.check"/>
                    <span>同意并接受</span>
                    <span class="them" @click="getDetail(index)">《{{item.name}}》</span>
                </div>
                <div class="btns">
                    <div class="btn" @click="handleHide">暂不激活</div>
                    <div class="btn" :class="{active: active}" @click="handleAgree">立即激活{{timeText}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { findProtocolList, saveProtocol } from '../service/other.service';
    import Check from '@/components/check'

    export default {
        name: "agreement",
        components: {
            Check
        },
        data: function () {
            return {
                list: [],
                selectList: [],
                detail: '',
                time: 5, //倒计时
            }
        },
        created: function () {
            this.getList();
            this.startTime();
        },
        computed: {
            active: function () {
                if (this.time) {
                    return false;
                }
                if (!this.list.length) {
                    return false;
                }
                for (let i = 0; i < this.list.length; i++) {
                    if (!this.list[i].check) {
                        return false;
                    }
                }
                return true;
            },
            timeText: function () {
                if(this.time){
                    return '('+this.time+')'
                } else {
                    return '';
                }
            }
        },
        methods: {
            startTime: function () {
                this.time--;
                if(this.time){
                    setTimeout(() => {
                        this.startTime();
                    }, 1000)
                }
            },
            getList: async function () {
                const res = await findProtocolList({load: true});
                if (res.status === '0') {
                    this.list = res.data.map(i => {
                        i.check = false;
                        return i;
                    });
                }
            },
            getDetail: function (index) {
                window.open(this.list[index].url);
            },
            handleAgree: async function () {
                if (this.active) {
                    const res = await saveProtocol({
                        id: this.list.map(i => i.type).join(','),
                        load: true,
                        successMsg: '操作成功'
                    });
                    if (res.status === '0') {
                        this.handleHide();
                        this.$router.go(0);
                    }
                }
            },
            handleHide: function () {
                this.$store.commit('showAgreement', false);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";
    @import "../assets/animation";

    .agreement {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 101;
        background-color: rgba(0, 0, 0, .5);
    }

    .content {
        position: absolute;
        left: 50%;
        top: 50%;
        @include translate(-50%, -50%);
        animation: alert-show .3s ease-out;
        width: rem(325);
        height: rem(350);
        background-color: white;
        overflow-y: auto;

        .top {
            position: relative;
            overflow: hidden;
            height: rem(97);
            background-image: linear-gradient(-135deg, #E21D4A 0%, #ED1B24 100%);
            img {
                margin: rem(20) auto;
                display: block;
                height: rem(57);
            }
            .close {
                box-sizing: content-box;
                position: absolute;
                right: 0;
                top: 0;
                padding-top: rem(10);
                padding-right: rem(10);
                font-size: rem(20);
                color: #ffffff;
            }
        }
        .title {
            text-align: center;
            margin: rem(32) rem(22) rem(20);
            color: #333333;
            font-size: rem(14);
            line-height: rem(20);
        }
        .item {
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-center;
            margin-top: rem(10);
            span:first-of-type {
                margin-left: rem(10);
            }
        }

        .btns {
            margin-top: rem(27);
            @extend %flex;
            @extend %justify-content-center;
            font-size: rem(15);
            .btn {
                padding: 0 rem(27);
                color: #ffffff;
                background: #999999;
                border-radius: rem(17);
                height: rem(27);
                line-height: rem(27);
            }
            .btn:last-of-type {
                margin-left: rem(15);
                background-color: #CECECE;
            }
            .btn.active {
                background-color: $them;
            }
        }
    }
</style>