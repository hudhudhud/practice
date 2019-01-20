<template>
    <div>
        <div class="card">
            <p class="title">代付金额</p>
            <p class="money">¥{{data.customerAmount}}</p>
            <p class="intro">代付交易—{{data.productTitle}}</p>
        </div>
        <button class="btn copy" data-clipboard-action="copy" data-clipboard-target="#copy1">
            <span>生成代付请求</span>
        </button>
        <div style="opacity: 0;" id="copy1">{{link}}</div>
    </div>
</template>

<script>
    import * as service from '../../service/pay/pay.service'
    import {Toast} from 'mint-ui'

    /**
     * 他人代付  页面
     */
    export default {
        name: "other-pay",
        data: function () {
            return {
                id: '',
                data: {},
                link: ''
            }
        },
        activated: function () {
            this.id = this.$route.params.id;
            this.link = location.origin + '/#/commodity/otherPayRes/' + this.id;
            this.getData();
            this.wxShare();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        mounted: function () {
            let self = this;
            // let clipboard = new Clipboard('.copy');

            let clipboard = new Clipboard('.copy', {
                // 通过target指定要复印的节点
                target: function () {
                    return document.querySelector('#copy1');
                }
            });

            clipboard.on('success', function (e) {
                //  Toast('复制成功，');
                self.handleOk();
                //    self.handleError();
            });

            clipboard.on('error', function (e) {
                self.handleError();
            });

        },
        methods: {
            getData: async function () {
                const res = await service.getPayInfo({id: this.id, load: true});
                if (res.status === '0') {
                    this.data = res.data;
                }
            },
            handleOk: async function () {
                await this.prompt(' ', '链接已生成', {
                    showInput: false,
                    showCancelBtn: false,
                    text: '您的代付链接已生成，你可以选择\n1.粘贴该链接以完成代付请求！\n(已复制到剪贴板)\n2.点击右上方分享，以完成代付请求',
                    confirmButtonText: '我知道了'
                });
                //  Toast('复制成功');
            },
            handleError: function () {
                this.prompt(' ', '链接已生成', {
                    showInput: false,
                    text: '您的代付链接已生成,请点击右上方微信分享，分享给好友以完成代付',
                    showCancelBtn: false,
                    confirmButtonText: '我知道了'
                });
            },
            wxShare: function () {
                this.$store.dispatch('wxInit');
                let self = this;
                wx.ready(function () {
                    let link = location.origin + '/#/commodity/otherPayRes/' + self.id;

                    // <%--公共方法--%>
                    let shareData = {
                        title: '我在火兔商城相中了一个好货', // 分享标题
                        desc: '快帮我付款吧，我会感谢你的', // 分享描述
                        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: '', // 分享图标
                        success: function (res) {
                            //layer.msg('已分享');
                            // location.href= '../commodityInfo/commodityInfo?id=' +rewardPoint.GetRequest().pid+'&oid='+rewardPoint.GetRequest().oid；
                        },
                        cancel: function (res) {
                        }
                    };
                    // <%--分享给朋友接口--%>
                    wx.onMenuShareAppMessage(shareData);
                    // <%--分享到朋友圈接口--%>
                    wx.onMenuShareTimeline(shareData);
                   // self.handleOk();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .card {
        box-sizing: border-box;
        overflow: hidden;
        margin: rem(20) auto 0;
        width: rem(345);
        height: rem(197);
        background-color: $them;
        box-shadow: 0px 2px 4px 0px rgba(153, 153, 153, 0.5);
        border-radius: 5px;
        text-align: center;
        color: #ffffff;
        font-size: rem(18);
        .title {
            margin-top: rem(40);
        }
        .money {
            margin-top: rem(10);
            font-size: rem(30);
        }
        .intro {
            margin-top: rem(20);
            font-size: rem(13);
            @extend %nowrap;
            //  width: rem(300);
            padding: 0 rem(20);
        }
    }

    .btn {
        display: block;
        margin: rem(54) auto 0;
        width: rem(325);
        height: rem(48);
        line-height: rem(48);
        font-size: rem(18);
        text-align: center;
        background: rgba(237, 27, 36, 1);
        border-radius: rem(24);
        color: #ffffff;
        font-weight: bold;
    }
</style>