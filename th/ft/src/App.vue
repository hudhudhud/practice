<template>
    <div id="app">
        <transition name="material-transition">
            <keep-alive exclude="login,register">
                <router-view></router-view>
            </keep-alive>
        </transition>
        <div class="load-mask" v-if="maskShow">
            <mt-spinner type="fading-circle" color="rgb(100, 100, 100)" size="100"></mt-spinner>
        </div>
        <!--协议-->
        <Agreement v-if="agreementShow"/>
        <!--二维码-->
        <Shareselfinfo></Shareselfinfo>
        <!--<div class="profile-qrcode" v-if="showCode" @click="hideQrcode">-->
            <!--<div class="profile-qrcode-content">-->
                <!--<div class="qrcodeImageref" ref="qrcodeImageref">-->
                    <!--<div class="profile-qrcode-info">-->
                        <!--<img class="profile-qrcode-head" :src="UserInfo.headImgUrl" alt="">-->
                        <!--<div class="profile-qrcode-nickname">-->
                            <!--<p>{{UserInfo.nickname}}</p>-->
                            <!--<p class="profile-qrcode-role">{{roles[UserInfo.rank]}}</p>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<img v-if="showCode===1" class="text" src="./assets/img/tem/qrcodetext.png" alt="">-->
                    <!--<div class="btns">-->
                        <!--<div class="btn">{{showCode===1?'服务全面':'包邮服务'}}</div>-->
                        <!--<div class="btn">{{showCode===1?'自用省钱':'爆品专享价'}}</div>-->
                        <!--<div class="btn">{{showCode===1?'分享赚钱':'服务全面'}}</div>-->
                    <!--</div>-->
                    <!--<img class="img" :src="qrcodeUlr" alt="" @click.stop="">-->
                    <!--<div class="profile-qrcode-tip">-->
                        <!--扫扫二维码，一起开店吧！-->
                    <!--</div>-->
                <!--</div>-->
                <!--<img class="profile-qrcode-canvas_img" :src="canvasImg" alt="">-->
            <!--</div>-->
        <!--</div>-->
        <!--客服微信二维码 wxCustomerShow-->
        <div class="profile-qrcode" v-if="wxCustomerShow" @click="hideCusCode">
            <div class="profile-qrcode-content" style="padding: 20px 0">
                <img class="wx-img" src="./assets/img/home/wxkf.jpg" alt="" @click.stop="">
                <div class="profile-qrcode-tip">
                    长按识别二维码，进入公众号，即可对话右下角客服
                </div>
            </div>
        </div>
        <!--输入框-->
        <Prompt ref="prompt">
            <div v-html="slot"></div>
        </Prompt>
    </div>
