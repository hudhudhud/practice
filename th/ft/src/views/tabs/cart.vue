<template>
    <div id='shoppingCart' class="shoppingCart">
        <div class="shoppingCart-test">
            <div v-for="(cla, cindex) in list" style="background-color: #fff;margin-bottom: 10px">
                <div class="classify-name" @click="handleSelectChange(cindex)">
                    <img v-if="getClassifySelectStatus(cindex)" class="shoppingCart-first-one-img"
                         src="../../assets/images/select1.png"/>
                    <img v-else class="shoppingCart-first-one-img" src="../../assets/images/unselect1.png"/>
                    <span>{{cla.supplierName}}</span>
                </div>
                <mt-cell-swipe :right=" [
                    {
                        content: '加入收藏',
                        style: { 'background-image': 'linear-gradient(-135deg, #FFC62B 0%, #FF8E00 100%)', color: '#fff', 'line-height': '8.33rem'},
                        handler: () => productCollect(item.productId)
                    },
                    {
                        content: '删除',
                        style: { background: '#FF0F0F', color: '#fff', 'line-height': '8.33rem'},
                        handler: () => delClick(cindex,index)
                    }
                ]" v-for='(item, index) in cla.cartList' :key="item.id">
                    <div class="flex">
                        <div class="shoppingCart-first-one" @click='handleSelectChange(cindex, index)'>
                            <img v-if="selects[cindex][index]" class="shoppingCart-first-one-img"
                                 src="../../assets/images/select1.png"/>
                            <img v-else class="shoppingCart-first-one-img" src="../../assets/images/unselect1.png"/>
                        </div>
                        <div class="shoppingCart-first-two" @click="toShopDeatil(item.productId)">
                            <img class="shoppingCart-first-two-img" :src="item.productImg"/>
                        </div>

                        <div class="shoppingCart-first-three" @click="toShopDeatil(item.productId)">

                            <div class="shoppingCart-first-three-one">
                                <div class="shoppingCart-first-three-two">
                                    <div class="shoppingCart-first-three-two00">
                                        <span class="shoppingCart-first-three-two01">{{item.productTitle}}</span>
                                    </div>
                                    <div class="shoppingCart-first-three-three" @click.stop="changeSpec(index)">
                                        <span class="shoppingCart-first-three-three01">{{item.productIntro}}</span>
                                        <!-- <span class="shoppingCart-first-three-three02">WiFi版本</span> -->
                                    </div>
                                </div>
                            </div>

                            <!--<div class="activity_icon_box" v-if="item.activityBeginTime != null">-->
                                <!--<div class="limitTime_icon"></div>-->
                            <!--</div>-->
                            <div class="activity_icon_box1" v-if="item.activityBeginTime != null && item.isPreheat !=1">
                                <div class="limitTime_icon1"></div>
                                <div class="activity_time_show">{{timestampToTime(item.activityEndTime,2)}}</div>
                            </div>
                            <div class="activity_icon_box1" v-if="item.activityBeginTime != null && item.isPreheat ==1">
                                <div class="limitTime_icon1"></div>
                                <div class="activity_time_show">{{timestampToTime(item.activityBeginTime,1)}}</div>
                            </div>

                            <div class="shoppingCart-first-three-fore">
                                <div class="shoppingCart-first-three-five">
                                    <span class="shoppingCart-first-three-five01">￥{{item.price}} </span>
                                    <span class="shoppingCart-first-three-five02">{{item.marketPrice}}</span>
                                </div>
                                <div class="shoppingCart-first-three-six">
                                    <img class="shoppingCart-first-three-six-img"
                                         @click.stop='downNumClick(cindex,index)'
                                         src="../../assets/images/down.png"/>
                                    <span class="shoppingCart-first-three-six001">{{item.quantity}}</span>
                                    <img class="shoppingCart-first-three-six001-img"
                                         @click.stop='UpNumClick(cindex,index)'
                                         src="../../assets/images/up.png"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </mt-cell-swipe>
                <template v-if="getGroupPostage(cindex)==='计算邮费'&&cla.fullFreeAmount">
                    <div class="postage" v-if="cla.allPrice">
                        <template v-if="cla.allPrice < Number(cla.fullFreeAmount)">
                            <div >
                                <span class="tag">包邮</span>
                                <span class="vertical-align">还差{{cla.fullFreeAmount-cla.allPrice}}元即可包邮</span>
                            </div>

                            <div class="tip" @click="toClassDetail(cla.supplierId)">
                                <span class="vertical-align">去凑单</span>
                                <i class="vertical-align iconfont icon-right"></i>
                            </div>
                        </template>
                        <div v-else>
                            <span>已满足包邮条件</span>
                        </div>

                    </div>
                </template>


            </div>
            <div v-if="!list.length" class="no-shop">
                <!--{{UserInfo.token?'没有商品':'请先登录'}}-->
                <img src="../../assets/img/home/cart_no.png" alt="">
                <p class="text">购物车是空的，快去挑选商品吧</p>
                <div class="btn" @click="$router.push({name: 'home'})">去首页</div>
            </div>

        </div>
        <div class="fixed-cart">
            <div @click="handleSelectAll">
                <div class="radius" :class="{active: selectAll}"></div>
                <span>全选</span>
            </div>
            <div></div>
            <div>
                <div class="total">
                    <span>合计：</span><span class="them">￥{{allprice}}</span>
                </div>
                <div class="createOrder" @click="inventoryClick">结算</div>
            </div>
        </div>
        <Specifications ref="spec"/>
    </div>

