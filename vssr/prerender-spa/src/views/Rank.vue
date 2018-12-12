<template>
    <Page @click.native="activeBbjgOne=false;activeBbjgTwo=false;" :headerShadow="false">
        <ToTop/>
        <div class="top-bar">
            <div class="bar">
                <SearchBar @cb="searchBar" :selectCatg="catgs"/>
            </div>
        </div>
        <div class="tj-bar  pa">
            <div class="clearfix total">
                <p class="fl"><span>总合作主播：{{zbCount.toLocaleString()}}</span>&nbsp;&nbsp;<span>总直播场次：{{liveCount.toLocaleString()}}</span>
                </p>
                <p class="fr">
                    <router-link
                            :to="{ name: 'catg', params: { from: 1 },query:{catgs:$route.query.catgs,from:$route.query.from,to:$route.query.to}}">
                        查看品类行情>
                    </router-link>
                </p>
            </div>
            <div class="hr"></div>
            <h3>主播匹配结果:已匹配到{{total?total.toLocaleString():0}}个主播</h3>
            <div class="tags" v-show="tags_show">
                <el-tag
                        closable
                        @close="handleAllClose()"
                >全部清除
                </el-tag>
                <el-tag
                        :key="tag"
                        v-for="tag in dynamicTags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                >{{tag}}
                </el-tag>
            </div>
            <div class="search-bar">
                <span class="bt">筛选条件:</span>
                <span class="fans">粉丝数:</span>
                <SelectNumRange select-ref="fss" :options="fssList" @cb="searchFss"
                                :defaultNumRange.sync="defaultValue.fss"/>
                <span class="view">场均观看次数:</span>
                <SelectNumRange select-ref="cjgk" :options="cjgkcsList" @cb="searchCjgk"
                                :defaultNumRange.sync="defaultValue.cjgk"/>
                <span class="video">直播场次数:</span>
                <!--<SelectNumRange select-ref="zbbb" :options="zbbbcsList" @cb="searchZbcc"/>-->
                <SelectNumRange select-ref="zbcc" :options="zbcsList" @cb="searchZbcc"
                                :defaultNumRange.sync="defaultValue.zbcc"/>
                <span class="shop">合作渠道:</span>
                <!--<SelectNumRange select-ref="zbcc" :options="zbcsList" @cb="searchHzdps"/>-->
                <CascaderNumRange :options="hzdpList" @cb="searchHzdps" :value.sync="defaultValue.hzdps"/>
                <span class="goods">直播宝贝数:</span>
                <!--<CascaderNumRange :options="hzdpList" @cb="searchZbbb" value="请选择"/>-->
                <SelectNumRange select-ref="zbbb" :options="zbbbcsList" @cb="searchZbbb"
                                :defaultNumRange.sync="defaultValue.zbbb"/>
                <span class="org">选择机构:</span>
                <SelectIn :options="jgList" inPlaceholder="请输入机构名称" @cb="searchJg"
                          :optionKey="{label:'org',value:'org'}" :defaultValue.sync="defaultValue.jg"/>
                <span class="area">选择领域:</span>
                <SelectIn :options="czly" inPlaceholder="请输入领域名称" @cb="searchLy"
                          :optionKey="{label:'verticalArea',value:'verticalArea'}"
                          :defaultValue.sync="defaultValue.ly"/>
                <!--<div class="jg clearfix">-->
                <!--<div class="hidePanel" v-show="showjgtj" @click="showjgtj=false"></div>-->
                <!--<div class="fr jgtj" :style="showjgtj?'z-index: 9999':''">-->
                <!--<span @click="jgtj_click">价格推荐</span>-->
                <!--<div id="echart-jgtj" v-show="showjgtj">我是图表</div>-->
                <!--</div>-->
                <!--<div :class="{active:activeBbjgOne||activeBbjgTwo,fr:true,bbjg:true} "-->
                <!--:style="showjgtj?'z-index: 9999':''">-->
                <!--<span>宝贝价格（￥）:</span>-->
                <!--<input type="text" placeholder="MIN" v-model="condi.min.bbjg" @click.stop="activeBbjgOne=true"-->
                <!--@input="condi.min.bbjg=condi.min.bbjg.replace(/[^0-9-]+/,'')">-<input type="text"-->
                <!--placeholder="MAX"-->
                <!--v-model="condi.max.bbjg"-->
                <!--@click.stop="activeBbjgTwo=true"-->
                <!--@input="condi.min.bbjg=condi.min.bbjg.replace(/[^0-9-]+/,'')">-->
                <!--<input type="button" value="确定" v-show="activeBbjgOne||activeBbjgTwo" @click="init();search()"/>-->
                <!--</div>-->
                <!--</div>-->
                <div class="sort-list fl">
                    <p>排序:</p>
                    <div :class="{sort:sort_active2,sort_active:sort_active1}" @click="sortactive(1)"><img
                            src="/img/asc.png" alt=""></div>
                    <div :class="{sort:sort_active1,sort_active:sort_active2}" @click="sortactive(2)"><img
                            src="/img/desc.png" alt=""></div>
                    <span v-for="(item,i) in sortList" :class="{active:sort==i}" :key="i" @click="sort=i;querysort(i)">{{item.label}}</span>
                </div>
            </div>
        </div>
        <ul v-show="zbList.length>0">
            <li v-for="(item ,i) in zbList" :key="i" class="clearfix zb-item">
                <div class="part1">
                    <p class="zb-ppd">
                        <span class="span1">匹配度</span><span class="span2">{{parseInt(item.suitability*100)}}%</span>
                    </p>
                    <p :class="{first:i==0,second:i==1,third:i==2,rank:i>2}">{{i+1}}</p>
                </div>
                <div class="part2">
                    <p class="zb-tx image" @click="goDetail(item.accountId)" title="进入主播详情"
                       :style="'background-image:url(/img/anchor_img/'+item.accountId+'.jpg)'"></p>
                    <p class="zb-name">{{item.accountName.length>7?item.accountName.slice(0, 7) +
                        '...':item.accountName}}</p>
                    <p @click="goDetail(item.accountId)" class="zbxq">主播详情</p>
                    <!--<div>-->
                    <!---->
                    <!--&lt;!&ndash; <router-link :to="'/detail/'+item.id" target="_blank">主播详情</router-link> &ndash;&gt;-->
                    <!--</div>-->
                </div>
                <div class="part3">
                    <div>
                        <div class="shu"></div>
                        <span class="zb-bt">主播信息</span>

                        <div v-show="!item.isCollect" class="unactive" @click="colZb(i,0)">
                           <span class="sc"><i
                                   class="fa fa-heart"></i></span>
                        </div>
                        <div v-show="item.isCollect" class="isactive" @click="colZb(i,1)">
                        <span class="sc"><i
                                class="fa fa-heart"></i></span>
                        </div>
                        <div :class="{active:pkList.indexOf(i)>-1,pk:true}" @click="addToPK(i)">
                            <span>PK</span>
                        </div>
                    </div>
                    <!--<p class="zb-fss">-->
                    <!--<span class="tit">粉丝数:</span><span class="value">{{item.fansNum.toLocaleString()}}</span>-->
                    <!--</p>-->
                    <!--<p class="zb-other" v-show="sort>-1&&sortList[sort].value=='cjgks'">-->
                    <!--<span class="tit">场均观看次数:</span><span class="value">{{parseInt(item.ever_live).toLocaleString()}}</span>-->
                    <!--</p>-->
                    <!--<p class="zb-other" v-show="sort>-1&&sortList[sort].value=='zbccs'">-->
                    <!--<span class="tit">直播场次数:</span><span class="value">{{item.live_count.toLocaleString()}}</span>-->
                    <!--</p>-->
                    <!--<p class="zb-other" v-show="sort>-1&&sortList[sort].value=='hzdps'">-->
                    <!--<span class="tit">合作店铺数:</span><span class="value">{{item.shop_count.toLocaleString()}}</span>-->
                    <!--</p>-->
                    <!--<p class="zb-other" v-show="sort>-1&&sortList[sort].value=='zbbbs'">-->
                    <!--<span class="tit">直播宝贝数:</span><span class="value">{{item.goods_count.toLocaleString()}}</span>-->
                    <!--</p>-->

                    <p class="zb-fss">
                        <span class="tit">粉丝数:</span><span class="value">{{item.fansNum.toLocaleString()}}</span>
                    </p>
                    <p class="zb-cjgkcs fr">
                        <span class="tit">场均观看次数:</span><span class="value">{{parseInt(item.ever_live).toLocaleString()}}</span>
                    </p>
                    <div class="zb-div">
                        <p class="zb-zbccs">
                            <span class="tit">直播场次数:</span><span
                                class="value">{{item.live_count.toLocaleString()}}</span>
                        </p>
                        <p class="zb-hzdps">
                            <span class="tit">合作店铺数:</span><span
                                class="value">{{item.shop_count.toLocaleString()}}</span>
                        </p>
                        <p class="zb-zbbbs fr">
                            <span class="tit">直播宝贝数:</span><span
                                class="value">{{item.goods_count.toLocaleString()}}</span>
                        </p>
                    </div>
                    <div>
                        <p class="zb-jg"><span class="tit">主播机构：</span><span
                                class="value">{{item.org?item.org:"无"}}</span></p>
                        <p class="zb-czly"><span class="tit">垂直领域：</span><span
                                class="value">{{item.verticalArea}}</span></p>
                        <p class="zb-zbsf"><span class="tit">主播身份：</span><span
                                class="value">{{item.accountIde}}</span></p>
                    </div>
                </div>
                <div class="part4"></div>
                <div class="part5">
                    <div class="shu"></div>
                    <p class="tit">近期直播</p>
                    <img src="/img/wenhao.png" alt="" title="更多直播请查看主播详情">
                    <ul>
                        <li v-for="(it,i) in item.liveId" :key="i" class="jqzb-item">
                            <div class="libox">
                                <router-link :to="'/detailzbxg/'+it+`?time=${$route.query.from}`" target="_blank">
                                    {{item.title[i].length>10?item.title[i].slice(0, 11)+'...':item.title[i]}}
                                </router-link>
                                <span class="fr">{{parseInt(item.viewCount[i])>10000?(parseInt(item.viewCount[i])/10000).toFixed(2)+'万观看':parseInt(item.viewCount[i]).toLocaleString()+'观看'}}</span>
                            </div>
                            <div class="heng" v-show="i!=2"></div>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <div v-show="parseInt(total)===0&&!loading" class="notfound">
            <img src="/img/no-zb.png" alt="">
        </div>
        <div class="pk-list" v-show="pkShow">
            <p class="tit">- 主播对比 - </p>
            <i class="fa fa-times gb" @click="pkShow=false"></i>

            <div :class="{not:item==null,item:true}" v-for="(item,i) in pkList" :key="i">
                <div v-if="item!=null">
                    <i class="fa fa-times xx" @click="removePK(item)"></i>
                    <p class="zb-tx"
                       :style="'background-image:url(/img/anchor_img/'+zbList[item].accountId+'.jpg)'"></p>
                    <p class="zb-name">{{zbList[item].accountName}}</p>
                </div>
                <div v-else>
                    <p class="zb-tx" style="background-color:#ccc"><img src="/img/default_tx.png" alt=""
                                                                        style="text-align: center;line-height: 80px">
                    </p>
                    <p style="color:transparent;">1</p>
                </div>
                <div class="heng" v-show="i!=1"></div>
            </div>

            <p class="ksdb" v-if="pkList.indexOf(null)==-1" style="color:white;">
                <router-link :to="`/detailzbpk/${zbList[pkList[0]].accountId}/${zbList[pkList[1]].accountId}`"
                             target="_blank"><span>开始对比</span><i class="fa fa-caret-right" aria-hidden="true"></i>
                </router-link>
            </p>
            <p class="qkdb" v-show="!pkList.every(item=>item==null)" @click="pkList=[null,null]">清空对比栏</p>
        </div>
        <div v-show="pkShow===false" class="pk-button" @click="pkShow=true">
            <i class="fa fa-plus" aria-hidden="true"></i>
        </div>
        <div class="load-more" @click="search()" v-if="total!==zbList.length&&!loading">
            <span>点击加载更多</span>
        </div>
        <div class="loading-img" v-if="loading">
            <img class="apng-image" src="/img/zb-loading.png" alt="">
        </div>
    </Page>