</template>
<script>
    import Agreement from '@/components/agreement'
    import Prompt from '@/components/global/prompt'
    import Shareselfinfo from '@/components/global/shareselfinfo.vue'
    import Vue from 'vue';

    export default {
        name: 'appvue',
        data: function () {
            return {
                canvasImg:'',//canvas生成的图片地址
                slot: ''
            }
        },
        components: {
            Agreement,
            Prompt,
            Shareselfinfo
        },
        created: function () {
            this.$store.dispatch('configShare');
            this.$store.dispatch('computeMsgCount');

            let inviterNumber = this.getUrlParam('inviterNumber');
            if (inviterNumber)
                localStorage.setItem('appKey', inviterNumber);
            Vue.prototype.prompt = (...data) => {
                data[2] = data[2] || {};
                if (data[2].slot)
                    this.slot = data[2].slot;
                else
                    this.slot = '';
                return this.$refs.prompt.getPrompt(...data);
            }
            Vue.prototype.confirm = (...data) => {
                data[1] = data[1] || '提示';
                data[2] = Object.assign(data[2] || {}, {showInput: false, text: data[0]});
                if (data[2].slot)
                    this.slot = data[2].slot;
                else
                    this.slot = '';
                return this.$refs.prompt.getPrompt(...data);
            }
            Vue.prototype.setTitle = (title) => {
                document.title = title;
                var i = document.createElement('iframe');
                i.src = "http://image.zhi-you.net/avatar_default.jpg";
                // i.setAttribute('src',"http://image.zhi-you.net/avatar_default.jpg");
                i.style.display = 'none';
                i.onload = function() {
                    setTimeout(function(){
                        i.remove();
                    }, 9)
                }
                document.body.appendChild(i);
            }
            this.redirect();

            window.requestAnimFrame = (function(){
                return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();
        },
        mounted: function () {
            // this.canvasToImage();
        },
        methods: {
            canvasToImage(res) {//邀请人的信息canvas转为图片
                console.log(res);
                console.log(this.$refs)
                html2canvas(this.$refs.qrcodeImageref,{
                    backgroundColor: null
                }).then((canvas) => {
                    let dataURL = canvas.toDataURL("image/png");
                    console.log(dataURL)
                    this.canvasImg = dataURL;
                });
            },
            getUrlParam: function (name) {
                let r = window.location.href.match(/[\?&]\w+=\w+/g);
                if (!r) {
                    return null;
                }
                const data = r.find(i => {
                    return i.substr(1).split('=')[0] === name;
                })
                if (data) {
                    return data.split('=')[1];
                }
                return null;
            },
            hideQrcode: function () {
                this.$store.commit('handleShowCode', false);
            },
            hideCusCode: function() {
                this.$store.commit('handleWxCustomerShow', 0);
            },
            redirect: function () {
               // if (history.length === 1) {
                    const router = this.getUrlParam('redirect');
                    if (router) {
                        let query = this.getQuery();
                        delete query.redirect;
                        this.$router.push({name: router, query: query},  () =>{
                            if(router !== 'login'){
                                this.$store.commit('maskChange', false);
                            }
                        })
                    } else{
                      //  this.maskShow = false;
                        this.$store.commit('maskChange', false);
                    }
             //   }
            },
            getQuery: function () {
                let r = window.location.href.match(/[\?&]\w+=\w+/g);
                let obj = {};
                if (r) {
                    r.map(i => {
                        let arry = i.substr(1).split('=');
                        obj[arry[0]] = arry[1];
                        return i;
                    })
                }
                return obj;
            }
        },
        computed: {
            agreementShow: function () {
                return this.$store.state.agreementShow;
            },
            wxCustomerShow: function(){
              return this.$store.state.wxCustomerShow;
            },
            UserInfo() {
                return this.$store.state.userInfo;
            },
            maskShow() {
                return this.$store.state.maskShow;
            }
        }
    }
</script>
<style lang="scss">
    @import "./assets/public";
    @import "./assets/animation";

    .them {
        color: $them !important;
    }

    .load-mask{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: gainsboro;
        z-index: 999999;
        @extend %flex-align-center;
        @extend %flex;
        @extend %justify-content-center;
    }
    * {
        margin: 0;
        padding: 0;
        border: none;
    }

    body {
        font-family: PingFangSC-Medium, "Microsoft YaHei";
        //  font-weight: 100;
        font-size: rem(13);
        background-color: #EFEFEF;
        overflow-y: auto;
        color: #999999;
    }

    h1 {
        font-weight: 200;
    }

    html,
    body,
    div,
    p, h1 {
        border: 0;
        margin: 0;
        padding: 0;
    }

    input, select {
        -webkit-appearance: none;
    }

    strong {
        font-weight: normal;
    }

    em,
    i {
        font-style: normal;
    }

    ul,
    ol,
    li {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .dialog__mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 11;
        background: rgba(0, 0, 0, 0.5);
        display: none;
    }

    .dialog__container {
        position: fixed;
        bottom: 0;
        width: 100%;
        transform: translateY(400%);
        transition: all 0.4s ease;
        z-index: 11;
        height: 40%;
    }

    .dialog--show .dialog__container {
        transform: translateY(-75%);
    }

    .dialog--show .dialog__mask {
        display: block;
    }

    .flex_Center {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        width: 100%;
    }

    .mint-toast {
        z-index: 100000 !important;
    }

    .bor-top {
        border-top: 1px solid $border;
    }

    .bor-left {
        border-left: 1px solid $border;
    }

    .bor-bottom {
        border-bottom: 1px solid $border;
    }

    .bor-right {
        border-right: 1px solid $border;
    }

    .vertical-align{
        vertical-align: middle;
    }
    /**
    * 上下出现转场
    */
    .material-transition {
        box-sizing: border-box;
    }

    .material-transition-enter-active {
        z-index: 100;
        pointer-events: none;
        -webkit-animation: pageFromBottomToCenter .3s ease-out;
        animation: pageFromBottomToCenter .3s ease-out;
    }

    .material-transition-leave-active {

    }

    @keyframes pageFromBottomToCenter {
        from {
            opacity: 0;
            transform: translate3d(0, 56px, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }

    @keyframes pageFromCenterToBottom {
        from {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
        to {
            opacity: 0;
            transform: translate3d(0, 56px, 0);
        }
    }


    .mint-indicator-wrapper {
        z-index: 9909;
    }

    .mint-indicator-mask {
        z-index: 9999;
    }

    .page {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: #ffffff;
    }

    .title-logo{
        img{
            margin: rem(20) auto;
            display: block;
            width: rem(81);
            height: rem(81);
        }
    }
</style>