</template>

<script>
    import {Toast, MessageBox, Indicator} from 'mint-ui';
    import * as service from '../../service/cart.service';
    import {getProductTagList} from '../../service/commodityDetail'
    import lodash from 'lodash';
    import Check from '@/components/check'
    import Specifications from '@/components/commodity/specifications'

    export default {
        name: "cart",
        data: function () {
            return {
                list: [],
                selects: []
            }
        },
        components: {
            Check,
            Specifications
        },
        mounted: function () {
            // $('#shoppingCart').css('min-height', $(document).height());
        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            },
            allprice() {
                if (!this.selects.length) {
                    return 0;
                }
                let total = 0;
                for (let c = 0; c < this.selects.length; c++) {
                    const keys = Object.keys(this.selects[c]);
                    for (let i of keys) {
                        if (this.selects[c][i]) {
                            total += this.list[c].cartList[i].price * this.list[c].cartList[i].quantity;
                        }
                    }
                }
                return total.toFixed(2);
            },

            selectAll() {
                if (!this.selects.length) {
                    return false;
                }
                for (let i = 0; i < this.list.length; i++) {
                    if (!this.getClassifySelectStatus(i)) {
                        return false;
                    }
                }
                return true;
            }
        },

        activated: function () {
            this.setTitle('购物车');
            this.getList();
        },
        methods: {
            timestampToTime:function(timestamp,n) {//预售时间
                timestamp = Math.ceil(parseInt(timestamp));
                if(timestamp!=null){
                    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                    var Y = date.getFullYear();
                    var M = date.getMonth()+1;
                    var D = date.getDate();
                    var h = date.getHours();
                    var m = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
                    var s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
                    if(n==1){
                        return M+'月'+D+'日'+h+':'+m+':'+s+'开抢';
                    }else{
                        return M+'月'+D+'日'+h+':'+m+':'+s+'结束';
                    }
                }
            },
            getClassifySelectStatus: function (n) {
                if (!this.list[n]) {
                    return false;
                }
                for (let i = 0; i < this.list[n].cartList.length; i++) {
                    if (!this.selects[n][i]) {
                        return false;
                    }
                }
                return true;
            },
            getList: async function (load = true) {
                const res = await service.getCartList({load: load});
                if (res.status === '0') {
                    this.list = res.data;
                    this.selects = [];
                    for (let i = 0; i < this.list.length; i++) {
                        this.selects.push([]);
                    }

                }
            },

            /**
             * 返回 该组 选中商品的总价   // 返回是否包邮
             *
             * */
            getGroupPostage: function (i) {
                let keys = Object.keys(this.selects[i]), total = 0;
                for (let index of keys) {
                    if (this.selects[i][index]) {
                        total += this.list[i].cartList[index].price * this.list[i].cartList[index].quantity
                    }
                }
                this.list[i].allPrice = total;
                return '计算邮费';
            },
            /**
             * 收藏
             */
            productCollect: function (id) {
                service.productCollect({id: id, load: true, successMsg: '收藏成功'});
            },
            /**
             * 规格重新选择
             * */
            changeSpec: async function (index) {
                return;
                const res = await getProductTagList({id: this.list[index].productId, load: true});
                if (res.status === '0') {
                    const data = await this.$refs.spec.getSpec(res.data, {
                        mainImg: this.list[index].productImg,
                        discountPrice: this.list[index].price,
                        hideCount: true,
                    });
                }
            },
            /**
             * 选中 或者取消了这一商品
             * */
            handleSelectChange: function (c, i) {
                // console.log(this.list)
                if (i === undefined) {
                    if (this.getClassifySelectStatus(c)) {
                        this.selects[c] = [];
                    } else {
                        this.selects[c] = new Array(this.list[c].cartList.length);
                        this.list[c].cartList.forEach((item,index)=>{
                            if(item.activityBeginTime != null && item.isPreheat == 1){
                                this.selects[c].fill(false,index,index+1);
                            }else{
                                this.selects[c].fill(true,index,index+1);
                            }
                        });
                        // this.selects[c] = new Array(this.list[c].cartList.length).fill(true);
                    }
                } else {
                    console.log(this.list[c].cartList[i])
                    if(this.list[c].cartList[i].activityBeginTime != null && this.list[c].cartList[i].isPreheat == 1){
                        // Toast('商品抢购预热中，不可勾选！');
                    }else{
                        this.selects[c][i] = !this.selects[c][i];
                    }
                }
                // console.log(this.selects)
                this.$set(this.selects, c, [...this.selects[c]]);
            },
            /**
             * 全选
             * */
            handleSelectAll: function () {
                if (this.selectAll) {
                    this.selects = [];
                    for (let i = 0; i < this.list.length; i++) {
                        this.selects.push([]);
                    }
                } else {
                    this.selects = [];
                    for (let i = 0; i < this.list.length; i++) {
                        // this.selects.push(new Array(this.list[i].cartList.length).fill(true));
                        this.selects.push(new Array(this.list[i].cartList.length));
                        this.list[i].cartList.forEach((item,index)=>{
                            if(item.activityBeginTime != null && item.isPreheat == 1){
                                this.selects[i].fill(false,index,index+1);
                            }else{
                                this.selects[i].fill(true,index,index+1);
                            }
                        });
                    }
                }
            },
            /**
             * 订单详情
             * @param id
             */
            toShopDeatil: function (id) {
                this.$router.push({name: 'commodityBuyerVip', query: {id: id}})
            },
            // 分类
            toClassDetail: function (id) {
                this.$router.push('/home/classifyList?' + 'supplierId=' + id+'&resource=class');
            },
            downNumClick: async function (c, index) {
                if (this.list[c].cartList[index].quantity > 1) {
                    this.list[c].cartList[index].quantity--;
                    const {status} = await service.updateCartCount({
                        id: this.list[c].cartList[index].id,
                        quantity: this.list[c].cartList[index].quantity
                    });
                    if (status !== '0') {
                        this.list[c].cartList[index].quantity++;
                    }

                } else {
                    this.delClick(c, index);
                }
                this.handleChangeAfter();
            },
            UpNumClick: async function (c, index) {
                this.list[c].cartList[index].quantity++;
                const {status} = await service.updateCartCount({
                    id: this.list[c].cartList[index].id,
                    quantity: this.list[c].cartList[index].quantity
                });
                if (status !== '0') {
                    this.list[c].cartList[index]--;
                }
                this.handleChangeAfter();
            },
            handleChangeAfter: lodash.debounce(function () {
                this.getList(false);
            }, 3000),

            delClick: async function (c, index) {
                await this.confirm('确定删除此商品?');
                await service.deleteCart({id: this.list[c].cartList[index].id, successMsg: '删除成功', load: true});
                this.getList();
            },

            //结算
            inventoryClick: async function () {

                const that = this;
                let arr = [], arr2 = [];
                for (let c = 0; c < this.list.length; c++) {
                    arr2.push({
                        list: [], isSelf: this.list[c].isSelf,
                        supplierId: this.list[c].supplierId,
                        supplierName: this.list[c].supplierName
                    });
                    const keys = Object.keys(this.selects[c]);
                    for (let i of keys) {
                        if (this.selects[c][i]) {
                            arr.push(this.list[c].cartList[i]);
                            arr2[c].list.push(this.list[c].cartList[i]);
                        }
                    }
                }
                const res = await service.toSettle({
                    load: true, id: arr.map(i => {
                        return i.id;
                    }).join(',')
                });
                if (res.status !== '0') {
                    return;
                }
                arr2 = arr2.filter(i => {
                    return i.list.length;
                });
                if (arr.length) {
                    localStorage.inventoryList = JSON.stringify(arr);
                    localStorage.inventoryList2 = JSON.stringify(arr2);
                    localStorage.allprice = that.allprice;
                    localStorage.cartInfo = JSON.stringify(res.data);
                    this.$router.push({name: 'myOrder', query: {resource: 'cart'}})
                } else {
                    Toast('请选择至少一款产品')
                }

            },


        },

    }
