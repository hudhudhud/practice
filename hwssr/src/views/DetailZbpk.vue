<template>
    <Page>
        <div class="part jbxx">
            <div class="clearfix part-name"><span>主播对比</span></div>
            <div class="txs">
                <img src="/img/vs.png" alt="" class="vs-img">
                <div class="tx-pk clearfix">
                    <span class="zb-tx bkg fl"
                          :style="'background-image:url(/img/anchor_img/'+$router.currentRoute.params.id+'.jpg)'"></span>
                    <span class="zb-tx bkg fr"
                          :style="'background-image:url(/img/anchor_img/'+$router.currentRoute.params.toid+'.jpg)'"></span>
                </div>
            </div>
            <div class="info-pk clearfix">
                <div class="left fl">
                    <p class="name">{{anchor1.accountName}}</p>
                    <p class="ID">ID:{{anchor1.accountId}}</p>
                    <p class="zwjs">自我介绍:{{!anchor1.oneself?"无":anchor1.oneself}}</p>
                </div>
                <div class="right fr">
                    <p class="name">{{anchor2.accountName}}</p>
                    <p class="ID">ID:{{anchor2.accountId}}</p>
                    <p class="zwjs">自我介绍:{{!anchor2.oneself?"无":anchor2.oneself}}</p>
                </div>
            </div>
            <div class="tj">
                <div class="data">
                    <p class="tit">粉丝数</p>
                    <div class="num">
                        <p :class="{'right-ra':anchor1.fansNumPercent==100,left:true}"
                           :style="'width:'+anchor1.fansNumPercent+'%'">
                            {{anchor1.fansNum?parseInt(anchor1.fansNum).toLocaleString():''}}</p>
                        <p :class="{'left-ra':anchor1.fansNumPercent==0,right:true}"
                           :style="'width:'+(100-anchor1.fansNumPercent)+'%'">{{
                            anchor2.fansNum?parseInt(anchor2.fansNum).toLocaleString():''}}</p>
                    </div>
                </div>
                <div class="data">
                    <p class="tit">最高观看数</p>
                    <div class="num">
                        <p :class="{'right-ra':anchor1.maxPercent==100,left:true}"
                           :style="'width:'+anchor1.maxPercent+'%'">{{anchor1.max?parseInt(anchor1.max ).toLocaleString():''}}</p>
                        <p :class="{'left-ra':anchor1.maxPercent==0,right:true}"
                           :style="'width:'+(100-anchor1.maxPercent)+'%'">{{anchor2.max?parseInt(anchor2.max
                            ).toLocaleString():''}}</p>
                    </div>
                </div>
                <div class="data">
                    <p class="tit">场均观看数</p>
                    <div class="num">
                        <p :class="{'right-ra':anchor1.avgViewPercent==100,left:true}"
                           :style="'width:'+anchor1.avgViewPercent+'%'">{{anchor1.avgView?parseInt(anchor1.avgView
                            ).toLocaleString():''}}</p>
                        <p :class="{'left-ra':anchor1.avgViewPercent==0,right:true}"
                           :style="'width:'+(100-anchor1.avgViewPercent)+'%'">{{anchor2.avgView?parseInt(anchor2.avgView
                            ).toLocaleString():''}}</p>
                    </div>
                </div>
                <div class="data">
                    <p class="tit">直播场次数</p>
                    <div class="num">
                        <p :class="{'right-ra':anchor1.liveNumPercent==100,left:true}"
                           :style="'width:'+anchor1.liveNumPercent+'%'">{{anchor1.liveNum?parseInt(anchor1.liveNum
                            ).toLocaleString():''}}</p>
                        <p :class="{'left-ra':anchor1.liveNumPercent==0,right:true}"
                           :style="'width:'+(100-anchor1.liveNumPercent)+'%'">{{anchor2.liveNum?parseInt(anchor2.liveNum
                            ).toLocaleString():''}}</p>
                    </div>
                </div>
                <div class="data">
                    <p class="tit">直播宝贝数</p>
                    <div class="num">
                        <p :class="{'right-ra':anchor1.goodsNumPercent==100,left:true}"
                           :style="'width:'+anchor1.goodsNumPercent+'%'">{{anchor1.goodsNum?parseInt(anchor1.goodsNum
                            ).toLocaleString():''}}</p>
                        <p :class="{'left-ra':anchor1.goodsNumPercent==0,right:true}"
                           :style="'width:'+(100-anchor1.goodsNumPercent)+'%'">{{anchor2.goodsNum?parseInt(anchor2.goodsNum
                            ).toLocaleString():''}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="part sjqs">
            <div class="clearfix part-name"><span>主播数据趋势</span></div>
            <div class="pk-data">
                <div class="data">
                    <p class="tit">- 直播观看趋势 -</p>
                    <div class="info clearfix">
                        <div class="line fl">
                            <p class="name one">{{anchor1.accountName}}</p>
                            <p class="tip">总曝光量（观看量）</p>
                            <p class="value one">{{anchor1.viewSum?anchor1.viewSum.toLocaleString():''}}</p>
                        </div>
                        <div class="line fr">
                            <p class="name two">{{anchor2.accountName}}</p>
                            <p class="tip">总曝光量（观看量）</p>
                            <p class="value two">{{anchor2.viewSum?anchor2.viewSum.toLocaleString():''}}</p>
                        </div>
                    </div>
                    <div id="total_view_line" class="echart" v-show="zbsjqs_show"></div>
                    <div class="imgloading" v-show="!zbsjqs_show">
                <img src="/img/loading.gif" alt="">
            </div>
                </div>
                <div class="data">
                    <p class="tit">- 直播时间段—观看次数 -</p>
                    <div class="info clearfix">
                        <div class="line fl">
                            <p class="name one">{{anchor1.accountName}}</p>
                        </div>
                        <div class="line fr">
                            <p class="name two">{{anchor2.accountName}}</p>
                        </div>
                    </div>
                    <div id="view_bar" class="echart" v-show="zbsjgkcs_show"></div>
                    <div class="imgloading" v-show="!zbsjgkcs_show">
                <img src="/img/loading.gif" alt="">
            </div>
                </div>
            </div>
        </div>
        <div class="part dhnl">
            <div class="clearfix part-name">
                <span>带货能力</span>
                <!--<div class="select fr">-->
                <!--<span sytle="font-size:12px;opacity:0.78;">共同类目选择：</span>-->
                <!--<el-select v-model="selectLm" placeholder="请选择" @change="change" value-key="id">-->
                <!--<el-option-->
                <!--v-for="item in lmList"-->
                <!--:key="item.lv1Id"-->
                <!--:label="item.lv1Name"-->
                <!--:value="item.obj">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--</div>-->
            </div>
            <div>
                <!--<div class="data">-->
                <!--<p class="tit">当前类目带货占比</p>-->
                <!--<div class="echart" id="double_bar"></div>-->
                <!--</div>-->
                <!--<div class="data two">-->
                <!--<p class="tit">子类目带货占比</p>-->
                <!--<div class="echart" id="double_bar_child"></div>-->
                <!--</div>-->

                <ul class="tabs">
                    <li @click="changeTab(i)" v-for="(item,i) in tabList" :class="{active:i==currentTab}" :key="i">
                        {{item.name}}
                    </li>
                </ul>
                <div class="pk-data">
                    <div class="data">
                        <div class="info clearfix">
                            <div class="line fl">
                                <p class="name one">{{anchor1.accountName}}</p>
                                <p class="tip">
                                    {{tabList[currentTab].name.substr(0,tabList[currentTab].name.length-2)}}</p>
                                <p class="value one">
                                    {{anchor1[tabList[currentTab].key]?parseInt(anchor1[tabList[currentTab].key]).toLocaleString():''}}</p>
                            </div>
                            <div class="line fr">
                                <p class="name two">{{anchor2.accountName}}</p>
                                <p class="tip">
                                    {{tabList[currentTab].name.substr(0,tabList[currentTab].name.length-2)}}</p>
                                <p class="value two">
                                    {{anchor2[tabList[currentTab].key]?parseInt(anchor2[tabList[currentTab].key]).toLocaleString():''}}</p>
                            </div>
                        </div>
                        <div id="pk_line" class="echart" v-show="dhnl_show"></div>
                        <div class="imgloading" v-show="!dhnl_show">
                <img src="/img/loading.gif" alt="">
            </div>
                    </div>
                </div>
            </div>
        </div>
    </Page>
</template>
<script>
    import Page from "@/components/Page.vue";
    import echarts from "echarts";
    import myaxios from "../assets/js/myaxios";
    import {
        Select,
        Option,
    } from "element-ui"

    export default {
        components: {
            Page,
            elSelect: Select,
            elOption: Option,
        },
        data() {
            return {
                anchor1: {},
                anchor2: {},
                fans_style1: {
                    width: '20%',
                    height: '20px',
                    background: 'red',
                    display: 'inline-block'
                },
                fans_style2: {
                    width: '80%',
                    height: '20px',
                    background: 'blue',
                    display: 'inline-block'
                },
                tabPosition: 'top',
                selectLm: {},
                lmList: [],
                value: '',
                activeName: 'first',
                tabList: [
                    {name: "直播场次趋势", key: "liveSum", x: "video_axis", y: "video_data"},
                    {name: "场均观看趋势", key: "avgView", x: "view_axis", y: "view_data"},
                    {name: "直播店铺数趋势", key: "shopNum", x: "shop_line_axis", y: "shop_line_data"},
                    {name: "直播宝贝数趋势", key: "goodsNum", x: "goods_line_axis", y: "goods_line_data"}
                ],
                currentTab: 0,
                zbsjqs_show:true,
                zbsjgkcs_show:true,
                dhnl_show:true,
            }
        },
        async mounted() {
            // console.log(this.$router.currentRoute.params);
            let id1 = this.$router.currentRoute.params.id;
            let id2 = this.$router.currentRoute.params.toid;
            await this.anchorInfo_post(id1, id2)
            await this.anchorCountPK_post(id1, id2)
            // await this.commonType(id1, id2)
            await this.liveViewTrend_post(id1, id2)
            await this.liveTimeViewTrend_post(id1, id2)
            await this.liveNumTrend_post(id1, id2)
            await this.liveTimeViewTrend_post(id1, id2)
            await this.avgLiveViewNumTrend(id1, id2)
            await this.liveShopNumTrend(id1, id2)
            await this.liveGoodsNumTrend(id1, id2)

            // this.double_bar();
            // this.double_bar_child();

            this.changeTab(0)
        },
        methods: {
            //
            linefun() {
                let linechart = echarts.init(document.getElementById("total_view_line"));
                let lineoption = {
                    color: ['#F2497D', '#13B5B1'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line'
                        }
                    },
                    xAxis: {
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(0,0,0,0.1)',
                            }
                        },
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: 'rgba(0,0,0,0.78)',
                                fontWeight: 'normal',
                                fontSize: '12',
                            },
                        },
                        data: this.anchor1.total_view_line_axis
                    },
                    yAxis: {
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff',
                            }
                        },
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: 'rgba(0,0,0,0.78)',
                                fontWeight: 'normal',
                                fontSize: '12',
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    series: [
                        {
                            name: this.anchor1.accountName,
                            type: 'line',
                            symbol: 'circle',
                            data: this.anchor1.total_view_line_data
                        },
                        {
                            name: this.anchor2.accountName,
                            type: 'line',
                            symbol: 'circle',
                            data: this.anchor2.total_view_line_data
                        }
                    ],
                };
                linechart.setOption(lineoption)
            },
            view_bar() {
                let barchart = echarts.init(document.getElementById("view_bar"));
                let baroption = {
                    color: ['#F2497D', '#13B5B1'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    // legend: {
                    //     data: [anchor1.accountName, anchor2.accountName]
                    // },
                    xAxis: {
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff',
                            }
                        },
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: 'rgba(0,0,0,0.78)',
                                fontWeight: 'normal',
                                fontSize: '12',
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    yAxis: {
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(0,0,0,0.1)',
                            }
                        },
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: 'rgba(0,0,0,0.78)',
                                fontWeight: 'normal',
                                fontSize: '12',
                            },
                        },
                        data: ['22-02时', '18-22时', '14-18时', '10-14时', '06-10时', '02-06时']
                    },
                    series: [
                        {
                            name: this.anchor1.accountName,
                            type: 'bar',
                            data: this.anchor1.view_bar_data
                        },
                        {
                            name: this.anchor2.accountName,
                            type: 'bar',
                            data: this.anchor2.view_bar_data
                        }
                    ]
                };
                barchart.setOption(baroption)
            },
            change(value) {
                // console.log(value)
            },
            // double_bar() {
            //     let double_bar_chart = echarts.init(document.getElementById('double_bar'))
            //     let double_bar_option = {
            //         tooltip: {
            //             trigger: 'axis',
            //             axisPointer: {
            //                 type: 'shadow'
            //             }
            //         },
            //         xAxis: {show: false},
            //         yAxis: [
            //             {
            //                 type: 'category',
            //                 axisLine: {
            //                     show: false
            //                 },
            //                 axisTick: {show: false},
            //                 data: ['周一']
            //             }
            //         ],
            //         series: [
            //
            //             {
            //                 name: '收入',
            //                 type: 'bar',
            //                 stack: '总量',
            //                 label: {
            //                     normal: {
            //                         show: true,
            //                         position: 'right'
            //                     }
            //                 },
            //                 data: [320]
            //             },
            //             {
            //                 name: '支出',
            //                 type: 'bar',
            //                 stack: '总量',
            //                 label: {
            //                     normal: {
            //                         show: true,
            //                         position: 'left'
            //                     }
            //                 },
            //                 data: [-120]
            //             }
            //         ]
            //     };
            //     double_bar_chart.setOption(double_bar_option)
            // },
            // double_bar_child() {
            //     let double_bar_child_chart = echarts.init(document.getElementById('double_bar_child'))
            //     let double_bar_child_option = {
            //         tooltip: {
            //             trigger: 'axis',
            //             axisPointer: {
            //                 type: 'shadow'
            //             }
            //         },
            //         xAxis: {show: false},
            //         yAxis: [
            //             {
            //                 type: 'category',
            //                 axisLine: {
            //                     show: false
            //                 },
            //                 axisTick: {show: false},
            //                 data: ['周一', '周二']
            //             }
            //         ],
            //         series: [
            //
            //             {
            //                 name: '收入',
            //                 type: 'bar',
            //                 stack: '总量',
            //                 label: {
            //                     normal: {
            //                         show: true,
            //                         position: 'right'
            //                     }
            //                 },
            //                 data: [320, 100]
            //             },
            //             {
            //                 name: '支出',
            //                 type: 'bar',
            //                 stack: '总量',
            //                 label: {
            //                     normal: {
            //                         show: true,
            //                         position: 'left'
            //                     }
            //                 },
            //                 data: [-120, -50]
            //             }
            //         ]
            //     };
            //     double_bar_child_chart.setOption(double_bar_child_option)
            // },
            changeTab(i) {
                this.currentTab = i
                let key = this.tabList[i].key
                let x = this.tabList[i].x
                let y = this.tabList[i].y
                let pk_line = echarts.init(document.getElementById('pk_line'))
                let pk_line_option = {
                    color: ['#F2497D', '#13B5B1'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line'
                        }
                    },
                    xAxis: {
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(0,0,0,0.1)',
                            }
                        },
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: 'rgba(0,0,0,0.78)',
                                fontWeight: 'normal',
                                fontSize: '12',
                            },
                        },
                        data: this.anchor1[x]
                    },
                    yAxis: {
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff',
                            }
                        },
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: 'rgba(0,0,0,0.78)',
                                fontWeight: 'normal',
                                fontSize: '12',
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    series: [
                        {
                            name: this.anchor1.accountName,
                            type: 'line',
                            symbol: 'circle',
                            data: this.anchor1[y]
                        },
                        {
                            name: this.anchor2.accountName,
                            type: 'line',
                            symbol: 'circle',
                            data: this.anchor2[y]
                        }
                    ],
                };
                pk_line.setOption(pk_line_option)
            },
            anchorInfo_post(anchorId1, anchorId2) {
                return myaxios.post('/web/anchorPK/anchorInfo', {
                    anchorId1: anchorId1,
                    anchorId2: anchorId2
                }).then(data => {
                    this.anchor1 = data.data.data[anchorId1]
                    this.anchor1.oneself = this.anchor1.oneself.replace('自我介绍：', '').replace('自我介绍:', '')
                    if (this.anchor1.oneself.length > 50) {
                        this.anchor1.oneself = this.anchor1.oneself.substr(0, 50) + '...'
                    }

                    this.anchor2 = data.data.data[anchorId2]
                    this.anchor2.oneself = this.anchor2.oneself.replace('自我介绍：', '').replace('自我介绍:', '')
                    if (this.anchor2.oneself.length > 50) {
                        this.anchor2.oneself = this.anchor2.oneself.substr(0, 50) + '...'
                    }

                    this.anchor1.fansNumPercent = parseInt(this.anchor1.fansNum) * 100 / (parseInt(this.anchor2.fansNum) + parseInt(this.anchor1.fansNum))
                    this.anchor1.maxPercent = parseInt(this.anchor1.max) * 100 / (parseInt(this.anchor2.max) + parseInt(this.anchor1.max))
                    this.anchor1.avgViewPercent = parseInt(this.anchor1.avgView) * 100 / (parseInt(this.anchor2.avgView) + parseInt(this.anchor1.avgView))
                    this.anchor1.liveNumPercent = parseInt(this.anchor1.liveNum) * 100 / (parseInt(this.anchor2.liveNum) + parseInt(this.anchor1.liveNum))
                    this.anchor1.goodsNumPercent = parseInt(this.anchor1.goodsNum) * 100 / (parseInt(this.anchor2.goodsNum) + parseInt(this.anchor1.goodsNum))

                })
            },
            liveViewTrend_post(anchorId1, anchorId2) {
                this.zbsjqs_show=false
                return myaxios.post('/web/anchorPK/liveViewTrend', {
                    anchorId1: anchorId1,
                    anchorId2: anchorId2
                }).then(data => {
                    // console.log('liveViewTrend_post',data)
                    let total_view_line_data1 = []
                    let total_view_line_data2 = []
                    let total_view_line_axis1 = []

                    let list1 = data.data.data[anchorId1]
                    let list2 = data.data.data[anchorId2]
                    for (let i = 0; i < list1.length; i++) {
                        total_view_line_data1.push(list1[i].viewSum)
                        total_view_line_data2.push(list2[i].viewSum)
                        total_view_line_axis1.push(list1[i].days)

                    }
                    this.$set(this.anchor1, 'total_view_line_data', total_view_line_data1);
                    this.$set(this.anchor1, 'total_view_line_axis', total_view_line_axis1);
                    this.$set(this.anchor2, 'total_view_line_data', total_view_line_data2);
                    this.zbsjqs_show=true
                    setTimeout(()=>{
                        this.linefun();
                    })
                })
            },
            anchorCountPK_post(anchorId1, anchorId2) {
                this.dhnl_show=false
                return myaxios.post('/web/anchorPK/anchorCountPK', {
                    anchorId1: anchorId1,
                    anchorId2: anchorId2
                }).then(data => {
                    // console.log('anchorCountPK_post',data)
                    this.$set(this.anchor1, 'viewSum', data.data.data[anchorId1]['viewSum']);
                    this.$set(this.anchor2, 'viewSum', data.data.data[anchorId2]['viewSum']);
                    this.$set(this.anchor1, 'avgView', data.data.data[anchorId1]['avgView']);
                    this.$set(this.anchor2, 'avgView', data.data.data[anchorId2]['avgView']);
                    this.$set(this.anchor1, 'goodsNum', data.data.data[anchorId1]['goodsNum']);
                    this.$set(this.anchor2, 'goodsNum', data.data.data[anchorId2]['goodsNum']);
                    this.$set(this.anchor1, 'liveSum', data.data.data[anchorId1]['liveSum']);
                    this.$set(this.anchor2, 'liveSum', data.data.data[anchorId2]['liveSum']);
                    this.$set(this.anchor1, 'shopNum', data.data.data[anchorId1]['shopNum']);
                    this.$set(this.anchor2, 'shopNum', data.data.data[anchorId2]['shopNum']);
                    this.dhnl_show=true
                })
            },
            liveTimeViewTrend_post(anchorId1, anchorId2) {
                this.zbsjgkcs_show=false
                return myaxios.post('/web/anchorPK/liveTimeViewTrend', {
                    anchorId1: anchorId1,
                    anchorId2: anchorId2
                }).then(data => {
                    // console.log('liveTimeViewTrend_post', data)
                    let view_bar_data1 = []
                    let view_bar_data2 = []
                    let list1 = data.data.data[anchorId1][0]
                    let list2 = data.data.data[anchorId2][0]
                    view_bar_data1.push(list1['02:00-06:00'])
                    view_bar_data1.push(list1['06:00-10:00'])
                    view_bar_data1.push(list1['10:00-14:00'])
                    view_bar_data1.push(list1['14:00-18:00'])
                    view_bar_data1.push(list1['18:00-22:00'])
                    view_bar_data1.push(list1['22:00-02:00'])
                    view_bar_data2.push(list2['02:00-06:00'])
                    view_bar_data2.push(list2['06:00-10:00'])
                    view_bar_data2.push(list2['10:00-14:00'])
                    view_bar_data2.push(list2['14:00-18:00'])
                    view_bar_data2.push(list2['18:00-22:00'])
                    view_bar_data2.push(list2['22:00-02:00'])
                    this.$set(this.anchor1, 'view_bar_data', view_bar_data1.reverse())
                    this.$set(this.anchor2, 'view_bar_data', view_bar_data2.reverse())
                    this.zbsjgkcs_show=true
                    setTimeout(()=>{
                        this.view_bar()
                    })
                })

            },
            liveNumTrend_post(anchorId1, anchorId2) {
                return myaxios.post('/web/anchorPK/liveNumTrend', {
                    anchorId1: anchorId1,
                    anchorId2: anchorId2
                }).then(data => {
                    let list1 = data.data.data[anchorId1]
                    let list2 = data.data.data[anchorId2]
                    let video_data1 = []
                    let video_data2 = []
                    let video_axis = []
                    for (let i = 0; i < list1.length; i++) {
                        video_data1.push(list1[i].liveIdSum)
                        video_data2.push(list2[i].liveIdSum)
                        video_axis.push(list1[i].days)
                    }
                    // console.log('liveNumTrend_post', data)
                    this.$set(this.anchor1, 'video_data', video_data1);
                    this.$set(this.anchor2, 'video_data', video_data2);
                    this.$set(this.anchor1, 'video_axis', video_axis);
                })
            },
            avgLiveViewNumTrend(anchorId1, anchorId2) {
                return myaxios.post('/web/anchorPK/avgLiveViewNumTrend', {
                    anchorId1: anchorId1,
                    anchorId2: anchorId2
                }).then(data => {
                    // console.log('avgLiveViewNumTrend', data)
                    let view_data1 = []
                    let view_data2 = []
                    let view_axis = []
                    let list1 = data.data.data[anchorId1]
                    let list2 = data.data.data[anchorId2]
                    for (let i = 0; i < list1.length; i++) {
                        view_data1.push(list1[i].avgView)
                        view_data2.push(list2[i].avgView)
                        view_axis.push(list1[i].days)
                    }
                    this.$set(this.anchor1, 'view_data', view_data1);
                    this.$set(this.anchor1, 'view_axis', view_axis);
                    this.$set(this.anchor2, 'view_data', view_data2);

                })
            },
            liveShopNumTrend(anchorId1, anchorId2) {
                return myaxios.post('/web/anchorPK/liveShopNumTrend', {
                    anchorId1: anchorId1,
                    anchorId2: anchorId2
                }).then(data => {
                    // console.log('liveShopNumTrend', data)
                    let shop_line_data1 = []
                    let shop_line_data2 = []
                    let shop_line_axis = []
                    let list1 = data.data.data[anchorId1]
                    let list2 = data.data.data[anchorId2]
                    for (let i = 0; i < list1.length; i++) {
                        shop_line_data1.push(list1[i].shopSum)
                        shop_line_data2.push(list2[i].shopSum)
                        shop_line_axis.push(list1[i].days)
                    }
                    this.$set(this.anchor1, 'shop_line_data', shop_line_data1);
                    this.$set(this.anchor1, 'shop_line_axis', shop_line_axis);
                    this.$set(this.anchor2, 'shop_line_data', shop_line_data2);
                })
            },
            liveGoodsNumTrend(anchorId1, anchorId2) {
                return myaxios.post('/web/anchorPK/liveGoodsNumTrend', {
                    anchorId1: anchorId1,
                    anchorId2: anchorId2
                }).then(data => {
                    // console.log('liveGoodsNumTrend', data)
                    let goods_line_data1 = []
                    let goods_line_data2 = []
                    let goods_line_axis = []
                    let list1 = data.data.data[anchorId1]
                    let list2 = data.data.data[anchorId2]
                    for (let i = 0; i < list1.length; i++) {
                        goods_line_data1.push(list1[i].goodsSum)
                        goods_line_data2.push(list2[i].goodsSum)
                        goods_line_axis.push(list1[i].days)
                    }
                    this.$set(this.anchor1, 'goods_line_data', goods_line_data1);
                    this.$set(this.anchor1, 'goods_line_axis', goods_line_axis);
                    this.$set(this.anchor2, 'goods_line_data', goods_line_data2);
                })
            },
            // commonType(anchorId1, anchorId2) {
            //     return myaxios.post('/web/anchorPK/commonType', {
            //         anchorId1: anchorId1,
            //         anchorId2: anchorId2
            //     }).then(data => {
            //         let res = data.data.data
            //         if (res.type1List) {
            //             this.typeId = res.type1List[0].lv1Id
            //             this.lmList = res.type1List.map(item => {
            //                 item.obj = {id: item.lv1Id, name: item.lv1Name}
            //                 return item
            //             })
            //             this.selectLm = this.lmList[0].obj
            //             if (res.type2List && res.type2List.length > 0) {
            //                 var lm2 = res.type2List.map(item => {
            //                     item.lv1Name = item.lv1Name + "," + item.lv2Name
            //                     item.lv1Id = item.lv2Id
            //                     item.obj = {id: item.lv1Id, name: item.lv1Name}
            //                     return item
            //                 })
            //                 this.lmList.push(...lm2)
            //             }
            //             this.goodsTypeNum_post(this.lmList[0].obj.name.indexOf(',') > -1 ? 2 : 1, this.anchor1.accountId, this.lmList[0].obj.id)
            //         }
            //     })
            // },//带货能力下拉框的数据
            // goodsTypeNum_post(level, id, typeID) {
            //     return myaxios.post('/web/AnchorRank/goodsTypeNum', {
            //         level: level,
            //         anchorId: id,
            //         id: typeID
            //     }).then(data => {
            //         console.log('goodsTypeNum_post',data)
            //         // this.pie_obj = data.data.data.goodsTypeNum;
            //         // this.pie_data = [];
            //         // this.pie_level = level;
            //         // for (let i = 0; i < this.pie_obj.length; i++) {
            //         //     let obj = {};
            //         //     if (this.pie_obj[i].typeName.length > 7) {
            //         //         obj['name'] = this.pie_obj[i].typeName.slice(0, 8) + '...'
            //         //     } else {
            //         //         obj['name'] = this.pie_obj[i].typeName;
            //         //     }
            //         //     obj['value'] = this.pie_obj[i].goodsNum;
            //         //     if (this.typeId == this.pie_obj[i].typeId) {
            //         //         this.pie_name = this.pie_obj[i].typeName;
            //         //         obj['selected'] = true
            //         //     }
            //         //     this.pie_data.push(obj);
            //         //
            //         //
            //         // }
            //     });
            // },//带货能力父级共同类目,有问题
        },

    }
