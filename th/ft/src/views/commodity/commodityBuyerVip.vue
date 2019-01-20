<template>
    <div class="page">
        <Qrcode ref="qrcode" :detail="classifyProduct" v-if="classifyProduct.id"></Qrcode>
        <div class="select-share" v-show="shareSelectShow" @click="shareSelectShow=false">
            <div class="card" @click.stop="">
                <div class="title">分享</div>
                <div class="select">
                    <div @click="shareClick">
                        <img src="../../assets/img/order/share_href.png" alt="">
                        <p>分享链接</p>
                    </div>
                    <div @click="getShareImg">
                        <img src="../../assets/img/order/share_img.png" alt="">
                        <p>分享图片</p>
                    </div>
                </div>
                <div class="action" @click="shareSelectShow=false">
                    <i class="iconfont icon-guanbi"></i>
                </div>
            </div>
        </div>

        <div id='commodity'>
            <div class="share-result" v-if="shareImgShow">

                <div class="img">
                    <div class="close" @click.stop="shareImgShow=false">
                        <i class="iconfont icon-guanbi"></i>
                    </div>
                    <img :src="shareImg" alt="">
                    <div class="tip-text">
                        长按保存图片
                    </div>
                </div>
            </div>
            <img class="share-img" v-if="Number(UserInfo.rank)>0&&classifyProduct.type!==4&&!hideTab"
                 @click="getShareImg" src="../../assets/img/order/share.png" alt="">
            <div class="commodity-img" v-if="!hideTab">
                <mt-swipe :auto="3000">
                    <mt-swipe-item v-for="(item, index) in classifyProduct.imgUrls" :key="index">
                        <img class="detail-img" :src="item+'@600w'" alt="">
                    </mt-swipe-item>
                </mt-swipe>
            </div>

            <div class="limit_time_shop_box" v-if="classifyProduct.activityBeginTime != null">
                <div class="limit_time_shop_left">
                    <div class="limit_time_shop_left_top"><span class="span1">￥</span><span class="span2">{{isShop?classifyProduct.priceV1str:classifyProduct.priceV0str}}</span></div>
                    <div class="limit_time_shop_left_bottom"><s>￥{{classifyProduct.marketPricestr}}</s></div>
                </div>
                <div class="limit_time_shop_right">
                    <div class="limit_time_shop_right_top" v-if="limitingShow">
                        <span>{{startTime.time1}}月</span>
                        <span>{{startTime.time2}}日</span>
                        <span><span class="spancalor">{{startTime.time3}}</span>时</span>
                        <span><span class="spancalor">{{startTime.time4}}</span>分</span>
                        <!--<span><span class="spancalor">{{startTime.time5}}</span>秒</span>-->
                        <span>开抢</span>
                    </div>
                    <div class="limit_time_shop_right_top" v-else><span>距结束</span>
                        <span class="spancalor">{{limitTime.time1}}</span><span>天</span>
                        <span class="spancalor">{{limitTime.time2}}</span><span>时</span>
                        <span class="spancalor">{{limitTime.time3}}</span><span>分</span>
                        <span class="spancalor">{{limitTime.time4}}</span><span>秒</span>
                    </div>
                    <div class="limit_time_shop_right_bottom" v-if="limitingShow">
                        <div class="limit_time_line_box">
                            <div class="limit_time_num1">限购{{classifyProduct.storeNumber}}件</div>
                        </div>
                    </div>
                    <div class="limit_time_shop_right_bottom" v-else>
                        <div class="limit_time_line_box">
                            <div class="limit_time_line" :style="{width:lineLenght+'%'}"></div>
                            <div class="limit_time_num">
                                <div class="cuncun_num_left">已抢{{classifyProduct.salesNumber}}件</div>
                                <div class="cuncun_num_right">仅剩{{classifyProduct.storeNumber}}件</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="commodity_Infomation" v-if="!hideTab&&classifyProduct.title">
                <!--价格-->
                <div class="commodity_price" v-if="classifyProduct.activityBeginTime == null">
                    <div class="price">
                        <p class="discountPrice" v-if="classifyProduct.type===4">
                            <span>{{(isShop?classifyProduct.priceV1str:classifyProduct.priceV0str)+'积分'}}</span>
                        </p>
                        <p class="discountPrice" v-else>
                            <span>{{'￥'+(isShop?classifyProduct.priceV1str:classifyProduct.priceV0str)}}</span>
                        </p>

                    </div>

                    <div class="collect" @click='CollectClick'>
                        <img v-if="classifyProduct.isCollect=='1'" src="../../assets/images/collect.png"
                             style="width: 25px"/>
                        <img v-else src="../../assets/images/nolike.png" style="width: 25px"/>
                        <p>{{classifyProduct.isCollect=="1"?"已收藏":'收藏'}}</p>
                    </div>
                </div>
                <p class="price-gray" v-if="classifyProduct.activityBeginTime == null">零售价：<span
                        class="line-through">¥{{classifyProduct.marketPricestr}}</span></p>
                <div class="other-prices">
                    <p class="member-price" v-for="item in otherPrice">{{item.name}}：¥{{item.price}}</p>
                    <!--  <p class="member-price" v-if="Number(UserInfo.rank) > 0&&classifyProduct.type !== 4">
                          会员价：¥{{classifyProduct.priceV0str}}</p>-->
                </div>
                <!--加入店主 tip-->
                <div class="upgrade-tip" v-if="classifyProduct.diffPrice&&UserInfo.rank == 0&&classifyProduct.type!==4">
                    <div>
                        <p class="upgrade-text">火兔店主专享价<span class="them">￥{{classifyProduct.priceV1str}}</span></p>
                        <p>立即成为店主，立省<span class="them">{{classifyProduct.diffPrice}}</span>元</p>
                    </div>
                    <div class="btn" @click="$router.push({name: 'upgradeVip', query: {type: 1}})">
                        开通店主<i class="iconfont icon-right"></i>
                    </div>
                </div>
                <!--标题-->
                <div class="commodity_Infomation_Css" style="position: relative">
                    <p class="commodity_title">{{classifyProduct.title}}</p>
                    <div class="collect" @click='CollectClick' :class="{collect1:true}" v-if="classifyProduct.activityBeginTime != null">
                        <img v-if="classifyProduct.isCollect=='1'" src="../../assets/images/collect.png"
                             style="width: 25px"/>
                        <img v-else src="../../assets/images/nolike.png" style="width: 25px"/>
                        <p>{{classifyProduct.isCollect=="1"?"已收藏":'收藏'}}</p>
                    </div>
                </div>
                <div class="labels">
                    <div class="label back" v-if="classifyProduct.isNew">新品</div>
                    <div class="label back" v-if="Number(UserInfo.rank) > 0&&classifyProduct.diffPrice">
                        省{{classifyProduct.diffPrice}}元
                    </div>
                    <div class="label" v-if="classifyProduct.ecardAmount">E卡最高可抵扣{{classifyProduct.ecardAmount}}元</div>
                </div>
                <div class="tip" v-if="classifyProduct.ecardAmount">该款商品支持火兔E卡，但折扣与E卡不能同时享受！</div>
            </div>
            <div class="healthNum_box" v-if="classifyProduct.healthCount!=null">
                <ul>
                    <li class="health_num1">健康指数：{{classifyProduct.healthCount!=null?classifyProduct.healthCount:''}}</li>
                    <li class="health_num2" v-for="(item,ide) in classifyProduct.healthTags" :key="ide">{{item}}</li>
                </ul>
            </div>
            <!--  <div class="com_Info">
                  &lt;!&ndash; <div > &ndash;&gt;
                  <p  @click="showclick()" >选择规格</p>
                  <p v-show='selspecifications.length==specificationList.length' >已选择:<span v-for='item in selspecifications'>{{item}}</span></p>
                  &lt;!&ndash; </div> &ndash;&gt;
              </div>-->
            <!--店铺-->
            <div class="invite-shop" v-if="inviteInfo">
                <img class="img" :src="inviteInfo.avatar" alt="">
                <div>
                    <p class="nickname">{{inviteInfo.nickname}}</p>
                    <p class="rank">{{inviteInfo.rank}}</p>
                </div>
                <div class="home" @click="$router.push('/')">去商城逛逛</div>
            </div>
            <!--套餐详情-->

            <div class="Payment_datails" v-html='classifyProduct.detail'>
                <!-- <p class="Payment_datails_title">——&nbsp;套餐详情&nbsp;——</p>
                <p class="commodity_title_Css">小米笔记本Air 13.3" <span class="discrete_graphics_card">独立显卡</span></p>
                <p class="discrete_graphics">带独立显卡的轻薄笔记本</p>
                <p class="commodity_details_image"><img src="../images/commodity_details.png" width="90%" /></p>
                <p class="commodity_describe">
                    选择轻薄，还是选择性能？如果只是强调性能，就没有容纳一块13.3" 屏幕和全尺寸键盘，却能够轻薄的全金属机身 选择轻薄，还是选择性能？如果只是强调性能，就没有容纳一块13.3" 屏幕和全尺寸键盘，却能够轻薄的全金属机身
                </p>
                <p class="distance_from_bottom"></p> -->
            </div>
            <div class="option" v-if="isGrade">
                <div class="welfare" @click="linkToOrder">
                    立即购买
                </div>
            </div>
            <template v-if="classifyProduct.type===4">
                <div class="option">
                    <div class="welfare" @click="showclick(2)">
                        立即兑换
                    </div>
                </div>
            </template>
            <template v-else>
                <div v-show='CustomerRank.rank==0&&!hideTab' class="option">
                    <div class="home" @click="$router.push({name: 'home'})">
                        <img src="../../assets/img/home/home_icon.png" alt="">
                        <span>首页</span>
                    </div>
                    <div @click='choppingCarClick' class="shopping_car">
                        <img src="../../assets/img/home/cart_icon.png" alt="">
                        <span>购物车</span>
                    </div>
                    <div class="share" @click="showclick(1,0)">
                        <span>加入购物车</span>
                    </div>
                    <div class="palce_order" :class="{palce_order1:clickShow}" @click="showclick(2)">
                        <span>立即购买</span>
                    </div>
                </div>

                <div v-show='CustomerRank.rank!=0&&!hideTab' class="option">
                    <div class="home" @click="$router.push({name: 'home'})">
                        <img src="../../assets/img/home/home_icon.png" alt="">
                        <span>首页</span>
                    </div>
                    <div @click='choppingCarClick' class="shopping_car">
                        <img src="../../assets/img/home/cart_icon.png" alt="">
                        <span>购物车</span>
                    </div>
                    <div class="share" @click='shareSelect'>
                        <span>{{[3,4].includes(classifyProduct.settleType)&&Number(CustomerRank.rank)>0?('分享赚钱￥'+(productProfits||'')):'分享'}}</span>
                    </div>
                    <div class="palce_order" :class="{palce_order1:clickShow}" @click="showclick()">
                        <span>{{[3,4].includes(classifyProduct.settleType)&&Number(CustomerRank.rank)>0?('自购省钱￥'+(productProfits||'')):'下单'}}</span>
                    </div>

                </div>
            </template>


            <div id="hidebg" v-show="hidebg" @click="hide()"></div>

            <div class="dialog dialog--show" v-if="showCenterDialog" @click='shareCloseClick'>
                <div class="dialog__mask"></div>

                <div class="dialog__container"
                     style="display:flex;align-items:center;justify-content:center;flex-direction:column;">
                    <!--  //此区域自定义视图  -->
                    <div class="flex_Center">

                        <img class="shareLogImg" src="http://p20gi5fjt.bkt.clouddn.com/shareLog.png">

                    </div>
                </div>
            </div>


            <Specifications ref="spec"/>
            <f-w></f-w>
        </div>
        <Scroll type="2" :id="classifyProduct.id"/>
        <to-top></to-top>
        <div class="limit_time_tipbox" v-if="limitTip">特卖商品未到开抢时间暂不能购买，请等待活动开始！</div>
    </div>
