<template>
    <Page :headerShadow="false">
        <ToTop/>
        <div class="top-bar clearfix">
            <div class="bar">
                <SearchBar @cb="search" :selectCatg="catgs"/>
            </div>
        </div>
        <Anchor :data="anchors" />
        <div class="part part1">
            <div class="clearfix part-name one">
                <span class="tit">直播热度</span>
                <span class="lm">{{ msg }}</span>
                <span class="date">本数据更新于:{{update_data}}</span>
                <router-link :to="'/rank?catgs='+$route.query.catgs+'&from='+$route.query.from+'&to='+$route.query.to"
                             class="more">
                    <img src="/img/morezb.png" alt=""><span> 热门主播>></span>
                </router-link>
            </div>
            <div class="part_content">
                <div class="echarts">
                    <div class="echart_box" v-for="(echarts_obj,i) in echarts_objs" :key="i">
                        <p class="name">{{echarts_obj.title}}&nbsp;&nbsp;<img src="/img/wenhao.png" alt=""
                                                                              :title="echarts_msg[i]"></p>
                        <p class="num">{{echarts_obj.num>=0?parseInt(echarts_obj.num).toLocaleString():'暂无数据'}}</p>
                        <!--<p class="comp">-->
                        <!--<span class="tip">较上一周期</span>-->
                        <!--<span v-if="echarts_obj.compare>0" class="up">↑{{echarts_obj.compare}}%</span>-->
                        <!--<span v-else class="down">↓{{echarts_obj.compare}}%</span>-->
                        <!--</p>-->
                        <div class="echart" :id="'echart'+i" v-show="siximg_show"></div>
                        <div class="imgloading" v-show="!siximg_show">
                            <img src="/img/loading.gif" alt="">
                        </div>
                    </div>
                </div>
                <div class="pie">
                    <p>直播宝贝占比</p>
                    <div id="pie1" v-show="pie1_show"></div>
                    <div class="imgloading" v-show="!pie1_show">
                        <img src="/img/loading.gif" alt="">
                    </div>
                </div>
                <div class="pie">
                    <!--后期改成变量-->
                    <p>子类目直播宝贝占比</p>
                    <div id="pie2" v-show="pie2_show"></div>
                    <div class="imgloading" v-show="!pie2_show">
                        <img src="/img/loading.gif" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="part">
            <div class="clearfix part-name">
                <span class="tit">直播趋势</span>
                <span class="lm">{{ msg }}</span>
                <!--<router-link :to="'/rank?catgs='+$route.query.catgs+'&from='+$route.query.from+'&to='+$route.query.to"-->
                <!--class="more">-->
                <!--<img src="/img/morezb.png" alt=""><span> 热门主播>></span>-->
                <!--</router-link>-->
            </div>
            <div class="part_content zbqs clearfix">
                <div id="echart_bar" class="echart fl" v-show="zbqs_show"></div>
                <div class="bz fl" v-show="zbqs_show">
                    <p class="gold">
                        <i class="fa fa-caret-up" aria-hidden="true"></i>
                        <span>该类目的黄金时段： {{timearea}}</span>
                    </p>
                    <p>
                        注：黄金时段是指在历史时期内， 场均观看次数最多的时段。
                    </p>
                </div>
                <div class="imgloading" v-show="!zbqs_show">
                    <img src="/img/loading.gif" alt="">
                </div>
            </div>
        </div>
        <div class="part zbsx">
            <div class="clearfix part-name">
                <span class="tit">直播属性分布</span>
                <span class="lm">{{ msg }}</span>
                <!--<router-link :to="'/rank?catgs='+$route.query.catgs+'&from='+$route.query.from+'&to='+$route.query.to"-->
                <!--class="more">-->
                <!--<img src="/img/morezb.png" alt=""><span> 热门主播>></span>-->
                <!--</router-link>-->
            </div>
            <div class="part_content zbsx">
                <div class="data">
                    <p class="tit">场均观看次数分布</p>
                    <div id="view_distribution" class="distribution echart" v-show="cjgkcs_show">
                    </div>
                    <div class="imgloading" v-show="!cjgkcs_show">
                        <img src="/img/loading.gif" alt="">
                    </div>
                </div>
                <div class="data">
                    <p class="tit bbjg">宝贝价格带分布</p>
                    <div id="price_distribution" class="distribution echart" v-show="bbjgfb_show">
                    </div>
                    <div class="imgloading" v-show="!bbjgfb_show">
                        <img src="/img/loading.gif" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="part">
            <div class="clearfix part-name"><span class="tit">直播概览</span><span class="lm">{{ msg }}</span></div>
            <div class="clearfix">
                <el-button type="text" @click="open2('out-table1')" v-if='video_datas.length>=0' class="fr export">
                    <i class="fa fa-upload" aria-hidden="true"></i><span>导出数据</span>
                </el-button>
            </div>
            <div class="data-table">
                <table border="1">
                    <tr>
                        <th>序号</th>
                        <th>直播主题</th>
                        <th>直播时间</th>
                        <th>观看次数</th>
                        <th>主播名称</th>
                        <th>主播所属机构</th>
                        <!--<th>本类目下本场宝贝</th>-->
                        <!--<th>本场宝贝价格</th>-->
                    </tr>
                    <tr v-if="video_datas_length===0">
                        <td colspan="8"><span>没有数据</span></td>
                    </tr>
                    <tr v-else-if="video_datas_length===''">
                        <td colspan="8"><span>数据加载中</span></td>
                    </tr>
                    <tr v-for="(video_data,i) in video_datas" :key="i">
                        <td>{{video_data.ranking}}</td>
                        <td>{{video_data.title}}</td>
                        <td>{{video_data.time.split(' ')[0]}}</td>
                        <td>{{video_data.view?parseInt(video_data.view).toLocaleString():video_data.view}}</td>
                        <td>{{video_data.name}}</td>
                        <td>{{video_data.organization}}</td>
                        <!--<td>{{video_data.goodsName}}</td>-->
                        <!--<td>{{video_data.price?parseFloat(video_data.price).toFixed(1):video_data.price}}</td>-->
                    </tr>
                </table>
                <el-pagination
                        v-if='video_datas.length>0'
                        background
                        @current-change="zbgl_handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="10"
                        layout="prev, pager, next"
                        :total="video_total"
                        :pager-count=5>
                </el-pagination>
            </div>
            <div id="out-table1" style="display:none;">
                <table border="1">
                    <tr>
                        <th>序号</th>
                        <th>直播主题</th>
                        <th>直播时间</th>
                        <th>观看次数</th>
                        <th>主播名称</th>
                        <th>主播所属机构</th>
                        <!--<th>本类目下本场宝贝</th>-->
                        <!--<th>本场宝贝价格</th>-->
                    </tr>
                    <tr v-for="(all_data,i) in all_video_datas" :key="i">
                        <td>{{all_data.ranking}}</td>
                        <td>{{all_data.title}}</td>
                        <td>{{all_data.time.split(' ')[0]}}</td>
                        <td>{{all_data.view?parseInt(all_data.view).toLocaleString():all_data.view}}</td>
                        <td>{{all_data.name}}</td>
                        <td>{{all_data.organization}}</td>
                        <!--<td>{{all_data.goodsName}}</td>-->
                        <!--<td>{{all_data.price?parseFloat(all_data.price).toFixed(1):all_data.price}}</td>-->
                    </tr>
                </table>
            </div>
        </div>
        <div class="part">
            <div class="clearfix part-name"><span class="tit">宝贝直播概览</span><span class="lm">{{ msg }}</span></div>
            <div class="clearfix">
                <el-button type="text" @click="open2('out-table2')" v-if='video_goods_datas.length>=0'
                           class="fr export">
                    <i class="fa fa-upload" aria-hidden="true"></i>
                    <span>导出数据</span>
                </el-button>
            </div>
            <div class="data-table">
                <table border="1">
                    <tr>
                        <th>宝贝</th>
                        <th>所属类目</th>
                        <th>主播名称</th>
                        <th>直播主题</th>
                        <th>直播价格</th>
                        <!--<th>日常价格</th>-->
                        <th>本次直播观看次数</th>
                        <th>直播时间</th>
                    </tr>
                    <tr v-if="video_goods_datas_length===0">
                        <td colspan="8"><span>没有数据</span></td>
                    </tr>
                    <tr v-else-if="video_goods_datas_length===''">
                        <td colspan="8"><span>数据加载中</span></td>
                    </tr>
                    <tr v-for="(video_goods_data,i) in video_goods_datas" :key="i">
                        <td>{{video_goods_data.goods}}</td>
                        <td>{{video_goods_data.type}}</td>
                        <td>{{video_goods_data.name}}</td>
                        <td>{{video_goods_data.title}}</td>
                        <td>
                            {{video_goods_data.video_price?parseFloat(video_goods_data.video_price).toFixed(1):video_goods_data.video_price}}
                        </td>
                        <!--<td>-->
                        <!--{{video_goods_data.source_price?parseFloat(video_goods_data.source_price).toFixed(1):video_goods_data.source_price}}-->
                        <!--</td>-->
                        <td>
                            {{video_goods_data.view?parseInt(video_goods_data.view).toLocaleString():video_goods_data.view}}
                        </td>
                        <td>{{video_goods_data.time?video_goods_data.time.split(' ')[0]:video_goods_data.time}}</td>
                    </tr>
                </table>
                <el-pagination
                        background
                        v-if='video_goods_datas.length>0'
                        @current-change="bbzbgl_handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="10"
                        layout="prev, pager, next"
                        :total="goods_total"
                        :pager-count=5>
                </el-pagination>
            </div>
            <div id="out-table2" style="display:none;">
                <table border="1">
                    <tr>
                        <th>宝贝</th>
                        <th>一级类目</th>
                        <th>二级类目</th>
                        <th>三级类目</th>
                        <th>四级类目</th>
                        <th>主播名称</th>
                        <th>直播主题</th>
                        <th>直播价格</th>
                        <!--<th>日常价格</th>-->
                        <th>本次直播观看次数</th>
                        <th>直播时间</th>
                    </tr>
                    <tr v-for="(goods_data,i) in all_goods_datas" :key="i">
                        <td>{{goods_data.goods}}</td>
                        <td>{{goods_data.first}}</td>
                        <td>{{goods_data.second}}</td>
                        <td>{{goods_data.third}}</td>
                        <td>{{goods_data.fourth}}</td>
                        <td>{{goods_data.name}}</td>
                        <td>{{goods_data.title}}</td>
                        <td>
                            {{goods_data.video_price?parseFloat(goods_data.video_price).toFixed(1):goods_data.video_price}}
                        </td>
                        <!--<td>-->
                        <!--{{goods_data.source_price?parseFloat(goods_data.source_price).toFixed(1):goods_data.source_price}}-->
                        <!--</td>-->
                        <td>{{goods_data.view?parseInt(goods_data.view).toLocaleString():goods_data.view}}</td>
                        <td>{{goods_data.time?goods_data.time.split(' ')[0]:goods_data.time}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </Page>
</template>
<script>
    import Page from "@/components/Page.vue";
    // import Breadcrumb from "@/components/Breadcrumb.vue";
    import echarts from "echarts";
    import FileSaver from "file-saver";
    import XLSX from "xlsx";
    import SearchBar from '@/components/SearchBar.vue';
    import myaxios from "../assets/js/myaxios";
    import moment from "moment";
    import ToTop from '@/components/ToTop.vue'
    import {
        Pagination,
        Button,
        MessageBox,
    }
    from "element-ui";
    import Anchor from '@/components/Anchor.vue'
    export default {
        components: {
            Page,
            SearchBar,
            ToTop,
            elPagination: Pagination,
            elButton: Button,
            Anchor,
        },
        data: function () {
            return {
                catgs: [],
                echarts_objs: [],
                pie_data: [],
                pie_child_data: [],
                video_datas: [],
                all_video_datas: [],
                video_goods_datas: [],
                all_goods_datas: [],
                bar_data: [],
                view_data: [],
                view_axis: [],
                price_data: [],
                price_axis: [],
                update_data: '',
                anchors: ["直播热度", "直播趋势", "直播属性分布", "直播概览", "宝贝直播概览"],
                msg: "美容护肤/美体/精油",
                active: -1,
                timearea: '',
                partTop: [],
                currentPage: 1,
                pie_obj: [],
                pie_child_obj: [],
                pie_level: 1,
                // routeFrom: "0",
                // path: [{"name": "首页", route: "/"}, {"name": "主播匹配", route: "/rank"}, {"name": "行情概览"}],
                video_total: 0,
                goods_total: 0,
                pie_name: '',
                startTime: '',
                endTime: '',
                level: '',
                typeId: '',
                pie_child_color: [],
                pie_color: [],
                echarts_msg: [
                    '合作主播数：选择时间范围内， 直播过该品类宝贝的热门主播数',
                    '直播场次数：选择时间范围内， 含有该品类宝贝的直播场次数',
                    '场均观看次数：选择时间范围内， 含有过该品类宝贝的直播场次的平均观看次数',
                    '直播店铺数：选择时间范围内， 参与该品类宝贝直播的店铺个数',
                    '直播宝贝数：选择时间范围内， 该品类下直播宝贝个数',
                    '宝贝总直播次数：选择时间范围内，该品类下宝贝直播总次数'],
                video_datas_length: '',
                video_goods_datas_length: '',
                //控制loading图像显示
                siximg_show: true,
                pie1_show: true,
                pie2_show: true,
                zbqs_show: true,
                cjgkcs_show: true,
                bbjgfb_show: true,
            };
        },
        created() {
            //首页过来绑定类目条件
            // 组件创建完后获取数据
            var catgList = this.$route.query.catgs + '';
            if (catgList) {
                this.catgs = catgList.split(',').map(item => item = item - '')//转为为数字
            }
            // this.update_data=moment()
            this.update_data = (moment().subtract(1, 'days').subtract(1, 'days')).format('YYYY-MM-DD')
        },
        mounted() {
            // this.page_init()
            let myChart1 = echarts.init(document.getElementById("pie1"));
            myChart1.on("click", (param) => {
                this.pie_child_fun(param, this.startTime)
            })
        },
        methods: {
            exportExcel(id) {
                /* generate workbook object from table */
                var wb = XLSX.utils.table_to_book(document.querySelector("#" + id));
                /* get binary string as output */
                var wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });
                if (id == 'out-table1') {
                    var xlsxname = this.msg + ' ' + this.startTime + " 直播概览.xlsx"
                } else {
                    var xlsxname = this.msg + ' ' + this.startTime + " 宝贝直播概览.xlsx"
                }
                try {
                    FileSaver.saveAs(
                        new Blob([wbout], {type: "application/octet-stream"}),
                        xlsxname
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, wbout);
                }
                return wbout;
            },
            async search(condi) {
                this.video_datas = []
                this.video_goods_datas = []
                this.video_datas_length = ''
                this.video_goods_datas_length = ''
                this.pie_data = []
                this.pie_child_data = []
                this.view_data = []
                this.view_axis = []
                this.price_data = []
                this.price_axis = []
                this.pie_level = condi.level;
                this.msg = condi.label;
                this.startTime = condi.from;
                this.endTime = condi.to;
                this.level = condi.level;
                this.typeId = condi.id;
                this.echarts_objs = [
                    {
                        title: '合作主播数',
                    },
                    {
                        title: '直播场次数',
                    },
                    {
                        title: '场均观看次数',
                    },
                    {
                        title: '直播店铺数',
                    },
                    {
                        title: '直播宝贝数',
                    },
                    {
                        title: '宝贝总直播次数',
                    }];

                this.six_img(this.typeId, this.startTime, this.endTime, this.level);
                this.pie(this.level, this.typeId, this.startTime);
                this.zbgl_post(0, 10, this.startTime, this.endTime, this.typeId, this.level, (data) => {
                    this.video_total = data.Total;
                    this.video_datas = data.video_datas
                    this.video_datas_length = this.video_datas.length
                });
                this.bbzbgl_post(0, 10, this.startTime, this.endTime, this.typeId, this.level, (data) => {
                    this.goods_total = data.Total;
                    this.video_goods_datas = [];
                    for (let i = 0; i < data.video_goods_datas.length; i++) {
                        let obj = {};
                        obj['type'] = data.video_goods_datas[i]['first'] + '>' + data.video_goods_datas[i]['second'] + '>' + data.video_goods_datas[i]['third'] + '>' + data.video_goods_datas[i]['fourth'];
                        obj['goods'] = data.video_goods_datas[i]['goods'];
                        obj['name'] = data.video_goods_datas[i]['name'];
                        obj['title'] = data.video_goods_datas[i]['title'];
                        obj['video_price'] = data.video_goods_datas[i]['video_price'];
                        obj['source_price'] = data.video_goods_datas[i]['source_price'];
                        obj['view'] = data.video_goods_datas[i]['view'];
                        obj['time'] = data.video_goods_datas[i]['time'];
                        this.video_goods_datas.push(obj)
                    }
                    this.video_goods_datas_length = this.video_goods_datas.length
                });
                this.timea();
                this.distribution(this.startTime, this.endTime, this.typeId, this.level);
            },
            async pie(level, id, time) {
                await this.pie_post(level, id, time);
                this.piefun();
                await this.pie_child_fun({name: this.pie_name}, time)
            },
            piefun() {
                let myChart1 = echarts.init(document.getElementById("pie1"));
                let option1 = {
                    color: this.pie_color,
                    grid: {
                        x: 35,
                    },
                    tooltip: {
                        formatter: '{b}:\n{d}% ',
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
                        data: this.pie_data
                    }
                };
                myChart1.setOption(option1);

            },
            async pie_child_fun(param, time) {
                if (param) {
                    if (param.name != '其他') {
                        for (let i = 0; i < this.pie_obj.length; i++) {
                            if (this.pie_obj[i].Name.slice(0, 8) == param.name.slice(0, 8)) {
                                var id = this.pie_obj[i].id;
                                break
                            }
                        }
                        let level = parseInt(this.pie_level) + 1 + '';
                        await this.pie_child_post(level, id, 0, time, (data) => {
                            if (data.childNum === 0) {
                                for (let i = 0; i < this.pie_data.length; i++) {
                                    if (this.pie_data[i].name == this.pie_name) {
                                        this.pie_child_data = [];
                                        let pie_child_obj = {};
                                        if (this.pie_data[i].name.length > 7) {
                                            pie_child_obj['name'] = this.pie_data[i].name.slice(0, 8) + '...'
                                        } else {
                                            pie_child_obj['name'] = this.pie_data[i].name;
                                        }
                                        pie_child_obj['value'] = this.pie_data[i].value;
                                        this.pie_child_data.push(pie_child_obj)
                                        this.pie_child_color.push("rgba(242,72,125," + (1 - i * 0.1) + ")")
                                    }
                                }


                            } else {
                                this.pie_child_obj = data.List;
                                this.pie_child_data = [];
                                for (let i = 0; i < this.pie_child_obj.length; i++) {
                                    let obj = {};
                                    if (this.pie_child_obj[i].Name.length > 7) {
                                        obj['name'] = this.pie_child_obj[i].Name.slice(0, 8) + '...'
                                    } else {
                                        obj['name'] = this.pie_child_obj[i].Name;
                                    }
                                    obj['value'] = this.pie_child_obj[i].value;
                                    this.pie_child_data.push(obj)
                                    this.pie_child_color.push("rgba(242,72,125," + (1 - i * 0.1) + ")")
                                }
                            }
                            this.pie2_show = true
                        })
                    }
                }
                let myChart2 = echarts.init(document.getElementById("pie2"));
                let option2 = {
                    color: this.pie_child_color,
                    grid: {
                        x: 35,
                    },
                    tooltip: {
                        formatter: '{b}:\n{d}% ',
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
            },
            zbgl_handleCurrentChange(val) {
                let start_num = (val - 1) * 10;
                this.zbgl_post(start_num, 10, this.startTime, this.endTime, this.typeId, this.level, (data) => {
                    this.video_datas = data.video_datas
                });
            },
            bbzbgl_handleCurrentChange(val) {
                let start_num = (val - 1) * 10;
                this.bbzbgl_post(start_num, 10, this.startTime, this.endTime, this.typeId, this.level, (data) => {
                    this.video_goods_datas = [];
                    for (let i = 0; i < data.video_goods_datas.length; i++) {
                        let obj = {};
                        obj['type'] = data.video_goods_datas[i]['first'] + '>' + data.video_goods_datas[i]['second'] + '>' + data.video_goods_datas[i]['third'] + '>' + data.video_goods_datas[i]['fourth'];
                        obj['goods'] = data.video_goods_datas[i]['goods'];
                        obj['name'] = data.video_goods_datas[i]['name'];
                        obj['title'] = data.video_goods_datas[i]['title'];
                        obj['video_price'] = data.video_goods_datas[i]['video_price'];
                        obj['source_price'] = data.video_goods_datas[i]['source_price'];
                        obj['view'] = data.video_goods_datas[i]['view'];
                        obj['time'] = data.video_goods_datas[i]['time'];
                        this.video_goods_datas.push(obj)
                    }
                })
            },
            open2(id) {
                MessageBox.confirm('<span>当前下载的数据：</span><br> <span style="color: blue">类目：' + this.msg + '</span><br> <span>时间：</span>' + this.update_data + '<br>如需下载其他时间或比较对象的原始数据，请重新选择<hr>', '', {
                    // MessageBox.confirm('<el-button type="text">导出</el-button>', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true,
                    dangerouslyUseHTMLString: true
                    // type: 'warning'
                }).then(() => {
                    let startTime = this.$route.query.from;
                    let endTime = this.$route.query.to;
                    let length= (this.$route.query.catgs + '').split(',').length
                    let level = length - 1;
                    let typeId = (this.$route.query.catgs + '').split(',')[length - 1];
                    if (id == 'out-table1') {
                        //直播概览表所有数据
                        this.zbgl_post(0, 10000, startTime, endTime, typeId, level, (data) => {
                            this.all_video_datas = data.video_datas;
                            setTimeout(() => {
                                this.exportExcel(id)
                            }, 0)
                        });
                    } else {
                        this.bbzbgl_post(0, 10000, startTime, endTime, typeId, level, (data) => {
                            this.all_goods_datas = data.video_goods_datas;
                            setTimeout(() => {
                                this.exportExcel(id)
                            }, 0)
                        })
                    }
                })
            },
            price_bar() {
                let barchart = echarts.init(document.getElementById("echart_bar"));
                let max = Math.max.apply(null, this.bar_data);

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

                let m = findall(this.bar_data, max);
                let color = ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.3)'];
                for (let i = 0; i < m.length; i++) {
                    color[m[i]] = '#FFAB2C'
                }
                let baroption = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
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
                        data: ["22:00-2:00时", "2:00-6:00时", "6:00-10:00时", "10:00-14:00时", "14:00-18:00时", "18:00-22:00时"]
                    },
                    yAxis: {
                        name: '场均观看次数',
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
                                color: '#f7f7f7',
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
                        barWidth: 30,
                        name: '场均观看次数',
                        type: 'bar',
                        data: [
                            {
                                value: this.bar_data[0],

                                itemStyle: {
                                    normal: {color: color[0]}
                                }
                            }, {
                                value: this.bar_data[1],
                                itemStyle: {
                                    normal: {color: color[1]}
                                }
                            }, {
                                value: this.bar_data[2],
                                itemStyle: {
                                    normal: {color: color[2]}
                                }
                            }, {
                                value: this.bar_data[3],
                                itemStyle: {
                                    normal: {color: color[3]}
                                }
                            }, {
                                value: this.bar_data[4],
                                itemStyle: {
                                    normal: {color: color[4]}
                                }
                            }, {
                                value: this.bar_data[5],
                                itemStyle: {
                                    normal: {color: color[5]}
                                }
                            },
                        ],
                    }
                    ]
                };
                barchart.setOption(baroption);
                return m
            },
            timea() {
                this.liveTrend_post(this.startTime, this.endTime, this.typeId, this.level).then(() => {
                        let max_value = this.price_bar();
                        let arr1 = ["22:00-2:00时", "2:00-6:00时", "6:00-10:00时", "10:00-14:00时", "14:00-18:00时", "18:00-22:00时"];
                        let arr2 = [];
                        for (let i = 0; i < max_value.length; i++) {
                            arr2[i] = arr1[max_value[i]]
                        }
                        this.timearea = arr2.join(',')
                    }
                )

            },
            viewNumDistribution_bar() {
                let viewchart = echarts.init(document.getElementById("view_distribution"));
                let viewoption = {
                    color: ['#F2487D'],
                    grid: [{
                        x: '27%',
                        // y: '7%',
                        width: '100%',
                        height: '90%'
                    },],
                    tooltip: {},
                    xAxis: [{
                        gridIndex: 0,
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        }
                    },],
                    yAxis: {
                        name: '观看次数     直播场次                      ',
                        nameLocation: 'end',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            margin: 55,
                            show: true
                        },
                        data: this.view_axis
                    },
                    series: [{
                        name: '直播场次',
                        type: 'bar',
                        barWidth: 30,
                        label: {
                            normal: {
                                show: true,
                                position: "left",
                                formatter: function (data) {
                                    return data.value.toLocaleString()
                                }
                            },
                        },
                        data: this.view_data
                    }
                    ]
                };
                viewchart.clear()
                viewchart.setOption(viewoption);
            },
            goodsPriceDistribution_bar() {
                let pricechart = echarts.init(document.getElementById("price_distribution"));
                let priceoption = {
                    color: ['#3AA1FF'],
                    grid: [{
                        x: '27%',
                        // y: '7%',
                        width: '100%',
                        height: '90%'
                    },],
                    tooltip: {},
                    xAxis: [{
                        gridIndex: 0,
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        }
                    },],
                    yAxis: {
                        name: '宝贝价格     直播场次                      ',
                        nameLocation: 'end',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            margin: 55,
                            show: true
                        },
                        data: this.price_axis
                    },
                    series: [{
                        name: '直播场次',
                        barWidth: 30,
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: "left",
                                formatter: function (data) {
                                    return data.value.toLocaleString()
                                }
                            }
                        },
                        data: this.price_data
                    }
                    ]
                };
                pricechart.clear()
                pricechart.setOption(priceoption);
            },
            async page_init() {
                this.startTime = this.$route.query.from;
                this.endTime = this.$route.query.to;
                let length= (this.$route.query.catgs + '').split(',').length
                this.typeId = (this.$route.query.catgs + '').split(',')[length - 1];
                this.pie(this.level, this.typeId);
                await this.zbgl_post(0, 10, this.startTime, this.endTime, this.typeId, this.level, (data) => {
                    this.video_total = data.Total;
                    this.video_datas = data.video_datas
                });
                await this.bbzbgl_post(0, 10, this.startTime, this.endTime, this.typeId, this.level, (data) => {
                    this.goods_total = data.Total;
                    for (let i = 0; i < data.video_goods_datas.length; i++) {
                        let obj = {};
                        obj['type'] = data.video_goods_datas[i]['first'] + '>' + data.video_goods_datas[i]['second'] + '>' + data.video_goods_datas[i]['third'] + '>' + data.video_goods_datas[i]['fourth'];
                        obj['goods'] = data.video_goods_datas[i]['goods'];
                        obj['name'] = data.video_goods_datas[i]['name'];
                        obj['title'] = data.video_goods_datas[i]['title'];
                        obj['video_price'] = data.video_goods_datas[i]['video_price'];
                        obj['source_price'] = data.video_goods_datas[i]['source_price'];
                        obj['view'] = data.video_goods_datas[i]['view'];
                        obj['time'] = data.video_goods_datas[i]['time'];
                        this.video_goods_datas.push(obj)
                    }
                });
                this.timea();
                this.distribution(this.startTime, this.endTime, this.typeId, this.level);

            },
            zbgl_post(queryStartNum, queryNum, startTime, endTime, typeId, level, cb) {
                //直播概览表
                return myaxios.post('/web/quotation/liveOverview', {
                    queryStartNum: queryStartNum,
                    queryNum: queryNum,
                    startTime: startTime,
                    endTime: endTime,
                    typeId: typeId,
                    level: level,
                }).then(data => {
                    if (typeof cb == "function") {
                        cb(data.data.data)
                    }
                });
            },
            bbzbgl_post(queryStartNum, queryNum, startTime, endTime, typeId, level, cb) {
                //宝贝直播概览
                return myaxios.post('web/quotation/liveGoodsOverview', {
                    queryStartNum: queryStartNum,
                    queryNum: queryNum,
                    startTime: startTime,
                    endTime: endTime,
                    typeId: typeId,
                    level: level,
                }).then(data => {
                    if (typeof cb == "function") {
                        cb(data.data.data)
                    }
                })
            },
            pie_post(level, id, time) {
                this.pie1_show = false
                return myaxios.post('/web/quotation/typeProportion', {
                    level: level,
                    id: id,
                    time: time,
                }).then(data => {
                    this.pie_obj = data.data.data.List;
                    this.pie_data = [];
                    this.pie_level = level;
                    for (let i = 0; i < this.pie_obj.length; i++) {
                        let obj = {};
                        if (this.pie_obj[i].Name.length > 7) {
                            obj['name'] = this.pie_obj[i].Name.slice(0, 8) + '...'
                        } else {
                            obj['name'] = this.pie_obj[i].Name;
                        }
                        // obj['name'] = this.pie_obj[i].Name;
                        obj['value'] = this.pie_obj[i].value;
                        if (id == this.pie_obj[i].id) {
                            this.pie_name = this.pie_obj[i].Name;
                            obj['selected'] = true
                        }
                        this.pie_data.push(obj);
                        this.pie_color.push("rgba(242,72,125," + (1 - i * 0.1) + ")")
                    }
                    this.pie1_show = true
                });
            },
            pie_child_post(level, id, isChild, time, cb) {
                this.pie2_show = false
                return myaxios.post('/web/quotation/typeProportion', {
                    level: level,
                    id: id,
                    isChild: isChild,
                    time: time,

                }).then(data => {
                    if (typeof cb == "function") {
                        cb(data.data.data)
                    }
                });
            },
            liveTrend_post(startTime, endTime, typeId, level) {
                this.zbqs_show = false
                return myaxios.post('/web/quotation/liveTrend', {
                    startTime: startTime,
                    endTime: endTime,
                    typeId: typeId,
                    level: level
                }).then(data => {
                    this.bar_data = [];
                    this.bar_data.push(data.data.data['22:00-2:00']);
                    this.bar_data.push(data.data.data['2:00-6:00']);
                    this.bar_data.push(data.data.data['6:00-10:00']);
                    this.bar_data.push(data.data.data['10:00-14:00']);
                    this.bar_data.push(data.data.data['14:00-18:00']);
                    this.bar_data.push(data.data.data['18:00-22:00']);
                    this.zbqs_show = true
                })
            },
            distribution(startTime, endTime, typeId, level) {
                this.viewNumDistribution_post(startTime, endTime, typeId, level);
                this.goodsPriceDistribution_post(startTime, endTime, typeId, level)
            },
            viewNumDistribution_post(startTime, endTime, typeId, level) {
                this.cjgkcs_show=false
                return myaxios.post('/web/quotation/viewNumDistribution', {
                    startTime: startTime,
                    endTime: endTime,
                    typeId: typeId,
                    level: level
                }).then(data => {
                    let post_data = data.data.data;
                    let section = post_data.section;
                    this.view_axis = [];
                    let str = '';
                    if (post_data.List) {
                        for (let i = 0; i < post_data.List.length; i++) {
                            if (i == (post_data.List.length - 1)) {
                                str = (i * section > 10000 ? parseFloat((i * section) / 10000).toFixed(1) + 'w' : i * section) + '+'
                            } else {
                                str = (i * section > 10000 ? parseFloat((i * section) / 10000).toFixed(1) + 'w' : i * section) + '-' + ((i + 1) * section > 10000 ? parseFloat(((i + 1) * section) / 10000).toFixed(1) + 'w' : (i + 1) * section);
                            }
                            this.view_axis.push(str)
                        }
                        this.view_data = post_data.List;
                        this.view_data.reverse();
                        this.view_axis.reverse();
                    }
                    this.cjgkcs_show=true
                    setTimeout(()=>{
                        this.viewNumDistribution_bar()
                    },0)
                })
            },
            goodsPriceDistribution_post(startTime, endTime, typeId, level) {
                this.bbjgfb_show=false
                return myaxios.post('/web/quotation/goodsPriceDistribution', {
                    startTime: startTime,
                    endTime: endTime,
                    typeId: typeId,
                    level: level
                }).then(data => {
                    let post_data = data.data.data;
                    let section = parseInt(post_data.section);
                    this.price_axis = [];
                    let str = '';
                    if (post_data.List) {
                        for (let i = 0; i < post_data.List.length; i++) {
                            if (i == (post_data.List.length - 1)) {
                                str = (i * section > 10000 ? parseInt((i * section) / 10000) + 'w' : i * section) + '+'
                            } else {
                                str = (i * section > 10000 ? parseInt((i * section) / 10000) + 'w' : i * section) + '-' + ((i + 1) * section > 10000 ? parseInt(((i + 1) * section) / 10000) + 'w' : (i + 1) * section);
                            }
                            this.price_axis.push(str)
                        }
                        this.price_data = post_data.List;
                        this.price_axis.reverse();
                        this.price_data.reverse();
                    }
                    this.bbjgfb_show=true
                    setTimeout(()=>{
                        this.goodsPriceDistribution_bar()
                    })
                })
            },
            async six_img(typeId, startTime, endTime, level) {
                this.siximg_show = false
                //直播总览
                await myaxios.post('/web/quotation/typeLiveCount', {
                    typeId: typeId,
                    time: startTime
                }).then(data => {
                    let res = data.data.data
                    this.echarts_objs[0]['num'] = res.accCount
                    this.echarts_objs[1]['num'] = res.liveCount
                    this.echarts_objs[2]['num'] = res.vCount
                    this.echarts_objs[3]['num'] = res.shopCount
                    this.echarts_objs[5]['num'] = res.goodsCount
                    this.echarts_objs[4]['num'] = res.goodsAll
                })
                //类目的每天合作主播，直播场次，直播店铺数，直播商品数，直播商品次数
                await myaxios.post('/web/quotation/typeAllDetail', {
                    startTime: startTime,
                    endTime: endTime,
                    typeId: typeId,
                    level: level
                }).then(data => {
                    let res = data.data.data
                    let anchorNumList_data = []
                    let anchorNumList_axis = []
                    let goodsAllList_data = []
                    let goodsAllList_axis = []
                    let goodsNumList_data = []
                    let goodsNumList_axis = []
                    let liveIdNumList_data = []
                    let liveIdNumList_axis = []
                    let shopNumList_data = []
                    let shopNumList_axis = []
                    for (let i = 0; i < res.anchorNumList.length; i++) {
                        anchorNumList_data.push(res.anchorNumList[i].anchorNum)
                        anchorNumList_axis.push(res.anchorNumList[i].date)
                    }
                    this.$set(this.echarts_objs[0], 'optiondata', {
                        xAxis: anchorNumList_axis,
                        data: anchorNumList_data,
                    });


                    for (let i = 0; i < res.goodsAllList.length; i++) {
                        goodsAllList_data.push(res.goodsAllList[i].goodsAllNum)
                        goodsAllList_axis.push(res.goodsAllList[i].date)
                    }
                    this.$set(this.echarts_objs[5], 'optiondata', {
                        data: goodsAllList_data,
                        xAxis: goodsAllList_axis,
                    });


                    for (let i = 0; i < res.goodsNumList.length; i++) {
                        goodsNumList_data.push(res.goodsNumList[i].goodsNum)
                        goodsNumList_axis.push(res.goodsNumList[i].date)
                    }
                    this.$set(this.echarts_objs[4], 'optiondata', {
                        data: goodsNumList_data,
                        xAxis: goodsNumList_axis,
                    });

                    for (let i = 0; i < res.liveIdNumList.length; i++) {
                        liveIdNumList_data.push(res.liveIdNumList[i].liveIdNum)
                        liveIdNumList_axis.push(res.liveIdNumList[i].date)
                    }
                    this.$set(this.echarts_objs[1], 'optiondata', {
                        data: liveIdNumList_data,
                        xAxis: liveIdNumList_axis,
                    });
                    for (let i = 0; i < res.shopNumList.length; i++) {
                        shopNumList_data.push(res.shopNumList[i].shopNum)
                        shopNumList_axis.push(res.shopNumList[i].date)
                    }
                    this.$set(this.echarts_objs[3], 'optiondata', {
                        data: shopNumList_data,
                        xAxis: shopNumList_axis,
                    });
                    // this.echarts_objs[0]['optiondata'] = {
                    //     xAxis: anchorNumList_axis,
                    //     data: anchorNumList_data,
                    // }
                })
                //类目的场均观看数
                await myaxios.post('/web/quotation/typeAvgViewNum', {
                    startTime: startTime,
                    endTime: endTime,
                    typeId: typeId,
                    level: level,
                }).then(data => {
                    let res = data.data.data
                    let vgViewList_data = []
                    let vgViewList_axis = []
                    for (let i = 0; i < res.vgViewList.length; i++) {
                        vgViewList_data.push(res.vgViewList[i].avgViewNum)
                        vgViewList_axis.push(res.vgViewList[i].date)
                    }
                    this.$set(this.echarts_objs[2], 'optiondata', {
                        data: vgViewList_data,
                        xAxis: vgViewList_axis,
                    });
                    let linecolor = ['rgba(58, 160, 255,1)', 'rgba(242,72,125,1)', 'rgba(250,211,66,1)', 'rgba(78,203,115,1)', 'rgba(151,95,229,1)', 'rgba(54,203,203,1)'];
                    let areacolor = ['rgba(58, 160, 255,0.1)', 'rgba(242,72,125,0.1)', 'rgba(250,211,66,0.1)', 'rgba(78,203,115,0.1)', 'rgba(151,95,229,0.1)', 'rgba(54,203,203,0.1)'];
                    this.siximg_show = true;
                    setTimeout(() => {
                        (new Array(6)).fill(true).forEach((item, i) => {
                            let myChart = echarts.init(document.getElementById("echart" + i));
                            let option = {
                                grid: {
                                    x: 20,
                                    y: 0,
                                    x2: 20,
                                    y2: 30,
                                    width: 260,
                                    height: 134
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'line'
                                    }
                                },
                                xAxis: {
                                    show: false,
                                    data: this.echarts_objs[i].optiondata.xAxis
                                },
                                yAxis: {show: false,},
                                series: [{
                                    symbol: 'none',
                                    type: 'line',
                                    itemStyle: {
                                        normal: {
                                            color: linecolor[i]
                                        }
                                    },
                                    areaStyle: {
                                        normal: {
                                            color: areacolor[i]
                                        }
                                    },
                                    data: this.echarts_objs[i].optiondata.data
                                }
                                ]
                            };
                            myChart.setOption(option);
                        })
                    })
                })
            },

        }
    };
