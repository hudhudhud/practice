<template>
    <div>
        <header>
            <div class="content">
                <div class="line">
                    <div class="point" :class="localRank?(rolesCode[localRank]+'-head-point'):''">
                        <div class="head">
                            <img :src="UserInfo.headImgUrl" alt="">
                        </div>
                    </div>
                </div>
                <div class="role" v-for="(item, index) in rolesCode" :class="{gray: localRank<index}">
                    <div class="progress" :class="item+'-height'"></div>
                    <div :class="localRank<index?(item+'-img-d'):(item+'-img')"></div>
                    <p>{{text[item]}}</p>
                </div>
            </div>
            <p class="tip" v-if="rank >=6" style="color: #F5A623">恭喜你，已达到最高等级</p>
            <p class="tip" v-else>您现在已是<span>{{longText[rolesCode[rank]]}}</span>，距离下次升级的指标还未完成</p>
            <div class="btn" @click.stop="linkTo('myGrowup')" v-if="rank <6"><button type="button">查看进度</button></div>

        </header>
        <div class="chart">
            <div class="title">
                合作伙伴
            </div>
            <div class="content">
                <div id="echarts1"></div>
            </div>
        </div>
        <Scroll type="1"/>
    </div>
</template>

<script>
    import {findTeamNumberByRank} from "../../service/profile/newProfile";
    import Scroll from '@/components/commodity/scrollComponent'

    export default {
        name: "myGrowth",
        data: function () {
            return {
                text: {
                    'member': '会员',
                    'shop': '店主',
                    'shop1': '一星',
                    'shop2': '二星',
                    'shop3': '三星',
                    'shop4': '钻石',
                    'shop5': '皇冠'
                },
                longText: {
                    'member': '会员',
                    'shop': '店主',
                    'shop1': '一星店主',
                    'shop2': '二星店主',
                    'shop3': '三星店主',
                    'shop4': '三星钻石店主',
                    'shop5': '三星皇冠店主'
                },
                localRank: 0
            }
        },
        components: {
            Scroll
        },
        activated: function () {
            this.getItem();
            this.rankInit();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            rankInit: function(){
                setTimeout(() => {
                    if(this.rank > this.localRank){
                        this.localRank++;
                        this.rankInit();
                    }
                }, 280);
              
            },
            getItem: async function () {
                const res = await findTeamNumberByRank();
                if (res.status === '0') {
                    this.init(res.data);
                }
             
            },
            linkTo(name) {
                if (arguments[1]) {
                    this.$router.push({name: name, query: arguments[1]});
                } else {
                    this.$router.push({name: name});
                }
            },
            init: function (data) {
                delete data.All;
                let option = {
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['30%', '55%'],
                            center: ['50%', '50%'],
                            data: Object.keys(data).map(i => {
                                return {name: i + '(' + data[i] + ')', value: data[i]}
                            }),
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#14FBEC', '#0CD1CC', '#FF3E00', '#FF8604', '#5FB2FF',
                                            '#FFE944', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                        ];
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }
                    ]
                };
                let myChart = this.$echarts.init(document.getElementById('echarts1'));
                myChart.setOption(option);
            }
        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            },
            rank() {
                return +this.$store.state.userInfo.rank;
            },
            rolesCode() {
                return this.$store.state.STATIC_DATA.rolesCode;
            }

        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    header {
        overflow: hidden;
        padding-bottom: rem(20);
        //  height: rem(352);
        background-color: #ffffff;
        .content {
            position: relative;
            margin: 0 auto;
            width: rem(310);
            height: rem(260);
            @extend %flex;
            .line {
                position: absolute;
                left: 0;
                width: rem(310);
                height: rem(134);
                top: rem(40);
                background: url("../../assets/img/profile/shop/line.png") no-repeat;
                background-size: 100% 100%;
            }
            .point {
                width: 0;
                height: 0;
                position: absolute;
                transition: all .3s linear;
                left: rem(10);
                top: getY(10);
                @include translate(0, rem(-10));
                &::after {
                    position: absolute;
                    left: 0;
                    top: 0;
                    content: '';
                    @include translate(-50%, 0);
                    width: 0;
                    height: 0;
                    border: rem(6) solid transparent;
                    border-left-width: rem(3);
                    border-right-width: rem(3);
                    border-top-color: #FAD961;
                }
            }
            .head {
                position: absolute;
                left: 0;
                top: 0;
                @include translate(-50%, -100%);
                overflow: hidden;
                box-sizing: content-box;
                border-radius: 50%;
                width: rem(27);
                height: rem(27);
                border: 1px solid #FAD961;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .tip {
            margin-top: rem(10);
            text-align: center;
            font-size: rem(14);
            color: #666666;
            span{
                color: #F5A623;
            }
        }
        .btn{
           margin-top: rem(20);
           text-align: center; 
           button{
               width: rem(159);
               height: rem(25);
               color: #ffffff;
               @include gradientToRight(#FAD961,#F76B1C);
               border-radius: rem(13);
               font-size: rem(12);
               font-weight: 700;
           }
        }
        .role:last-of-type, .role:first-of-type {
            flex: .7;
        }
        .role {
            flex: 1;
            @extend %flex;
            @extend %flex-column;
            @extend %flex-align-center;
            justify-content: flex-end;
            -webkit-justify-content: flex-end;
            color: #F5A623;
            .progress {
                border-radius: 4px;
                margin-bottom: 2px;
                width: rem(8);
                height: rem(29);
                @include gradient(#F76B1C, #FAD961);
            }
        }
        .role.gray {
            color: #DDDDDD;
            .progress {
                background: #DDDDDD;
            }
        }
        @each $role, $height, $x in (member, 30, 40), (shop, 50, 85), (shop1, 70, 130), (shop2, 90, 175), (shop3, 110, 228), (shop4, 130, 270), (shop5, 150, 293) {
          /*  .#{$role}-img {
                width: rem(27);
                height: rem(27);
                background: url("../../assets/img/profile/shop/#{$role}.png") no-repeat bottom;
                background-size: 100% 100%;
            }*/
            .#{$role}-height {
                height: rem($height) !important;
            }
            .point.#{$role}-head-point {
                left: rem($x);
                top: getY($x);
            }
        }
    }

    #echarts1 {
        box-sizing: border-box;
        height: rem(225);
    }

    .chart {
        margin: rem(20) rem(10) 0;
        height: rem(266);
        background-color: #ffffff;
        .title {
            height: rem(41);
            line-height: rem(41);
            font-size: rem(15);
            color: #333333;
            text-indent: rem(14);
            border-bottom: 1px solid $border;
            font-weight: bold;
        }
    }
</style>