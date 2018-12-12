<template>
    <Page>
        <div class="top-bar clearfix">
            <div class="fr">
                <div class="btn">
                    <el-button type="text" @click="dialogTableVisible = true" class="other-btn">查看该主播的其他直播</el-button>
                    <span class="tri"><img src="/img/triangle.png" alt=""></span>
                </div>

                <el-dialog :visible.sync="dialogTableVisible">
                    <v-date-picker v-model="picker" color="blue" @input="change" locale="zh-cn"
                                   :first-day-of-week="0"
                                   multiple
                                   landscape
                                   full-width
                                   scrollable
                                   :events="arrayEvents"
                                   event-color="red lighten-1"
                                   :allowed-dates="allowedDates"
                    ></v-date-picker>
                    <table v-show="show">
                        <tr>
                            <th>直播时间</th>
                            <th>直播主题</th>
                            <th>观看次数</th>
                        </tr>
                        <tr v-for="(video,i) in video_obj" :key="i">
                            <td>{{video.time}}</td>
                            <td>
                                <a :href="video.url" target="_blank">{{video.title}}</a>
                            </td>
                            <td>{{video.view?parseInt(video.view).toLocaleString():''}}</td>
                        </tr>
                    </table>
                </el-dialog>
            </div>
        </div>
        <div class="part zbxx">
            <p class="bf zb-tx bkg" :style="`background-image:url(/img/anchor_img/${anchorId}.jpg)`"
               v-if="anchorId"></p>
            <p class="bf zb-name">主播:{{live_info.accountName}}</p>
            <p class="bf zb-title">直播主题:{{live_info.title}}</p>
            <p class="bf view-count">观看次数:{{live_info.viewCount?parseInt(live_info.viewCount).toLocaleString():''}}</p>
            <div class="bf right">
                <p>直播时间:{{live_info.time}}</p>
                <p class="">场次标签:{{live_info.label}}</p>
            </div>
        </div>
        <div class="part zbxg">
            <div class="clearfix part-name"><span class="tit">直播效果详情</span></div>
            <div class="data">
                <div class="bblmzb ">
                    <P class="tit">-宝贝类目占比-</P>
                    <div class="pie">
                        <div id="pie1" v-show="bblmzb1_show"></div>
                        <div class="imgloading" v-show="!bblmzb1_show">
                            <img src="/img/loading.gif" alt="">
                        </div>
                    </div>
                    <div class="pie">
                        <div id="pie2" v-show="bblmzb2_show"></div>
                        <div class="imgloading" v-show="!bblmzb2_show">
                            <img src="/img/loading.gif" alt="">
                        </div>
                    </div>
                </div>
                <div class="bbjgfb">
                    <p class="tit">-宝贝价格分布-</p>
                    <div id="bar" v-show="bbjgfb_show"></div>
                    <div class="imgloading" v-show="!bbjgfb_show">
                            <img src="/img/loading.gif" alt="">
                        </div>
                </div>
            </div>

        </div>
        <div class="part">
            <div class="clearfix part-name"><span class="tit">直播宝贝清单</span></div>
            <div class="data-table">
                <table border="1">
                    <tr>
                        <th>序列</th>
                        <th>直播宝贝</th>
                        <th>直播价格</th>
                        <!--<th>日常价格</th>-->
                    </tr>
                    <tr v-if="video_goods.length==0">
                        <td colspan="4"><span>没有数据</span></td>
                    </tr>
                    <tr v-for="(video_good,i) in video_goods" :key="i">
                        <td>{{i+1}}</td>
                        <td class="zbbb link">
                            <img :src="video_good.goodsPci" alt="" style="width: 30px;height: 30px">
                            <a :href="video_good.goodsUrl.startsWith('http')?video_good.goodsUrl:'https://'+video_good.goodsUrl"
                               target="_blank">{{video_good.goods_name}}</a>
                        </td>
                        <td>{{video_good.goodsPrice?parseFloat(video_good.goodsPrice).toFixed(1):''}}</td>
                        <!--<td>{{video_good.slowPriceMax?parseFloat(video_good.slowPriceMax).toFixed(1):''}}</td>-->
                    </tr>
                </table>
                <el-pagination
                        background
                        v-if="video_goods.length>0"
                        @current-change="zbbb_handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="10"
                        layout="prev, pager, next"
                        :total="zbbb_total"
                        :pager-count=5>
                </el-pagination>
            </div>
        </div>
        <div class="part">
            <div class="clearfix part-name"><span class="tit">更多历史直播</span></div>
            <div class="data-table">
                <table border="1">
                    <tr>
                        <th>直播时间</th>
                        <th>直播主题</th>
                        <th>观看次数</th>
                        <th>直播宝贝数</th>
                    </tr>
                    <tr v-if="more_videos.length==0">
                        <td colspan="4"><span>没有数据</span></td>
                    </tr>
                    <tr v-for="(more_video,i) in more_videos" :key="i">
                        <td>{{more_video.time}}</td>
                        <td class="link">
                            <a :href="more_video.replayUrl.startsWith('http')?more_video.replayUrl:'https://'+more_video.replayUrl"
                               target="_blank">{{more_video.title}}</a>
                        </td>
                        <td>{{parseInt(more_video.viewCount).toLocaleString()}}</td>
                        <td>{{more_video.goodsNum}}</td>
                    </tr>
                </table>
                <el-pagination
                        background
                        v-if="more_videos.length>0"
                        @current-change="gdzb_handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="10"
                        layout="prev, pager, next"
                        :total="more_video_total"
                        :pager-count=5>
                </el-pagination>
            </div>
        </div>
    </Page>
