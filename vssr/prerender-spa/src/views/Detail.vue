<template>
    <Page>
        <ToTop/>
        <div class="top-bar clearfix">
            <div class="btn">
                <SelectZb selectClass="zb-class" popperClass="select-zb" @cb="goPk" placeholder="输入主播名称进行对比"
                          :forPk="true">
                </SelectZb>
                <span class="pk"><img src="/img/pk.png" alt=""></span>
            </div>
        </div>
        <Anchor :data="anchors" />
        <div class="part zbxx clearfix">
            <div class="clearfix part-name"><span>主播信息</span></div>
            <div class="left fl">
                <p class="zb-tx bkg" :style="'background-image:url(/img/anchor_img/'+$route.params.id+'.jpg)'"></p>
                <p class="zb-name" :title="detail.accountName">{{detail.accountName}}</p>
                <div class="sj">
                    <div class="fss fl">
                        <p class="tit">粉丝数</p>
                        <p class="value">
                            {{detail.fansNum>10000?parseFloat(detail.fansNum/10000).toFixed(1)+'万':detail.fansNum}}</p>
                    </div>
                    <div class="gks fr">
                        <p class="tit">单场最高观看数</p>
                        <p class="value">{{detail.viewMax}}</p>
                    </div>
                </div>
            </div>
            <div class="right fl">
                <div class="zb-zbsf"><img src="/img/sf.png" alt=""><span class="tit">主播身份：</span><span class="value">{{detail.accountIde}}</span>
                </div>
                <div class="zb-zbsf"><img src="/img/lx.png" alt=""><span class="tit">服务类型：</span><span class="value">{{detail.serviceType}}</span>
                </div>
                <div class="zb-czly"><img src="/img/ly.png" alt=""><span class="tit">垂直领域：</span><span class="value">{{detail.verticalArea}}</span>
                </div>
                <div class="zb-jg"><img src="/img/jg.png" alt=""><span class="tit">所属机构：</span><span class="value">{{detail.org=="None"?"无":detail.org}}</span>
                </div>
                <div class="zb-jg"><p class="tit"><img src="/img/js.png" alt="">自我介绍：<span
                        v-if='!detail.oneself'>无</span></p>
                    <p class="value oneself" v-if='detail.oneself'>{{detail.oneself}}</p>
                </div>
            </div>
            <div class="circle one"></div>
            <div class="circle two"></div>
            <div class="circle three"></div>
            <div class="circle four"></div>
        </div>
        <div class="part zbfx clearfix">
            <div class="clearfix part-name tit-local">
                <span>直播分析</span><span>  时间：{{dataFromDate?(dataFromDate +'~'+dataToDate):'无'}}</span></div>
            <ul class="echarts-list clearfix" v-show="zbfx_show">
                <li class="fl">
                    <p class="tit">- 近期直播趋势 -</p>
                    <div class="echart " id="echart-jqzbqs"></div>
                    <p class="con">总直播场次：{{detail_rd.liveNum?parseInt(detail_rd.liveNum).toLocaleString():''}}场</p>
                </li>
                <li class="fl">
                    <p class="tit">- 观看次数趋势 -</p>
                    <div class="echart " id="echart-gkcsqs"></div>
                    <p class="con">
                        直播平均观看量：{{detail_rd.svgViewCount?parseInt(detail_rd.svgViewCount).toLocaleString():''}}人次</p>
                </li>
                <li class="fl">
                    <p class="tit">- 直播时段场次分布 -</p>
                    <div class="echart " id="echart-gkcs"></div>
                    <p class="con">主播最常直播时间段：{{timearea}}</p>
                </li>
                <li class="fl">
                    <p class="tit">- 直播时段观看量分布 -</p>
                    <div class="echart " id="echart-gkl"></div>
                    <p class="con">主播直播观看量最高时间段：{{timearea_gkl}}</p>
                </li>
            </ul>
            <div class="imgloading" v-show="!zbfx_show">
                <img src="/img/loading.gif" alt="">
            </div>
        </div>
        <div class="part dphz clearfix">
            <div class="clearfix part-name"><span>店铺合作</span><span>  时间：{{'2018.09'}}</span></div>
            <ul class="sjtj-ul clearfix" v-show="dphz_show">
                <li class="fl"><span class="name">合作店铺数：</span><span class="value">{{detail_rd.liveShopNum?parseInt(detail_rd.liveShopNum).toLocaleString():''}}</span>
                </li>
                <li class="fl"><span class="name">合作宝贝数：</span><span class="value">{{detail_rd.liveGoodsNum?parseInt(detail_rd.liveGoodsNum).toLocaleString():''}}</span>
                </li>
                <li class="fl r" v-show="numRank>0">
                    <span class="name">合作店铺复播指数：</span>
                    <span class="value zs-height" @mouseenter="show_height=true" @mouseout="show_height=false">{{detail_rd.anchorAvgCoopNum}}</span>
                    <span class="value tip-height">
                        <i class="fa fa-arrow-up" aria-hidden="true"></i>{{numRank}}%
                    </span>
                    <div class="msg-height" v-show="show_height">
                        <p class="tit">比同行业平均水平<span>高{{Math.abs(numRank)}}%</span></p>
                        <hr>
                        <p class="con">合作店铺回购指数基于店铺重复合作次数计算得出，合作店铺回购指数越高，则可认为该主播与店铺合作效果越好，受到店铺下的信任与青睐。</p>
                        <div class="circle one"></div>
                        <div class="circle two"></div>
                    </div>
                </li>
                <li class="fl r" v-show="numRank<=0">
                    <span class="name">合作店铺复播指数：</span>
                    <span class="value zs-low" @mouseenter="show_low=true" @mouseout="show_low=false">{{detail_rd.anchorAvgCoopNum}}</span>
                    <span class="value tip-low"><i class="fa fa-arrow-down" aria-hidden="true"></i>{{Math.abs(numRank)}}%</span>
                    <div class="msg-low" v-show="show_low">
                        <p class="tit">比同行业平均水平<span>低{{Math.abs(numRank)}}%</span></p>
                        <hr>
                        <p class="con">合作店铺回购指数基于店铺重复合作次数计算得出，合作店铺回购指数越高，则可认为该主播与店铺合作效果越好，受到店铺下的信任与青睐。</p>
                        <div class="circle one"></div>
                        <div class="circle two"></div>
                    </div>
                </li>
            </ul>
            <ul class="hzdp-ul clearfix" v-show="dphz_show">
                <li class="fl">
                    <div id="wc"></div>
                </li>
                <li class="fl">
                    <div class="data-table">
                        <table class="">
                            <caption>-店铺合作次数排行-</caption>
                            <tr>
                                <th>合作排行</th>
                                <th>合作店铺</th>
                                <th>渠道<img src="/img/wenhao.png" alt="" title=""></th>
                                <th>合作次数</th>
                                <th>合作宝贝数</th>
                            </tr>
                            <tr v-for="(item,i) in dphzcs_list" :key="i">
                                <td>{{item.rank}}</td>
                                <td class="link"><a
                                        :href="item.shopUrl?(item.shopUrl.startsWith('http')?item.shopUrl:'https://'+item.shopUrl):''"
                                        target="_blank">{{item.shopName}}</a></td>
                                <td>{{item.shopChannel}}</td>
                                <td>{{item.coopNum}}</td>
                                <td>{{item.liveGoodsNum}}</td>
                            </tr>
                        </table>
                        <el-pagination
                                v-if='dphzcs_data.length>0'
                                background
                                @current-change="pageChangeHzdp"
                                :page-size="5"
                                layout="prev, pager, next"
                                :total="dphzcs_num"
                                :pager-count=5>
                        </el-pagination>
                    </div>
                </li>
            </ul>
            <div class="imgloading" v-show="!dphz_show">
                <img src="/img/loading.gif" alt="">
            </div>
        </div>
        <div class="part lmzb">
            <div class="clearfix part-name"><span>类目占比</span></div>
            <div class="select">
                <el-cascader
                        v-model="lmDefault"
                        :options="lmOption"
                        :filterable="true"
                        :selectAllLevels="true"
                        @change="lmChange"
                        expand-trigger="hover"
                        popper-class="select-lm"
                ></el-cascader>
                <!-- <i class="fa fa-chevron-circle-down" aria-hidden="true" v-if="!show"></i>
                <i class="fa fa-chevron-circle-up" aria-hidden="true" v-else></i> -->
            </div>
            <div class="echarts clearfix">
                <p class="tit">-直播宝贝本级类目占比-</p>
                <div class="echart fl" id="echart-lmzb1" v-show="lmzb_show"></div>
                <!-- <div class="echart fl" id="echart-lmzb1"></div> -->

                <div class="echart fl" id="echart-lmzb1-bar" v-show="lmzb_show"></div>
                <div class="imgloading" v-show="!lmzb_show">
                    <img src="/img/loading.gif" alt="">
                </div>
                <!-- <div class="echart fl" id="echart-lmzb2"></div> -->
            </div>
            <div class="echarts clearfix" v-show="show_child_echarts">
                <p class="tit">-直播宝贝下级类目占比-</p>
                <div class="echart fl" id="echart-lmzb2" v-show="lmzb_child_show"></div>
                <div class=" echart fl" id="echart-lmzb2-bar" v-show="lmzb_child_show"></div>
                <div class="imgloading" v-show="!lmzb_child_show">
                    <img src="/img/loading.gif" alt="">
                </div>
            </div>

        </div>
        <div class="part bbfx">
            <div class="clearfix part-name"><span>宝贝分析</span></div>
            <div class="select">
                <el-select v-model="selectLm2" filterable clearable placeholder="请选择类目进行查看" @change="bbfx_lmChange"
                           value-key="id"
                           popper-class="select-lm2">
                    <el-option
                            v-for="item in lmList2"
                            :key="item.typeId"
                            :label="item.typeName"
                            :value="item.obj">
                    </el-option>
                </el-select>
            </div>
            <div class="bbjgfb">
                <p class="tit">-宝贝价格分布-</p>
                <div class="echart" id="echart-bbjgfb" v-show="bbjgfb_show"></div>
                <div class="imgloading" v-show="!bbjgfb_show">
                    <img src="/img/loading.gif" alt="">
                </div>
            </div>
            <div class="data-table">
                <p class="tit">-宝贝详情-</p>
                <table>
                    <tr>
                        <th>直播时间</th>
                        <th>直播宝贝</th>
                        <th>直播价格</th>
                        <!--<th>日常价格</th>-->
                        <th>本场观看次数</th>
                        <th>直播回放</th>
                    </tr>
                    <tr v-if="rtbbList_page.length===0">
                        <td colspan="6"><span>没有数据</span></td>
                    </tr>
                    <tr v-for="(item,i) in rtbbList_page" :key="i">
                        <td>{{Object.keys(item)[0]}}</td>
                        <td class="zbbb link">
                            <a :href="item[Object.keys(item)[0]].goodsUrl?(item[Object.keys(item)[0]].goodsUrl.startsWith('http')?item[Object.keys(item)[0]].goodsUrl:'https://'+item[Object.keys(item)[0]].goodsUrl):''"
                               target="_blank"
                               :title="item[Object.keys(item)[0]].goodsName">
                                <img :src="item[Object.keys(item)[0]].goodsPci" alt="">
                                {{item[Object.keys(item)[0]].goodsName?
                                (item[Object.keys(item)[0]].goodsName.length>30?
                                (item[Object.keys(item)[0]].goodsName.substr(0,30)+"...")
                                :item[Object.keys(item)[0]].goodsName
                                )
                                :""
                                }}
                            </a>
                        </td>
                        <td>
                            {{item[Object.keys(item)[0]].goodsPrice?item[Object.keys(item)[0]].goodsPrice.toFixed(0):''}}
                        </td>
                        <!--<td>{{item[Object.keys(item)[0]].slowPriceMax?item[Object.keys(item)[0]].slowPriceMax.split('.')[0]:''}}</td>-->
                        <td>
                            {{item[Object.keys(item)[0]].viewCount?item[Object.keys(item)[0]].viewCount.toLocaleString():""}}
                        </td>
                        <td class="link"><a
                                :href="item[Object.keys(item)[0]].replayUrl?(item[Object.keys(item)[0]].replayUrl.startsWith('http')?item[Object.keys(item)[0]].replayUrl:'https://'+item[Object.keys(item)[0]].replayUrl):''"
                                target="_blank">{{item[Object.keys(item)[0]].title}}</a>
                        </td>
                    </tr>
                    <!-- <tr v-for="(item,i) in (new Array(5).fill(true))" :key="i">
                        <td>{{'2018.01.01'}}</td>
                        <td><a href="" target="_blank"><img src="/img/bb.jpg" alt="">{{123}}</a></td>
                        <td>{{'665元'}}</td>
                        <td>{{'665元'}}</td>
                        <td>{{123456}}</td>
                        <td><a href="" target="_blank">{{'hello'}}}</a></td>
                    </tr> -->
                </table>
                <el-pagination
                        v-if="rtbbList_page.length>0"
                        background
                        layout="prev, pager, next"
                        :total="rtbbList.length"
                        @current-change="pageChangeRtbb"
                        :page-size="rtbb_pageSize"
                >
                </el-pagination>
            </div>
        </div>
        <div class="part zbhk">
            <div class="clearfix part-name"><span>直播回看</span></div>
            <div class="zrzb">
                <p class="tit">最热直播</p>
                <ul>
                    <!-- <li v-for="(item,i) in (new Array(3)).fill(true)" :key="i" @click="goVedio(item.replayUrl)">
                       <div class="zb-img">
                           <p class="tx bkg" :style="'background-image:url(/img/anchor_img/'+zbId+'.jpg)'"></p>
                           <p class="zb-name">{{'hello hello'}}</p>
                           <p class="vedio"></p>
                       </div>
                       <p class="info">
                       <span class="date">直播日期：{{'2018.01.08'}}</span>
                       <span>观看数：{{2222}}</span></p>
                   </li> -->
                    <li v-for="(item,i) in zrzbList" :key="i"
                        @click="goVedio(item.replayUrl.startsWith('http')?item.replayUrl:'https://'+item.replayUrlitem.replayUrl)">
                        <div class="zb-img">
                            <p class="tx bkg" :style="'background-image:url(/img/anchor_img/'+zbId+'.jpg)'"></p>
                            <p class="zb-name">{{item.title}}</p>
                            <img src="/img/vedio.png" alt="" class="vedio">
                        </div>
                        <p class="info">
                            <span class="date">直播日期：{{item.time}}</span>
                            <span>观看数：{{item.viewCount?item.viewCount.toLocaleString():""}}</span>
                        </p>
                    </li>
                </ul>
            </div>
            <div class="data-table">
                <p class="tit">-近期直播- </p>
                <table>
                    <tr>
                        <th>直播时间</th>
                        <th>直播主题</th>
                        <th>观看次数</th>
                        <th>直播宝贝数</th>
                    </tr>
                    <tr v-if="jqzbList.length==0">
                        <td colspan="4"><span>没有数据</span></td>
                    </tr>
                    <tr v-for="(item,i) in jqzbList" :key="i" @click="goDetailZbxg(item.liveId,item.date)"
                        title="点击查看直播效果详情"
                        class="tr_hover">
                        <td>{{item.date}}</td>
                        <td>{{item.title}}</td>
                        <td>{{item.viewCount?item.viewCount.toLocaleString():""}}</td>
                        <td>{{item.goodNum?item.goodNum.toLocaleString():""}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="part zbs clearfix" v-if="zbCondi.id">
            <div class="clearfix part-name"><span>相关推荐</span></div>
            <div class="slider">
                <i class="fa fa-chevron-left fl prev" aria-hidden="true" @click="preZb"></i>
                <div class="zbList">
                    <ul :style="`transform: translateX(${-zbIndex*164}px);width:${1940*zbList.length/zbPageSize}px`">
                        <li v-for="(item,i) in zbList" :key="i"
                            :style="'background-image:url(/img/anchor_img/'+item.accountId+'.jpg)'"
                            @click="goZbDetail(item.accountId)" class="bkg">
                            <div class="info">
                                <p>{{item.accountName}}</p>
                                <p class="fssl"><span class="tit">粉丝：</span><span
                                        class="value">{{item.fansNum}}</span>
                                </p>
                            </div>
                            <router-link class="hover-info" :to="'/detail/'+item.accountId" target="_blank">
                                <p class="name">{{item.accountName}}</p>
                                <p class="fssl"><span class="tit">粉丝：</span><span
                                        class="value">{{item.fansNum}}</span>
                                </p>
                                <p class="zbfg">{{item.oneself}}</p>
                                <p class="more">更多详情>></p>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <i class="fa fa-chevron-right fl next" aria-hidden="true" @click="nextZb"></i>
            </div>
            <div class="toggle clearfix">
            <span :class="{disable:!noFirst,fl:true}" @click="goZbDetail(preZbId)" v-if="preZbId">&lt;查看上一主播</span>
            <span :class="{disable:!noLast,fr:true}" @click="goZbDetail(nextZbId)" v-if="nextZbId">查看下一主播&gt;</span>
            </div>
        </div>
        <!-- <div class="part zbrd clearfix">
            <div class="clearfix part-name"><span>主播热度</span></div>
            <div v-if="loadRd">加载中...</div>
            <ul v-if="!loadRd" class="tj">
                <li><p class="tit">直播场次</p>
                    <p class="value">{{parseInt(detail_rd.liveNum).toLocaleString()}}</p></li>
                <li><p class="tit">场均观看次数</p>
                    <p class="value">{{parseInt(detail_rd.svgViewCount).toLocaleString()}}</p></li>
                <li><p class="tit">直播店铺数</p>
                    <p class="value">{{parseInt(detail_rd.liveShopNum).toLocaleString()}}</p></li>
                <li><p class="tit">直播宝贝数</p>
                    <p class="value">{{parseInt(detail_rd.liveGoodsNum).toLocaleString()}}</p></li>
            </ul>
            <div class="rd zchz clearfix" v-if="detail_rd.no1ShopLiveNum>1&&!loadRd&&detail_rd.no1ShopName">
                <div class="left">
                    <p>最常合作</p>
                    <p class="numRank">TOP1</p>
                    <p class="shop">{{detail_rd.no1ShopName}}</p>
                </div>
                <div class="middle">
                    <p><img src="/img/hz.png"/> 与该店铺总合作次数 <span class="value">{{detail_rd.no1ShopLiveNum}}</span> 次</p>
                    <p><img src="/img/zb.png"/> 为该店铺直播了产品 <span class="value">{{detail_rd.no1ShopGoodsNum}}</span> 件</p>
                </div>
                <div class="right ">
                    <div class="clearfix"><p class="rank fl"><img src="/img/zbb.png"/>是该店铺的第 <span class="value">{{detail_rd.shopAnchorRank}}</span> 合作主播</p> </div>
                    <p class="cg">超过{{detail_rd.dpRank}}的主播</p>
                    <a :href="detail_rd.no1ShopUrl" class="ckdp">查看店铺</a>
                </div>
            </div>
            <div class="rd gypj clearfix" v-if="detail_rd.no1ShopLiveNum>1&&!loadRd">
                <div class="left">
                    <p>高于平均</p>
                    <p class="numRank">
                        {{numRank+'%'}}
                    </p>
                    <p class="shop">店铺平均合作次数对比</p>
                </div>
                <div class="middle">
                    <p><img src="/img/hz.png"/>{{detail.accountName}}店铺平均合作次数<span class="value">{{detail_rd.anchorAvgCoopNum}}</span> 次</p>
                    <p><img src="/img/zb.png"/>所有主播店铺平均合作次数 <span class="value">{{detail_rd.allAnchorAvgCoopNum}}</span> 次</p>
                </div>
                <div class="right">
                    <p class="zbname">{{detail.accountName}} </p>
                    <p class="yy">拥有较平均更 <span>高</span> 的直播合作回头率</p>
                    <p>更加受到店铺的信任与满意</p>
                </div>
            </div>
        </div> -->
    </Page>
</template>

<script>
    import Page from '@/components/Page.vue'
    import echarts from "echarts"
    import SelectZb from '@/components/SelectZb.vue'
    import myaxios from '../assets/js/myaxios'
    import ToTop from '@/components/ToTop.vue'
    import {
        Pagination,
        Select,
        Option,
        Cascader
    } from "element-ui"
    // import * as d3 from 'd3'
    // import * as cloud from 'd3-cloud'
    import * as wordcloud from 'echarts-wordcloud'
    import Anchor from '@/components/Anchor.vue'
    export default {
        components: {
            Page,
            ToTop,
            SelectZb,
            elPagination: Pagination,
            elSelect: Select,
            elOption: Option,
            elCascader: Cascader,
            Anchor,
        },
        data: function () {
            return {
                zbPageSize: 6,
                zbIndex: 0,
                zbList: [],
                zbCondi: {},
                zbId: "",
                msg: '主播详情',
                anchors: ["主播信息", "直播分析", "店铺合作", "类目占比", "宝贝分析", "直播回看"],
                detail: {},
                detail_rd: {},
                zrzbList: [],
                rtbbList: [],
                rtbbList_page: [],
                rtbb_pageSize: 10,
                jqzbList: [],
                video_data: [],
                video_axis: [],
                view_data: [],
                view_data_gkl: [],
                goods_price_data: [],
                goods_price_axis: [],
                pie_data: [],
                bar_data: [],
                pie_child_data: [],
                bar_child_data: [],
                pie_obj: [],
                pie_level: 1,
                pie_child_obj: [],
                loadRd: false,
                typeId: '',
                pie_color: [],
                pie_child_color: [],
                numRank: 0,
                zbTotal: 0,
                noFirst: true,
                noLast: true,
                timearea: '',
                timearea_gkl: '',
                wc_data: [],
                dphzcs_data: [],
                dphzcs_list: [],
                dphzcs_num: '',
                bar_axis: [],
                bar_child_axis: [],
                gkcsqs_data: [],
                gkcsqs_axis: [],
                show_low: false,
                show_height: false,
                lmList2: '',
                selectLm2: '',
                dataFromDate: "",
                dataToDate: "",
                lmOption: [],
                lmDefault: [],
                show_child_echarts: true,
                zbfx_show: false,
                dphz_show: false,
                lmzb_show: true,
                lmzb_child_show: true,
                bbjgfb_show: true,
                preZbId:"",
                nextZbId:"",
            }
        },
        beforeRouteUpdate(to, from, next) {
            next()
            this.goods_price_data = []
            this.goods_price_axis = []
            this.dataInit()
        },
        created() {
        },
        mounted() {
            this.dataInit()
            let myChart1 = echarts.init(document.getElementById("echart-lmzb1"));
            myChart1.on("click", (param) => {
                this.pie_child_fun(param)
            })
        },
        methods: {
            dataInit() {

                this.zbId = this.$route.params.id
                //根据匹配页传过来的条件获取主播数据
                if (this.$route.query.condi) {
                    this.zbCondi = JSON.parse(this.$route.query.condi)
                    this.quertAnchorRanking_post()
                }


                let option = {id: this.zbId, anchorId: this.zbId}
                //主播详细信息
                myaxios.post('/web/user/queryAnchorInfo', option).then(data => {
                    var res = data.data.data
                    if (res.oneself) {
                        res.oneself = res.oneself.replace('自我介绍：', '').replace('自我介绍:', '')
                        if (res.oneself.length > 100) {
                            res.oneself = res.oneself.substr(0, 100) + '...'
                        }
                    }
                    this.detail = res

                })
                //主播热度
                this.loadRd = true
                myaxios.post('/web/AnchorRank/anchorHeat', option).then(data => {
                    this.wc_data = []
                    var res = data.data.data
                    this.detail_rd = res
                    this.detail_rd.dpRank = ((this.detail_rd.shopAllCoopAnchorNum - this.detail_rd.shopAnchorRank) / this.detail_rd.shopAllCoopAnchorNum).toFixed(2)
                    this.loadRd = false
                    if (this.detail_rd.anchorAvgCoopNum - this.detail_rd.allAnchorAvgCoopNum) {
                        this.numRank = parseInt((this.detail_rd.anchorAvgCoopNum - this.detail_rd.allAnchorAvgCoopNum) * 100)
                    }
                    for (let i = 0; i < res.liveShop.length; i++) {
                        this.wc_data.push({
                            name: res.liveShop[i].shopName,
                            value: res.liveShop[i].coopNum,
                            url: res.liveShop[i].shopUrl
                        })
                    }
                    this.dphzcs_data = res.liveShop
                    this.dphzcs_num = res.liveShop.length
                    this.dphzcs_list = res.liveShop.slice(0, 5)
                    this.dphz_show = true
                    this.wc_fun()
                    // this.d3_fun(res.liveShop)

                })

                //主播带货能力
                myaxios.post('/web/AnchorRank/saleAbility', option).then(data => {
                    var res = data.data.data
                    this.pie_data = [];
                    this.bar_data = [];
                    this.bar_axis = [];
                    this.zrzbList = res.liveNewInfos

                    if (res.lv1Data.length > 0) {
                        this.lmOption = res.lv1Data.map(item => {
                            return {value: item.lv1Id, label: item.lv1Name}
                        })
                        res.lv2Data.map(ch => {
                            let par = this.lmOption.find(par => par.value == ch.lv1Id)
                            if (par) {
                                par.children = par.children ? par.children : []
                                par.children.push({value: ch.lv2Id, label: ch.lv2Name})
                            }
                        })
                        this.lmDefault = [this.lmOption[0].value]


                        this.typeId = res.lv1Data[0].lv1Id
                        this.pie(1, this.zbId, this.lmOption[0].value)
                    } else {
                        this.piefun()
                        this.pie_child_fun()
                    }


                })
                this.goodsAnalysisType_post(this.zbId, (data) => {
                    this.lmList2 = []
                    this.selectLm2 = ''
                    this.goods_price_data = []
                    this.goods_price_axis = []
                    if (data.allType.length > 0) {
                        this.lmList2 = data.allType.map(item => {
                            item.obj = {id: item.typeId, name: item.typeName, level: item.typeLevel}
                            return item
                        })
                        this.selectLm2 = this.lmList2[0].obj
                        let id = this.lmList2[0].obj.id
                        let lv = this.lmList2[0].obj.level
                        this.goodsPriceNum_post(this.zbId, id, lv)
                        this.hotSaleGoods_post(this.zbId, id, lv)
                    } else {
                        this.price_bar()
                    }


                })

                //热推宝贝
                // myaxios.post('/web/AnchorRank/hotSaleGoods', option).then(data => {
                //     var res = data.data.data
                //     this.rtbbList = res.resultList
                //     this.rtbbList_page = this.rtbbList.slice(0, this.rtbb_pageSize)
                // })

                //近期直播
                myaxios.post('/web/AnchorRank/recentLive', option).then(data => {
                    var res = data.data.data
                    this.jqzbList = res.recentLive
                })
                this.anchorActivity_post(this.zbId)

                //d3 cloud
                this.wc_fun()

                //end
            },
            pageChangeRtbb(page) {
                var begin = (page - 1) * this.rtbb_pageSize
                this.rtbbList_page = this.rtbbList.slice(begin, begin + this.rtbb_pageSize)
            },
            pageChangeHzdp(val) {
                let start_num = (val - 1) * 5;
                let end_num = val * 5;
                this.dphzcs_list = this.dphzcs_data.slice(start_num, end_num)

            },
            lmChange(value) {
                this.pie_data = []
                this.pie_child_data = []
                this.pie_color = []
                this.pie_child_color = []
                this.bar_data = []
                this.bar_child_data = []
                this.bar_axis = []
                this.bar_child_axis = []

                let id = value[value.length - 1]
                this.typeId = id
                this.pie(value.length, this.zbId, id)
            },
            bbfx_lmChange(value) {
                // console.log(value)
                let id = value.id
                let lv = value.level
                this.goods_price_data = []
                this.goods_price_axis = []
                this.goodsPriceNum_post(this.zbId, id, lv)

                //热推宝贝
                let option = {id: this.zbId, anchorId: this.zbId, level: lv, typeId: id}
                this.hotSaleGoods_post(this.zbId, id, lv)
            },
            goDetailZbxg(id, time) {
                var page = this.$router.resolve({
                    name: "detailzbxg",
                    params: {
                        id: id,
                    },
                    query: {time}
                })
                window.open(page.href, '_blank')
            },
            goZbDetail(id) {
                var page = this.$router.resolve({
                    name: "detail",
                    params: {
                        id: id,
                    },
                    query: {condi: JSON.stringify(this.zbCondi)},
                })
                window.open(page.href, '_blank')
            },
            goPk(payload) {
                //this.$router.push(`/DetailZbpk/${this.zbId}/${payload.id}`)
                var page = this.$router.resolve({
                    name: "detailzbpk",
                    params: {id: this.zbId, toid: payload.id}
                });
                window.open(page.href, '_blank');
            },
            goVedio(url) {
                window.open(url, '_blank');
            },
            //前后主播列表
            preZb() {
                if (this.zbIndex > 0) {
                    this.zbIndex--
                }
                else {
                }
            },
            nextZb() {
                var moveNum = this.zbList.length - this.zbPageSize// (this.zbList.length / this.zbPageSize - 1) * this.zbPageSize

                if (this.zbList.length == this.zbTotal) {
                    moveNum = this.zbTotal - this.zbPageSize
                }
                // console.log(moveNum, this.zbIndex, this.zbTotal)
                if (this.zbIndex < moveNum) {
                    this.zbIndex++
                }
                else {
                    if (this.zbList.length < this.zbTotal) {
                        this.quertAnchorRanking_post()
                        this.zbIndex++
                    }
                    else {
                        console.log("没有更多数据啦！")
                    }
                    //获取下一页数据
                    // setTimeout(() => {
                    //     var newList = this.zbList.map(item => {
                    //         var obj = {};
                    //         obj.name = (item.name + '').repeat(this.zbList.length / this.zbPageSize);
                    //         obj.img = item.img;
                    //         return obj
                    //     })
                    //     this.zbList.push(...newList)
                    //     this.zbIndex++
                    // }, 0)
                }
            },
            quertAnchorRanking_post() {
                //this.quertAnchorRanking_post(this.zbCondi.id, time, 0, this.zbPageSize, sortQuery, desc, fansNumMin, fansNumMax, everLiveMin, everLiveMax, liveCountMin, liveCountMax, shopCountMin, shopCountMax, goodsCountMin, goodsCountMax, org, verticalArea, goodsPriMin, goodsPriMax, shopChannel, shopChannelMin, shopChannelMax)
                let typeId = this.zbCondi.id
                let date = this.zbCondi.from.split('.')[0] + '-' + this.zbCondi.from.split('.')[1]
                let startNum = this.zbList.length
                let queryNum = startNum == 0 ? 12 : this.zbPageSize
                let sort = this.zbCondi.sort_query
                let desc = this.zbCondi.desc

                let fansNumMin = this.zbCondi.min.fss
                let fansNumMax = this.zbCondi.max.fss
                let everLiveMin = this.zbCondi.min.cjgk
                let everLiveMax = this.zbCondi.max.cjgk
                let liveCountMin = this.zbCondi.min.zbcc
                let liveCountMax = this.zbCondi.max.zbcc
                let shopCountMin = this.zbCondi.min.hzdps
                let shopCountMax = this.zbCondi.max.hzdps
                let goodsCountMin = this.zbCondi.min.zbbb
                let goodsCountMax = this.zbCondi.max.zbbb
                let org = this.zbCondi.org
                let verticalArea = this.zbCondi.lyId
                let goodsPriMin = this.zbCondi.min.bbjg
                let goodsPriMax = this.zbCondi.max.bbjg
                let shopChannel = this.zbCondi.shopChannel
                let shopChannelMin = this.zbCondi.min.shopChannelMin
                let shopChannelMax = this.zbCondi.max.shopChannelMax


                let params = {
                    typeId: typeId,
                    date: date,
                    startNum: startNum,
                    queryNum: queryNum,
                    sort: sort,
                    desc: desc
                }
                if (fansNumMin) {
                    params['fansNumMin'] = fansNumMin
                }
                if (fansNumMax) {
                    params['fansNumMax'] = fansNumMax
                }
                if (everLiveMin) {
                    params['everLiveMin'] = everLiveMin
                }
                if (everLiveMax) {
                    params['everLiveMax'] = everLiveMax
                }
                if (liveCountMin) {
                    params['liveCountMin'] = liveCountMin
                }
                if (liveCountMax) {
                    params['liveCountMax'] = liveCountMax
                }
                if (shopCountMin) {
                    params['shopCountMin'] = shopCountMin
                }
                if (shopCountMax) {
                    params['shopCountMax'] = shopCountMax
                }
                if (goodsCountMin) {
                    params['goodsCountMin'] = goodsCountMin
                }
                if (goodsCountMax) {
                    params['goodsCountMax'] = goodsCountMax
                }
                if (org) {
                    params['org'] = org
                }
                if (verticalArea) {
                    params['verticalArea'] = verticalArea
                }
                if (verticalArea) {
                    params['verticalArea'] = verticalArea
                }
                if (goodsPriMin) {
                    params['goodsPriMin'] = goodsPriMin
                }
                if (goodsPriMax) {
                    params['goodsPriMax'] = goodsPriMax
                }
                if (shopChannel) {
                    params['shopChannel'] = shopChannel
                }
                if (shopChannelMin) {
                    params['shopChannelMin'] = shopChannelMin
                }
                if (shopChannelMax) {
                    params['shopChannelMax'] = shopChannelMax
                }

                return myaxios.post('/web/AnchorRank/quertAnchorRanking', {
                    data: JSON.stringify(params)
                }).then(data => {
                    if (startNum == 0) {
                        this.zbList = []
                        this.zbTotal = data.data.data.total
                    }
                    var res = data.data.data.anchorInfo
                    res.forEach(item => {
                        if (item.oneself) {
                            item.oneself = item.oneself.replace('自我介绍：', '').replace('自我介绍:', '')
                            if (item.oneself.length > 25) {
                                item.oneself = item.oneself.substr(0, 25) + '...'
                            }
                        }

                    })
                    this.zbList = this.zbList.concat(res)
                    if (startNum == 0) {
                        this.zbIndex=this.zbList.indexOf(this.zbList.find(item=>item.accountId==this.zbId))
                        this.zbIndex=this.zbIndex==-1?0:this.zbIndex
                        if(this.zbIndex-1>=0)
                            this.preZbId=this.zbList[this.zbIndex-1].accountId
                        if(this.zbIndex+1<this.zbList.length)
                            this.nextZbId=this.zbList[this.zbIndex+1].accountId
                    }
                })
            },
            //前后主播列表
            //图表

            hyd_line() {
                //主播活跃度折线图
                let hyd_line_chart = echarts.init(document.getElementById('echart-jqzbqs'));
                let hyd_line_option = {
                    color: ['rgb(242,72,125)'],
                     grid: [{
                        x: '17%',
                        // y: '7%',
                        // width: '100%',
                        // height: '90%'
                    },],
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
                        data: this.video_axis
                    },
                    yAxis: {
                        name: '单位:场        ',
                        nameTextStyle: {
                            color: 'rgba(0,0,0,1)',
                            fontSize: 12,
                            padding: 10
                        },
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
                        symbol: 'circle',
                        type: 'line',
                        smooth: false,
                        data: this.video_data
                    }]
                };
                hyd_line_chart.setOption(hyd_line_option);
            },
            gkcsqs_line() {
                //主播活跃度折线图
                let gkcsqs_line_chart = echarts.init(document.getElementById('echart-gkcsqs'));
                let gkcsqs_line_option = {
                    color: ['rgb(242,72,125)'],
                    grid: [{
                        x: '17%',
                        // y: '7%',
                        // width: '100%',
                        // height: '90%'
                    },],
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
                        data: this.gkcsqs_axis
                    },
                    yAxis: {
                        name: '单位:次       ',
                        nameTextStyle: {
                            color: 'rgba(0,0,0,1)',
                            fontSize: 12,
                            padding: 10
                        },
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
                        symbol: 'circle',
                        type: 'line',
                        smooth: false,
                        data: this.gkcsqs_data
                    }]
                };
                gkcsqs_line_chart.setOption(gkcsqs_line_option);
            },
            hyd_bar() {
                let hyd_bar_chart = echarts.init(document.getElementById('echart-gkcs'))

                let max = Math.max.apply(null, this.view_data);

                function findall(a, x) {
                    let results = [],
                        len = a.length,
                        pos = 0;
                    while (pos < len) {
                        pos = a.indexOf(x, pos);
                        if (pos === -1) {
                            break;
                        }
                        results.push(pos);
                        pos += 1;
                    }
                    return results;
                }

                if (this.view_data) {
                    var m = findall(this.view_data, max);
                } else {
                    var m = 0
                }

                let hyd_bat_option = {
                    color: ['rgb(242,72,125)'],
                     grid: [{
                        x: '17%',
                        // y: '7%',
                        // width: '100%',
                        // height: '90%'
                    },],
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
                        data: ['0-02时', '02-04时', '04-06时', '06-08时', '08-10时', '10-12时', '12-14时', '14-16时', '16-18时', '18-20时', '20-22时', '22-24时']
                    },
                    yAxis: {
                        name: '单位:场        ',
                        nameTextStyle: {
                            color: 'rgba(0,0,0,1)',
                            fontSize: 12,
                            padding: 10
                        },
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
                            type: 'bar',
                            barWidth: 18,
                            data: this.view_data
                        }
                    ]
                }
                hyd_bar_chart.setOption(hyd_bat_option);
                return m
            },
            gkl_bar(){
                let gkl_bar_chart = echarts.init(document.getElementById('echart-gkl'))

                let max = Math.max.apply(null, this.view_data_gkl);

                function findall(a, x) {
                    let results = [],
                        len = a.length,
                        pos = 0;
                    while (pos < len) {
                        pos = a.indexOf(x, pos);
                        if (pos === -1) {
                            break;
                        }
                        results.push(pos);
                        pos += 1;
                    }
                    return results;
                }

                if (this.view_data_gkl) {
                    var m = findall(this.view_data_gkl, max);
                } else {
                    var m = 0
                }

                let gkl_bat_option = {
                    color: ['rgb(242,72,125)'],
                     grid: [{
                        x: '17%',
                        // y: '7%',
                        // width: '100%',
                        // height: '90%'
                    },],
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
                        data: ['0-02时', '02-04时', '04-06时', '06-08时', '08-10时', '10-12时', '12-14时', '14-16时', '16-18时', '18-20时', '20-22时', '22-24时']
                    },
                    yAxis: {
                        name: '单位:次        ',
                        nameTextStyle: {
                            color: 'rgba(0,0,0,1)',
                            fontSize: 12,
                            padding: 10
                        },
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
                            type: 'bar',
                            barWidth: 18,
                            data: this.view_data_gkl
                        }
                    ]
                }
                gkl_bar_chart.setOption(gkl_bat_option);
                return m
            },
            timea() {
                let max_value = this.hyd_bar();
                let max_value_gkl =this.gkl_bar();
                let arr1 = ['0-02时', '02-04时', '04-06时', '06-08时', '08-10时', '10-12时', '12-14时', '14-16时', '16-18时', '18-20时', '20-22时', '22-24时'];
                let arr2 = [];
                let arr3 = [];
                for (let i = 0; i < max_value.length; i++) {
                    arr2[i] = arr1[max_value[i]]
                }
                for (let i = 0; i < max_value_gkl.length; i++) {
                    arr3[i] = arr1[max_value_gkl[i]]
                }
                this.timearea = arr2.join(',')
                this.timearea_gkl = arr3.join(',')


            },
            price_bar() {
                let myChart = echarts.init(document.getElementById("echart-bbjgfb"))

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
                            data: this.goods_price_axis
                        },
                        yAxis: {
                            name: '宝贝数量        ',
                            nameTextStyle: {
                                color: 'rgba(0,0,0,1)',
                                fontSize: 12,
                                padding: 10
                            },
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
                            name: '宝贝数量',
                            type: 'bar',
                            barWidth: 50,
                            data: this.goods_price_data
                        }]
                    }
                ;
                myChart.setOption(option);
            },
            async pie(level, id, typeID) {
                await this.pie_post(level, id, typeID);
                this.piefun();
                if (level < 4) {
                    await this.pie_child_fun({name: this.pie_name})
                } else {
                    for (let i = 0; i < this.pie_data.length; i++) {
                        if (this.pie_data[i].name == this.pie_name) {
                            this.pie_child_data = [];
                            let pie_child_obj = {};
                            pie_child_obj['name'] = this.pie_data[i].name;
                            pie_child_obj['value'] = this.pie_data[i].value;
                            this.pie_child_data.push(pie_child_obj)
                        }
                        this.pie_child_fun()
                    }
                }
            },
            piefun() {
                let myChart1 = echarts.init(document.getElementById("echart-lmzb1"));
                let barChart1 = echarts.init(document.getElementById("echart-lmzb1-bar"));
                let total = 0
                for (let i = 0; i < this.bar_data.length; i++) {
                    total += this.bar_data[i].data[0]
                }
                let option1 = {
                    tooltip: {
                        formatter: '{b}:\n{d}% ',
                    },
                    color: this.pie_color,
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
                let barOption1 = {
                    tooltip: {
                        formatter: function (params) {
                            return params.seriesName + ': ' + ((params.value / total) * 100).toFixed(2) + '%'
                        }
                    },
                    grid: [{
                        x: '30%',
                        // y: '7%',
                        // width: '100%',
                        // height: '90%'
                    },],
                    color: this.pie_color,
                    legend: {
                        data: this.bar_axis,
                        y: 'center',
                        x: 'left',
                        orient: 'vertical',
                        selectedMode: false
                    },
                    xAxis: {
                        show: false,
                    },
                    yAxis: {
                        show: false,
                        data: []
                    },
                    series: this.bar_data
                }
                console.log('this.bar_axis', this.bar_axis)
                myChart1.clear()
                barChart1.clear()
                myChart1.setOption(option1);
                barChart1.setOption(barOption1);
            },
            async pie_child_fun(param) {
                this.pie_child_data = [];
                this.bar_child_data = [];
                this.bar_child_axis = [];
                if (param) {
                    if (param.name != '其他') {
                        for (let i = 0; i < this.pie_obj.length; i++) {
                            if (this.pie_obj[i].typeName.slice(0, 8) == param.name.slice(0, 8)) {
                                var id = this.pie_obj[i].typeId;
                                break
                            }
                        }
                        let level = parseInt(this.pie_level) + 1 + '';
                        await this.pie_child_post(level, id, 0, this.zbId, (data) => {
                            this.pie_child_obj = data.goodsTypeNum;
                            if (data.goodsTypeNum.length > 0) {
                                this.show_child_echarts = true
                                for (let i = 0; i < this.pie_child_obj.length; i++) {
                                    let obj = {};
                                    let bar_child_obj = {
                                        type: 'bar',
                                        barWidth: 18,
                                    };
                                    if (this.pie_child_obj[i].typeName.length > 7) {
                                        obj['name'] = this.pie_child_obj[i].typeName.slice(0, 8) + '...'
                                        bar_child_obj['name'] = this.pie_child_obj[i].typeName.slice(0, 8) + '...'
                                        this.bar_child_axis.push(this.pie_child_obj[i].typeName.slice(0, 8) + '...')
                                    } else {
                                        obj['name'] = this.pie_child_obj[i].typeName;
                                        bar_child_obj['name'] = this.pie_child_obj[i].typeName
                                        this.bar_child_axis.push(this.pie_child_obj[i].typeName)
                                    }
                                    obj['value'] = this.pie_child_obj[i].goodsNum;
                                    bar_child_obj['data'] = [this.pie_child_obj[i].goodsNum];
                                    this.pie_child_data.push(obj)
                                    this.bar_child_data.push(bar_child_obj);

                                    this.pie_child_color.push("rgba(242,72,125," + (1 - i * 0.1) + ")")
                                }
                            } else {
                                this.show_child_echarts = false
                            }
                            this.lmzb_child_show = true
                        })
                    }
                }
                let myChart2 = echarts.init(document.getElementById("echart-lmzb2"));
                let barChart2 = echarts.init(document.getElementById("echart-lmzb2-bar"));
                let total = 0
                for (let i = 0; i < this.bar_child_data.length; i++) {
                    total += this.bar_child_data[i].data[0]
                }
                let option2 = {
                    tooltip: {
                        formatter: '{b}:\n{d}% ',
                    },
                    color: this.pie_child_color,
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
                let barOption2 = {
                    tooltip: {
                        formatter: function (params) {
                            return params.seriesName + ': ' + ((params.value / total) * 100).toFixed(2) + '%'
                        }
                    },
                    grid: [{
                        x: '30%',
                        // y: '7%',
                        // width: '100%',
                        // height: '90%'
                    },],
                    color: this.pie_child_color,
                    legend: {
                        data: this.bar_child_axis,
                        y: 'center',
                        x: 'left',
                        orient: 'vertical',
                        selectedMode: false
                    },
                    xAxis: {
                        show: false,
                    },
                    yAxis: {
                        show: false,
                        data: []
                    },
                    series: this.bar_child_data
                }
                myChart2.clear()
                barChart2.clear()
                myChart2.setOption(option2);
                barChart2.setOption(barOption2);
            },
            pie_post(level, id, typeID) {
                this.lmzb_show = false
                return myaxios.post('/web/AnchorRank/goodsTypeNum', {
                    level: level,
                    anchorId: id,
                    id: typeID
                }).then(data => {
                    this.pie_obj = data.data.data.goodsTypeNum;

                    this.pie_level = level;

                    for (let i = 0; i < this.pie_obj.length; i++) {
                        let obj = {};
                        let bar_obj = {
                            type: 'bar',
                            barWidth: 18,
                        };
                        if (this.pie_obj[i].typeName.length > 7) {
                            obj['name'] = this.pie_obj[i].typeName.slice(0, 8) + '...'
                            bar_obj['name'] = this.pie_obj[i].typeName.slice(0, 8) + '...'
                            this.bar_axis.push(this.pie_obj[i].typeName.slice(0, 8) + '...')
                        } else {
                            obj['name'] = this.pie_obj[i].typeName;
                            bar_obj['name'] = this.pie_obj[i].typeName;
                            this.bar_axis.push(this.pie_obj[i].typeName)
                        }
                        obj['value'] = this.pie_obj[i].goodsNum;
                        bar_obj['data'] = [this.pie_obj[i].goodsNum];
                        if (this.typeId == this.pie_obj[i].typeId) {
                            this.pie_name = this.pie_obj[i].typeName;
                            obj['selected'] = true
                        }
                        this.pie_data.push(obj);
                        this.bar_data.push(bar_obj);

                        this.pie_color.push("rgba(242,72,125," + (1 - i * 0.1) + ")")

                    }
                    this.lmzb_show = true
                    // console.log(this.bar_data)
                });
            },
            pie_child_post(level, id, isChild, anchorId, cb) {
                this.lmzb_child_show = false
                return myaxios.post('/web/AnchorRank/goodsTypeNum', {
                    level: level,
                    id: id,
                    isChild: isChild,
                    anchorId: anchorId
                }).then(data => {
                    if (typeof cb == "function") {
                        cb(data.data.data)
                    }
                });
            },
            anchorActivity_post(anchorId) {
                myaxios.post('/web/AnchorRank/anchorActivity', {
                    anchorId: anchorId
                }).then(data => {
                    this.view_data = data.data.data.viewCountList
                    this.view_data_gkl = data.data.data.avgViewCountList
                    let list = data.data.data.liveNumTrend
                    this.video_data = []
                    this.video_axis = []
                    this.gkcsqs_data = []
                    this.gkcsqs_axis = []
                    if (list) {
                        for (let i = 0; i < list.length; i++) {
                            this.video_data.push(list[i].liveIdSum)
                            this.video_axis.push(list[i].days)
                        }
                    }
                    if (data.data.data.avgViewTrend) {
                        for (let k = 0; k < data.data.data.avgViewTrend.length; k++) {
                            this.gkcsqs_data.push(data.data.data.avgViewTrend[k]['viewCount'])
                            this.gkcsqs_axis.push(data.data.data.avgViewTrend[k].time)
                        }
                    }

                    this.zbfx_show = true
                    setTimeout(() => {
                        this.hyd_line()
                        this.gkcsqs_line()
                        this.timea()
                    }, 0)
                    if (this.video_axis.length > 0) {
                        this.dataFromDate = this.video_axis[0]
                        this.dataToDate = this.video_axis[this.video_axis.length - 1]
                    }
                })
            },
            goodsPriceNum_post(anchorId, typeId, level) {
                this.bbjgfb_show = false
                return myaxios.post('/web/AnchorRank/goodsPriceNum', {
                    anchorId: anchorId,
                    typeId: typeId,
                    level: level,
                }).then(data => {
                    this.goods_price_data = data.data.data.goodsPrice
                    let section = data.data.data.section
                    this.goods_price_axis = []
                    for (let i = 0; i < this.goods_price_data.length; i++) {
                        if (i == this.goods_price_data.length - 1) {
                            this.goods_price_axis.push((i * section).toLocaleString() + '元以上')
                        } else {
                            this.goods_price_axis.push((i * section).toLocaleString() + '-' + ((i + 1) * section).toLocaleString())
                        }
                    }
                    this.bbjgfb_show = true
                    setTimeout(() => {
                        this.price_bar()
                    },0)
                })
            },
            hotSaleGoods_post(zbId, typeId, level) {
                myaxios.post('/web/AnchorRank/hotSaleGoods', {anchorId: zbId, level, typeId}).then(data => {
                    var res = data.data.data
                    this.rtbbList = res.resultList
                    this.rtbbList_page = this.rtbbList.slice(0, this.rtbb_pageSize)
                })
            },
            wc_fun() {
                let chart = echarts.init(document.getElementById('wc'));
                let maskImage = new Image();
                let option = {
                    tooltip: {},
                    grid: {
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        width: 600,
                        height: 400
                    },
                    series: [{
                        type: 'wordCloud',
                        sizeRange: [6, 20],
                        rotationRange: [0, 0],
                        textPadding: 0,
                        maskImage: maskImage,
                        autoSize: {
                            enable: true,
                            minSize: 6
                        },
                        textStyle: {
                            normal: {
                                color: function () {
                                    return 'rgb(' + [
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160)
                                    ].join(',') + ')';
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        data: [{
                            name: "Jayfee",
                            value: 666
                        }, {
                            name: "Nancy",
                            value: 520
                        }]
                    }]
                }
                chart.clear()
                option.series[0].data = this.wc_data;
                maskImage.src = "/img/timg (3).jpg";
                maskImage.onload = function () {
                    chart.setOption(option);
                };
                chart.on('click', function (params) {
                    window.open(params.data.url.startsWith('http') ? params.data.url : 'https://' + params.data.url);

                });
            },
            goodsAnalysisType_post(anchorId, cb) {
                myaxios.post('/web/AnchorRank/goodsAnalysisType', {
                    anchorId: anchorId
                }).then(data => {
                    if (typeof cb == "function") {
                        cb(data.data.data)
                    }
                })
            },
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import '../assets/css/part.less';

    .page {
        * {
            xbackground-color: rgba(0, 0, 0, 0.2);
        }
        .top-bar {
            width: 100%;
            height: 50px;
            background-color: #fff;
            .btn {
                float: right;
                width: 190px;
                height: 30px;
                position: relative;
                background: rgba(240, 240, 240, 1);
                border-radius: 15px;
                margin-right: 40px;
                margin-top: 10px;
                .pk {
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
            &.zbxx {
                margin-top: 10px;
                height: 350px;
                xpadding: 20px;
                box-sizing: border-box;
                text-align: center;
                position: relative;
                .left {
                    width: 40%;
                    padding-left: 200px;
                    box-sizing: border-box;
                    .zb-tx {
                        display: inline-block;
                        width: 180px;
                        height: 180px;
                        border-radius: 50%;
                    }
                    .zb-name {
                        text-align: center;
                        line-height: 2em;
                        font-weight: bold;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .sj {
                        margin-top: 10px;
                        .tit {
                            color: #afafaf;
                            font-size: 14px;
                        }
                        .value {
                            font-size: 16px;
                            font-weight: bold;
                            color: rgba(0, 0, 0, 1);
                            line-height: 24px;
                            opacity: 0.78;
                        }
                    }
                    .zb-ppd {
                        text-align: center;
                        span {
                            font-size: 20px;
                            color: red;
                            line-height: 2em;
                        }
                    }
                }
                .right {
                    width: 60%;
                    padding-left: 50px;
                    box-sizing: border-box;
                    & > div {
                        text-align: left;
                        padding: 5px;
                        font-size: 14px;
                        .tit {
                            margin-right: 5px;
                            font-size: 14px;
                            font-weight: bold;
                            color: rgba(0, 0, 0, 1);
                            line-height: 24px;
                            opacity: 0.78;
                        }
                        img {
                            vertical-align: middle;
                            padding-right: 7px;
                        }
                        .value {
                            font-size: 16px;
                            color: rgba(0, 0, 0, 1);
                            line-height: 24px;
                            opacity: 0.78;
                            &.oneself {
                                width: 350px;
                                font-size: 14px;
                            }
                        }
                    }
                    .sc {
                        cursor: pointer;
                        .fa-heart {
                            color: red;
                        }
                    }
                    .pk {
                        cursor: pointer;
                        margin-left: 10px;
                    }
                }
                .circle {
                    position: absolute;
                    border-radius: 50%;
                    background-color: @mainColor;
                    &.one {
                        width: 300px;
                        height: 300px;
                        opacity: 0.1;
                        left: -205px;
                        bottom: -110px;
                    }
                    &.two {
                        width: 150px;
                        height: 150px;
                        opacity: 0.05;
                        left: -10px;
                        bottom: -80px;
                    }
                    &.three {
                        width: 200px;
                        height: 200px;
                        opacity: 0.1;
                        right: -50px;
                        top: -80px;
                    }
                    &.four {
                        width: 150px;
                        height: 150px;
                        opacity: 0.05;
                        right: 50px;
                        top: -100px;
                    }
                }
                overflow: hidden;
            }
            &.dphz {
                .sjtj-ul {
                    margin-top: 20px;
                    width: 100%;
                    height: 70px;
                    li {
                        position: relative;
                        xborder: 1px solid;
                        xbox-sizing: border-box;
                        width: 32%;
                        &:not(.r) {
                            margin-right: 2%;
                        }
                        height: 100%;
                        text-align: center;
                        .name {
                            font-size: 16px;
                            font-weight: bold;
                        }
                        .msg-low {
                            overflow: hidden;
                            border-radius: 4px;
                            padding: 10px 10px;
                            width: 189px;
                            height: 150px;
                            border: #c9c9c9 solid 1px;
                            position: absolute;
                            left: 65px;
                            top: 48px;
                            background: white;
                            .tit {
                                font-size: 14px;
                                span {
                                    font-size: 16px;
                                    color: #13b5b1;
                                    font-weight: bold;
                                }
                            }
                            .con {
                                margin-top: 20px;
                                font-size: 12px;
                            }
                            .circle {
                                background-color: #13b5b1;
                            }
                        }
                        .msg-height {
                            overflow: hidden;
                            border-radius: 4px;
                            padding: 10px 10px;
                            width: 189px;
                            height: 150px;
                            border: #c9c9c9 solid 1px;
                            position: absolute;
                            left: 65px;
                            top: 48px;
                            background: white;
                            .tit {
                                font-size: 14px;
                                span {
                                    font-size: 16px;
                                    color: @mainColor;
                                    font-weight: bold;
                                }
                            }
                            .con {
                                margin-top: 20px;
                                font-size: 12px;
                            }
                            .circle {
                                background-color: @mainColor;
                            }
                        }
                        .value {
                            font-size: 25px;
                            &.zs-low {
                                color: #13b5b1;
                                font-size: 25px;
                                font-weight: bold;
                            }
                            &.zs-height {
                                color: @mainColor;
                                font-size: 25px;
                                font-weight: bold;
                            }
                            &.tip-height {
                                color: @mainColor;
                                font-size: 14px;
                                font-weight: bold;
                                i {
                                    font-size: 20px;
                                }
                            ;
                            }
                            &.tip-low {
                                color: #13b5b1;
                                font-size: 14px;
                                font-weight: bold;
                                i {
                                    font-size: 20px;
                                }
                            ;
                            }
                        }
                        &:after {
                            content: "";
                            display: inline-block;
                            width: 100%;
                            height: 10px;
                            background: @mainColor;
                            background: linear-gradient(to bottom, @mainColor, #fff)
                        }
                    }
                }
                .hzdp-ul {
                    width: 100%;
                    margin-top: 20px;
                    #wc {
                        width: 600px;
                        height: 500px;
                        left: -45px;
                        top: -50px;
                    }
                    li {
                        xborder: 1px solid;
                        xbox-sizing: border-box;
                        width: 48%;
                        height: 410px;
                        &:first-child {
                            margin-right: 4%;
                        }
                        table {
                            caption {
                                background-color: @mainColor;
                                padding: 10px 0;
                                border-radius: 5px;
                                color: #fcd9e4;
                                width: 100%;
                            }
                            tr {
                                background-color: #fff;
                                height: 52px;
                                border-bottom: 1px solid #e1e1e1;
                            }
                        }
                    }
                }
                .circle {
                    position: absolute;
                    border-radius: 50%;
                    &.one {
                        width: 200px;
                        height: 200px;
                        left: -100px;
                        bottom: -100px;
                        opacity: 0.1;
                    }
                    &.two {
                        width: 100px;
                        height: 100px;
                        left: 20px;
                        bottom: -50px;
                        opacity: 0.05;
                    }
                }
            }
            &.zbrd {
                .tj {
                    padding: 0 22px;
                    box-sizing: border-box;
                    width: 100%;
                    height: 110px;
                    li {
                        text-align: center;
                        display: inline-block;
                        width: 220px;
                        height: 100%;
                        box-sizing: border-box;
                        border: 1px solid #e2e2e2;
                        border-radius: 4px;
                        padding-top: 21px;
                        &:not(:last-child) {
                            margin-right: 22px;
                        }
                        background-color: #f0f0f0;
                        &:hover {
                            background-color: #fff;
                        }
                        .tit {
                            background-color: @mainColor;
                            padding: 2px 7px;
                            border-radius: 8px;
                            font-size: 14px;
                            display: inline;
                            color: #fff;
                        }
                        .value {
                            font-size: 32px;
                            line-height: 2em;
                        }
                    }
                }
                .rd {
                    margin: auto;
                    box-sizing: border-box;
                    margin-top: 10px;
                    width: 952px;
                    height: 170px;
                    color: #fff;
                    & > div {
                        height: 100%;
                        box-sizing: border-box;
                        xborder: 1px solid;
                        xwidth: 40%;
                        float: left;
                        &:first-child {
                            width: 20%;
                        }
                    }
                    .middle {
                        width: 45%;
                        padding-left: 31px;
                        box-sizing: border-box;
                        & > p {
                            float: left;
                        }
                    }
                    .right {
                        width: 35%;
                    }
                    &.zchz {
                        background-color: #13B5B1;
                        .ckdp {
                            position: absolute;
                            right: 5px;
                            bottom: 5px;
                            font-size: 14px;
                        }
                        .middle {
                            img {
                                vertical-align: middle;
                                margin-right: 14px;
                            }
                        }
                        .right {
                            .rank {
                                img {
                                    vertical-align: middle;
                                }
                            }
                        }
                    }
                    &.gypj {
                        background-color: @mainColor;
                        .middle {
                            img {
                                vertical-align: middle;
                                margin-right: 14px;
                            }
                        }
                        .right {
                            p {
                                padding-right: 40px;
                                text-align: right;
                                &.zbname {
                                    position: absolute;
                                    right: 40px;
                                    xwidth: 100px;
                                    xheight: 30px;
                                    line-height: 30px;
                                    border: 1px solid #fff;
                                    border-radius: 4px;
                                    text-align: center;
                                    font-size: 18px;
                                    padding: 3px 10px;
                                }
                                &.yy {
                                    margin-top: 43px;
                                }
                                line-height: 1.5em;
                                font-size: 14px;
                            }
                        }
                    }
                    &.zchz, &.gypj {
                        margin-top: 21px;
                        .value {
                            font-size: 32px;
                        }
                        text-align: center;
                        .left {
                            position: relative;
                            padding-top: 30px;
                            p {
                                font-size: 16px;
                                line-height: 1.5em;
                                &.numRank {
                                    font-size: 48px;
                                    font-weight: 900;
                                }
                                &.shop {
                                    xmargin-top: 40px;
                                    font-size: 14px;
                                }
                            }
                            &:after {
                                position: absolute;
                                right: 0;
                                top: 30px;
                                content: "";
                                display: inline-block;
                                width: 1px;
                                height: 110px;
                                background-color: #fff;
                                opacity: 0.54;
                            }
                        }
                        .middle {
                            padding-top: 41px;
                            p {
                                font-size: 18px;
                                line-height: 2.1em;
                            }
                        }
                        .right {
                            padding-top: 47px;
                            position: relative;
                            .cg {
                                xmargin: auto;
                                background-color: #fff;
                                color: #13b5b1;
                                width: 150px;
                                height: 20px;
                                border-radius: 4px;
                                margin-top: 10px;
                                margin-left: 30px;
                            }
                            .rank {
                                font-size: 18px;
                            }
                        }
                    }
                }
            }
            &.zbfx {
                padding: 20px 5px;
                .tit-local {
                    margin-left: 50px;
                }
                .echarts-list {
                    width: 100%;
                    li {
                        p {
                            text-align: center;
                        }
                        width: 50%;
                        box-sizing: border-box;
                        .echart {
                            box-sizing: border-box;
                            width: 100%;
                            height: 280px;
                        }
                        .con {
                            color: @mainColor;
                            padding-bottom: 20px;
                        }
                    }
                }

            }
            &.lmzb {
                xheight: 1020px;
                .tit {
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                }
                .echarts {
                    width: 100%;
                    box-sizing: border-box;
                    .tit {
                        font-size: 14px;
                        font-weight: bold;
                        color: rgba(0, 0, 0, 1);
                        line-height: 24px;
                        opacity: 0.78;
                        text-align: left;
                    }
                    .echart {
                        box-sizing: border-box;
                        width: 50%;
                        height: 270px;
                    }
                }

            }
            &.zbhk {
                .tit {
                    width: 50%;
                    display: inline-block;
                    text-align: left;
                    font-size: 14px;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.78;
                }
                table {
                    tr:not(:first-child) {
                        cursor: pointer;
                    }
                    tr {
                        height: 40px;
                        line-height: 40px;
                    }
                }
                .zrzb {
                    margin-bottom: 50px;
                    .tit {
                        width: 120px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        color: #fff;
                        background-color: @mainColor;
                        margin: auto;
                        margin-top: 30px;
                        border-radius: 4px;
                    }
                    ul {
                        padding-top: 20px;
                        box-sizing: border-box;
                        li {
                            display: inline-block;
                            cursor: pointer;
                            &:not(:last-child) {
                                margin-right: 35px;
                            }
                            .zb-img {
                                position: relative;
                                width: 300px;
                                height: 200px;
                                .tx {
                                    width: 100%;
                                    height: 100%;;
                                    border-radius: 4px;
                                }
                                .zb-name {
                                    position: absolute;
                                    bottom: 0;
                                    width: 100%;
                                    height: 20px;
                                    background-color: rgba(0, 0, 0, 0.5);
                                    color: #fff;
                                    text-align: center;
                                    font-size: 12px;
                                    line-height: 20px;
                                }
                                .vedio {
                                    position: absolute;
                                    left: 120px;
                                    top: 70px;
                                    // &:after {
                                    //     position: absolute;
                                    //     content: "";
                                    //     top: 15px;
                                    //     left: 18px;
                                    //     border-left: 15px solid transparent;
                                    //     border-right: 15px solid transparent;
                                    //     border-bottom: 30px solid #fff;
                                    //     border-radius: 5px;
                                    //     transform: rotate(90deg);
                                    // }
                                }
                            }
                            .info {
                                text-align: center;
                                font-size: 12px;
                                margin-top: 10px;
                                span {
                                    text-align: center;
                                    &.date {
                                        &:after {
                                            content: "";
                                            width: 1px;
                                            height: 10px;
                                            display: inline-block;
                                            margin: 0 30px;
                                            background-color: #fff;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            &.bbfx {
                .tit {
                    font-size: 14px;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.78;
                    text-align: left;
                }
                .bbjgfb {
                    margin-top: 50px;
                    width: 100%;
                    box-sizing: border-box;
                    .echart {
                        box-sizing: border-box;
                        width: 100%;
                        height: 270px;
                    }
                }
            }
            &.zbs {
                xheight: 260px;
                padding: 30px 10px;
                .part-name {
                    padding: 10px 55px;
                }
                .slider {
                    position: relative;
                    .prev, .next {
                        position: absolute;
                        top: 45%;
                        cursor: pointer;
                        user-select: none;
                        font-size: 40px;
                        color: #e1e1e1;
                    }
                    .prev {
                        left: 0;
                    }
                    .next {
                        right: 0;
                    }
                    .zbList {
                        position: relative;
                        height: 200px;
                        margin: auto;
                        width: 970px; //只显示6个
                        overflow: hidden;
                        ul {
                            box-sizing: border-box;
                            position: absolute;
                            transform: translateX(0);
                            transition: transform .3s linear;
                            height: 200px;
                            li {
                                cursor: pointer;
                                box-sizing: border-box;
                                display: inline-block;
                                width: 150px;
                                height: 100%;
                                border-radius: 4px;
                                position: relative;
                                &:not(:last-child) {
                                    margin-right: 14px;
                                }
                                .info {
                                    position: absolute;
                                    bottom: 0;
                                    width: 100%;
                                    height: 50px;
                                    background-color: #000;
                                    opacity: 0.54;
                                    color: #fff;
                                    text-align: center;
                                    font-size: 14px;
                                    padding-top: 8px;
                                    box-sizing: border-box;
                                    .fssl {
                                        font-size: 12px;
                                    }

                                }
                                &:hover {
                                    .hover-info {
                                        top: 0;
                                    }
                                }
                                .hover-info {
                                    transition: top .1s linear;
                                    position: absolute;
                                    border-radius: 4px;
                                    width: 100%;
                                    height: 100%;
                                    background-color: @mainColor;
                                    top: 100%;
                                    left: 0;
                                    color: #fff;
                                    font-size: 12px;
                                    padding: 10px 14px;
                                    text-align: center;
                                    box-sizing: border-box;
                                    line-height: 1.5;
                                    .name {
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin-top: 20px;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                    }
                                    .zbfg {
                                        margin-top: 30px;
                                        text-align: left;
                                    }
                                    .more {
                                        margin-top: 20px;
                                        text-align: center;
                                    }

                                }
                            }
                        }
                    }
                }
                .toggle {
                    margin-top: 10px;
                    span {
                        cursor: pointer;
                        color: @mainColor;
                        text-decoration: underline;
                        &.disable {
                            color: gray;
                            cursor: not-allowed;
                        }
                    }
                }
            }
        }
    }

    .zbbb {
        text-align: left;
        padding-left: 10px;
    }

    .data-table table .tr_hover:hover {
        background: @mainColor;
        td {
            color: white;
        }
    }


</style>
<style lang="less">
    @import '../assets/css/pager.less';

    .select-zb {
        padding: 10px;
    }

    .zb-class {
        .el-input__inner {
            width: 190px;
            height: 30px;
            line-height: 30px;
            border-radius: 15px;
            background: rgba(240, 240, 240, 1);
            color: #000;
            border: none;
        }
        position: absolute;
        width: 100%;
        height: 100%;

        border-radius: 15px;
        font-size: 12px;
        top: 0;
        left: 0;
    }

    .lmzb, .bbfx {
        position: relative;
        .select {
            position: absolute;
            top: 15px;
            left: 140px;
            .el-select {
                input {
                    width: 170px;
                    height: 30px;
                    line-height: 30px;
                    outline: none;
                }
                .el-input__icon {
                    line-height: 30px;
                }
            }
        }

    }

    .select {
        width: 170px;
        height: 30px;
        .el-cascader {
            line-height: 30px;
            .el-input__icon {
                line-height: 30px;
            }
            .el-input__inner {
                height: 30px;
            }
        }
        .el-cascader .el-input.is-focus .el-input__inner {
            border-color: @mainColor;
        }
        .el-input.is-active .el-input__inner, .el-input__inner:focus {
            border-color: @mainColor;
        }
        .el-select .el-input.is-focus .el-input__inner {
            border-color: @mainColor;
        }
    }

    .select-lm, .select-lm2 {
        .el-cascader-menu__item.is-active {
            color: @mainColor;
        }
        .el-select-dropdown__item.selected {
            color: @mainColor;
        }
        .el-cascader-menu__item:focus:not(:active), .el-cascader-menu__item:hover {
            background-color: @mainColor;
            color: #fff;
        }
        .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
            background-color: @mainColor;
            color: #fff;
        }
        .el-select-dropdown__item {
            padding: 0 10px;
        }
    }
</style>