</script>

<style lang="scss">
    .shoppingCart-test {
        .mint-cell-title {
            display: none;
        }
        .mint-cell-value {
            flex: 1;
        }
    }
</style>
<style scoped lang="scss">
    @import "../../assets/public";
    .no-shop{
        text-align: center;
        width: 100%;
        img{
            margin: rem(70) auto 0;
            width: rem(120);
            height: rem(112);
        }
        .text{
            margin-top: rem(34);
            font-size: rem(16);
            color: #666;
        }
        .btn{
            border-radius: rem(25);
            width: rem(104);
            height: rem(35);
            font-size: rem(18);
            line-height: rem(35);
            border:1px solid #999;
            margin:  rem(15) auto;
        }
    }
    .postage {
        height: rem(40);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        padding: 0 rem(15) 0 rem(46);
        color: #999;
        font-size: rem(13);
        .tag {
            display: inline-block;
            width: rem(36);
            height: rem(20);
            text-align: center;
            line-height: rem(20);
            background-color: $them;
            color: #fff;
            font-size: rem(12);
            margin-right: rem(10);
            vertical-align: middle;
        }
        .tip {
            color: $them;
            font-size: rem(13);
            font-weight: bold;
            .iconfont {
                font-size: rem(10);
                margin-left: rem(10);
            }
        }
    }

    .classify-name {
        height: rem(44);
        line-height: rem(44);
        border-bottom: 1px solid $border;
        font-weight: bold;
        font-size: rem(14);
        color: #333333;
        img {
            margin: 0 rem(15);
        }
        > * {
            vertical-align: middle;
        }
    }

    .fixed-cart {
        border-top: 1px solid $border;
        border-bottom: 1px solid $border;
        position: fixed;
        bottom: rem(50);
        left: 0;
        height: rem(40);
        width: 100%;
        background-color: #ffffff;
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        .radius {
            margin: 0 rem(10) 0 rem(15);
            vertical-align: middle;
            display: inline-block;
            border-radius: 50%;
            width: rem(18);
            height: rem(18);
            background: rgba(238, 238, 238, 1);
        }
        .radius.active {
            background: url("../../assets/images/select1.png") no-repeat center;
            background-size: 100% 100%;
        }
        .radius + span {
            vertical-align: middle;
            font-size: rem(13);
            color: #333333;
        }
        .total {
            vertical-align: middle;
            display: inline-block;

            text-align: center;
            font-size: rem(15);
            color: #333333;
            span {
                vertical-align: middle;
            }
            .them {

                margin-right: rem(18);
            }

        }
        .createOrder {
            height: rem(40);
            line-height: rem(40);
            @extend .total;
            color: #ffffff;
            background-color: $them;
            width: rem(130);
        }
    }

    .mint-cell-title {
        display: none;
    }

    #shoppingCart {
        padding-bottom: rem(40);
    }

    .flex {
        width: 100%;
        @extend %flex;
        @extend %flex-align-center;
        /*height: rem(100);*/
        border-bottom: 1px solid lighten(gainsboro, 5%);
        color: #333333;
        padding-top: rem(15);
        padding-bottom: rem(15);
    }

    .shoppingCart {

    }

    .shoppingCart-test {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
    }

    .shoppingCart-first {
        width: 100%;
        height: 116px;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #EEEEEE;
    }

    .shoppingCart-first-one {
        width: 12%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .shoppingCart-first-one-img {
        width: rem(17);
        height: rem(17);
    }

    .shoppingCart-first-two {
        margin: 0 rem(10);
        width: rem(80);
        align-self: flex-start;
    }

    .shoppingCart-first-two-img {
        width: rem(80);
        height: rem(80);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .shoppingCart-first-three {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        /*margin-top: 5%;*/
    }

    .shoppingCart-first-three-one {
        width: 100%;
        /*height: 90%;*/
        display: flex;
        flex-direction: row;
        font-weight: 500;
    }

    .shoppingCart-first-three-two {
        width: 100%;
        height: 65%;
    }

    .shoppingCart-first-three-two00 {
        width: 100%;
        /*min-height: rem(36);*/
    }

    .shoppingCart-first-three-two01 {
        font-size: rem(13);
        color: #333333;
    }

    .shoppingCart-first-three-three {
        margin-top: rem(4);
    }

    .shoppingCart-first-three-three01 {
        color: #DBDBDB;
        font-size: rem(13);
    }

    .shoppingCart-first-three-three02 {
        color: #DBDBDB;
    }

    .shoppingCart-first-three-three003 {
        width: 20%;
        height: 100%;
    }

    .shoppingCart-first-three-three004-img {
        width: 47%;
        height: 100%;
        margin-top: 70%;
    }

    .shoppingCart-first-three-fore {
        width: 100%;
        /*height: 70%;*/
        /*border: 1px solid #F1F4F3;*/
        @extend %flex;
        @extend %flex-align-center;
        margin-top: rem(4);
        font-size: rem(13);
    }

    .shoppingCart-first-three-five {
        width: 60%;
        height: 100%;
    }

    .shoppingCart-first-three-five01 {
        color: red;
        margin-right: rem(5);
    }

    .shoppingCart-first-three-five02 {
        color: #DBDBDB;
        text-decoration: line-through;
    }

    .shoppingCart-first-three-six {
        width: 40%;
        height: 100%;
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        flex-direction: row;
        text-align: center;
    }

    .shoppingCart-first-three-six-img {
        width: rem(20);
        height: rem(20);
    }

    .shoppingCart-first-three-six001 {
        margin: 0 rem(5);
        display: inline-block;
        min-width: rem(30);
    }

    .shoppingCart-first-three-six001-img {
        width: rem(20);
        height: rem(20);
    }

    /*底部的一层*/
    .shoppingCart02 {
        width: 100%;
        height: rem(60);
        display: flex;
        flex-direction: column;
        background: #ffffff;
        position: fixed;
        bottom: 50px;
    }

    .shoppingCart02-one {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .shoppingCart02-two {
        width: 12%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .shoppingCart02-two-img {
        width: 52%;
        height: 41%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .shoppingCart03-three {
        width: 16%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
    }

    .shoppingCart03-three-text {
        margin-right: 40%;
    }

    .shoppingCart04-fore {
        width: 37%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .shoppingCart04-fore-text {
        font-size: 14px;
    }

    .shoppingCart04-fore-text01 {
        color: #FF6565;
        font-size: 14px;
    }

    .shoppingCart05-five {
        width: 35%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FF6161;
    }

    .shoppingCart05-five-text {
        background: #FF6161;
        color: #FFF8F8;
    }
    .activity_icon_box{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        .limitTime_icon{
            width: rem(33);
            height: rem(13);
            background-image: url("../../assets/images/limit_time_icon@2x.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
            margin-top: rem(5);
            margin-right: rem(9);
        }
    }
    .activity_icon_box1{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        margin-top: rem(5);
        .limitTime_icon1{
            width: rem(70);
            height: rem(16);
            background-image: url("../../assets/images/limit_time_shop@2x.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
            margin-right: rem(5);
        }
        .activity_time_show{
            height: rem(16);
            line-height: rem(16);
            color: #ED1B24;
            font-size: rem(12);
        }
    }
</style>