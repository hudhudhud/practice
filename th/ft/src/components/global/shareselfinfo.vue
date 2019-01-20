<template>
    <div class="shareselfinfo" v-if="showCode">
        <div class="profile-qrcode" @click.self="hideQrcode">
            <div class="profile-qrcode-content">
                <div class="qrcodeImageref" ref="qrcodeImageref">
                    <div class="profile-qrcode-info">
                        <img class="profile-qrcode-head" :src="userImage" alt="">
                        <div class="profile-qrcode-nickname">
                            <p>{{UserInfo.nickname}}</p>
                            <p class="profile-qrcode-role">{{roles[UserInfo.rank]}}</p>
                        </div>
                    </div>
                    <img v-if="showCode===1" class="text" src="../../assets/img/tem/qrcodetext.png" alt="">
                    <div class="btns">
                        <div class="btn">{{showCode===1?'服务全面':'包邮服务'}}</div>
                        <div class="btn">{{showCode===1?'自用省钱':'爆品专享价'}}</div>
                        <div class="btn">{{showCode===1?'分享赚钱':'服务全面'}}</div>
                    </div>
                    <img class="img" :src="qrcodeUlr" alt="" @click.stop="">
                    <div class="profile-qrcode-tip">
                        扫扫二维码，一起开店吧！
                    </div>
                </div>
                <div class="profile-qrcode-canvas_box" v-if="canvasImg!='' && canvasImg!=undefined && canvasImg!=null">
                    <img class="profile-qrcode-canvas_img" :src="canvasImg" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {srcToBase64} from "../../service/util";
    export default {
        name: "shareselfinfo",
        data(){
            return{
                showimg:1,
                userImage:'',//头像
                canvasImg:'',//canvas生成的图片地址
            }
        },
        created(){
            this.userImage = this.UserInfo.headImgUrl;
            var that = this;
            Promise.resolve(srcToBase64(this.toSelfSrc(this.UserInfo.headImgUrl+'@100w'))).then(function (result) {
                that.userImage = result;
            });
        },
        mounted(){

        },
        watch: {
            showimg: function (val) {
                if(this.showimg){
                    html2canvas(this.$refs.qrcodeImageref,{
                        backgroundColor: null
                    }).then((canvas) => {
                        let dataURL = canvas.toDataURL("image/png");
                        this.canvasImg = dataURL;
                    });
                }
            },
        },
        methods:{
            toSelfSrc: function (src) {
                return src;
            },
            hideQrcode: function () {
                this.canvasImg = '';
                this.$store.commit('handleShowCode', false);
            },
        },
        computed: {
            showCode: function () {
                this.showimg = this.$store.state.showCode;
                return this.$store.state.showCode;
            },
            UserInfo() {
                return this.$store.state.userInfo;
            },
            roles() {
                return this.$store.state.STATIC_DATA.roles;
            },
            qrcodeUlr: function () {
                return process.env.VUE_APP_BASE_API + '/customerLogin/signInQrCode?token=' + this.UserInfo.token;
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/public";
    @import "../../assets/animation";
    .shareselfinfo {
        width: 100%;
        .profile-qrcode {
            z-index: 10000;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .6);
            .profile-qrcode-canvas_box{
                width: 100%;
                height: 100%;
                /*background-color: #fff;*/
                border-radius: 5px;
                position: absolute;
                top: 0;
                left: 0;
            }
            .profile-qrcode-canvas_img {
                width: 100%;
                height: 100%;
                /*position: absolute;*/
                /*top: 0;*/
                /*left: 0;*/
            }
            .profile-qrcode-content {
                position: relative;
                border-radius: 5px;
                background: #FFFFFF;
                box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.50);
                width: rem(310);
                position: absolute;
                top: 50%;
                left: 50%;
                animation: opacity-show .2s ease-out;
                @include translate(-50%, -50%);
                .qrcodeImageref {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                    background: #FFFFFF;
                    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.50);
                }
                .btns {
                    @extend %flex;
                    @extend %justify-content-center;
                    margin-top: rem(10);
                    height: rem(26);
                    line-height: rem(26);
                    text-align: center;
                    .btn {
                        border-radius: 21px;
                        margin: 0 rem(5);
                        padding: 0 rem(15);
                        //  width: rem(82);
                        height: rem(26);
                        font-size: rem(13);
                        color: #ffffff;
                        @include gradientToRight(#FCDB4B, #FBA030);
                    }
                }
                .wx-img {
                    display: block;
                    width: rem(258);
                    height: rem(258);
                    margin: 0 auto;
                }
                .profile-qrcode-info {
                    height: rem(76);
                    @extend %flex;
                    @extend %flex-align-center;
                    .profile-qrcode-nickname {
                        margin-left: rem(10);
                        font-size: rem(15);
                        color: #333333;
                        p:first-of-type {
                            font-weight: bold;
                        }
                        p:last-of-type {
                            display: inline-block;
                        }
                    }
                    .profile-qrcode-role {
                        margin-top: 2px;
                        padding: 0 rem(21);
                        color: $them;
                        font-size: rem(12);
                        border: 1px solid $them;
                        border-radius: 8.5px;
                    }
                }
                .text {
                    margin: 0 auto;
                    display: block;
                    width: rem(266);
                    height: rem(172);
                }
                .img {
                    display: block;
                    margin: 0 auto;
                    width: rem(124);
                    height: rem(124);
                }
                .profile-qrcode-head {
                    border-radius: 50%;
                    width: rem(50);
                    height: rem(50);
                    margin-left: rem(35);
                }

                .profile-qrcode-tip {
                    margin: 0 auto;
                    width: rem(232);
                    text-align: center;
                    font-size: rem(15);
                    color: #999999;
                    margin-bottom: rem(20);
                }
            }

        }
    }
</style>