</script>
<style scoped lang="less">
    @import '../assets/css/part.less';

    @pkColor: #13b5b1;
    .line {
        width: 277px;
        display: inline-block;
    }

    .part {
        &.jbxx {
            .txs {
                position: relative;
                .vs-img {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translateX(-50%) translateY(-50%);
                }
                .tx-pk {
                    width: 650px;
                    margin: auto;
                    .zb-tx {
                        display: inline-block;
                        width: 180px;
                        height: 180px;
                        border-radius: 50%;
                    }
                }
            }

            .info-pk {
                margin-top: 18px;
                box-sizing: border-box;
                .left, .right {
                    width: 50%;
                    padding: 0 45px;
                    box-sizing: border-box;
                    line-height: 1.5em;
                    .name, .ID {
                        text-align: center;
                    }
                    .name {
                        font-size: 16px;
                        opacity: 0.78;
                    }
                    .ID, .zwjs {
                        font-size: 14px;
                        opacity: 0.54;
                    }
                    .zwjs {
                        margin-top: 20px;
                    }
                }
            }
            .tj {
                width: 900px;
                margin: auto;
                margin-top: 41px;
                .data {
                    margin-bottom: 20px;
                    .tit {
                        text-align: left;
                        width: 70px;
                        font-size: 14px;
                        opacity: 0.78;
                        display: inline-block;
                        margin-right: 12px;
                    }
                    .num {
                        display: inline-block;
                        width: 770px;
                        height: 20px;
                        border-radius: 10px;
                        .left, .right {
                            height: 100%;
                            display: inline-block;
                            height: 100%;
                            text-align: center;
                            line-height: 20px;
                            color: #fff;
                            font-size: 12px;
                            vertical-align: top;
                        }
                        .left {
                            background: @mainColor;
                            border-top-left-radius: 10px;
                            border-bottom-left-radius: 10px;
                        }
                        .right {
                            background-color: @pkColor;
                            border-top-right-radius: 10px;
                            border-bottom-right-radius: 10px;
                        }
                        .left-ra {
                            border-top-left-radius: 10px;
                            border-bottom-left-radius: 10px;
                        }
                        .right-ra {
                            border-top-right-radius: 10px;
                            border-bottom-right-radius: 10px;
                        }
                    }

                }

            }
        }
        &.sjqs {
            .pk-data {
                .data {
                    &:last-child {
                        margin-top: 100px;
                    }
                    .echart {
                        height: 300px;
                        width: 800px;
                        box-sizing: border-box;
                        margin: auto;
                        margin-top: 10px;
                    }
                    #view_bar {
                        width: 900px;
                    }
                }
            }
        }
        .pk-data {
            .data {
                .tit {
                    text-align: center;
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                .info {
                    width: 700px;
                    margin: auto;
                    box-sizing: border-box;
                    text-align: center;
                    .name {
                        font-size: 14px;
                        font-weight: bold;
                        opacity: 0.78;
                        &:before {
                            content: "";
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background-color: @mainColor;
                            line-height: 2em;
                            margin-right: 5px;
                            opacity: 1;
                        }
                        &.two:before {
                            background-color: @pkColor;
                        }
                    }
                    .tip {
                        font-size: 14px;
                        opacity: 0.54;
                    }
                    .value {
                        font-size: 48px;
                        color: @mainColor;
                        &.two {
                            color: @pkColor;
                        }
                    }
                }
            }
        }
        &.dhnl {
            .part-name {
                padding: 10px 55px;
            }
            padding: 0;
            .data {
                padding: 20px 55px;
                .tit {
                    margin-bottom: 10px;
                }
                .echart {
                    width: 880px;
                }
                #double_bar {
                    height: 80px;
                }
                #double_bar_child {
                    height: 350px;
                }
                &.two {
                    margin-top: 50px;
                }
            }
            .tabs {
                margin-top: 50px;
                width: 100%;
                height: 40px;
                background-color: #e1e1e1;
                text-align: center;
                li {
                    display: inline-block;
                    padding: 0 20px;
                    color: #000;
                    text-align: center;
                    cursor: pointer;
                    line-height: 40px;
                    &.active {
                        background-color: #fff;

                    }
                }
            }
            #pk_line {
                height: 300px;
                width: 800px;
                box-sizing: border-box;
                margin: auto;
                margin-top: 10px;
            }
        }

    }

</style>
<style lang="less">
    @import '../assets/css/pager.less';

    .dhnl {
        .el-select {
            border-radius: 4px;
            width: 170px;
            height: 30px;
            .el-input__inner {
                height: 30px;
                line-height: 30px;
                width: 100%;
            }
            .el-input__icon {
                line-height: 30px;
            }
        }
    }

    .el-select-dropdown__list {
        padding: 6px 10px;
    }
</style>
