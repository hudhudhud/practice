<template>
    <footer>
        <div class="foot-content clearfix">
            <div class="fl">
                <img src="/img/qrcode.png" alt="" class="qrcode fl">
                <div class="fl">
                    <p class="large">扫码关注微信公众号，送百元红包</p>
                    <p>Copyright © www.high.com, All Rights Reserved.</p>
                    <p>助力网红营销，实现电商跨越</p>
                </div>
            </div>
            <ul class="fr">
                <!--<li class="clearfix">-->
                <!--<div class="fl icon"><i class="fa fa-comments" aria-hidden="true"></i></div>-->
                <!--<div class="fl">-->
                <!--<p>微信公众号</p>-->
                <!--<p>搜索关注：HI网红</p>-->
                <!--</div>-->
                <!--</li>-->
                <!--<li class="clearfix">-->
                <!--<div class="fl icon"><i class="fa fa-qq" aria-hidden="true"></i></div>-->
                <!--<div class="fl">-->
                <!--<p>QQ交流群</p>-->
                <!--<p><a href="#">查看交流群相关信息</a></p>-->
                <!--</div>-->
                <!--</li>-->
                <!--<li class="clearfix">-->
                <!--<div class="fl icon"><i class="fa fa-envelope" aria-hidden="true"></i></div>-->
                <!--<div class="fl">-->
                <!--<p>联系邮箱</p>-->
                <!--<p>HIKOL@leqee.com</p>-->
                <!--</div>-->
                <!--</li>-->
                <li>
                    <img src="/img/weixin.png" alt="">
                    <span class="span1">微信公众号</span>
                    <span class="span2" style="margin-left: 20px">搜索关注：HI网红</span>
                </li>
                <li>
                    <img src="/img/qq.png" alt="">
                    <span class="span1">QQ交流群</span>
                    <span class="span2" style="margin-left: 28px">查看交流群相关信息</span>
                </li>
                <li>
                    <img src="/img/email.png" alt="">
                    <span class="span1">联系邮箱</span>
                    <span class="span2" style="margin-left: 36px">HIKOL@leqee.com</span>
                </li>
            </ul>
        </div>
    </footer>
</template>
<script>
    export default {}
</script>
<style lang="less" scoped>
    footer {
        margin-top: 84px;
        width: 100%;
        min-width: @contentWidth;
        height: @footerHeight;
        background-color: #E6E6E6;
        .foot-content {
            margin: auto;
            padding-top: 46px;
            box-sizing: border-box;
            width: @contentWidth;
            color: #bcbcbc;
            font-size: 13px;
            .qrcode {
                width: 140px;
                height: 141px;
                margin-right: 10px;
                /*border: dashed 1px;*/
            }
            .large {
                padding-top: 29px;
                font-size: 16px;
                font-family: MicrosoftYaHeiUI;
                font-weight: bold;
                color: rgba(0, 0, 0, 1);
                line-height: 18px;
            }
            p + p {
                margin-top: 17px;
                font-size: 14px;
                font-family: MicrosoftYaHeiUI;
                font-weight: 400;
                color: rgba(0, 0, 0, 1);
                line-height: 18px;
                opacity: 0.54;
            }
            ul {
                margin-top: 11px;
                li {
                    margin-top: 15px;
                    img {
                        /*border: dashed 1px;*/
                        margin-right: 4px;
                    }
                    .span1 {
                        vertical-align: top;
                        font-size: 14px;
                        font-family: MicrosoftYaHeiUI-Bold;
                        font-weight: bold;
                        color: rgba(0, 0, 0, 1);
                        line-height: 14px;
                        opacity: 0.54;
                    }
                    .span2 {
                        vertical-align: top;
                        font-size: 14px;
                        font-family: MicrosoftYaHeiUI;
                        font-weight: 400;
                        color: rgba(0, 0, 0, 1);
                        line-height: 18px;
                        opacity: 0.54;

                    }
                    /*height: 100px;*/
                    /*padding: 10px;*/
                    /*display: inline-block;*/
                    /*a {*/
                    /*color: #bcbcbc;*/
                    /*}*/
                    /*.icon {*/
                    /*width: 50px;*/
                    /*height: 50px;*/
                    /*border: 1px solid #bcbcbc;*/
                    /*border-radius: 50%;*/
                    /*text-align: center;*/
                    /*margin-right: 5px;*/
                    /*i {*/
                    /*font-size: 30px;*/
                    /*line-height: 50px;*/
                    /*}*/
                    /*}*/
                }
            }
        }
    }
</style>