</template>
<script>
    import Page from "@/components/Page.vue"
    //import Breadcrumb from "@/components/Breadcrumb.vue"
    import echarts from "echarts"
    import {
        Pagination,
        Button,
        Dialog,
    }
        from "element-ui"
    import myaxios from "../assets/js/myaxios";

    export default {
        components: {
            Page,
            elPagination: Pagination,
            elButton: Button,
            elDialog: Dialog,
        },
        data: function () {
            return {
                live_info: {},
                bar_data: [],
                video_goods: [],
                more_videos: [],
                currentPage: 1,
                dialogTableVisible: false,
                date: [],
                picker: [],
                arrayEvents: [],
                pick_date_list: [],
                video_obj: {},
                show: false,
                anchorId: '',
                liveId: '',
                zbbb_total: 0,
                more_video_total: 0,
                bar_axis: [],
                pie_data: [],
                pie_child_data: [],
                pie_obj: [],
                pie_level: 1,
                pie_child_obj: [],
                pie_name: '',
                pie_child_color: [],
                pie_color: [],
                bblmzb1_show: false,
                bblmzb2_show: false,
                bbjgfb_show: false,
            }
        },
        async mounted() {
            this.liveId = this.$route.params.id;
            this.routeFrom = this.$route.params.from;

            this.arrayEvents = ['2018-09-01', '2018-09-10', '2018-08-15'];
            await this.LiveInfo_post(this.liveId, 10, 0, (data) => {
                this.live_info = data.liveInfo
                if (this.live_info.accountId) {
                    this.anchorId = this.live_info.accountId
                }
                this.video_goods = data.liveGoods
                this.zbbb_total = data.Total
            });
            await this.liveDate_post(this.anchorId);
            await this.moreHisLive_post(this.anchorId, 10, 0, '', '', (data) => {
                this.more_videos = data.hisLiveList;
                this.more_video_total = data.Total
            });
            this.goodsDetailInfo_post(this.liveId, '', (data) => {
                this.bar_axis = []
                let section = data.section
                let priceList = data.priceList ? data.priceList : []
                this.bar_data = priceList
                let str = ''
                for (let i = 0; i < priceList.length; i++) {
                    if (i == (priceList.length - 1)) {
                        str = (i * section) + '元以上'
                    } else {
                        str = (i * section) + '-' + ((i + 1) * section) + '元';
                    }
                    this.bar_axis.push(str)
                }
                this.bbjgfb_show=true
                setTimeout(()=>{
                   this.price_bar();
                },0)
                this.pie_obj = data.goodsNum
                this.pie_data = []
                for (let k = 0; k < this.pie_obj.length; k++) {
                    let obj = {}
                    if (this.pie_obj[k].lv1Name.length > 8) {
                        obj['name'] = this.pie_obj[k].lv1Name.slice(0, 8) + '...'
                    } else {
                        obj['name'] = this.pie_obj[k].lv1Name
                    }

                    obj['value'] = this.pie_obj[k].goodsNum
                    if (k == 0) {
                        this.pie_name = this.pie_obj[k].lv1Name;
                        obj['selected'] = true
                    }
                    this.pie_data.push(obj)
                    this.pie_color.push("rgba(242,72,125," + (1 - k * 0.1) + ")")
                }
                this.bblmzb1_show = true
                this.bblmzb2_show = true
                setTimeout(() => {
                    this.piefun()
                    this.pie_child(this.pie_name)
                },0)

            })
        },
        methods: {
            allowedDates(val) {
                return this.arrayEvents.indexOf(val) != -1
            },
            price_bar() {
                let myChart = echarts.init(document.getElementById("bar"))
                let option = {
                    color: ['#F2487D'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
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
                        data: this.bar_axis
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
                    series: [{
                        type: 'bar',
                        barWidth: 30,
                        data: this.bar_data
                    }]
                };
                myChart.setOption(option);
            },
            gdzb_handleCurrentChange(val) {
                let start_num = (val - 1) * 10;
                this.moreHisLive_post(this.anchorId, 10, start_num, '', '', (data) => {
                    this.more_videos = data.hisLiveList;
                });

            },
            zbbb_handleCurrentChange(val) {
                let start_num = (val - 1) * 10;
                this.LiveInfo_post(this.liveId, 10, start_num, (data) => {
                    this.video_goods = data.liveGoods
                })
            },
            change(s) {
                if (s.length) {
                    this.show = true
                } else {
                    this.show = false
                }
                var diff = []
                if (s.length > this.pick_date_list.length) {
                    //点击增加
                    this.pick_date_list = s
                    this.pick_date_list.reverse()

                    let start_time = this.pick_date_list[0].replace(/-/g, '.')
                    let end_time = this.pick_date_list[0].replace(/-/g, '.')
                    this.moreHisLive_post(this.anchorId, 1, 0, start_time, end_time, (data) => {
                        this.$set(this.video_obj, this.pick_date_list[0], {
                            time: this.pick_date_list[0],
                            title: data.hisLiveList[0].title,
                            url: data.hisLiveList[0].replayUrl,
                            view: data.hisLiveList[0].viewCount
                        })
                    })
                } else {
                    //点击删除
                    diff = this.array_difference(this.pick_date_list, s)[0];//删除的日期
                    this.pick_date_list = s
                    delete this.video_obj[diff]
                }
            },
            array_difference(a, b) {
                var clone = a.slice(0);
                for (var i = 0; i < b.length; i++) {
                    var temp = b[i];
                    for (var j = 0; j < clone.length; j++) {
                        if (temp === clone[j]) {
                            //remove clone[j]
                            clone.splice(j, 1);
                        }
                    }
                }
                return clone;
            },
            liveDate_post(anchorId) {
                return myaxios.post('/web/liveInfo/liveDate', {anchorId: anchorId}).then(data => {
                    this.arrayEvents = []
                    let DateList = data.data.data.DateList
                    for (let i = 0; i < DateList.length; i++) {
                        this.arrayEvents.push(DateList[i].time)
                    }
                })
            },
            LiveInfo_post(liveId, queryNum, startNum, cb) {
                let params = {
                    liveId: liveId,
                    queryNum: queryNum,
                    startNum: startNum
                }
                if (this.$route.query.time) {
                    params.time = this.$route.query.time.substr(0, 7)
                }
                return myaxios.post('/web/liveInfo/LiveInfo', params).then(data => {
                    if (typeof cb == "function") {
                        cb(data.data.data)
                    }

                })
            },
            moreHisLive_post(anchorId, queryNum, startNum, startDate, endDate, cb) {
                let params = {
                    anchorId: anchorId,
                    queryNum: queryNum,
                    startNum: startNum,
                }
                if (startDate && endDate) {
                    params.startDate = startDate
                    params.endDate = endDate
                    params.time = startDate.substr(0, 7)
                }
                else if (this.$route.query.time) {
                    params.time = this.$route.query.time.substr(0, 7)
                }
                return myaxios.post('/web/liveInfo/moreHisLive', params).then(data => {
                    if (typeof cb == "function") {
                        cb(data.data.data)
                    }
                })
            },
            goodsDetailInfo_post(liveId, typeName, cb) {
                let params = {liveId: liveId}
                if (typeName) {
                    params.typeName = typeName
                }
                if (this.$route.query.time) {
                    params.time = this.$route.query.time.substr(0, 7)
                }
                return myaxios.post('/web/liveInfo/goodsDetailInfo', params).then(data => {
                    if (typeof cb == "function") {
                        cb(data.data.data)
                    }
                })
            },
            pie_child(name) {
                this.bblmzb2_show=false
                if (!name) {
                    name = this.pie_name
                }
                this.goodsDetailInfo_post(this.liveId, name, (data) => {
                    this.pie_child_obj = data.goodsNum
                    this.pie_child_data = []
                    for (let k = 0; k < this.pie_child_obj.length; k++) {
                        let obj = {}
                        if (this.pie_child_obj[k].lv1Name.length > 8) {
                            obj['name'] = this.pie_child_obj[k].lv1Name.slice(0, 8) + '...'
                        } else {
                            obj['name'] = this.pie_child_obj[k].lv1Name
                        }
                        obj['value'] = this.pie_child_obj[k].goodsNum
                        this.pie_child_data.push(obj)
                        this.pie_child_color.push("rgba(242,72,125," + (1 - k * 0.1) + ")")
                    }
                    this.bblmzb2_show=true
                    setTimeout(()=>{
                        this.pie_child_fun()
                    },0)

                })
            },
            piefun() {
                let myChart1 = echarts.init(document.getElementById("pie1"));
                let option1 = {
                    color: this.pie_color,
                    grid: {
                        x: 35,
                    },
                    tooltip: {},
                    series: {
                        hoverAnimation: false,
                        selectedMode: 'single',
                        type: 'pie',
                        radius: ['40%', '60%'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                formatter: '{b}:{d}% ',
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: '#ffffff',
                            }
                        },
                        data: this.pie_data
                    }
                };
                myChart1.setOption(option1);
                myChart1.on("click", (param) => {
                    for (let k = 0; k < this.pie_obj.length; k++) {
                        if (param.name.slice(0, 8) == this.pie_obj[k].lv1Name.slice(0, 8)) {
                            console.log(1)
                            this.pie_child(this.pie_obj[k].lv1Name)
                            break
                        }
                    }
                })
            },
            pie_child_fun() {
                let myChart2 = echarts.init(document.getElementById("pie2"));
                let option2 = {
                    color: this.pie_child_color,
                    tooltip: {},
                    grid: {
                        x: 35,
                    },
                    series: {
                        hoverAnimation: false,
                        selectedMode: 'single',
                        type: 'pie',
                        radius: ['40%', '60%'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                formatter: '{b}:{d}% ',
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: '#ffffff',
                            }
                        },
                        data: this.pie_child_data
                    }
                };
                myChart2.setOption(option2);
            }

        }
    }