</template>
<script>
    import Page from '@/components/Page.vue';
    import SearchBar from '@/components/SearchBar.vue';
    import SelectNumRange from '@/components/SelectNumRange.vue';
    import CascaderNumRange from '@/components/CascaderNumRange.vue';
    import SelectIn from '@/components/SelectIn.vue';
    import moment from 'moment'
    import myaxios from "../assets/js/myaxios";
    import echarts from "echarts";
    import ToTop from '@/components/ToTop.vue';
    import {
        Tag
    } from "element-ui"

    export default {
        components: {
            Page,
            SearchBar,
            SelectIn,
            SelectNumRange,
            CascaderNumRange,
            ToTop,
            elTag: Tag,
        },
        data: function () {
            return {
                zbCount: '',
                liveCount: '',
                condi: {
                    min: {
                        fss: "",
                        cjgk: "",
                        zbcc: "",
                        zbbb: "",
                        hzdps: "",
                        bbjg: ""
                    },
                    max: {
                        fss: "",
                        cjgk: "",
                        zbcc: "",
                        zbbb: "",
                        hzdps: "",
                        bbjg: ""
                    },
                },
                catgs: [],
                fssList: [],
                cjgkcsList: [],
                zbcsList: [],
                zbbbcsList: [],
                hzdpList: [],
                jgList: [],
                selectHzdp: [],
                czly: [],
                sort: 0,
                sortList: [{label: "匹配度", value: "ppd"}, {label: "粉丝数", value: "fss"}, {
                    label: "场均观看次数",
                    value: "cjgks"
                }, {label: "直播场次数", value: "zbccs"}, {label: "合作店铺数", value: "hzdps"}, {
                    label: "直播宝贝数",
                    value: "zbbbs"
                }],

                activeBbjgOne: false,
                activeBbjgTwo: false,
                sort_active1: true,
                sort_active2: false,

                showjgtj: false,

                zbList: [],
                sc: false,
                pkList: [null, null],
                pkShow: null,

                loading: true,
                currentNum: 0,
                jgtj_data: '',
                time: '',
                level: '',
                typeId: '',
                total: '',
                desc: 0,
                sort_query: 'index1',
                defaultValue: {},
                dynamicTags: [],
                tags_show:false
            }
        },
        created() {
            //首页过来绑定类目条件
            // 组件创建完后获取数据
            this.dataInit()
            // this.searchCon()

        },
        mounted() {
            //this.dataInit()
        },
        beforeRouteUpdate(to, from, next) {
            next()
            var catgList = this.$route.query.catgs + ''
            if (catgList) {
                this.catgs = catgList.split(',').map(item => item = item - '')//转为为数字
            }
        },
        methods: {
            //删除TAG
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                if (this.dynamicTags.length===0){
                    this.tags_show=false
                }
                if (tag === '粉丝数') {
                    this.defaultValue.fss = ''
                    this.condi.max.fss = ''
                    this.condi.min.fss = ''
                }
                if (tag === '场均观看次数') {
                    this.defaultValue.cjgk = ''
                    this.condi.max.cjgk = ''
                    this.condi.min.cjgk = ''
                }
                if (tag === '直播场次数') {
                    this.defaultValue.zbcc = ''
                    this.condi.max.zbcc = ''
                    this.condi.min.zbcc = ''
                }
                if (tag === '直播宝贝数') {
                    this.defaultValue.zbbb = ''
                    this.condi.max.zbbb = ''
                    this.condi.min.zbbb = ''
                }
                if (tag === '合作渠道') {
                    this.defaultValue.hzdps = ''
                    this.condi.hzdpId = ''
                    this.condi.max.hzdps = ''
                    this.condi.min.hzdps = ''
                }
                if (tag === '机构') {
                    this.defaultValue.jg = ''
                    this.condi.jgId = ''
                }
                if (tag === '领域') {
                    this.defaultValue.ly = ''
                    this.condi.lyId = ''
                }
                this.init()
                this.search()
            },
            handleAllClose() {
                this.tags_show=false
                this.dynamicTags = []
                this.defaultValue = {}
                this.condi.max = {}
                this.condi.min = {}
                this.condi.hzdpId = ''
                this.condi.lyId = ''
                this.condi.jgId = ''
                this.init()
                this.search()
            },
            searchCon() {
                myaxios.post('/web/AnchorRank/searchCon').then(data => {
                    var res = data.data.data
                    //console.log(res)
                    this.fssList = this.numRange(res.fansNum)
                    this.fssList.unshift({label: "全部", value: "全部"})

                    this.cjgkcsList = this.numRange(res.watckAvgNum)
                    this.cjgkcsList.unshift({label: "全部", value: "全部"})

                    this.zbcsList = this.numRange(res.liveNum)
                    this.zbcsList.unshift({label: "全部", value: "全部"})

                    this.zbbbcsList = this.numRange(res.liveGoodsNum)
                    this.zbbbcsList.unshift({label: "全部", value: "全部"})

                    this.jgList = res.org
                    this.jgList.unshift({org: "全部", org: "全部"})

                    this.czly = res.verticalArea
                    this.czly.unshift({verticalArea: "全部", verticalArea: "全部"})

                    this.hzdpList = res.cooperateShop.filter(item => item).map(item => {
                        if (item) {
                            let newObj = {}
                            newObj.label = item.shopName
                            newObj.value = item.shopName
                            newObj.children = this.numRange(res.cooperateShopNum.filter(a => a.shopName == item.shopName))
                            return newObj
                        }
                    })
                    this.hzdpList.unshift({label: "全部", value: "全部"})

                })
            },
            dataInit() {
                var catgList = this.$route.query.catgs + ''
                if (catgList) {
                    this.catgs = catgList.split(',').map(item => item = item - '')//转为为数字
                }
                this.time = this.$route.query.from.split('.')[0] + '-' + this.$route.query.from.split('.')[1];
                this.level = (this.$route.query.catgs + '').split(',').length;
                this.typeId = (this.$route.query.catgs + '').split(',')[this.level - 1];

                this.condi.id = this.catgs[this.catgs.length - 1]
                this.condi.from = this.$route.query.from
                this.condi.to = this.$route.query.to
                this.currentNum = 0
                this.zbList = []
                this.search()
            },
            //数值范围数组转化
            numRange(list) {
                return list.map(item => {
                    var newItem = {}
                    newItem.min = item.valueMin
                    newItem.max = item.valueMax
                    newItem.value = (item.valueMin ? item.valueMin : '0') + (item.valueMax ? ('-' + item.valueMax) : '')
                    newItem.label = (item.MinName ? item.MinName : '0') + (item.MaxName ? ('-' + item.MaxName) : '+')
                    return newItem
                })
            },
            //收藏主播
            colZb(i, flag) {
                if (flag === 0) {
                    if (this.zbList[i]) {
                        myaxios.post('/web/AnchorRank/collectionAnchor', {id: this.zbList[i].accountId}).then(data => {
                            var res = data.data
                            if (res.code == 0) {
                                this.$set(this.zbList[i], 'isCollect', true);
                            }
                            else {
                                console.log("收藏失败:" + res.msg)
                            }
                        })
                    }
                    else {
                        console.log("主播不存在！")
                    }
                } else if (flag === 1) {
                    if (this.zbList[i]) {
                        myaxios.post('/web/AnchorRank/collectionAnchor', {
                            id: this.zbList[i].accountId,
                            flag: 1
                        }).then(data => {
                            var res = data.data
                            if (res.code == 0) {
                                this.$set(this.zbList[i], 'isCollect', false);
                            }
                            else {
                                console.log("取消收藏失败:" + res.msg)
                            }
                        })
                    }
                    else {
                        console.log("主播不存在！")
                    }
                }

            },
            goDetail(id) {
                this.condi.sort_query = this.sort_query
                this.condi.desc = this.desc
                var page = this.$router.resolve({
                    name: "detail",
                    params: {
                        id: id
                    },
                    query: {condi: JSON.stringify(this.condi)},
                })
                window.open(page.href, '_blank')
            },
            //search
            init() {
                this.zbList = [];
                this.currentNum = 0;
                this.pkList = [null, null]
            },
            searchBar(condi) {
                this.defaultValue = {}

                // this.condi.min.bbjg = ''
                // this.condi.max.bbjg = ''

                this.condi = Object.assign(this.condi, condi)
                this.init()
                this.sort = 0
                this.sort_query = 'index1'
                this.zbCount = ''
                this.liveCount = ''
                this.condi.hzdpId = ''
                this.condi.lyId = ''
                this.condi.jgId = ''
                this.condi.min = {}
                this.condi.max = {}
                this.dynamicTags = []

                this.searchCon()
                this.search()
                //axios获取数据
            },
            searchFss(payload) {
                if (!this.tags_show){
                    this.tags_show=true
                }
                this.condi.min.fss = payload.min
                this.condi.max.fss = payload.max
                this.init()
                this.sort = 1
                this.sort_query = 'fans_num'
                if (this.dynamicTags.indexOf('粉丝数') === -1) {
                    this.dynamicTags.push('粉丝数')
                }
                if (!payload.min && !payload.max) {
                    this.dynamicTags.splice(this.dynamicTags.indexOf('粉丝数'), 1)
                    if (this.dynamicTags.length===0){
                        this.tags_show=false
                    }
                }
                this.search()
            },
            searchCjgk(payload) {
                if (!this.tags_show){
                    this.tags_show=true
                }
                this.condi.min.cjgk = payload.min
                this.condi.max.cjgk = payload.max
                this.init()
                this.sort = 2
                this.sort_query = 'ever_live'
                if (this.dynamicTags.indexOf('场均观看次数') === -1) {
                    this.dynamicTags.push('场均观看次数')
                }
                if (!payload.min && !payload.max) {
                    this.dynamicTags.splice(this.dynamicTags.indexOf('场均观看次数'), 1)
                    if (this.dynamicTags.length===0){
                        this.tags_show=false
                    }
                }
                this.search()
            },
            searchZbcc(payload) {
                if (!this.tags_show){
                    this.tags_show=true
                }
                this.condi.min.zbcc = payload.min
                this.condi.max.zbcc = payload.max
                this.init()
                this.sort = 3
                this.sort_query = 'live_count'
                if (this.dynamicTags.indexOf('直播场次数') === -1) {
                    this.dynamicTags.push('直播场次数')
                }
                if (!payload.min && !payload.max) {
                    this.dynamicTags.splice(this.dynamicTags.indexOf('直播场次数'), 1)
                    if (this.dynamicTags.length===0){
                        this.tags_show=false
                    }
                }
                this.search()
            },
            searchZbbb(payload) {
                if (!this.tags_show){
                    this.tags_show=true
                }
                this.condi.min.zbbb = payload.min
                this.condi.max.zbbb = payload.max
                this.init()
                this.sort = 5
                this.sort_query = 'goods_count'
                if (this.dynamicTags.indexOf('直播宝贝数') === -1) {
                    this.dynamicTags.push('直播宝贝数')
                }
                if (!payload.min && !payload.max) {
                    this.dynamicTags.splice(this.dynamicTags.indexOf('直播宝贝数'), 1)
                    if (this.dynamicTags.length===0){
                        this.tags_show=false
                    }
                }
                this.search()
            },
            searchHzdps(payload) {
                if (!this.tags_show){
                    this.tags_show=true
                }
                this.condi.hzdpId = payload.shop
                this.condi.min.hzdps = payload.min
                this.condi.max.hzdps = payload.max
                this.init()
                this.sort = 4
                this.sort_query = 'shop_count'
                if (this.dynamicTags.indexOf('合作渠道') === -1) {
                    this.dynamicTags.push('合作渠道')
                }
                if (!payload.min && !payload.max) {
                    this.dynamicTags.splice(this.dynamicTags.indexOf('合作渠道'), 1)
                    if (this.dynamicTags.length===0){
                        this.tags_show=false
                    }
                }
                this.search()
            },
            searchJg(payload) {
                if (!this.tags_show){
                    this.tags_show=true
                }
                this.condi.jgId = payload.value
                // console.log(payload.value)
                this.init()
                if (this.dynamicTags.indexOf('机构') === -1) {
                    this.dynamicTags.push('机构')
                }
                if (!payload.value) {
                    this.dynamicTags.splice(this.dynamicTags.indexOf('机构'), 1)
                    if (this.dynamicTags.length===0){
                        this.tags_show=false
                    }
                }
                this.search()
            },
            searchLy(payload) {
                if (!this.tags_show){
                    this.tags_show=true
                }
                this.condi.lyId = payload.value
                this.init()
                if (this.dynamicTags.indexOf('领域') === -1) {
                    this.dynamicTags.push('领域')
                }
                if (!payload.value) {
                    this.dynamicTags.splice(this.dynamicTags.indexOf('领域'), 1)
                    if (this.dynamicTags.length===0){
                        this.tags_show=false
                    }
                }
                this.search()
            },
            search() {
                console.log(this.condi)
                if (this.typeId != this.condi.id) {
                    this.zbList = []
                    this.pkList = [null, null]
                }
                this.loading = true
                this.typeId = this.condi.id
                let time = this.condi.from.split('.')[0] + '-' + this.condi.from.split('.')[1]
                let fansNumMin = this.condi.min.fss
                let fansNumMax = this.condi.max.fss
                let everLiveMin = this.condi.min.cjgk
                let everLiveMax = this.condi.max.cjgk
                let liveCountMin = this.condi.min.zbcc
                let liveCountMax = this.condi.max.zbcc
                let shopCountMin = this.condi.min.hzdps
                let shopCountMax = this.condi.max.hzdps
                let goodsCountMin = this.condi.min.zbbb
                let goodsCountMax = this.condi.max.zbbb
                let org = this.condi.jgId
                let verticalArea = this.condi.lyId
                let goodsPriMin = this.condi.min.bbjg
                let goodsPriMax = this.condi.max.bbjg
                let shopChannel = this.condi.shopChannel
                let shopChannelMin = this.condi.min.shopChannelMin
                let shopChannelMax = this.condi.max.shopChannelMax
                this.quertAnchorRanking_post(this.typeId, time, this.currentNum, 8, this.sort_query, this.desc, fansNumMin, fansNumMax, everLiveMin, everLiveMax, liveCountMin, liveCountMax, shopCountMin, shopCountMax, goodsCountMin, goodsCountMax, org, verticalArea, goodsPriMin, goodsPriMax, shopChannel, shopChannelMin, shopChannelMax)

            },
            sortactive(i) {
                if (i == 1) {
                    if (!this.sort_active1) {
                        this.sort_active1 = true;
                        this.sort_active2 = false;
                        this.desc = 0
                    }
                } else {
                    if (!this.sort_active) {
                        this.sort_active2 = true;
                        this.sort_active1 = false;
                        this.desc = 1
                    }
                }
                this.zbList = []
                this.currentNum = 0
                this.search()

            },
            querysort(i) {

                if (i == 0) {
                    this.sort_query = 'index1'
                } else if (i == 1) {
                    this.sort_query = 'fans_num'
                } else if (i == 2) {
                    this.sort_query = 'ever_live'
                } else if (i == 3) {
                    this.sort_query = 'live_count'
                } else if (i == 4) {
                    this.sort_query = 'shop_count'
                } else if (i == 5) {
                    this.sort_query = 'goods_count'
                }
                this.zbList = []
                this.currentNum = 0
                this.search()
            },
            //pk
            addToPK(i) {
                var index = this.pkList.indexOf(i)
                var nullIndex = this.pkList.indexOf(null)
                if (index < 0) {
                    this.pkList.splice(nullIndex > -1 ? nullIndex : 1, 1, i)
                }
                else {
                    this.pkList.splice(index, 1, null)
                }
                if (!this.pkShow) {
                    this.pkShow = true
                }
            },
            removePK(i) {
                var index = this.pkList.indexOf(i)
                if (index > -1) {
                    this.pkList.splice(index, 1, null)
                }
            },
            jgtj_click() {
                //显示价格推荐
                this.showjgtj = !this.showjgtj;
                if (!this.jgtj_data) {
                    console.log('发送请求');
                    this.jgtj_data = [
                        {
                            name: '0-100',
                            value: 23,
                        }, {
                            name: '100-200',
                            value: 10,
                        }, {
                            name: '200-500',
                            value: 41,
                        }, {
                            name: '500-1000',
                            value: 35,
                        }, {
                            name: '1000+',
                            value: 19,
                        }]
                }
                let jgtj_pie_chart = echarts.init(document.getElementById('echart-jgtj'))
                let jgtj_pie_option = {
                    tooltip: {},
                    series: {
                        hoverAnimation: false,
                        selectedMode: 'single',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                formatter: '{b}:{d}% ',
                            }
                        },
                        data: this.jgtj_data
                    }
                };
                jgtj_pie_chart.setOption(jgtj_pie_option)
            },
            quertAnchorRanking_post(typeId, date, startNum, queryNum, sort, desc, fansNumMin, fansNumMax, everLiveMin, everLiveMax, liveCountMin, liveCountMax, shopCountMin, shopCountMax, goodsCountMin, goodsCountMax, org, verticalArea, goodsPriMin, goodsPriMax, shopChannel, shopChannelMin, shopChannelMax) {
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
                    params['priceMin'] = goodsPriMin
                }
                if (goodsPriMax) {
                    params['priceMax'] = goodsPriMax
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
                        this.total = data.data.data.total
                        if (data.data.data.allInfoNum) {
                            if (this.zbCount === '') {
                                this.zbCount = data.data.data.total
                                this.liveCount = data.data.data.allInfoNum.liveNum
                            }
                        }
                    }
                    this.zbList = this.zbList.concat(data.data.data.anchorInfo)
                    this.loading = false
                    this.currentNum = this.zbList.length
                })
            }

        }
    }
