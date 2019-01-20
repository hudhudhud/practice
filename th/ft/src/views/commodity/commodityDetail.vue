<template>
    <div id='commodity'>

        <img :src="classifyProduct.mainImg" width="100%" height="180px"/>
        <!-- v-for='item in classifyProduct.imgUrls' -->

        <div class="commodity_Infomation">
            <div class="commodity_Infomation_Css">
                <p class="commodity_title">{{classifyProduct.title}}</p>
                <!-- 				<div class="collect" @click='CollectClick' >
                                    <img :src="classifyProduct.isCollect=='1'?'../../images/collect.png':'../../images/nolike.png'" width="25px" />
                                    <p>{{classifyProduct.isCollect=="1"?"已收藏":'收藏'}}</p>
                                </div> -->
            </div>
            <div class="commodity_price">
                <p class="original">￥<span class="original_price">{{classifyProduct.v0MarketPrice}}</span></p>
                <!-- <p class="current"><s>￥<span class="current_price">5581</span></s></p> -->
                <!-- <p><span class="member">会员95折</span></p> -->
            </div>
        </div>

        <!--套餐详情-->

        <div class="Payment_datails" style="width: 100%;" v-html='classifyProduct.detail'>
            <!-- <p class="Payment_datails_title">——&nbsp;套餐详情&nbsp;——</p>
            <p class="commodity_title_Css">小米笔记本Air 13.3" <span class="discrete_graphics_card">独立显卡</span></p>
            <p class="discrete_graphics">带独立显卡的轻薄笔记本</p>
            <p class="commodity_details_image"><img  src="../images/commodity_details.png" width="90%"/></p>
            <p class="commodity_describe">
                选择轻薄，还是选择性能？如果只是强调性能，就没有容纳一块13.3" 屏幕和全尺寸键盘，却能够轻薄的全金属机身
                选择轻薄，还是选择性能？如果只是强调性能，就没有容纳一块13.3" 屏幕和全尺寸键盘，却能够轻薄的全金属机身
            </p>
            <p class="distance_from_bottom"></p> -->
        </div>

        <!--套餐内产品-->

        <div class="package_product">
            <!-- <p class="package_product_title">——&nbsp;套餐内产品&nbsp;——</p> -->
            <!-- 			<div class="package_product_Infomation" v-for='item in specificationList' >
                            <div class="package_product_Image">
                                <img :src="item.mainImg" width="70px" height="70px"/>
                            </div>
                            <div class="package_product_info">
                                <p class="package_product_context">{{item.title}}</p>
                                <div class="package_product_price">
                                    <p class="price">￥<span>{{item.price}}</span></p>
                                    <p class="view_detail" @click='selVDClick(item.id)' >查看详情</p>
                                </div>
                            </div>
                        </div> -->

            <div class="bottom">
                <input class="button" @click='payClick' type="button" value="立即购买"/>
                <input class="button" @click='shareClick' style="background: #333333;border:1px solid #333333;"
                       type="button" value="分享">
            </div>

        </div>

        <div class="dialog" :class="showCenterDialog ? 'dialog--show' : '' ">
            <div class="dialog__mask" @click='shareCloseClick'></div>

            <div class="dialog__container"
                 style="display:flex;align-items:center;justify-content:center;flex-direction:column;">
                <!--  //此区域自定义视图  -->
                <div class="flex_Center">

                    <img class="shareLogImg" src="http://p20gi5fjt.bkt.clouddn.com/shareLog.png">

                </div>
            </div>
        </div>

    </div>

</template>