</script>
<style scoped lang="less">
    @import '../assets/css/part.less';

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

    .part {
        &.part1 {
            margin-top: 60px;
        }
        .part-name {
            &.one {
                margin-left: 55px;
            }
            padding-top: 20px;
            padding-bottom: 20px;
            position: relative;
            span {
                &.lm {
                    color: #fff;
                    background-color: @mainColor;
                    padding: 2px 5px;
                    margin-left: 6px;
                    border-radius: 5px;
                    font-size: 14px;
                }
                &.date {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    color: #000;
                    opacity: 0.54;
                }
            }
            .more {
                position: absolute;
                right: 56px;
                color: @mainColor;
                font-size: 14px;
                img {
                    vertical-align: middle;
                }
            }
        }
        .export {
            margin-top: 8px;
            background-color: @mainColor;
            color: #fff;
            font-size: 14px;
            width: 100px;
            height: 30px;
            padding: 0;
            line-height: 30px;
            i {
                color: @mainColor;
                background-color: #fff;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                vertical-align: middle;
                margin-right: 2px;
            }
        }
        .part_content {
            /*xpadding: 0 55px 20px;*/
            background: #f7f7f7;
            box-sizing: border-box;
            width: 100%;
            .echarts {
                margin-left: 55px;
                margin-right: 55px;
                background-color: #f7f7f7;
                .echart_box {
                    /*vertical-align: top;*/
                    background: white;
                    height: 286px;
                    width: 300px;
                    box-sizing: border-box;
                    display: inline-block;
                    border-radius: 4px;
                    transition: box-shadow .1s linear;
                    xbox-shadow: 1px 1px 8px -4px rgba(0, 0, 0, 0.2);
                    .imgloading {
                        height: 164px;
                        line-height: 164px;
                    }
                    &:hover {
                        box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12);
                    }
                    &:not(:nth-child(3n)) {
                        margin-right: 45px;
                    }
                    &:nth-child(n+3) {
                        margin-top: 32px;
                    }
                    p {
                        text-align: center;
                    }
                    .name {
                        margin-top: 30px;
                        font-size: 14px;
                        font-weight: bold;
                        opacity: 0.54;
                    }
                    .num {
                        margin-top: 21px;
                        font-size: 40px;
                    }
                    .comp {
                        margin-top: 13px;
                        font-size: 14px;
                        .tip {
                            opacity: 0.54;
                        }
                        .up {
                            color: @mainColor;
                        }
                        .down {
                            color: #1AAD19
                        }
                    }
                    .echart {
                        width: 300px;
                        height: 164px;
                        margin: auto;
                    }
                }
            }
            .pie {
                margin-top: 30px;
                display: inline-block;
                background: white;
                height: 310px;
                width: 50%;
                vertical-align: top;
                p {
                    margin-left: 95px;
                    margin-top: 10px;
                }
                div {
                    width: 100%;
                    height: 300px;
                }
                .imgloading {
                    height: 300px;
                    line-height: 300px;
                }
            }

            &.zbsx {
                background: white;
                .data {
                    /*border: 1px solid;*/
                    box-sizing: border-box;
                    display: inline-block;
                    margin-top: 50px;
                    width: 50%;
                    .tit {
                        font-size: 14px;
                        font-weight: bold;
                        &.bbjg {
                            text-align: center;
                        }
                    }
                    .echart {
                        width: 100%;
                        height: 400px;
                    }
                    .imgloading{
                        height: 400px;
                        line-height: 400px;
                    }
                }
            }
            &.zbqs {
                box-sizing: border-box;
                padding-top: 20px;
                width: 100%;
                background: white;
                .echart {
                    box-sizing: border-box;
                    width: 65%;
                    height: 320px;
                }
                .bz {
                    box-sizing: border-box;
                    width: 35%;
                    margin-top: 130px;
                    padding-left: 105px;
                    .gold {
                        color: #ffab2c;
                        i {
                            font-size: 20px;
                            margin-right: 3px;
                        }
                    }
                }
            }
            &.zbsx {
                height: 480px;
            }
        }
    }

    .part1 {
        padding: 0px;
    }
</style>
<style lang="less">
    @import '../assets/css/pager.less';
</style>