</template>

<script>
    import {
        getProductDiscount,
        getProductDetail,
        getProductTagList,
        getSkuIdByProductTags,
        addToCard, getInviteInfo,
        findBenchmarkPrice
    } from '../../service/commodityDetail'
    import {findWelfareValue} from '../../service/home/welfare.service'
    import Specifications from '@/components/commodity/specifications'
    import {cancelProductCollect} from "../../service/profile/collection.service";
    import {productCollect} from "../../service/cart.service";
    import {getRank} from "../../service/home.service";

    import Qrcode from '@/components/commodity/shareImg';
    import Scroll from '@/components/commodity/scrollComponent'

    import {Indicator, Toast} from 'mint-ui';

    export default {
        name: "commodity-buyer-vip",
        components: {
            Specifications,
            Qrcode,
            Scroll
        },
        data: function () {
            return {
                inviteInfo: null,
                shareSelectShow: false,
                wrapper: [],
                id: null,//产品目录
                classifyProduct: {},//商品
                specificationList: [],
                specSelect: [],
                show: false,
                selspecifications: '',//选中的规格
                productTageid: null,
                inviteNumber: '',//分享人编号
                skuid: '',
                setcount: 1,
                choose: false,
                collectId: null,
                CustomerRank: {'rank': 0, 'rankName': '会员'},
                showCenterDialog: false,
                link: '',
                allprice: 0,
                productDiscount: 10, // 单品折扣
                initPro: null,
                hideTab: false,
                clickType: 0, // 1购物车
                hidebg: false,
                hidebox: false,
                productProfits: null,
                shareImg: '',
                shareImgShow: false,
                inviterNumber: '',
                otherPrice: [],
                // 升级套餐
                isGrade: false,
                lineLenght:0,
                limitTip:false,//提示显示控制
                clickShow:false,//判断是否可购买 ture:不可购买
                limitingShow:true,//判断是预热还是正在抢购
                clearTimer:null,//定时器
                limitTime:{//定时器时间
                    time1:'00',
                    time2:'00',
                    time3:'00',
                    time4:'00',
                },
                startTime:{//开始时间
                    time1:'',
                    time2:'',
                    time3:'',
                    time4:'',
                    time5:'',
                }
            }
        },
        // beforeRouteEnter (to, from, next) {
        //     getPost(to.params.id, (err, post) => {
        //         next(vm => vm.setData(err, post))
        //     })
        // },
        created:function(){

        },
        activated: function () {
            window.scrollTo(0, 0);
            this.inviteNumber = this.$route.query.inviteNumber || localStorage.getItem('appKey') || '';
            this.$store.dispatch('wxInit');
            this.id = this.GetRequest().id;
            this.hideTab = this.$route.query.hide === 'hide';
            this.isGrade = this.$route.query.type === 'upgrade';
            // var link=encodeURIComponent(window.location.href.split('#')[0]);
            this.onRead();
            this.findWelfareValue();
            this.getRank();
            this.specificationClick();
            // 配置 分享
            this.getTicket();
            //
            this.getInviteInfo();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
            this.$store.dispatch('configShare');
        },
        beforeDestroy :function(){
            // var that = this;
            // clearInterval(this.clearTimer);
            // this.clearTimer = null;
        },
        beforeRouteLeave(to, from, next) {
            // ....
            var that = this;
            clearInterval(that.clearTimer);
            next()
        },
        methods: {
            timestampToTime:function(timestamp) {//限时购开始时间
                // console.log(timestamp)
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear();
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
                var D = date.getDate();
                var h = date.getHours();
                var m = date.getMinutes();
                var s = date.getSeconds();
                this.startTime.time1 = M;
                this.startTime.time2 = D;
                this.startTime.time3 = h;
                this.startTime.time4 = m;
                this.startTime.time5 = s;
            },
            limitTimeFun:function(limittime){//限时购倒计时s
                var times = Math.ceil(limittime/1000);
                var that = this;
                this.clearTimer = setInterval(function(){
                    var day=0, hour=0, minute=0, second=0;//时间默认值
                    if(times > 0){
                        day = Math.floor(times / (60 * 60 * 24));
                        hour = Math.floor(times / (60 * 60)) - (day * 24);
                        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
                        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                    }
                    if (day <= 9) day = '0' + day;
                    if (hour <= 9) hour = '0' + hour;
                    if (minute <= 9) minute = '0' + minute;
                    if (second <= 9) second = '0' + second;
                    that.limitTime.time1 = day;
                    that.limitTime.time2 = hour;
                    that.limitTime.time3 = minute;
                    that.limitTime.time4 = second;
                    if(times<=0){
                        clearInterval(that.clearTimer);
                    }
                    times--;
                    // console.log(times)
                },1000);
            },
            tip: function () {
                Toast('该商品已告罄');
            },
            showclick: async function (type,n) {
                if(this.clickShow == true && n != 0){
                    // Toast('特卖商品未到开枪时间暂不能购买，请等待活动开始！');
                    this.limitTip = true;
                    var that = this;
                    var cleartimer1 = setTimeout(function(){
                        that.limitTip = false;
                        clearTimeout(cleartimer1);
                    },3000);
                    return;
                }
                const res = await this.$refs.spec.getSpec(this.specificationList, this.classifyProduct);
                this.specSelect = res.select;
                this.setcount = res.count;
                //  type = res.type;
                if (res.type === 1) {
                    type = 1
                }
                if (type === 1) {
                    this.shopingcartClick(res.sku);
                } else {
                    this.payClick(res.sku, res.price, res.marketPrice);
                }
            },
            GetRequest: function () {
                return this.$route.query;
            },
            getRank: function () {
                if (this.UserInfo.token)
                    getRank().then(
                        res => {
                            if (res.status === '0') {
                                this.CustomerRank = res.data;
                            }
                        }
                    );
            },
            getInviteInfo: function () {
                if (this.$route.query.inviterNumber) {
                    //  this.inviterNumber = this.$route.query.inviterNumber;
                    getInviteInfo({customerNumber: this.$route.query.inviterNumber}).then(
                        res => {
                            if (res.status === '0') {
                                this.inviteInfo = res.data;
                            }
                        }
                    );
                }
            },
            getShareImg: async function () {
                //
                this.shareSelectShow = false;
                if (!this.shareImg) {
                    Indicator.open('正在生成图片');
                    try {
                        this.shareImg = await this.$refs.qrcode.getImg();
                    } catch (e) {
                    }
                    Indicator.close();
                }
                if (this.shareImg) {
                    this.shareImgShow = true;
                } else {
                    Toast('生成失败，请再试一次');
                }
            },

            onRead: function () {
                const that = this;
                this.initPro = new Promise(async (resolve, reject) => {
                    // await this.getProductDiscount();
                    const res = await getProductDetail({id: that.id, load: true});
                    // clearInterval(that.clearTimer);
                    if (res.status === '0') {
                        that.classifyProduct = res.data;
                        if(res.data.activityBeginTime != null){
                            that.timestampToTime(parseInt(res.data.activityBeginTime));
                            if(parseInt(res.data.activityBeginTime)-parseInt(res.data.nowTime)>0){//预热时间
                                that.limitingShow = true;
                                that.clickShow = true;
                            }else{//抢购时间
                                that.limitingShow = false;
                                that.clickShow = false;
                                if(res.data.storeNumber==0){
                                    this.lineLenght = 100;
                                }else{
                                    this.lineLenght =(res.data.salesNumber/(res.data.salesNumber + res.data.storeNumber))*100;
                                    if(this.lineLenght>=100){
                                        this.lineLenght = 100;
                                    }
                                    // console.log(this.lineLenght)
                                }
                                if(parseInt(res.data.activityEndTime)-parseInt(res.data.nowTime)>0){
                                    that.limitTimeFun(parseInt(res.data.activityEndTime)-parseInt(res.data.nowTime));
                                }
                            }
                        }
                        resolve();
                        // that.classifyProduct=res.data;
                    } else {
                        reject()
                    }
                    // 获取竞标价
                    if (that.classifyProduct.type !== 4) {
                        return;
                    }
                    const priRes = await findBenchmarkPrice({productId: that.id});
                    if (priRes.status === '0') {
                        that.otherPrice = priRes.data;
                    }
                });


            },

            shareSelect: function () {
                this.shareSelectShow = true;
                //  this.shareClick();
            },
            shareClick: function () {
                this.shareSelectShow = false;
                this.showCenterDialog = !this.showCenterDialog;
            },

            shareCloseClick: function () {
                const that = this;
                that.showCenterDialog = !that.showCenterDialog;
            },

            choppingCarClick: function () {
                // const that=this;
                // location.href='../shoopCart/shoopCart.html';
                this.$router.push({name: 'cart'})
            },

            /**
             * 福利商品  获取 利润
             */
            findWelfareValue: async function () {
                if (this.UserInfo.token) {
                    await this.initPro;
                    if ([3, 4].includes(this.classifyProduct.settleType)) {
                        ({data: this.productProfits} = await findWelfareValue({productId: this.classifyProduct.id}));
                    }
                }

            },
            /**
             * 收藏
             * @constructor
             */
            CollectClick: async function () {
                const res = await (this.classifyProduct.isCollect === '0' ? productCollect({id: this.id}) : cancelProductCollect({id: this.id}));
                if (res.status === '0') {
                    if (this.classifyProduct.isCollect === '1') {
                        this.classifyProduct.isCollect = '0';
                        layer.msg('已取消')
                    } else {
                        this.classifyProduct.isCollect = '1';
                        layer.msg('已收藏')
                    }
                }
            },

            linkToOrder: function () {
                if (+this.$route.query.shopType === 1) {
                    if (Number(this.UserInfo.rank) >= 1) {
                        Toast('您已拥有此服务');
                        return;
                    }
                } else {
                    if (Number(this.UserInfo.rank) >= 2) {
                        Toast('您已拥有此服务');
                        return;
                    }
                }
                this.$router.push({name: 'myOrder', query: {type: 'upgrade', shopType: this.$route.query.shopType}})
            },

            payClick: async function (sku, price, marketPrice) {
                const that = this;
                if (this.UserInfo.token) {
                    that.skuid = sku;

                    let arr = [];
                    //
                    arr[0] = Object.assign({}, this.classifyProduct, {
                        quantity: that.setcount,
                        productTitle: that.classifyProduct.title,
                        productImg: that.classifyProduct.mainImg,
                        productIntro: this.specSelect.map((i, index) => {
                            return this.specificationList[index].productTagRetList.find((j) => {
                                return j.productTageid === i;
                            }).name;
                        }).join(','),
                        price: price,
                        productId: that.classifyProduct.id,
                        productTagId: that.skuid,
                        marketPrice: marketPrice,
                    });

                    that.allprice = (that.setcount * price);

                    localStorage.inventoryList = JSON.stringify(arr);
                    localStorage.inventoryList2 = JSON.stringify([{list: arr}]);
                    localStorage.allprice = that.allprice;
                    //
                    //   location.href='../myOrder/myOrder.html?inviteNumber='+that.inviteNumber;
                    that.$router.push({
                        name: 'myOrder',
                        query: {inviteNumber: that.inviteNumber, shop: that.inviteInfo ? 'shop' : ''}
                    })


                } else {
                    //  location.href='../login/login.html'
                    that.$router.push({name: 'login'})
                }
            },

            shopingcartClick: async function (sku) {
                const that = this;

                if (this.UserInfo.token) {

                    that.skuid = sku;
                    await addToCard({
                        "productTagId": this.skuid,
                        "quantity": that.setcount,
                        load: true,
                        successMsg: '添加成功'
                    });

                } else {
                    that.$router.push({name: 'login'})
                }
            },


            //获取商品规格

            specificationClick: async function () {
                const res = await getProductTagList({id: this.id});
                if (res.status === '0') {
                    this.specificationList = res.data;
                }
            },


            getTicket: async function () {
                await this.initPro;

                const that = this;
                wx.ready(function () {
                    let inviterNumber = '';
                    if (that.UserInfo.rank && Number(that.UserInfo.rank) > 0) {
                        inviterNumber = that.$store.state.inviterNumber;
                    }
                    that.link = location.origin + '/#/?id=' + that.$route.query.id + '&inviterNumber=' + inviterNumber + '&redirect=commodityBuyerVip';

                    // <%--公共方法--%>
                    let shareData = {
                        title: that.classifyProduct.title, // 分享标题
                        desc: that.classifyProduct.intro, // 分享描述
                        link: that.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: that.classifyProduct.mainImg, // 分享图标
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
                });
            },

        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            },
            isShop() {
                return this.$store.state.userInfo.rank && this.$store.state.userInfo.rank > 0;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    @import "../../assets/animation";

    .labels {
        @extend %flex;
        @extend %flex-wrap;
        .label {
            box-sizing: border-box;
            margin-bottom: rem(10);
            margin-left: rem(15);
            padding: 0 rem(10);
            height: rem(21);
            line-height: rem(21);
            color: $them;
            border: 1px solid $them;
            border-radius: rem(11);
            font-size: rem(12);
            font-weight: bold;
        }
        .back {
            border: none;
            background-color: rgba(237, 27, 36, .25);
        }
    }

    .invite-shop {
        position: relative;
        @extend %flex;
        @extend %flex-align-center;
        margin-top: rem(10);
        height: rem(82);
        border-bottom: 1px solid $border;
        background-color: #ffffff;
        .img {
            margin: 0 rem(15) 0 rem(13);
            width: rem(49);
            height: rem(49);
        }
        .nickname {
            font-weight: bold;
            font-size: rem(15);
            color: #333333;
        }
        .rank {
            display: inline-block;
            font-weight: bold;
            margin-top: rem(5);
            border-radius: rem(9);
            font-size: rem(12);
            line-height: rem(17);
            padding: 0 rem(10);
            color: $them;
            border: 1px solid $them;
        }
        .home {
            position: absolute;
            right: rem(14);
            top: 50%;
            @include translate(0, -50%);
            border-radius: rem(14);
            padding: 0 rem(12);
            line-height: rem(27);
            font-size: rem(12);
            background-color: $them;
            color: #ffffff;
        }
    }

    .gray {
        background-color: gray !important;
        border-color: gray !important;
    }

    #commodity {
        z-index: 100;
        overflow-x: hidden;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        min-height: 100%;
        background-color: #F1F4F3;
        padding-bottom: rem(40);
    }

    .select-share {
        z-index: 200;
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, .3);
        .card {
            animation: upShow .3s ease-out;
            border-radius: rem(16) rem(16) 0 0;
            width: 100%;
            //   height: rem(189);
            background-color: #ffffff;
            position: absolute;
            left: 0;
            bottom: 0;
            .title {
                height: rem(49);
                line-height: rem(49);
                font-size: rem(15);
                color: #333333;
                text-indent: rem(25);
            }
            .select {
                text-align: center;
                padding-bottom: rem(31);
                div {
                    margin: 0 rem(50);
                    display: inline-block;
                }
                img {
                    display: inline-block;
                    width: rem(45);
                    margin-bottom: rem(8);
                }
            }
            .action {
                height: rem(35);
                font-size: rem(20);
                text-align: center;
            }
        }
    }

    .share-img {
        z-index: 99;
        position: fixed;
        width: rem(50);
        height: rem(50);
        right: rem(13);
        top: 8%;
    }

    .share-result {
        z-index: 101;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .8);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        .img {
            /* &::after{
                 display: none;
                 z-index: 4;
                 content: '';
                 position: absolute;
                 width: 100%;
                 height: 100%;
                 left: 0;
                 top: 0;
                 border: 2px solid $them;
                 animation: pictureShow .7s linear;
             }*/
            position: relative;
            width: 80%;
            img {
                display: block;
                width: 100%;
            }
            .tip-text {
                position: absolute;
                left: 0;
                text-align: center;
                width: 100%;
                height: rem(50);
                line-height: rem(50);
                color: #ffffff;
                font-size: rem(20);
                bottom: rem(-50);
            }
        }
        .close {
            z-index: 10;
            position: absolute;
            right: 0;
            top: 0;
            width: rem(40);
            height: rem(40);
            line-height: rem(40);
            text-align: center;
            font-size: rem(30);
            color: #333333;
        }
    }

    .commodity-img {
        width: 100%;
        height: rem(375);
        //  height: rem(180);
        .detail-img {
            width: 100%;
            height: 100%;
        }
    }

    .price-gray {
        padding-left: rem(15);
        font-size: rem(13);
        color: #999999;
        background-color: transparent !important;
    }

    .commodity_price {
        padding-top: rem(5);
        height: rem(41);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        position: relative;
        .price {
            margin-bottom: rem(5);
            margin-left: rem(15);
            .discountPrice {
                > span {
                    vertical-align: middle;
                }
                display: block;
                font-size: rem(18);
                color: $them;
                font-weight: bold;
            }
            .save {
                margin-left: rem(10);
                color: $them;
                font-size: rem(12);
            }
        }
        .new-shop {
            border-radius: rem(11);
            display: inline-block;
            text-align: center;
            font-size: rem(12);
            color: #ffffff;
            width: rem(44);
            height: rem(21);
            line-height: rem(21);
            background-color: $them;
        }

    }

    .labels + .tip {
        padding-bottom: rem(10);
        text-indent: rem(10);
        font-size: rem(12);
        color: $them;
    }

    .other-prices {
        padding: 0 rem(15);
        font-size: rem(13);
        color: #999;
        .member-price {

        }
    }

    #hidebg {
        position: fixed;
        left: 0px;
        top: 0px;
        background-color: #000;
        width: 100%; /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
        height: 100%;
        filter: alpha(opacity=60); /*设置透明度为60%*/
        opacity: 0.6; /*非IE浏览器下设置透明度为60%*/
        display: block;
        z-Index: 2;
    }

    #hidebox {
        width: 100%;
        // height: 290px;
        position: fixed;
        bottom: 0;
        background-color: #fff;
        display: block;
        z-Index: 3;
        padding: 10px 0px 0px 0px;
        animation: upShow .3s ease-out;
    }

    .commodity_Infomation {
        background: #FFFFFF;

    }

    .commodity_Infomation_Css {
        padding: rem(10) rem(15);
        font-size: rem(15);
        color: #333333;
        font-weight: bold;
    }

    .collect {
        position: absolute;
        right: rem(21);
        top: rem(10);
        font-size: rem(11);
        min-width: rem(35);
        color: #333333;
        text-align: center;
        img {
            margin: 0 auto;
            width: rem(18);
            display: block;
        }
    }
    .collect1{
        top: rem(10);
    }

    .upgrade-tip {
        position: relative;
        @extend %flex;
        @extend %justify-content-space-between;
        @extend %flex-align-center;
        margin: 5px auto;
        box-sizing: border-box;
        width: rem(345);
        height: rem(50);
        padding: 0 rem(20);
        font-size: rem(12);
        color: #333333;
        background-color: #F1F4F3;
        &::after {
            content: '';
            position: absolute;
            right: rem(110);
            top: 50%;
            height: rem(22);
            @include translate(0, -50%);
            border-right: 1px solid $them;
        }
        .upgrade-text {
            font-weight: bold;
        }
        .iconfont {
            margin-left: rem(15);
            font-size: rem(12);
            color: $them;
        }
        .btn {
            color: $them;
        }
    }

    .original {
        color: #F34541;
        font-size: 12px;
    }

    .original_price {
        font-size: 18px;
        line-height: 40px;
    }

    .current {
        margin-left: 6px;
        color: #999999;
        font-size: 12px;
    }

    .member {
        margin-left: 10px;
        padding: 1px 8px 1px 8px;
        border: 1px solid #FFFFFF;
        background: #FFC100;
        font-size: 8px;
        color: white;
        border-radius: 3px;
    }

    .Payment_datails {
        background: #FFFFFF;
        //     margin-top: 10px;
        text-align: center;
    }

    .Payment_datails_title {
        line-height: 40px;
        font-size: 13px;
        color: #999999;
    }

    .commodity_title_Css {
        font-size: 20px;
        line-height: 25px;
        font-weight: 700;
    }

    .discrete_graphics_card {
        padding: 1px 8px 1px 8px;
        border: 1px solid #B8B8B8;
        font-size: 15px;
        border-radius: 3px;
    }

    .discrete_graphics {
        line-height: 20px;
        font-size: 15px;
        font-weight: 650;
    }

    .commodity_details_image {
        margin-top: 60px;
        margin-bottom: 60px;
    }

    .commodity_describe {
        width: 85%;
        margin: auto;
        text-align: center;
        font-size: 8px;
        font-weight: 400;
        color: #999999;
    }

    .distance_from_bottom {
        height: 20px;
    }

    .line-through {
        text-decoration: line-through;
    }

    .button {
        width: 100%;
        height: 35px;
        background: #FF6666;
        border: 1px solid #FF6666;
        text-align: center;
        color: #fff;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        cursor: pointer;
    }

    .option {
        background-color: #fff;
        width: 100%;
        @extend %flex;
        @extend %flex-align-center;
        line-height: 40px;
        position: fixed;
        bottom: 0;
        .welfare {
            width: 100%;
            font-size: rem(15);
            text-align: center;
            color: #ffffff;
            background-color: $them;
        }
        .welfare1 {
            width: 100%;
            font-size: rem(15);
            text-align: center;
            color: #ffffff;
            background-color: #DDDDDD;
        }
        .home{
            border-right: 1px solid $border;
            text-align: center;
            line-height: rem(15);
            color: #333;
            font-size: rem(10);
            img{
                margin: 0 auto;
                display: block;
                width: rem(18);
                height: rem(19);
            }
            width: rem(49);
        }
        .shopping_car{
            text-align: center;
            img{
                margin: 0 auto;
                display: block;
                width: rem(18);
                height: rem(19);
            }
            font-size: rem(10);
            line-height: rem(15);
            color: #333;
            width: rem(49);
        }
    }

  /*  .shopping_car {
        text-align: center;
        align-items: center;
        width: 33.3%;
        height: 40px;
        background: #F1F4F3;
        border: 1px solid #F1F4F3;
        color: #333333;
        font-size: rem(15);
        .iconfont {
            font-size: rem(18);
            margin-right: rem(5);
        }
    }*/

    .palce_order {
        flex: 1;
        text-align: center;
        height: 40px;
        background: $them;
        border: 1px solid $them;
        color: white;
        font-size: 14px;
    }
    .palce_order1 {
        flex: 1;
        text-align: center;
        height: 40px;
        background: #DDDDDD;
        border: 1px solid #DDDDDD;
        color: white;
        font-size: 14px;
    }

    .share {
        flex: 1;
        text-align: center;
        height: 100%;
        color: white;
        font-size: 14px;
        border: 1px solid #F5A623;
        background-color: #F5A623;
    }

    .commodity {
        display: flex;
        justify-content: space-between;
        width: 95%;
        margin: auto;
        line-height: 45px;
    }

    .commodity_Img {
        width: 30%;
        margin-top: -25px;
    }

    .com_Info {
        margin-left: 20px;
        width: 70%;
        font-size: 12px;
        line-height: 20px;
        font-weight: 350;
    }

    .color_Img {
        margin-right: 10px;
    }

    .original_Css {
        color: #F34541;
        font-size: 18px;
        line-height: 30px;
    }

    .line {
        border-bottom: 1px solid #F1F4F3;
    }

    .commodity_option {
        width: 95%;
        margin: auto;
    }

    .color {
        font-size: 10px;
        font-weight: 350;

    }

    .color_Css {
        margin-top: 10px;
    }

    .color_option_one {
        color: #FF6666;
        margin-left: 5px;
        border: 1px solid #FF6666;
        padding: 2px 10px 2px 10px;
        font-size: 12px;
        font-weight: 350;
    }

    .color_option_two {
        margin-left: 5px;
        border: 1px solid #B8B8B8;
        //margin-left: 20px;
        padding: 2px 10px 2px 10px;
        font-size: 12px;
        font-weight: 350;
    }

    .color_option_three {

        border: 1px solid #B8B8B8;
        margin-left: 20px;
        padding: 2px 10px 2px 10px;
        font-size: 12px;
        font-weight: 350;
    }

    .versions {
        margin-top: 10px;
        font-size: 10px;
        font-weight: 350;
    }

    .quantity_change {
        width: 95%;
        margin: auto;
        display: flex;
        justify-content: space-between;
        margin-top: 18px;
        font-size: 12px
    }

    .quantity_change_Icon {
        margin-right: 60px;
        & > * {
            vertical-align: middle;
        }
        span {
            display: inline-block;
            min-width: rem(22);
            text-align: center;
        }
    }

    .option_hidebox {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
    }

    .palce_order_hidebox {
        text-align: center;
        width: 50%;
        height: 40px;
        background: $them;
        border: 1px solid $them;
        margin-top: 20px;
        color: white;
        font-size: 14px;
    }

    .share_hidebox {
        text-align: center;
        width: 50%;
        height: 40px;
        //  background: black;
        //   border: 1px solid black;
        color: white;
        font-size: 14px;
        margin-top: 20px;
    }

    .dialog--show .dialog__container {
        transform: translateY(-138%);
    }
    .healthNum_box{
        color: #333;
        width: 100%;
        min-height: rem(38);
        margin: rem(10) 0;
        padding: 0 rem(15);
        box-sizing: border-box;
        background-color: #fff;
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                height: rem(38);
                line-height: rem(38);
            }
            .health_num1{
                font-size: rem(12);
                background-image: url("../../assets/images/health_icon@2x.png");
                background-size: rem(17) rem(15);
                background-repeat: no-repeat;
                background-position: left center;
                padding-left: rem(22);
            }
            .health_num2{
                font-size: rem(10);
                background-image: url("../../assets/images/health_item_icon@2x.png");
                background-size: rem(11) rem(11);
                background-repeat: no-repeat;
                background-position: rem(10) center;
                padding-left: rem(24);
            }
        }
    }
    .limit_time_shop_box{
        width: 100%;
        height: rem(54);
        background:linear-gradient(132deg,rgba(237,27,36,1) 0%,rgba(255,99,74,1) 100%);
        display: flex;
        justify-content: space-between;
        .limit_time_shop_left{
            .limit_time_shop_left_top{
                height: rem(20);
                line-height: rem(20);
                font-size: rem(20);
                color: #fff;
                font-weight:500;
                padding-top: rem(6);
                padding-left: rem(10);
                .span1{
                    font-size: rem(10);
                }
            }
            .limit_time_shop_left_bottom{
                color: #fff;
                font-size: rem(13);
                background-image: url("../../assets/images/limit_time_shop_detail@2x.png");
                background-size: rem(70) rem(16);
                background-repeat: no-repeat;
                background-position: rem(5) center;
                padding-left: rem(85);
                margin-top: rem(5);
            }
        }
        .limit_time_shop_right{
            .limit_time_shop_right_top{
                font-size: rem(12);
                color: #fff;
                padding-right: rem(10);
                text-align: right;
                height: rem(17);
                line-height: rem(17);
                margin-top: rem(11);
                margin-bottom: rem(5);
                .spancalor{
                    color: #F8E71C;
                }
            }
            .limit_time_shop_right_bottom{
                padding-right: rem(10);
                .limit_time_line_box{
                    width: rem(143);
                    height: rem(13);
                    background-color: #F5A623;
                    border-radius: rem(6);
                    position: relative;
                }
                .limit_time_num1{
                    font-size: rem(9);
                    height: rem(13);
                    line-height: rem(13);
                    width: 100%;
                    text-align: right;
                    padding-right: rem(6);
                    box-sizing: border-box;
                }
                .limit_time_line{
                    width: 60%;
                    height: rem(13);
                    background-color: #F8E71C;
                    border-radius: rem(6);
                }
                .limit_time_num{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: rem(143);
                    height: rem(13);
                    line-height: rem(13);
                    display: flex;
                    justify-content: space-between;
                    font-size: rem(9);
                    color: #fff;
                    .cuncun_num_left{
                        color: #CB8004;
                        padding-left: rem(6);
                    }
                    .cuncun_num_right{
                        padding-right: rem(6);
                    }
                }
            }
        }
    }
    .limit_time_tipbox{
        position: fixed;
        width: rem(273);
        /*height: rem(70);*/
        background-color: #8F8E94;
        border-radius: rem(3);
        padding: rem(15);
        bottom: rem(124);
        left: rem(36);
        z-index: 999;
        font-size: rem(14);
        color: #fff;
        text-align: center;
    ;
    }
</style>