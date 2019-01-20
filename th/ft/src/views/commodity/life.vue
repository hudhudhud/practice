<template>
    <div id='indexPage'>
        <div class="commodity_information" v-for='item in Catalog'  >
            <div class="commodity_information_css"  >
                <div class="goodsImg">
                    <img :src="item.mainImg" width="100" height="100"/>
                </div>
                <div class="commodity_Info">
                    <p class="commodity_title">{{item.title}}</p>
                    <span class="member">{{CustomerRank.rankName}}{{item.discount}}折</span>

                    <div class="price_buy">
                        <p class="price">￥<span class="current_price">{{item.discountPrice}}</span> <span v-show='item.discountPrice!=item.v0MarketPrice' class="original_price"><del>{{item.v0MarketPrice}}</del></span></p>
                        <p class="buy" @click='GoInfoClick(item.id)'>立即购买</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "life",
        data: function () {
            return {
                Catalog:[],//产品目录
                loadPageNum:1,
                CustomerRank:{'rank':0,'rankName':'会员'},
                classifyProduct:[],
            }
        },
        activated: function () {
            this.onRead();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods:{


            GetRequest :function () {
               return this.$route.query;
            },


            onRead:function(){
                const that=this;
                if(localStorage.UserInfo){
                    that.UserInfo= JSON.parse(localStorage.UserInfo)
                    //是否会员
                    let Discountsurl="/rest/customer/findCustomerRank";
                    var Discountsbody = {"token":that.UserInfo.token}
                    var DiscountsreqJson = {"head":head, "body":Discountsbody};

                    $.ajax({
                        url: https+ Discountsurl,
                        data:JSON.stringify(DiscountsreqJson),
                        type:"post",
                        dataType:"json",
                        contentType:"application/json;charset=UTF-8",

                        success: function (res) {

                            if(res.status==1){
                                layer.msg(res.msg);

                            }else if (res.status==0) {
                                that.CustomerRank=res.data;
                            }
                        },
                    })

                }


                let url="/product/findPage";
                var body = {"pageNo":that.loadPageNum,"pageSize":"5","productTypeId":that.GetRequest().id}
                var reqJson = {"head":head, "body":body};

                $.ajax({
                    url: https+ url,
                    data:JSON.stringify(reqJson),
                    type:"post",
                    dataType:"json",
                    contentType:"application/json;charset=UTF-8",

                    success: function (res) {

                        if(res.msg=="系统会话过期重新登录！"){
                            that.$router.push({name: 'login'})
                        }
                        if(res.status==1){
                            layer.msg(res.msg);

                        }else if (res.status==0) {

                            for(let i in res.data.list){

                                let url="/product/findPage";
                                var body = {"pageNo":that.loadPageNum,"pageSize":"5","productTypeId":that.GetRequest().id}
                                var reqJson = {"head":head, "body":body};

                                $.ajax({
                                    url: https+ url,
                                    data:JSON.stringify(reqJson),
                                    type:"post",
                                    dataType:"json",
                                    contentType:"application/json;charset=UTF-8",

                                    success: function (res) {
                                        //
                                        if(res.msg=="系统会话过期重新登录！"){
                                            that.$router.push({name: 'login'})
                                        }
                                        if(res.status==1){
                                            layer.msg(res.msg);

                                        }else if (res.status==0) {
                                            let arr=[];
                                            let arrb=[];
                                            for(let i in res.data.list){
                                                if(localStorage.UserInfo){
                                                    let url="/rest/customer/getProductDiscount";
                                                    var body = {"token":that.UserInfo.token,"productId":res.data.list[i].id}
                                                    var reqJson = {"head":head, "body":body};

                                                    $.ajax({
                                                        url: https+ url,
                                                        data:JSON.stringify(reqJson),
                                                        type:"post",
                                                        dataType:"json",
                                                        contentType:"application/json;charset=UTF-8",

                                                        success: function (msg) {

                                                            if(msg.status==1){
                                                            }else if (msg.status==0) {
                                                                arrb.push({
                                                                    id:res.data.list[i].id,
                                                                    discount:msg.data.toFixed(2),
                                                                    graName:res.data.list[i].graName,
                                                                    mainImg:res.data.list[i].mainImg,
                                                                    productTypeQ:res.data.list[i].productTypeQ,
                                                                    v0MarketPrice:res.data.list[i].v0MarketPrice.toFixed(2),
                                                                    title:res.data.list[i].title,
                                                                    discountPrice:(res.data.list[i].v0MarketPrice-res.data.list[i].v0MarketPrice*(msg.data/100)).toFixed(2),

                                                                })
                                                                // that.classifyProduct.push(arrb)
                                                                if(arrb.length>0){
                                                                    that.Catalog=(arrb);
                                                                }

                                                            }
                                                        },
                                                    })
                                                }

                                                arr.push({
                                                    id:res.data.list[i].id,
                                                    discount:'98',
                                                    graName:res.data.list[i].graName,
                                                    mainImg:res.data.list[i].mainImg,
                                                    productTypeQ:res.data.list[i].productTypeQ,
                                                    v0MarketPrice:res.data.list[i].v0MarketPrice.toFixed(2),
                                                    title:res.data.list[i].title,
                                                    discountPrice:res.data.list[i].v0MarketPrice.toFixed(2),

                                                })
                                                if(arrb.length>0){
                                                }else {
                                                    that.Catalog=(arr);
                                                }

                                            }
                                            that.loadPageNum++;
                                            // that.Catalog=res.data.list;
                                            $('title').html(res.data.list[0].graName);
                                        }


                                    },
                                })

                            }
                            // that.loadPageNum++;
                            // that.Catalog=res.data.list;
                            // $('title').html(res.data.list[0].graName);
                        }


                    },
                })


            },


            GoInfoClick:function(id){
                const that=this;

               // top.location='../commodity_buyer_vip/commodity_buyer_vip.html?id='+id;
                this.$router.push({name: 'commodityBuyerVip', query: {id: id}})
            },


        },

    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    #indexPage {
        font-size: rem(35);
    }
    .commodity_information{
        background: #fff;
        border-bottom: 5px solid #F1F3F4;
    }
    .commodity_information_css{
        width: 95%;
        margin: auto;
        display: flex;
        justify-content: space-between;
        height: 120px;
        align-items: center;
    }
    .goodsImg{
        width: 35%;
    }
    .commodity_Info{
        margin-left: 8px;
    }
    .price_buy{
        display: flex;
        justify-content: space-between;
    }
    .commodity_title{
        font-size: 14px;
        line-height: 20px;
    }
    .member{
        margin-top: 5px;
        color: white;
        border: 1px solid #FF8B1A;
        font-size: 10px;
        background: #FF8B1A;
        padding: 1px 5px 1px 5px;
        border-radius: 3px;
        text-align: center;
    }
    .price_buy{
        margin-top: 10px;
    }
    .price{
        color:#FF6161;

    }
    .original_price{
        color: #B2B2B2;
        margin-left: 5px;
    }
    .buy{
        display: flex;
        align-items: center;
        color: white;
        border: 1px solid #FF6161;
        font-size: 12px;
        background: #FF6161;
        border-radius: 3px;
        padding: 2px 8px 2px 8px;
    }

</style>