<script>
    function showclick() //显示隐藏层和弹出层
    {

        if (localStorage.UserInfo) {

            var hideobj = document.getElementById("hidebg");
            hidebg.style.display = "block"; //显示隐藏层
            //hidebg.style.height=document.body.clientHeight+"px";  //设置隐藏层的高度为当前页面高度
            document.getElementById("hidebox").style.display = "block"; //显示弹出层

        } else {

            let gologin = confirm('需登录，是否去登录？');
            if (gologin) {
                location.href = '../login/login.html'
            }
        }
    }

    function hide() //去除隐藏层和弹出层
    {

        document.getElementById("hidebg").style.display = "none";
        document.getElementById("hidebox").style.display = "none";
    }

    export default {
        name: "commodity-detail",
        data: function () {
            return {
                wrapper: [],
                id: null,//产品目录
                classifyProduct: [],//商品
                specificationList: [],
                show: false,
                selspecifications: '',//选中的规格
                skuid: null,
                setcount: 1,
                showCenterDialog: false,
            }
        },
        activated: function () {
            this.$store.dispatch('wxInit');
            this.id = this.GetRequest().id;

            this.onRead();
            this.specificationClick();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {


            GetRequest: function () {
                return this.$route.query;
            },


            onRead: function () {
                const that = this;
                if (localStorage.UserInfo) {
                    that.UserInfo = JSON.parse(localStorage.UserInfo)

                }


                let url = "/product/findOne";
                var body = {"id": that.id, "token": that.UserInfo ? that.UserInfo.token : ''}
                var reqJson = {"head": head, "body": body};

                $.ajax({
                    url: https + url,
                    data: JSON.stringify(reqJson),
                    type: "post",
                    dataType: "json",
                    contentType: "application/json;charset=UTF-8",

                    success: function (res) {

                        if (res.status == 1) {
                            layer.msg(res.msg);
                            // that.hint=res.msg;
                        } else if (res.status == 0) {
                            that.classifyProduct = res.data;
                        }
                    },
                })

            },

            CollectClick: function () {
                const that = this;

                let url = (that.classifyProduct.isCollect == '0' ? "/rest/customerCollect/productCollect" : "/rest/customerCollect/cancelProductCollect");
                if (that.classifyProduct.isCollect == '0') {
                    var body = {"token": that.UserInfo.token, "id": that.id};
                } else {
                    var body = {"token": that.UserInfo.token, "id": that.classifyProduct.isCollect};
                }

                var reqJson = {"head": head, "body": body};

                $.ajax({
                    url: https + url,
                    data: JSON.stringify(reqJson),
                    type: "post",
                    dataType: "json",
                    contentType: "application/json;charset=UTF-8",

                    success: function (res) {

                        if (res.status == 1) {
                            layer.msg(res.msg);
                            // that.hint=res.msg;
                        } else if (res.status == 0) {

                            if (that.classifyProduct.isCollect == '1') {
                                that.classifyProduct.isCollect = '0';
                                layer.msg('已取消')
                            } else {
                                that.classifyProduct.isCollect = '1';
                                layer.msg('已收藏')
                            }
                        }
                    },
                })

            },

            pitchOnClick: function (item) {
                const that = this;
                let arr = [];
                let arrb = [];
                for (let i in that.specificationList) {

                    for (let j in that.specificationList[i].productTagRetList) {

                        if (item.productTageid == that.specificationList[i].productTagRetList[j].productTageid) {
                            if (that.specificationList[i].productTagRetList[j].choose == false) {
                                that.specificationList[i].productTagRetList[j].choose = true;

                            } else {
                                that.specificationList[i].productTagRetList[j].choose = false;
                            }
                        } else {
                            if (that.specificationList[i].productTagRetList[j].choose == false) {
                                // that.specificationList[i].productTagRetList[j].choose=true;
                            } else {
                                that.specificationList[i].productTagRetList[j].choose = false;
                            }
                        }

                        if (that.specificationList[i].productTagRetList[j].choose == true) {
                            arr.push(that.specificationList[i].productTagRetList[j].name)
                            arrb.push(that.specificationList[i].productTagRetList[j].productTageid)
                        }

                    }

                }
                that.selspecifications = arr;
                that.skuid = arrb;


            },

            payClick: function () {
                const that = this;
                if (localStorage.UserInfo) {
                    let url = "/product/getSkuIdByProductTags";
                    var body = {"productId": that.id};

                    var reqJson = {"head": head, "body": body};

                    $.ajax({
                        url: https + url,
                        data: JSON.stringify(reqJson),
                        type: "post",
                        dataType: "json",
                        contentType: "application/json;charset=UTF-8",

                        success: function (res) {

                            if (res.status == 1) {
                                layer.msg(res.msg);
                            } else if (res.status == 0) {
                                that.skuid = res.id;

                                let arr = [];
                                let arrb = ''

                                for (let i of that.selspecifications) {
                                    arrb = arrb + '' + that.selspecifications[i];
                                }


                                arr[0] = ({
                                    quantity: that.setcount,
                                    productTitle: that.classifyProduct.title,
                                    productImg: that.classifyProduct.mainImg,
                                    productIntro: arrb,
                                    price: that.classifyProduct.v0MarketPrice,
                                    productId: that.classifyProduct.id,
                                    skuCode: that.classifyProduct.skuCode,
                                    productTagId: that.skuid
                                })

                                let allprice = (that.setcount * that.classifyProduct.v0MarketPrice)

                                localStorage.inventoryList = JSON.stringify(arr);
                                localStorage.allprice = allprice;

                               // location.href = '../myOrder/myOrder.html?inviteNumber=' + that.inviteNumber;
                                that.$router.push({name: 'myOrder', query: {inviteNumber: that.inviteNumber }})

                            }
                        },
                    })
                } else {
                    let gologin = confirm('需登录，是否去登录？');
                    if (gologin) {
                        location.href = '../login/login.html'
                    }
                }

            },

            shopingcartClick: function () {
                const that = this;


            },

            selVDClick: function (id) {
                const that = this;
                location.href = '../commodity_buyer_vip/commodity_buyer_vip.html?id=' + id;

            },


            //获取商品规格

            specificationClick: function () {
                const that = this;

                let url = "/product/findComboProductList";
                var head = {
                    "mos": "h5",
                    "ver": "1.0",
                    "aid": "zhiyou-mobile",
                    "imei": "860947030260591",
                    "de": new Date().getTime()
                };
                var body = {"id": that.id}
                var reqJson = {"head": head, "body": body};

                $.ajax({
                    url: https + url,
                    data: JSON.stringify(reqJson),
                    type: "post",
                    dataType: "json",
                    contentType: "application/json;charset=UTF-8",

                    success: function (res) {

                        if (res.status == 1) {
                            // that.hint=res.msg;
                            layer.msg(res.msg);
                        } else if (res.status == 0) {
                            that.specificationList = res.data;

                        }
                    },
                })

            },

            shareClick: function () {
                const that = this;
                if (localStorage.UserInfo) {

                    that.showCenterDialog = !that.showCenterDialog;
                    that.getTicket();
                } else {
                    let gologin = confirm('需登录，是否去登录？');
                    if (gologin) {
                        location.href = '../login/login.html'
                    }
                }
            },

            shareCloseClick: function () {
                const that = this;
                that.showCenterDialog = !that.showCenterDialog;
            },


            getTicket: function () {
                const that = this;
                wx.ready(function () {

                    // <%--公共方法--%>
                    var shareData = {
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
                    wx.onMenuShareAppMessage({
                        title: that.classifyProduct.title, // 分享标题
                        desc: that.classifyProduct.intro, // 分享描述
                        link: that.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: that.classifyProduct.mainImg, // 分享图标
                        trigger: function (res) {
                            //  layer.msg('用户点击发送给朋友');
                        },
                        success: function (res) {
                            //layer.msg('已分享');
                        },
                        cancel: function (res) {
                            //layer.msg('已取消');
                        },
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });
                    // <%--分享到朋友圈接口--%>
                    wx.onMenuShareTimeline(shareData);
                });
            },


        },
    }
</script>

<style scoped>

    .commodity_Infomation {
        background: #FFFFFF;

    }

    .commodity_Infomation_Css {
        width: 95%;
        margin: auto;
        display: flex;
        justify-content: space-between;
        height: 50px;
        align-items: center;
    }

    .commodity_title {
        width: 80%;
        font-size: 15px;
        line-height: 20px;
        font-weight: 700;
    }

    .collect {
        margin-top: 20px;
        font-size: 12px;
        text-align: center;
    }

    .commodity_price {
        display: flex;
        margin: auto;
        width: 95%;
        align-items: center;
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
        margin-top: 10px;
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

    .package_product {
        background: #FFFFFF;
        margin-top: 5px;
    }

    .package_product_title {
        line-height: 40px;
        font-size: 13px;
        color: #999999;
        text-align: center;
    }

    .package_product_Infomation {
        width: 95%;
        margin: auto;
        display: flex;
        justify-content: space-between;
        height: 80px;
    }

    .package_product_Image {
        width: 15%;
    }

    .package_product_info {
        width: 75%;
        margin-right: 5px;
    }

    .package_product_context {
        font-size: 14px;
        line-height: 20px;

    }

    .package_product_price {
        font-size: 17px;
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        font-weight: 600;
    }

    .view_detail {
        padding: 4px 15px 4px 15px;
        border: 1px solid #FF6666;
        background: #FF6666;
        font-size: 6px;
        color: white;
        border-radius: 3px;
        font-weight: 200;
    }

    .bottom {
        width: 100%;
        position: fixed;
        bottom: 0;
        display: flex;
    }

    .button {
        width: 50%;
        height: 52px;
        background: #FF6666;
        border: 1px solid #FF6666;
        text-align: center;
        color: #fff;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        cursor: pointer;
    }

    .dialog--show .dialog__container {
        transform: translateY(-138%);
    }
</style>