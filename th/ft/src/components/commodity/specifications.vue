<template>
    <div class="box" v-if="show" @click="close">
        <div class="content" @click.stop="">
            <div class="title">
                <img :src="pro_image" alt="">
                <div class="total">
                    <p>已选择：{{selectText}}</p>
                    <p class="them" v-if="detail.type===4">{{price}}积分</p>
                    <p class="them" v-else>¥{{productPrice}}</p>
                    <p >库存{{storeNumber}}件</p>

                </div>
                <div class="close" @click="close">
                    <i class="iconfont icon-guanbi"></i>
                </div>
            </div>

            <div class="spec">
                <div class="group" v-for="(item, index) in option" :key="item.productTageid">
                    <div class="title">{{item.name}}:</div>
                    <div class="options">
                        <div class="option" :class="{active: select[index] === child.productTageid,active1:tageArr.indexOf(child.productTageid)>-1}"
                             v-for="child in item.productTagRetList" :key="child.productTageid"
                             @click="!tageArr.includes(child.productTageid)&&selectChange(index,child.productTageid)"><div class="option_n">{{child.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="count" v-if="!detail.hideCount">
                    <div>数量</div>
                    <div class="countChange">
                        <div class="reduce" @click="reduce">
                            <i class="iconfont icon-reduce"></i>
                        </div>
                        <div class="num">{{count}}</div>
                        <div class="add" @click="add">
                            <i class="iconfont icon-xiao64"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns">
                <div class="cart" v-if="rank >0&&detail.type!==4" @click="ok(1)">加入购物车</div>
                <div class="ok" @click="ok(2)" v-if="!storeNumber" style="background-color:gray">确定</div>
            <div class="ok" @click="ok(2)" v-else>确定</div>
            </div>
        </div>
    </div>
</template>

<script>
import {Toast} from 'mint-ui'
import {getSkuIdByProductTags,findTag} from "../../service/commodityDetail";
    export default {
        name: "specifications",
        data: function () {
            return {
                show: false,
                resolve: null,
                reject: null,
                option: [],
                detail: {},
                select: [],
                tageArr:[],//对应规格存储
                count: 1,
                storeNumber: ' ',
                sku: '',
                price: '',
                marketPrice: '',
                pro_image:'',//规格图片
                productPrice:'',//商品价格
            }
        },
        deactivated: function () {
            this.show = false;
            //this.reject&&this.reject();
        },
        methods: {
            getSkuIdByProductTags: function () {
                this.count = 1;
                let params = {};
                if(this.option.length !== this.select.filter(i => {
                    return i;
                }).length){
                    this.cuncunFun();
                    return;
                }
                this.select.forEach((i, index) => {
                    params['tageId' + (index + 1)] = i;
                });
             getSkuIdByProductTags({productId: this.detail.id, ...params}).then(
                 res => {
                     if(res.status === '0'){
                         this.pro_image = res.data.image != null?res.data.image:this.detail.mainImg;
                         this.storeNumber = res.data.storeNumber;
                         this.sku = res.data.sku;
                         this.price = this.isShop?res.data.v1Price:res.data.v0Price;
                         this.marketPrice = res.data.marketPrice
                         this.productPrice = this.isShop?res.data.v1Price:res.data.v0Price;
                     }
                 }
             );
            },
            cuncunFun:function(){//实时获取库存数量
                let params = {};
                this.select.forEach((i, index) => {
                    params['tageId' + (index + 1)] = i;
                });
                getSkuIdByProductTags({productId: this.detail.id, ...params}).then(
                    res => {
                        if(res.status === '0'){
                            this.pro_image = res.data.image != null?res.data.image:this.detail.mainImg;
                            this.price = this.isShop?res.data.v1Price:res.data.v0Price;
                            this.storeNumber = res.data.storeNumber;
                            this.productPrice = this.isShop?res.data.v1Price:res.data.v0Price;
                        }
                    }
                );
            },
            findTags:function(proId,param){
                findTag({productId: proId,...param}).then(
                    res => {
                        if(res.status === '0'){
                            this.tageArr = res.data;
                            this.select = this.select.map(i => {
                               return this.tageArr.includes(i)?undefined: i;
                            });

                        }
                    }
                );
            },
            getSpec: function (option, detail, select) {
                this.select = [];
                this.count = 1;
                this.detail = detail;
                this.cuncunFun();
                this.pro_image = this.detail.mainImg;
                this.option = option.map(i => {
                    // this.select.push(i.productTagRetList[0].productTageid);
                    return i;
                });
                this.getSkuIdByProductTags();
                this.show = true;
                return new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                });
            },
            selectChange: function (i, id) {
                this.$set(this.select, [i], id);
                let params={};
                this.select.forEach((i, index) => {
                    params['tageId' + (index + 1)] = i;
                });
                this.findTags(this.detail.id,params);
                this.getSkuIdByProductTags();
            },
            add: function(){
                if(this.count < this.storeNumber){
                    this.count++;
                }
            },
            reduce: function () {
                this.count = (this.count - 1) || 1;
            },
            ok: function (type) {
                if(this.option.length !== this.select.filter(i => {
                    return i;
                }).length){
                    Toast('请选择规格！');
                    return;
                }
                if(!this.storeNumber){
                    Toast('库存不足，无法购买');
                    return;
                }
                this.show = false;
                this.resolve({type: type, select: this.select, count: this.count, sku: this.sku,price: this.price, marketPrice: this.marketPrice});
            },
            close: function () {
                this.show = false;
                this.reject();
            }
        },
        computed: {
            selectText: function () {
                return this.select.map((i, index) => {
                    if(i){
                        return this.option[index].productTagRetList.find((j) => {
                            return j.productTageid === i;
                        }).name;
                    }else{
                        return '';
                    }

                }).join(',');
            },
            rank() {
                return Number(this.$store.state.userInfo.rank);
            },
            isShop() {
                return this.$store.state.userInfo.rank&&this.$store.state.userInfo.rank>0;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .box {
        z-index: 999;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .6);
    }

    .content {
        animation: upShow .3s ease-out;
        width: 100%;
        //  height: rem(330);
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: #ffffff;
        & > .title {
            position: relative;
            height: rem(95);
            border-bottom: 1px solid $border;
            img {
                position: absolute;
                left: rem(10);
                top: rem(-24);
                width: rem(100);
                height: rem(100);
            }
            .total {
                padding-top: rem(12);
                margin-left: rem(120);
                font-size: rem(13);
                color: #333333;
                p {
                    margin-bottom: rem(5);
                }
                .them {
                    font-size: rem(22);
                    line-height: rem(26);
                }
                p:last-of-type {
                    color: #666;
                }
            }
            .close {
                position: absolute;
                right: 0;
                top: 0;
                width: rem(11);
                height: rem(11);
                padding: rem(15);
                font-size: rem(11);
            }
        }

        .spec {
            .group {
                margin-top: rem(10);
                .title {
                    font-size: rem(11);
                    color: #333333;
                    margin-left: rem(15);
                }
                .options {
                    @extend %flex;
                    flex-wrap: wrap;
                    .option {
                        font-size: rem(13);
                        margin: rem(5) 0 rem(5) rem(15);
                        border: 1px solid #DDDDDD;
                        height: rem(26);
                        line-height: rem(26);
                        padding: 0 rem(17);
                    }
                    .option.active {
                        color: $them;
                        border-color: $them;
                    }
                    .option.active1 {
                        color: #ccc;
                        border-color: #EEEEEE;
                    }
                }

            }

            .count {
                height: rem(70);
                @extend %flex;
                @extend %flex-align-center;
                @extend %justify-content-space-between;
                padding: 0 rem(30) 0 rem(15);
                font-size: rem(11);
                color: #999999;
                .countChange {
                    @extend %flex;
                    @extend %flex-align-center;
                    text-align: center;
                    color: #333333;
                }
                .num {
                    margin: 0 rem(15);
                }
                .iconfont {
                    font-size: rem(11);
                }
                .reduce {
                    border-radius: 50%;
                    width: rem(24);
                    height: rem(24);
                    line-height: rem(24);
                    background-color: #EDEDED;
                }
                .add {
                    @extend .reduce;
                }
            }
        }

        .btns {
            @extend %flex;
            height: rem(49);
            line-height: rem(49);
            text-align: center;
            font-size: rem(15);
            color: #ffffff;
            & > div {
                height: 100%;
                flex-grow: 1;
                flex:1;
            }
            .cart {
                background-color: #F5A623;
            }
            .ok {
                background-color: $them;
            }
        }
    }

</style>