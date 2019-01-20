<template>
    <div id='myOrder' class="myOrder">
        <!--1.-->
        <div class="myOrder-one" @click='upAddressClick'>
            <div class="myOrder-one-left">
                <img class="myOrder-one-left-img" src="../../assets/images/Location.png"/>
            </div>
            <div class="myOrder-one-center">
                <p>收货人：
                    <span class="name">{{addressList.realname}}</span>
                    <span>{{addressList.phone}}</span>
                </p>
                <p>
                    <span>收货地址：</span>
                    <span>{{address}}</span>
                </p>
            </div>
            <div class="myOrder-one-right">
                <i class="iconfont icon-right"></i>
            </div>
        </div>
        <!--2.-->
        <div class="inventoryList">
            <div class="inventory-group" v-for="group in inventoryList2">
                <div class="group-title" v-if="resource==='cart'">{{group.supplierName}}</div>
                <div class="myOrder-two" v-for='item in group.list'>
                    <div class="myOrder-two-top">
                        <div class="myOrder-two-top-left">
                            <img v-if="!isUpgrade" class="myOrder-two-top-left-img" :src="item.productImg"/>
                            <img v-else-if="shopType==1" class="myOrder-two-top-left-img"
                                 src="../../assets/img/vip/shop.png"/>
                            <img v-else class="myOrder-two-top-left-img" src="../../assets/img/vip/one_shop.png"/>

                        </div>
                        <div class="myOrder-two-top-center">
                            <div class="title">{{item.productTitle}}</div>
                            <div class="intro">{{item.productIntro}}</div>
                            <!--<div class="myOrder-two-top-center-content">-->
                            <!--<div class="myOrder-two-top-center-content-one">-->
                            <!--<span class="myOrder-two-top-center-content-one-text">{{item.productTitle}}</span>-->
                            <!--</div>-->
                            <!--<div class="myOrder-two-top-center-content-two">-->
                            <!--<div class="myOrder-two-top-center-content-two-left">-->
                            <!--<span class="myOrder-two-top-center-content-two-left-textOne">{{item.productIntro}}</span>-->
                            <!--&lt;!&ndash; <span class="myOrder-two-top-center-content-two-left-textTwo">居家温暖棕色</span> &ndash;&gt;-->
                            <!--</div>-->
                            <!--&lt;!&ndash; <div class="myOrder-two-top-center-content-two-right">-->
                            <!--<span class="myOrder-two-top-center-content-two-right-textOne">坐数：</span>-->
                            <!--<span class="myOrder-two-top-center-content-two-right-textTwo">2人坐</span>-->
                            <!--</div> &ndash;&gt;-->
                            <!--</div>-->
                            <!--</div>-->
                        </div>
                        <div class="myOrder-two-top-right">
                            <p class="marketPrice">
                                <span class="">¥{{item.marketPrice}}</span>
                            </p>
                            <p class="price">
                                <span v-if="item.type===4">{{parseInt(item.price)}}F</span>
                                <span v-else>¥{{item.price}}</span>
                            </p>
                            <p class="quantity">
                                <span class="">×{{item.quantity}}</span>
                            </p>
                        </div>
                    </div>

                </div>
                <div class="group-bottom" v-if="resource==='cart'">
                    <p>
                        <span>配送费用</span>
                        <span style="float: right">{{Number(postage[group.supplierId])?postage[group.supplierId]:'包邮'}}</span>
                    </p>
                    <p>
                        <span>添加备注：</span>
                        <input type="text" placeholder="请写下想要说的话…" v-model="group.supplierRemarks">
                    </p>
                </div>
            </div>


            <!--套餐-->
            <!--店主套餐-->
            <div v-if="isUpgrade&&shopType==1" class="upgrade">
                <div class="tip">赠送服务</div>
                <label v-for="(item, index) in upgradeData" :key="index">
                    <input type="radio" name="upgrade" v-model="indexUpgrade" :value="index">
                    <span>{{item.title}}</span>
                </label>
            </div>
            <!--一星店主套餐-->
            <div v-if="isUpgrade&&shopType==2" class="upgrade">
                <div class="tip">赠送服务</div>
                <div>
                    <div class="item" v-for="(item, index) in upgradeData" :key="index">
                        <label>
                            <span>{{item.title}}</span>
                        </label>
                        <div>
                            <i class="iconfont icon-jian" @click="handleCountChange(index,-1)"></i>
                            <span>{{item.count||0}}</span>
                            <i class="iconfont icon-jia" @click="handleCountChange(index,1)"></i>
                        </div>
                    </div>
                </div>
            </div>
            <!--邀请人手机号-->
            <div class="invitePhone" v-if="showInvitePhone">
                <div class="flex">
                    <label><span class="important">*</span>邀请人：</label>
                    <input type="text" placeholder="请输入邀请人手机号" v-model="invitePhone" :disabled="invitePhoneDisable">
                </div>
                <div class="tip">
                    1、根据相关规定购买该服务时，需填写邀请人！如果您没有邀请人，可为您推荐邀请人！
                    <br/>2、提交订单前请仔细核对邀请人信息，如信息有误，请及时修改。
                    <br/>3、邀请关系一旦绑定成功，将无法修改。
                </div>
            </div>
            <!--套餐 end-->
            <!--积分抵扣 useIntegral-->
            <div class="eCard" v-if="integralInfo&&Number(integralInfo.maxCanUseJIfen)">
                <p>使用积分抵扣，最高可抵扣{{integralInfo.maxCanUseJIfen}}元</p>
                <p>积分余额{{integralInfo.jifenRemainSum}}元，限指定商品使用</p>
                <div class="check">
                    <Check :check.sync="useIntegral"/>
                </div>
            </div>
            <!--火兔e卡-->
            <div class="eCard" v-if="eCardInfo">
                <p>使用火兔E卡，本单可减{{eCardInfo.skuEcardAmount}}元</p>
                <p>火兔E卡余额{{eCardInfo.sumEcardAmount}}元，限指定商品使用</p>
                <div class="check">
                    <Check :check.sync="useECard"/>
                </div>
                <div class="tip" v-if="useECard">
                    使用火兔E卡后，将不再享受商品的折扣！
                </div>
            </div>
            <!--3.-->
            <div class="myOrder-three">
                <p class="info">
                    <span>商品金额：</span>
                    <span v-if="inventoryList[0].type===4">{{allMarketPrice}}积分</span>
                    <span v-else>￥{{Number(allMarketPrice).toFixed(2)}}</span>
                </p>
                <p class="info">
                    <span>享受折扣：</span>
                    <span>{{allDiscount?('-￥'+allDiscount):'未使用'}}</span>
                </p>
                <p class="info" v-if="eCardInfo">
                    <span>火兔E卡抵扣：</span>
                    <span>{{useECard?('-￥'+Math.min(eCardInfo.skuEcardAmount,eCardInfo.sumEcardAmount)):'未使用'}}</span>
                </p>
                <p class="info" v-if="integralInfo&&Number(integralInfo.maxCanUseJIfen)">
                    <span>积分抵扣：</span>
                    <span>{{useIntegral?integralInfo.maxCanUseJIfen:'未使用'}}</span>
                </p>
                <p class="info">
                    <span>配送费用：</span>
                    <span>{{Number(postage.totalPostage)?('￥'+Number(postage.totalPostage).toFixed(2)):'包邮'}}</span>
                </p>
            </div>

        </div>

        <div class="remark">
            <div class="label">添加备注：</div>
            <textarea placeholder="请写下想要说的话" v-model="buyerMemo"></textarea>
        </div>


        <!--4.-->
        <div class="show-shop-tip" v-if="showShopTip">
            你已绑定过邀请人，本次邀请不会改变原有的邀请关系，请知悉！！
            <div class="close" @click="showShopTip=false">
                <i class="iconfont icon-guanbi"></i>
            </div>
        </div>
        <div class="myOrder-four">
            <div class="myOrder-four-left">
                <div class="myOrder-four-left-one">
                    <span>共{{inventoryList.length}}件商品</span>
                </div>
                <div class="myOrder-four-left-two">
                    <span class="myOrder-four-left-two-textOne">应付款：</span>
                    <span class="myOrder-four-left-two-textTwo" v-if="inventoryList[0].type===4">{{parseInt(allprice+Number(postage.totalPostage))}}积分</span>
                    <span class="myOrder-four-left-two-textTwo" v-else>¥{{(Number(allprice)+Number(postage.totalPostage)).toFixed(2)}}</span>
                </div>
            </div>
            <div class="myOrder-four-right" @click='submitOrder'>
                <span class="myOrder-four-right-text">提交订单</span>
            </div>
        </div>
        <PayPsw ref="psw"/>
    </div>