</script>
<style scoped lang="less">
    @import '~vuetify/dist/vuetify.min.css';
    @import '~material-design-icons-iconfont/dist/material-design-icons.css';
    @import '../assets/css/part.less';

    .top-bar {
        width: 100%;
        height: 50px;
        background-color: #fff;
        line-height: 50px;
        color: #000;
        .btn {
            width: 190px;
            height: 30px;
            position: relative;
            background: rgba(240, 240, 240, 1);
            border-radius: 15px;
            margin-right: 40px;
            margin-top: 10px;
            .other-btn {
                position: absolute;
                width: 100%;
                height: 100%;
                color: #000;
                background: rgba(240, 240, 240, 1);
                border-radius: 15px;
                font-size: 12px;
                top: 0;
                left: 0;
            }
            .tri {
                position: absolute;
                display: inline-block;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: @mainColor;
                text-align: center;
                line-height: 30px;
                top: 0;
                right: 0;
            }
        }
    }

    .part {
        box-sizing: border-box;
        &.zbxx {
            box-sizing: border-box;
            padding: 0;
            padding: 10px 55px;
            height: 80px;
            .bf {
                display: inline-block;
            }
            .zb-tx {
                width: 60px;
                height: 60px;
                border-radius: 4px;
                vertical-align: middle;
            }
            .zb-name {
                background-color: @mainColor;
                color: #fff;
                padding: 4px 11px;
                margin-left: 41px;
                border-radius: 10px;
            }
            .zb-title, .view-count {
                &:before {
                    content: "";
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    background-color: @mainColor;
                    border-radius: 50%;
                    margin-left: 65px;
                    margin-right: 5px;
                }
            }
            .right {
                margin-top: 20px;
                text-align: right;
                opacity: 0.54;
                font-size: 14px;
                p {
                    line-height: 1.3em;
                }
            }
        }
        &.zbxg {
            /*height: 940px;*/
            .data {
                xpadding: 0 55px;
                .tit {
                    text-align: center;
                }
                .bbjgfb {
                    margin-top: 20px;
                }
                .rtbb {
                    margin: auto;
                    margin-top: 81px;
                    width: 814px;
                    xborder: 1px solid;
                    box-sizing: border-box;
                    .tit {
                        color: #fff;
                        background-color: @mainColor;
                        width: 120px;
                        height: 30px;
                        line-height: 30px;
                        font-size: 14px;
                        margin: auto;
                        border-radius: 4px;
                    }
                    .bbtx {
                        width: 147px;
                        height: 147px;
                    }

                    .hot_goods {
                        margin-top: 12px;
                        text-align: left;
                        box-sizing: border-box;
                        display: inline-block;
                        xborder: 1px solid;
                        xwidth: 50%;
                        &:nth-child(2) {
                            float: left
                        }
                        &:last-child {
                            float: right
                        }
                        .info {
                            position: relative;
                            margin-top: 30px;
                            .name {
                                margin-left: 14px;
                                color: @mainColor;
                                font-size: 16px;
                                font-weight: bold;
                                .fire {
                                    margin-right: 10px;
                                    display: inline-block;
                                    color: rgb(95, 60, 60);
                                    background-color: @mainColor;
                                    width: 20px;
                                    height: 20px;
                                    border-radius: 50%;
                                    text-align: center;
                                    line-height: 23px;
                                    vertical-align: top;
                                }
                            }
                            .num {
                                margin-left: 50px;
                                color: #000;
                                font-size: 14px;
                                opacity: 0.78;
                                margin-top: 5px;
                            }
                            &:after {
                                content: "";
                                width: 4px;
                                height: 40px;
                                background-color: #e1e1e1;
                                position: absolute;
                                top: 28px;
                                left: 40px;
                            }
                        }
                    }
                }
            }
        }
    }

    .pie {
        display: inline-block;
        height: 240px;
        width: calc(50% - 2px);
        vertical-align: top;
        div {
            width: 100%;
            height: 100%;
            top: 20px;
        }
        .imgloading{
            height: 240px;
            line-height: 240px;
        }
    }

    #bar {
        height: 240px;
        width: 500px;
        margin: auto;
    }

    .zbbb {
        text-align: left;
        padding-left: 10px;
    }


</style>
<style lang="less">
    @import '../assets/css/pager.less';

    .other-btn.el-button {
        padding: 0;
        span {
            opacity: 0.54;
        }
    }

    .v-date-picker-table {
        height: auto;
    }

    .v-picker--landscape .v-picker__actions, .v-picker--landscape .v-picker__body {
        margin-left: 0px !important;
    }

    .v-picker__title.v-picker__title--landscape.blue {
        display: none !important;
    }

    .v-btn--floating .v-btn__content {
        line-height: 1;
    }
</style>