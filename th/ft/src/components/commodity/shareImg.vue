<template>
    <div class="share-page">
        <div id="share">
            <div style="height: 22%">
                <header>
                    <img class="head-img" :src="headImgUrl" @load="() => headResolve()" alt="">
                    <div class="info">
                        <p>{{UserInfo.nickname}}</p>
                        <p>{{roles[UserInfo.rank]}}</p>
                    </div>
                </header>
                <p class="title">{{detail.title}}</p>
                <p class="intro">{{detail.intro}}</p>
            </div>
            <img class="main-img" @load="() => mainResolve()" :src="mainImg" alt="">
            <div class="bottom">
                <img class="qrcode" :src="qrcode" alt="" @load="() => qrcodeResolve()">
                <div class="text">
                    <p>￥{{detail.priceV0str}}<span class="tag">会员价</span></p>
                    <p class="tip">注册可享会员价</p>
                    <p>{{detail.title}}</p>
                    <p>【更多规格扫描或长按二维码购买】</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getCurrentImg, srcToBase64} from "../../service/util";

    export default {
        name: "shareImg",
        props: ['detail'],
        data: function () {
            return {
                result: '',
                roles: [
                    '会员',
                    '店主',
                    '一星店主',
                    '二星店主',
                    '三星店主',
                    '三星钻石店主',
                    '三星皇冠店主'
                ],
                headImgUrl: '',
                headResolve: null,
                mainImg: '',
                mainResolve: null,
                qrcode: '',
                qrcodeResolve:null
            }
        },

        methods: {
            getImg: async function () {
                // this.mainImg = this.toSelfSrc(this.detail.mainImg);
                // this.headImgUrl = this.toSelfSrc(this.UserInfo.headImgUrl);
                // this.qrcode = this.qrcodeUlr;
                [this.headImgUrl, this.mainImg, this.qrcode] = await Promise.all([srcToBase64(this.toSelfSrc(this.UserInfo.headImgUrl+'@100w')), srcToBase64(this.toSelfSrc(this.detail.mainImg+'@828w')), srcToBase64(this.toSelfSrc(this.qrcodeUlr))]);
                await Promise.all([
                    new Promise(resolve => {
                        this.headResolve = resolve;
                    }),
                    new Promise(resolve => {
                        this.mainResolve = resolve;
                    }),
                    new Promise(resolve => {
                        this.qrcodeResolve = resolve;
                    })
                ]);

                return getCurrentImg(document.getElementById("share"));
            },
            toSelfSrc: function (src) {
                 return src;
                // return process.env.VUE_APP_BASE_API + '/filenet/downloadByUrl?url=' + src
            }
        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            },
            qrcodeUlr: function () {
                return process.env.VUE_APP_BASE_API + '/customerLogin/signInQrCode?token=' + this.UserInfo.token + '&id=' + this.detail.id;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .share-page {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    #share {
        overflow: hidden;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
    }

    header {
        padding: rem(20) rem(25) 0;
        @extend %flex;
        .head-img {
            border-radius: 50%;
            width: rem(49);
            height: rem(49);
        }
        .info {
            margin-left: rem(15);
            p:first-of-type {
                margin-bottom: rem(3);
                font-size: rem(15);
                color: #333333;
            }
            p:last-of-type {
                border-radius: rem(10);
                padding: 0 rem(10);
                display: inline-block;
                border: 1px solid $them;
                font-size: rem(12);
                color: $them;
            }
        }
    }

    .title {
        margin-top: rem(10);
        margin-bottom: rem(3);
        padding: 0 rem(25);
        font-size: rem(16);
        color: #333333;
    }

    .intro {
        margin: 0 rem(25);
        @extend %nowrap;
        font-size: rem(12);
    }

    .main-img {
        display: block;
        margin: rem(5) auto 0;
        //  width: 100%;
        height: 53%;
    }

    .bottom {
        height: 24%;
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        padding-top: rem(5);
        .qrcode {
            // margin: rem(15);
            width: rem(120);
        }
        .tag {
            margin-left: rem(5);
            padding: 0 rem(8);
            border-radius: rem(9);
            line-height: rem(17);
            font-size: rem(12);
            background-color: rgba(237, 27, 36, .2);
        }
        .tip{
            font-size: rem(12);
            color: $them;
            margin-bottom: rem(5);
        }
        .text {
            margin-left: rem(9);
            margin-right: rem(5);
            p:first-of-type {
                font-size: rem(18);
                color: $them;
            }
            p:nth-of-type(3) {
                width: rem(204);
                font-size: rem(16);
                color: #000000;
                margin-bottom: rem(5);
            }
            p:nth-of-type(4) {
                white-space: nowrap;
                font-size: rem(12);
                color: $them;
            }
        }
    }

    .result {
        width: 100%;
        height: 100%;
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #ffffff;
        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
</style>