</template>

<script>
    import {Indicator, Toast} from 'mint-ui';
    import * as service from '../../service/upgradeVip.service';
    import {isPhone} from "../../service/util";
    import {getSkuEcardAmount} from '../../service/pay/pay.service'
    import Check from '@/components/check'
    import {getNumberByPhone} from "../../service/upgradeVip.service";
    import {createOrder, getDefaultAddress} from "../../service/order.service";
    import PayPsw from '@/components/commodity/inputPsw'

    export default {
        name: "my-order",
        components: {
            Check,
            PayPsw
        },
        data: function () {
            return {
                inventoryList: [{}],//通知
                inventoryList2: [],
                addressList: [],//地址
                address: '',
                postage: {
                    totalPostage: 0
                },
                skuId: '',
                inviteNumber: '',
                buyerMemo: '',// 留言
                invitePhone: '',
                invitePhoneDisable: false,
                flag: '',
                // 升级服务
                isUpgrade: false,
                shopType: 1, // 1 店主套餐   2 一星店主套餐
                indexUpgrade: 1, // 店主套餐专用   升级服务  选择的套餐
                upgradeData: [], // upgradePrice 升级服务的  数据
                useECard: false,
                useIntegral: 0,
                eCardInfo: null,
                integralInfo: null,
                showShop: false,
                resource: ''
            }
        },
        computed: {
            showShopTip: {
                get: function () {
                    return this.showShop && !this.flag;
                },
                set: function (newValue) {
                    this.showShop = newValue;
                }
            },
            UserInfo() {
                return this.$store.state.userInfo;
            },
            allCountUpgrade() { // 一星店主套餐专用，   总套餐数量
                let count = 0;
                this.upgradeData.map(i => {
                    count += i.count || 0;
                });
                return count;
            },
            // 享受折扣
            allDiscount: function () {
                return (this.allMarketPrice - this.allMarketPriceEcard).toFixed(2);
            },
            // 原价
            allMarketPrice: function () {
                if (!this.inventoryList.length) {
                    return 0;
                }
                let total = 0;
                for (let i = 0; i < this.inventoryList.length; i++) {
                    total += this.inventoryList[i].marketPrice * this.inventoryList[i].quantity;
                }
                return total;
            },
            // 使用e卡的原价
            allMarketPriceEcard: function () {
                if (!this.inventoryList.length) {
                    return 0;
                }
                let total = 0;
                for (let i = 0; i < this.inventoryList.length; i++) {
                    if (this.useECard && this.inventoryList[i].ecardAmount) {
                        total += this.inventoryList[i].marketPrice * this.inventoryList[i].quantity;
                    } else {
                        total += this.inventoryList[i].price * this.inventoryList[i].quantity;
                    }
                }
                return total;
            },
            allprice: function () {
                if (!this.inventoryList.length) {
                    return 0;
                }
                let total = this.allMarketPriceEcard;
                if (this.useECard) {
                    total -= Math.min(this.eCardInfo.skuEcardAmount, this.eCardInfo.sumEcardAmount);
                }
                if (this.useIntegral) {
                    total -= Math.min(this.integralInfo.maxCanUseJIfen, this.integralInfo.jifenRemainSum);
                }
                return total;
            },
            /**
             * 是否显示邀请人弹框
             * */
            showInvitePhone: function () {
                return this.flag && this.inventoryList[0].type !== 4;
            }
        },
        watch: {
            indexUpgrade: function (newQuestion, oldQuestion) {
                this.setUpgradeDataByI();
            },
            useECard: function (newValue) {
                this.getPostage();
            }
        },
        activated: function () {
            this.resource = this.$route.query.resource;
            this.showShop = Boolean(this.$route.query.shop);
            this.inviteNumber = this.$route.query.inviteNumber || localStorage.getItem('appKey') || '';
            if (this.$route.query.type === 'upgrade') {
                this.shopType = this.$route.query.shopType;
                this.isUpgrade = true;
                this.getUpgradeInfo();
            } else {
                this.onRead();
            }
            this.getStatus();
            this.getPostage();
            //  $(".myOrder").css("height", window.screen.availHeight);
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
            this.clearAddress();
        },
        methods: {
            getPostage: async function () {
                if (!this.inventoryList[0].id) {
                    return;
                }
                await this.getAddress();
                let id = '', marketPrice = 0;
                if (this.isUpgrade) {
                    ({
                        data: {
                            sku: id,
                            marketPrice
                        }
                    } = await service.getSkuIdByProductTags({productId: this.inventoryList[0].productTagId}));
                    if (this.shopType == 2) {
                        marketPrice = marketPrice * 6;
                    }
                    this.inventoryList[0].marketPrice = marketPrice;
                    this.inventoryList[0].price = marketPrice;
                    this.$set(this.inventoryList, '0', this.inventoryList[0]);
                } else {
                    id = this.inventoryList[0].productTagId;
                }
                if (!this.addressList.id) {
                    return;
                }
                if (this.resource === 'cart') {
                    //  findPostageCart
                    const res = await service.findPostageCart({
                        cartIds: this.inventoryList.map(i => {
                            return i.id;
                        }).join(','),
                        isUseEcard: Number(this.useECard),
                        provinceId: this.addressList.id,
                        load: true
                    });
                    if (res.status === '0') {
                        this.postage = res.data;
                        console.log(this.postage)
                    }

                } else {
                    const res = await service.findPostage({
                        skuId: id,
                        provinceId: this.addressList.id,
                        quantity: this.inventoryList[0].quantity,
                        load: true,
                        isUseEcard: Number(this.useECard)
                    });
                    if (res.status === '0')
                        this.postage = {totalPostage: res.data.postage};
                }

            },
            getStatus: async function () {
                if(this.inventoryList[0].type === 4){
                    return;
                }
                ({data: this.flag} = await service.checkChangeInvite({}));
                if (this.flag && this.inviteNumber) {
                    const res = await service.getPhoneByNumber({id: this.inviteNumber});
                    if (res.status === '0') {
                        this.invitePhone = res.data.phone;
                    }
                }
            },
            /**
             * 商品 获取数据
             * @param num
             */
            onRead: function (num) {
                const that = this;

                that.inventoryList = JSON.parse(localStorage.inventoryList);
                that.inventoryList2 = JSON.parse(localStorage.inventoryList2);
                // console.log(this.inventoryList);
                // console.log(this.inventoryList2);
                //     that.allprice = localStorage.allprice;
                this.getSkuEcardAmount();
            },
            /**
             * 获取e卡可用额度
             * */
            getSkuEcardAmount: async function () {
                if (this.resource === 'cart') {
                    let cartInfo = JSON.parse(localStorage.getItem('cartInfo'));
                    if (Number(cartInfo.maxCanUseEcard))
                        this.eCardInfo = {
                            sumEcardAmount: cartInfo.ecardRemainSum,
                            skuEcardAmount: cartInfo.maxCanUseEcard
                        }
                    // 获得积分信息
                    this.integralInfo = cartInfo;
                } else {
                    if (this.inventoryList[0].ecardAmount) {
                        const res = await getSkuEcardAmount({id: this.inventoryList[0].productTagId});
                        if (res.status === '0') {
                            this.eCardInfo = res.data;
                            this.eCardInfo.skuEcardAmount = this.eCardInfo.skuEcardAmount * this.inventoryList[0].quantity;
                        }
                    }
                }


            },
            /**
             * s获得地址
             * */
            getAddress: function () {
                const that = this;
                return new Promise((resolve, reject) => {
                    if (localStorage.upAddressList) {

                        that.addressList = JSON.parse(localStorage.upAddressList);
                        that.address = that.addressList.provinceName + (that.addressList.cityName === "市辖区" ? "" : '"' + that.addressList.cityName + '"') + that.addressList.districtName + that.addressList.address;
                        resolve();
                    }
                    else {
                        getDefaultAddress().then(
                            res => {
                                resolve()
                                if (res.status === '0') {
                                    if (!res.data) {
                                        return
                                    }
                                    that.addressList = res.data;
                                    that.address = res.data.provinceName + (res.data.cityName === "市辖区" ? "" : '"' + res.data.cityName + '"') + res.data.districtName + res.data.address;
                                    //
                                }
                            }, () => {
                                reject()
                            }
                        );
                    }
                })


            },
            clearAddress: function () {
                localStorage.upAddressList = '';
            },
            /**
             * 升级服务 获取数据
             */
            getUpgradeInfo: async function () {
                this.upgradeData = JSON.parse(localStorage.getItem('upgrade_data'));
                for (let i = 0; i < this.upgradeData.length; i++) {
                    if (this.upgradeData[i].count === 6) {
                        this.indexUpgrade = i;
                        break;
                    }
                }
                this.setUpgradeDataByI();
                //  if (this.inviteNumber) {
                if (this.$route.query.action === 'select') {
                    this.invitePhone = this.$route.query.phone;
                } else {
                    const res = await service.getPhoneByNumber({id: this.inviteNumber || ''});
                    if (res.status === '0') {
                        this.invitePhone = res.data.phone;
                    }
                }

                //     this.invitePhoneDisable = Boolean(this.inviteNumber);
                //  }

            },
            /**
             * 获得  套餐 i的 数据
             */
            setUpgradeDataByI: function () {
                this.upgradeData = JSON.parse(localStorage.getItem('upgrade_data'));
                if (this.shopType == 1) {
                    const data = this.upgradeData[this.indexUpgrade];
                    console.log(JSON.parse(JSON.stringify(this.inventoryList[0])));
                    this.inventoryList = [{
                        ...data,
                        productImg: data.mainImg,
                        productTitle: '加盟店主服务费',
                        productIntro: data.intro,
                        quantity: 1,
                        productTagId: data.id
                    }];
                    console.log(JSON.parse(JSON.stringify(this.inventoryList[0])));

                    this.inventoryList2 = [{list: this.inventoryList}];
                } else {
                    // 一星店主套餐
                    this.inventoryList = [{
                        ...this.upgradeData[0],
                        productImg: this.upgradeData[0].mainImg,
                        productTitle: '加盟一星店主服务费',
                        productIntro: this.upgradeData[0].intro,
                        quantity: 1,
                        productTagId: this.upgradeData[0].id
                    }];
                    this.inventoryList2 = [{list: this.inventoryList}];
                }


            },
            /**
             * 套餐数量改变  (一星店主)
             */
            handleCountChange: function (i, action) {
                if (action > 0) {
                    if (this.allCountUpgrade >= 6) {
                        Toast('合计最多6个套餐');
                    } else {
                        this.upgradeData[i].count += action;
                    }
                } else {
                    if (Number(this.upgradeData[i].count) > 0) {
                        this.upgradeData[i].count += action;
                    }
                }

            },

            upAddressClick: function () {
                this.$router.replace({
                    name: 'addressList',
                    query: {action: 'select', ...this.$route.query, phone: this.invitePhone}
                })

            },

            //提交订单
            submitOrder: async function () {
                let payPsw;
                if (this.isUpgrade) {
                    if (this.shopType == 2 && this.allCountUpgrade !== 6) { // 如果是一星店主
                        Toast('请添加6个套餐');
                        return;
                    }
                    // if (this.flag && !/1[2-9]\d{9}/.test(this.invitePhone)) {
                    //     Toast('请填写正确邀请人手机号');
                    //     return;
                    // }

                }
                if (this.inventoryList[0].type !== 4) {
                    if (this.showInvitePhone) {
                        if (!isPhone(this.invitePhone)) {
                            Toast('请填写正确的手机号');
                            return;
                        }
                        const res = await service.getInviterInfo({phone: this.invitePhone});
                        if (res.status === '0') {
                            if (isPhone(this.invitePhone)) {
                                await this.confirm('请核实邀请人信息，邀请人一旦绑定成功，将无法修改，请谨慎操作！', '温馨提示', {
                                    confirmButtonText: '确认绑定', cancelButtonText: '修改邀请人', slot: `
    <div class="confirmPhone">
  <div>
    <p>邀请人：${res.data.nickname}</p>
     <p>手机号：${res.data.phone}</p>
</div>
</div>
`
                                });
                            } else {
                                await this.confirm('您未填写邀请人，是否需要为您推荐一位邀请人？', '温馨提示', {
                                    confirmButtonText: '使用推荐', cancelButtonText: '自己填写', slot: `
    <div class="confirmPhone">
  <div>
    <p>邀请人：${res.data.nickname}</p>
     <p>手机号：${res.data.phone}</p>
</div>
</div>
`
                                });
                                this.invitePhone = res.data.phone;
                            }
                            // 确定 绑定 邀请人 将邀请人 保存
                            try {
                                const numberRes = await getNumberByPhone({inviterPhone: this.invitePhone});
                                if (numberRes.status === '0') {
                                    console.log('保存number');
                                    localStorage.setItem('appKey', numberRes.data.inviterNumber)
                                }
                            } catch (e) {
                            }
                        }
                    }
                    // 没有邀请人  要提示 到有为止
                    /* if (this.flag && !this.inviteNumber && !this.isUpgrade) {
                         let prompt;
                         try {
                             prompt = await this.prompt('邀请人手机号', '提示', {
                                 text: '您还未填写邀请人，如果有邀请人，请在下方填写邀请人手机号；如果没有，可以选择暂不填写。',
                                 cancelButtonText: '暂不填写',
                                 confirmButtonText: '确认填写'
                             })
                         }catch (e) {

                         }
                         if(prompt){
                             if(!isPhone(prompt.value)){
                                 Toast('请输入正确的手机号');
                                 return;
                             }
                             const promptRes = await service.getInviterInfo({phone: prompt.value});
                             if(promptRes.status === '0'){
                                 await this.confirm('请核实邀请人信息，邀请人一旦绑定成功，将无法修改，请谨慎操作！', '温馨提示', {
                                     confirmButtonText: '确认绑定', cancelButtonText: '取消绑定', slot: `
     <div class="confirmPhone">
   <div>
     <p>邀请人：${promptRes.data.nickname}</p>
      <p>手机号：${promptRes.data.phone}</p>
 </div>
 </div>
 `
                                 });
                                 this.invitePhone = promptRes.data.phone;
                             }
                         }

                     }*/
                } else {
                    payPsw = await this.$refs.psw.getPayPsw();
                    if(!payPsw){
                        this.$toast('请输入支付密码');
                        return;
                    }
                }
                //   Indicator.open();
                const that = this;
                let id = '';
                if (that.isUpgrade) {
                    ({data: {sku: id}} = await service.getSkuIdByProductTags({productId: that.inventoryList[0].productTagId}));
                } else {
                    id = that.inventoryList[0].productTagId;
                }
                let body = {
                    "addressId": that.addressList.id,
                    //    "quantity": that.inventoryList[0].quantity,
                    "flag": this.flag,
                    inviteNumber: '',
                    buyerMemo: that.buyerMemo,
                    useIntegral: this.useIntegral ? 1 : undefined,
                    useEcard: that.useECard ? 1 : 0,
                    invitePhone: this.invitePhone
                };
                if (this.resource === 'cart') {
                    body.cartIds = this.inventoryList.map(i => {
                        return i.id;
                    }).join(',');
                    body.supplierRemarks = this.inventoryList2.filter(i => i.supplierRemarks).map(i => i.supplierId + ':' + i.supplierRemarks).join(',');

                } else {
                    body.skuId = id;
                    body.quantity = this.inventoryList[0].quantity;
                }
                if (this.inventoryList[0].type === 4) {
                    body.payPassword = hex_md5(payPsw);
                }

                if (this.isUpgrade) {
                    if (this.shopType == 2) { // 一星店主需要添加信息
                        /* body.buyerMemo += JSON.stringify(that.upgradeData.map(i => {
                             return {[i.title]: i.count || 0};
                         }));*/
                        body.oneStarTags = that.upgradeData.map(i => {
                            return i.title[0] + ':' + i.count;
                        }).join(',');
                    }
                }
                createOrder({load: true, ...body}).then(
                    res => {
                        if (res.status === '0') {
                            setTimeout(function () {
                                if (that.inventoryList[0].type === 4) {
                                    that.$router.replace({name: 'personalOrder', params: {orderType: 0}})
                                } else {
                                    that.$router.replace({
                                        name: 'pay',
                                        query: {
                                            OrderId: res.id
                                        }
                                    })
                                }

                            }, 1000);
                        }
                    }
                );


            },


        }

    }