</script>
<style scoped lang="less">
    .page {
        background-color: #f2f2f2;
    }

    .top-bar {
        background-color: #fff;
        width: 100%;
        height: 50px;
        line-height: 50px;
        position: fixed;
        left: 0;
        right: 0;
        top: @headerHeight;
        z-index: 1;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, .25);
        .bar {
            width: @contentWidth;
            margin: auto;
        }
    }

    .pa {
        background-color: #fff;
    }

    .tj-bar {
        margin-top: 60px;
        height: 250px;
        line-height: 30px;
        box-sizing: border-box;
        .total {
            p {
                margin-left: 56px;
                margin-top: 19px;
                font-size: 14px;
                font-weight: bold;
                color: @mainColor;
                line-height: 24px;
                opacity: 0.78;
            }
        ;
            p {
                margin-right: 57px;
                margin-top: 19px;
            }
        ;
        }
    ;

    }

    h3 {
        background-color: @mainColor;
        text-align: center;
        color: #fff;
        border-radius: 30px;
        width: 291px;
        height: 30px;
        line-height: 30px;
        margin-left: 405px;
        font-size: 14px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .el-cascader {
        width: 90px;
    }

    .el-select, .select-in {
        width: 70px;
    }

    .el-select, .select-in, .el-cascader {
        margin-right: 5px;
    }

    .sort-list {
        p {
            margin: 0px 0px 0px 56px;
            display: inline-block;
        }
        span {
            /*padding: 5px;*/
            cursor: pointer;
            padding: 5px 17px;
            border-radius: 27px;
            margin-left: 22px;
            border: #E1E1E1 solid 1px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.54);
            line-height: 24px;
            /*opacity: 0.54;*/

            &.active {
                background-color: @mainColor;
                border: none;
                font-size: 14px;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                line-height: 24px;
            }
        }
    }

    .bbjg {
        line-height: 40px;
        box-sizing: border-box;
        width: 255px;
        height: 40px;
        transition: all .1s linear;
        position: relative;
        margin-top: -5px;
        span {
            margin-left: 9px;
        }
        input[type=text] {
            width: 50px;
            height: 24px;
            border: 1px solid #aaa;
            margin-left: 9px;
            margin-right: 8px;
            text-align: center;
            line-height: 24px;
            opacity: 0.54;
            font-size: 12px;
            font-weight: 400;
        }
        input[type=button] {
            background-color: @mainColor;
            color: #fff;
            border: none;
            height: 24px;
            margin-left: 5px;
            line-height: 1.6;
            width: 50px;

        }
        &.active {
            box-shadow: 1px 1px 6px #aaa;
            width: 314px;
            background-color: #fff;
        }
    }

    .sort {
        background: #E1E1E1;
        width: 40px;
        height: 30px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        margin-left: 9px;
        border-radius: 4px;
    }

    .sort_active {
        background: @mainColor;
        width: 40px;
        height: 30px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        margin-left: 9px;
        border-radius: 4px;
    }

    .search-bar {
        margin-top: 10px;
        & > span {
            width: 84px;
            height: 12px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 1);
            line-height: 24px;
            opacity: 0.78;

            &.bt {
                width: 61px;
                height: 12px;
                font-size: 14px;
                font-weight: bold;
                color: rgba(0, 0, 0, 1);
                line-height: 24px;
                opacity: 0.78;
                margin-left: 56px;
                position: relative;
                i {
                    font-size: 10px;
                    position: absolute;
                    top: 0;
                    right: 8px;
                }
            }
        }
    }

    .fans {
        margin-left: 15px;
    }

    .view {
        margin-left: 52px;
    }

    .video {
        margin-left: 52px;
    }

    .goods {
        margin-left: 52px;
    }

    .shop {
        margin-left: 52px;
    }

    .org {
        margin-left: 131px;
    }

    .area {
        margin-left: 38px;
    }

    .jg {
        display: inline-block;
        vertical-align: top;
        margin-left: 71px;

    }

    .jgtj {
        position: relative;
        display: inline-block;
        right: 0px;
        top: 3px;
        line-height: 24px;
        text-align: center;
        background: #E1E1E1;
        span {
            display: inline-block;
            height: 24px;
            font-size: 14px;
            border: 1px solid #E1E1E1;
            cursor: pointer;
            user-select: none;
            width: 70px;
            font-weight: 400;
            color: rgba(0, 0, 0, 1);
            line-height: 24px;
            opacity: 0.78;
        }
        #echart-jgtj {
            position: absolute;
            /*top: 50px;*/
            right: 0;
            width: 400px;
            height: 200px;
            background-color: #fff;
        }
    }

    .zb-tx {
        display: inline-block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }

    .zb-item {
        margin-top: 10px;
        width: 100%;
        height: 220px;
        background: white;
        .part1 {
            margin-left: 55px;
            display: inline-block;
            width: 80px;
            height: 200px;
            vertical-align: top;
            .zb-ppd {
                width: 80px;
                height: 60px;
                border-radius: 0px 0px 40px 40px;
                background: @mainColor;
                color: white;
                text-align: center;
                .span1 {
                    font-size: 12px;
                    font-weight: 400;
                }
                .span2 {
                    line-height: 2em;
                    display: block;
                    font-weight: bold;
                    font-size: 16px;

                }
            }
            .first {
                font-size: 36px;
                font-weight: bold;
                color: rgba(242, 72, 125, 1);
                line-height: 24px;
                margin-left: 31px;
                margin-top: 29px;
            }
            .second {
                font-size: 36px;
                font-weight: bold;
                color: rgba(242, 72, 125, 1);
                line-height: 24px;
                opacity: 0.78;
                margin-left: 31px;
                margin-top: 29px;
            }
            .third {
                font-size: 36px;
                font-weight: bold;
                color: rgba(242, 72, 125, 1);
                line-height: 24px;
                opacity: 0.54;
                margin-left: 31px;
                margin-top: 29px;
            }
            .rank {
                font-size: 36px;
                font-weight: 300;
                color: rgba(0, 0, 0, 1);
                line-height: 24px;
                opacity: 0.26;
                margin-left: 31px;
                margin-top: 29px;
            }
        }
        .part2 {
            margin-left: 27px;
            display: inline-block;
            width: 122px;
            height: 200px;
            vertical-align: top;
            .zb-tx {
                cursor: pointer;
            }
            .image {
                margin-top: 10px;
                width: 121px;
                height: 122px;

            }
            .zb-name {
                margin-top: 5px;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                color: rgba(0, 0, 0, 1);
                line-height: 24px;
                opacity: 0.78;
            }
            .zbxq {
                margin-top: 5px;
                text-align: center;
                cursor: pointer;
                font-size: 14px;
                font-weight: 400;
                color: rgba(0, 0, 0, 1);
                line-height: 24px;
                opacity: 0.54;
            }
        }
        .part3 {
            display: inline-block;
            margin-left: 29px;
            width: 470px;
            height: 200px;
            vertical-align: top;
            .isactive {
                height: 30px;
                width: 30px;
                background: @mainColor;
                border-radius: 30px;
                display: inline-block;
                vertical-align: top;
                margin-left: 315px;
                margin-top: 20px;
                cursor: pointer;
                font-size: 20px;
                text-align: center;
                line-height: 28px;
                .sc {

                    .fa-heart {
                        color: white;
                    }
                }
            }
            .unactive {
                height: 30px;
                width: 30px;
                border: rgba(0, 0, 0, 0.5) solid 1px;
                border-radius: 30px;
                display: inline-block;
                vertical-align: top;
                margin-left: 315px;
                margin-top: 20px;
                cursor: pointer;
                font-size: 20px;
                text-align: center;
                line-height: 28px;
                .sc {

                    .fa-heart {
                        color: rgba(0, 0, 0, 0.5);
                    }
                }
            }

            .pk {
                cursor: pointer;
                display: inline-block;
                border: rgba(0, 0, 0, 0.5) solid 1px;
                border-radius: 30px;
                height: 30px;
                width: 30px;
                vertical-align: top;
                margin-left: 10px;
                margin-top: 20px;
                color: rgba(0, 0, 0, 0.5);
                font-size: 17px;
                font-weight: bold;
                text-align: center;
                line-height: 28px;
                /*margin-left: 10px;*/
                /*margin-right: 20px;*/
            }
            .pk.active {
                color: white;
                background: @mainColor;
                border: none;
            }
            .shu {
                margin-top: 52px;
                width: 4px;
                height: 14px;
                background: @mainColor;
                display: inline-block;
            }
            .zb-bt {
                margin-left: 11px;
                font-size: 14px;
                font-weight: bold;
                color: rgba(0, 0, 0, 1);
                line-height: 24px;
                opacity: 0.78;
            }
            .zb-div {
                margin-top: 10px;
                .zb-hzdps {
                    margin-left: 30px;
                    display: inline-block;
                    span {
                        font-size: 14px;
                        font-weight: bold;
                        color: rgba(0, 0, 0, 1);
                        line-height: 24px;
                        opacity: 0.78;
                    }
                    .value {
                        margin-left: 10px;
                    }
                }
                .zb-zbccs {
                    margin-left: 15px;
                    display: inline-block;
                    span {
                        font-size: 14px;
                        font-weight: bold;
                        color: rgba(0, 0, 0, 1);
                        line-height: 24px;
                        opacity: 0.78;
                    }
                    .value {
                        margin-left: 10px;
                    }
                }
                .zb-zbbbs {
                    margin-right: 30px;
                    display: inline-block;
                    span {
                        font-size: 14px;
                        font-weight: bold;
                        color: rgba(0, 0, 0, 1);
                        line-height: 24px;
                        opacity: 0.78;
                    }
                    .value {
                        margin-left: 10px;
                    }
                }
            }
            .zb-fss {
                margin-left: 15px;
                margin-top: 40px;
                display: inline-block;
                span {
                    font-size: 18px;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.78;
                }
                .value {
                    margin-left: 10px;
                }

            }
            .zb-cjgkcs {
                /*margin-left: 15px;*/
                margin-right: 30px;
                margin-top: 40px;
                display: inline-block;
                span {
                    font-size: 18px;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.78;
                }
                .value {
                    margin-left: 10px;
                }

            }

            .zb-jg {
                display: inline-block;
                margin-top: 10px;
                margin-left: 15px;
                .tit {
                    font-size: 14px;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.54;
                }
                .value {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.54;
                }
            }
            .zb-czly {
                display: inline-block;
                margin-left: 20px;
                .tit {
                    font-size: 14px;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.54;
                }
                .value {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.54;
                }
            }
            .zb-zbsf {
                display: inline-block;
                margin-left: 20px;
                .tit {
                    font-size: 14px;
                    font-weight: bold;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.54;
                }
                .value {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.54;
                }
            }
        }
        .part4 {
            margin-top: 20px;
            display: inline-block;
            width: 1px;
            height: 160px;
            background: #E1E1E1;
            vertical-align: top;
        }
        .part5 {
            display: inline-block;
            height: 200px;
            width: 285px;
            .shu {
                width: 4px;
                height: 14px;
                background: @mainColor;
                display: inline-block;
                margin-left: 20px;
                margin-top: 23px;
            }
            .tit {
                display: inline-block;
                margin-left: 11px;
                font-size: 14px;
                font-weight: bold;
                color: rgba(0, 0, 0, 1);
                line-height: 24px;
                opacity: 0.78;
            }
            img {
                margin-left: 10px;
            }
            ul {
                margin-left: 35px;
                margin-top: 18px;
                li {
                    width: 270px;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    opacity: 0.78;
                    .heng {
                        width: 250px;
                        height: 1px;
                        background: #E1E1E1;
                        margin-left: 10px;
                    }
                    .libox {
                        padding: 10px;
                    }
                    /*<!--.libox:hover {-->*/
                    /*<!--!*width: 250px;*!-->*/
                    /*<!--background: @mainColor;-->*/
                    /*<!--padding: 5px;-->*/
                    /*<!--color: white;-->*/
                    /*<!--border-radius: 4px;-->*/
                    /*<!--a {-->*/
                    /*<!--color: white;-->*/
                    /*<!--opacity: 1;-->*/
                    /*<!--}-->*/
                    /*<!--}-->*/
                }
                li:hover {
                    border-radius: 4px;
                    background: @mainColor;
                    color: white;
                    .heng {
                        background: @mainColor;
                    }
                    a {
                        color: white;
                        opacity: 1;
                    }
                }
            }
        }
        /*.info {*/
        /*position: relative;*/
        /*left: 162px;*/
        /*top: -50px;*/
        /*}*/
        .zbxx {
            display: inline-block;
            width: 60%;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
            text-align: center;
            // .zb-tx{
            //     display: inline-block;
            //     width:100px;
            //     height: 100px;
            //     border-radius: 50%;
            //     background-repeat: no-repeat;
            //     background-size: cover;
            //     background-position: center;
            // }
            .zb-name {
                text-align: center;
                line-height: 2em;
            }

            .left {
                width: 20%;
                transition: box-shadow .1s linear;
                box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
                &:hover {
                    box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12);
                }
            }
            .right {
                width: 70%;

            }
        }
        .jqzb {
            box-sizing: border-box;
            display: inline-block;
            padding: 20px;
            width: 40%;
            height: 100%;
            .jqzb-item {

            }

        }

    }

    .pk-list {
        * {
            xbackground-color: rgba(0, 0, 0, 0.1)
        }
        .zb-tx {
            width: 80px;
            height: 80px;
            text-align: center;
            line-height: 134px;
        }
        .zb-name {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 1);
            line-height: 20px;
            opacity: 0.54;
            margin-top: 10px;
        }
        border-radius: 10px 10px 0px 0px;
        background-color: #fff;
        box-sizing: border-box;
        height: 420px;
        width: 160px;
        position: fixed;
        right: 211px;
        top: 50%;
        margin-top: -200px;
        .tit {
            width: 160px;
            height: 40px;
            background: @mainColor;
            color: white;
            text-align: center;
            border-radius: 10px 10px 0px 0px;
            font-size: 14px;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            line-height: 40px;
        }
        .gb {
            width: 19px;
            height: 19px;
            background: @mainColor;
            border-radius: 19px;
            color: white;
            text-align: center;
            cursor: pointer;
            display: inline-block;
            line-height: 19px;
            position: absolute;
            top: -11px;
            right: -11px;
        }
        .heng {
            width: 100px;
            height: 1px;
            background: #E1E1E1;
            margin-left: 30px;
            margin-top: 19px;
        }
        .item {
            text-align: center;
            height: 30%;
            margin-top: 20px;
            div {
                position: relative;
                .xx {
                    position: absolute;
                    top: 0px;
                    right: 20px;
                    color: #E1E1E1;
                    cursor: pointer;
                }
            }

            &:nth-child(2) {
                border-bottom: 1px solid #bcbcbc;
            }
            &.not {
                text-align: center;
                .fa-user {
                    color: #fff;
                    line-height: 100px;
                    font-size: 30px;
                }
            }

        }
        .qkdb, .ksdb {
            cursor: pointer;
            text-align: center;
            width: 120px;
            height: 30px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 400;
            line-height: 30px;
            margin-left: 20px;
        }
        .qkdb {
            border: @mainColor solid 1px;

            margin-top: 10px;
            color: @mainColor;
        }
        .ksdb {

            background: @mainColor;

            .fa-caret-right {
                color: white;
                margin-left: 5px;
            }
            span {
                color: white;
            }
        }
    }

    .pk-button {
        position: fixed;
        right: 0;
        top: 50%;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.2);
        i {
            color: #fff;
            font-size: 18px;
        }
    }

    .load-more {
        margin: auto;
        width: 60%;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        text-align: center;
        box-shadow: 1px 1px 6px #aaa;
        margin-top: 10px;
        margin-bottom: 10px;
        cursor: pointer;
    }

    .hr {
        border-bottom: solid 1px #F0F0F0;
    }

    .notfound {
        text-align: center;
        margin-top: 50px;
    }
