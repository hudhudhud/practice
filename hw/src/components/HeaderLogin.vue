<template>
    <header>
        <div class="bars clearfix">
            <div class="logo fl">
                <router-link to="/">
                    <img src="/img/logo.png" alt="">
                </router-link>
                <div class="shu"></div>
                <span class="title">{{title}}</span>
            </div>
            <div class="customer">
                <slot name="right"></slot>
            </div>
        </div>
    </header>
</template>
<script>

    export default {
        props: {
            title: String
        },
        data() {
            return {}
        }
    }
</script>
<style lang="less" scoped>
    header {
        &.shadow {
            box-shadow: 3px 3px 5px rgba(0, 0, 0, .25);
        }
        position: fixed;
        top: 0;
        width: 100%;
        min-width: @contentWidth;
        height: @headerHeight;
        background:@mainColor;
        background: linear-gradient(90deg, rgba(245, 121, 131, 1), rgba(244, 57, 116, 1));
        z-index: 9999;
        .bars {
            height: 100%;
            width: @contentWidth;
            margin: auto;
            .logo {
                line-height: @headerHeight;
                margin-right: 10px;
                img {
                    border:none;
                    vertical-align: middle;
                }
                span {
                    font-size: 16px;
                    font-family: MicrosoftYaHeiUI-Bold;
                    font-weight: bold;
                    color:#fff
                }
                .shu {
                    width: 1px;
                    height: 44px;
                    display: inline-block;
                    background: rgba(255, 255, 255, 0.72);
                    margin: 0px 27px;
                    vertical-align: middle;
                }
            }
            .customer{
                line-height: @headerHeight;
            }
        }

    }
</style>