</script>
<style lang="scss">
    @import "../../assets/public";

    .confirmPhone {
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        margin: 0 auto rem(29);
        width: rem(273);
        height: rem(54);
        background-color: #F1F4F3;
        color: #333333;
    }
</style>

<style scoped lang="scss">
    @import "../../assets/public";

    .inventory-group {
        margin-top: rem(10);
        .group-title {
            height: rem(44);
            line-height: rem(44);
            border-bottom: 1px solid $border;
            text-indent: rem(15);
            color: #333333;
            font-size: rem(14);
            background-color: #ffffff;
        }
        .group-bottom {
            background-color: #ffffff;
            padding: 0 rem(15);
            line-height: rem(28);
            font-size: rem(13);
            color: #333333;
        }
    }

    .show-shop-tip {
        position: fixed;
        width: 100%;
        height: rem(34);
        line-height: rem(34);
        bottom: rem(49);
        left: 0;
        font-size: rem(11);
        color: $them;
        text-align: center;
        background-color: #F9F9CD;
        .close {
            display: inline-block;
            border-radius: 50%;
            width: rem(12);
            height: rem(12);
            line-height: rem(12);
            text-align: center;
            vertical-align: middle;
            border: 1px solid #999999;
            .iconfont {
                font-size: rem(8);
            }
            color: #999999;
        }
    }

    .invitePhone {
        margin: rem(10) 0;
        background-color: white;
        //  height: rem(73);
        box-sizing: border-box;
        padding-top: rem(14);
        font-size: rem(14);
        .important {
            color: red;
            vertical-align: middle;
            font-size: 155%;
        }
        .flex {
            @extend %flex-align-center;
            @extend %flex;
            input {
                background-color: #ffffff;
            }
        }
        .tip {
            padding-bottom: rem(15);
            padding-left: rem(22);
            color: red;
            font-size: rem(11);
            margin-top: rem(10);
        }
        input {
            text-indent: 10px;
            width: rem(225);
            height: rem(25);
            border: 1px solid gainsboro;
            background-color: #F3F3F3;
        }
        label {
            margin-left: rem(10);
        }
    }

    .upgrade {
        .item {
            margin: rem(10) 0;
            @extend %flex-align-center;
            @extend %flex;
            font-size: rem(13);
            color: #333333;
            & > div:last-of-type {
                margin-left: rem(20);
                & > * {
                    vertical-align: middle;
                }
                span {
                    text-align: center;
                    min-width: rem(30);
                    display: inline-block;
                }
            }
        }
    }

    .upgrade {
        box-sizing: border-box;
        position: relative;
        margin: rem(10) 0;
        min-height: rem(80);
        padding-top: rem(10);
        background-color: white;
        @extend %flex-align-center;
        @extend %flex;
        @extend %justify-content-center;
        label {
            @include label-radio(url("../../assets/images2/selected_hui.png"), url("../../assets/images2/selected.png"));
            margin: 0 rem(22);
        }
        .tip {
            position: absolute;
            top: rem(5);
            left: rem(10);
            font-size: rem(13);
            color: #333333;
        }
    }

    .eCard {
        position: relative;
        margin: rem(10) 0;
        padding: rem(10);
        padding-bottom: 0;
        color: #333333;
        font-size: rem(14);
        background-color: #ffffff;
        p:last-of-type {
            margin-top: rem(5);
            font-size: rem(12);
            color: #999999;
            padding-bottom: rem(10);
        }
        .check {
            position: absolute;
            right: rem(22);
            top: rem(23);
        }
        @keyframes tip-show {
            0% {
                height: 0;
            }
            100% {
                height: rem(34);
            }
        }
        .tip {
            overflow: hidden;
            animation: tip-show .3s ease-out;
            border-top: 1px solid $border;
            height: rem(34);
            line-height: rem(34);
            font-size: rem(12);
            color: $them;
        }
    }

    .myOrder {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow-y: auto;
        padding-bottom: rem(60);
    }

    .remark {
        margin-top: rem(10);
        padding: rem(10) rem(10);
        min-height: rem(70);
        background-color: white;
        font-size: rem(13);
        line-height: rem(13);
        color: #333333;
        @extend %flex;
        .label {

        }
        textarea {
            flex: 1;
        }
    }

    /*1.*/
    .myOrder-one {
        width: 100%;
        height: rem(80);
        background: #ffffff;
        display: flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        flex-direction: row;
        border-bottom: 1px solid #F1F4F3;
    }

    .myOrder-one-left {
        width: 12%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .myOrder-one-left-img {
        width: rem(16);
        height: rem(22);
    }

    .myOrder-one-center {
        width: 76%;
        p:nth-of-type(1) {

            font-size: rem(13);
            color: #434343;
            letter-spacing: 0;
            .name {
                margin-right: rem(10);
            }
        }
        p:nth-of-type(2) {
            margin-top: rem(5);
            font-size: rem(13);
            color: #BBBBBB;
            letter-spacing: 0;
            text-align: left;
            line-height: rem(17);
        }
    }

    .myOrder-one-right {
        width: 12%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .myOrder-one-right-img {
        width: 30%;
        height: 15%;
    }

    /*2.*/
    .myOrder-two {
        width: 100%;
        //  height: 50%;
        height: rem(100);
        display: flex;
        flex-direction: column;
        background: #ffffff;
    }

    .myOrder-two-top {
        width: 100%;
        height: 100%;
        border: 1px solid #F1F4F3;
        display: flex;
        flex-direction: row;
        padding: rem(10);
        box-sizing: border-box;
    }

    .myOrder-two-top-left {
        margin-right: rem(10);
    }

    .myOrder-two-top-left-img {
        width: rem(80);
        height: rem(80);
    }

    .myOrder-two-top-center {
        height: 100%;
        width: 60%;
        padding: 3px 0;
        position: relative;
        .title {
            font-size: rem(13);
            color: #333333;
            letter-spacing: 0;
            text-align: left;
            line-height: rem(13);
        }
        .intro {
            position: absolute;
            bottom: 3px;
            font-size: rem(13);
            color: #BBBBBB;
        }
    }

    .myOrder-two-top-right {
        width: 15%;
        height: 100%;
        font-size: rem(13);
        color: #BBBBBB;
        text-align: right;
        .marketPrice {
            text-decoration: line-through;
        }
        .price {
            margin: 5px 0;
            white-space: nowrap;
        }
    }

    .mine-two {
        width: 100%;
        height: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .myOrder-two-top-right-content-center {
        font-size: 14px;
    }

    .mine-three {
        width: 100%;
        height: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .myOrder-two-top-right-content-bottom {
        font-size: 14px;
        color: #C0C0C0;
    }

    .myOrder-two-bottom {
        width: 100%;
        height: 30%;
        display: flex;
        flex-direction: row;
    }

    .myOrder-two-bottom-left {
        width: 75%;
        height: 100%;
        display: flex;
        align-items: center;
        margin-left: 5%;
    }

    .myOrder-two-bottom-right {
        width: 27%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .myOrder-two-bottom-right-img {
        width: 12%;
        height: 30%;
        margin-left: 13%;
    }

    /*3.*/
    .myOrder-three {
        padding-top: rem(10);
        width: 100%;
        margin-top: rem(10);
        background: #ffffff;
        color: #333333;
        font-size: rem(13);
        .info {
            padding: 0 rem(10) rem(10);
            @extend %flex;
            @extend %justify-content-space-between;
        }
    }

    /*4.*/
    .myOrder-four {
        width: 100%;
        height: rem(49);
        position: fixed;
        bottom: 0;
        background: #ffffff;
        display: flex;
        flex-direction: row;
    }

    .myOrder-four-left {
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .myOrder-four-left-one {
        width: 35%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #BCBCBC;
        font-size: 13px;
    }

    .myOrder-four-left-two {
        padding-left: 5px;
        width: 65%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .myOrder-four-left-two-textOne {
        font-size: rem(14);
        color: #333333;
    }

    .myOrder-four-left-two-textTwo {
        font-size: 16px;
        color: #FF6969;
    }

    .myOrder-four-right {
        width: 40%;
        height: 100%;
        background: $them;
    }

    .myOrder-four-right-text {
        width: 100%;
        height: 100%;
        color: #ffffff;
        font-size: rem(15);
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>