</style>
<style lang="less">
    .el-tag {
        background: white;
        color: @mainColor;
        border: 1px @mainColor solid;
        height: 21px;
        line-height: 21px;
        border-radius: 10px;
        margin-left: 10px;
        &:first-child {
            margin-left: 55px;
            border-radius: 4px;
            background: @mainColor;
            color: white;
            .el-icon-close {
                color: white;
            }
            .el-icon-close:hover {
                background: white;
                color: @mainColor;
            }
        }
        .el-icon-close {
            color: @mainColor;
        }
        .el-icon-close:hover {
            background: @mainColor;
        }
    }

    a:link {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 24px;
        opacity: 0.78;

    }

    a:visited {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 24px;
        opacity: 0.78;

    }

    a:hover {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 24px;
        opacity: 0.78;

    }

    a:active {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 24px;
        opacity: 0.78;

    }

    .el-cascader-menu {
        &:last-child {
            li {
                &:last-child {
                    position: relative
                }
            }
        }
    }

    .input-customer {
        z-index: 2004;
        position: absolute;
        right: 0;
        input {
            width: 60px;
            height: 20px;
        }

    }

    .search-bar {
        .el-select {
            .el-input {
                height: 19px;
                width: 90px;
                input {
                    height: 19px;
                    line-height: 19px;
                }
            ;
                .el-input__icon {
                    line-height: 19px;
                }
            }
        }
    }
</style>
