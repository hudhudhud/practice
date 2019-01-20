<template>
    <div>
        <div class="title">
            需支付：{{allprice}}元
        </div>
        <div class="pay_class">
            <div class="pay" @click="selectPay(0)">
                <div class="type">
                    <img src="../../assets/images/U.png" alt="">
                    <span>U币</span>
                </div>
                <div class="select">
                    <img v-if="active===0" src="../../assets/images2/select1.png" alt="">
                    <img v-else src="../../assets/images2/select1_hui.png" alt="">
                </div>
            </div>
            <div class="pay" @click="selectPay(1)">
                <div class="type">
                    <img src="../../assets/images/Vault.png" alt="">
                    <span>余额</span>
                </div>
                <div class="select">
                    <img v-if="active===1" src="../../assets/images2/select1.png" alt="">
                    <img v-else src="../../assets/images2/select1_hui.png" alt="">
                </div>
            </div>
            <!--<div class="pay" @click="selectPay(2)">-->
            <!--<div class="type">-->
            <!--<img src="../../assets/images/integral.png" alt="">-->
            <!--<span>积分</span>-->
            <!--</div>-->
            <!--<div class="select">-->
            <!--<img v-if="active===2" src="../../assets/images2/select1.png" alt="">-->
            <!--<img v-else src="../../assets/images2/select1_hui.png" alt="">-->
            <!--</div>-->
            <!--</div>-->
            <div class="pay" @click="selectPay(3)">
                <div class="type">
                    <img src="../../assets/images2/Mixed_payment.png" alt="">
                    <span>混合支付(U币、余额)</span>
                </div>
                <div class="select">
                    <img v-if="active===3" src="../../assets/images2/select1.png" alt="">
                    <img v-else src="../../assets/images2/select1_hui.png" alt="">
                </div>
            </div>
        </div>
        <template v-if="!isDF">
            <div class="other">
                其他支付方式
            </div>
            <div class="pay_class">
                <div class="pay" @click="selectPay(4)">
                    <div class="type">
                        <img src="../../assets/images/WeChat.png" alt="">
                        <span>微信</span>
                    </div>
                    <div class="select">
                        <img v-if="active===4" src="../../assets/images2/select1.png" alt="">
                        <img v-else src="../../assets/images2/select1_hui.png" alt="">
                    </div>
                </div>
                <div class="pay" @click="selectPay(5)">
                    <div class="type">
                        <i class="iconfont icon-umidd17"></i>
                        <span>支付宝</span>
                    </div>
                    <div class="select">
                        <img v-if="active===5" src="../../assets/images2/select1.png" alt="">
                        <img v-else src="../../assets/images2/select1_hui.png" alt="">
                    </div>
                </div>
                <div class="pay" @click="selectPay(6)">
                    <div class="type">
                        <img src="../../assets/img/pay/other.png" alt="">
                        <span>找人代付</span>
                    </div>
                    <div class="select">
                        <img v-if="active===6" src="../../assets/images2/select1.png" alt="">
                        <img v-else src="../../assets/images2/select1_hui.png" alt="">
                    </div>
                </div>
            </div>
        </template>

        <div class="button" @click="haveStore==1&&payClick()">
            <span>{{haveStore==2?'库存不足':'确认支付'}}</span>
        </div>
        <PayPsw ref="psw"/>
        <Alert ref="alert" :okDisabled="mixinNotEnough||mixinFree===false" @ok="mixinResolve()" @cancel="mixinReject()"
               :isTime="mixinIsTime">
            <div class="mixin-pay">
                <p class="mixin-pay-title">需支付：{{allprice}}元</p>
                <div class="mixin-pay-type" v-for="(item, index) in mixinPay">
                    <div class="mixin-check">
                        <Check :check.sync="item.use" v-on:update:check="distribution"/>
                    </div>
                    <div class="mixin-content">
                        <div>
                            <img class="icon-u" v-if="item.key==='u'" src="../../assets/images/U.png" alt="">
                            <img class="icon-v" v-if="item.key==='vault'" src="../../assets/images/Vault.png" alt="">
                            <img class="icon-i" v-if="item.key==='integral'" src="../../assets/images/integral.png"
                                 alt="">
                            <label> {{item.label}}</label>
                            <input type="text" v-model="item.money" @change="realTimeComputing(index)">
                        </div>
                        <div>
                            <span>可用余额：{{item.balance}}</span>
                            <span @click="useThis(index)">使用全部</span>
                        </div>
                    </div>
                </div>
            </div>
        </Alert>
        <SetPayPsw ref="setPsw"/>
    </div>

</template>

<script>
    import {
        getAccount,
        getPaySignature,
        payByLocalCurrency,
        getCustomerAmountByOrderId
    } from '../../service/pay/pay.service'
    import Alert from '@/components/alert'
    import Check from '@/components/check'
    import PayPsw from '@/components/commodity/inputPsw'
    import { Toast, MessageBox } from 'mint-ui';
    import SetPayPsw from '@/components/commodity/setPayPsw';
    import lodash from 'lodash';


    export default {
        name: "pay",
        components: {
            Alert,
            Check,
            PayPsw,
            SetPayPsw
        },
        data: function () {
            return {
                active: 4,
                allprice: '',
                orderId: '',
                mixinPay: [], // 混合支付
                mixinNotEnough: true, // 混合支付是否不够
                mixinFree: null, // 混合支付 自由分配 是否成
                mixinIsTime: false,
                mixinResolve: null,
                mixinReject: null,
                isDF: false,
                haveStore: '', //
            }
        },
        activated: function () {
            //this.$refs.alert.show = true;
            this.getAccount();
            //   this.allprice = Number(this.$route.query.allprice || 0).toFixed(2);
            this.orderId = this.$route.query.OrderId;
            this.isDF = this.$route.query.type === 'df';
            if(this.isDF)
                this.active = 0;
            this.getPrice();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getPrice: async function () {
                const res = await  getCustomerAmountByOrderId({id: this.orderId});
                if(res.status === '0'){
                    this.allprice = res.data.amount;
                    this.haveStore = res.data.haveStore;
                }
            },
            getUrlParam: function (name) {
                let r = window.location.href.match(/[\?&]\w+=\w+/g);
                if (!r) {
                    return null;
                }
                const data = r.find(i => {
                    return i.substr(1).split('=')[0] === name;
                })
                if (data) {
                    return data.split('=')[1];
                }
                return null;
            },
            /**
             * 获得余额
             * */
            getAccount: function () {
                getAccount({}).then(
                    res => {
                        //
                        this.mixinPay = [
                            {money: '', label: 'u币', key: 'u', use: true, balance: res.data.uCurrency},
                            {money: '', label: '余额', key: 'vault', use: true, balance: res.data.coffers},
                            //  {money: '', label: '积分', key: 'integral', use: true, balance: res.data.sumAmount}
                        ];
                    }, error => {

                    }
                )
            },
            /**
             * 混合支付 - 分配余额方法  第一种使用全部，如不够 使用第二种
             * */
            distribution: function () {
                // 清空余额情况
                this.mixinPay.map(i => {
                    i.money = '';
                    return i;
                });
                // Jisuan
                let allprice = this.allprice; // 总金额
                for (let i = 0; i < this.mixinPay.length; i++) {
                    if (!this.mixinPay[i].use) {
                        // 如果不适用这个种方式，则跳过
                        continue;
                    }
                    allprice -= this.mixinPay[i].balance;
                    if (allprice > 0) {
                        // 还有需要付的
                        this.mixinPay[i].money = this.mixinPay[i].balance;
                        //  allprice -= this.mixinPay[i].balance;
                    } else {
                        this.mixinPay[i].money = (Number(allprice) + Number(this.mixinPay[i].balance)).toFixed(2);
                        break;
                    }
                }
                //如果混合支付余额不足, 即存在未分配金额
                if (allprice > 0) {
                    this.mixinNotEnough = true;
                    Toast('混合支付余额不足');
                } else {
                    this.mixinNotEnough = false;
                    this.mixinFree = null;
                }
            },
            /**
             * 混合支付 - 计算金额 使得混合支付总额相加等于 支付金额.
             * */
            realTimeComputing: function (index) {
                this.mixinIsTime = true;
                setTimeout(() => {
                    this.mixinIsTime = false;
                }, 1500);
                this.computing(index);

            },
            computing: lodash.debounce(function (index) {
                // console.log(JSON.parse(JSON.stringify(this.mixinPay[index])));
                this.mixinPay[index].money = Math.abs(this.mixinPay[index].money || 0).toFixed(2);
                let total = 0; // 输入框加起来的 总数
                this.mixinPay.map(i => total += Number(i.money)); // 获取

                let value = total - Number(this.allprice);
                if (Math.abs(value) > 0) {
                    // 有差值  需要计算
                    for (let i = 1; i < this.mixinPay.length; i++) {
                        let forI = (i + index) > (this.mixinPay.length - 1) ? (i + index - this.mixinPay.length) : (i + index); // 获得他下一个的 坐标， 如果超过最后一个则获得第一个
                        if (!this.mixinPay[forI].use) {
                            // 如果不适用这个种方式，则跳过
                            continue;
                        }
                        let tmp = this.mixinPay[forI].money - value;
                        if (tmp <= Number(this.mixinPay[forI].balance) && tmp >= 0) { // 后一个值  必须不超过余额 并且大于0
                            this.mixinPay[forI].money = tmp.toFixed(2);
                            value = 0;
                            // 后一个完全承担了 当前的计算
                            break;
                        } else {
                            // 不够 需要继续向下
                            if (value > 0) {
                                value = value - this.mixinPay[forI].money;
                                this.mixinPay[forI].money = 0;
                            } else {
                                value = value + (this.mixinPay[forI].balance - this.mixinPay[forI].money);
                                this.mixinPay[forI].money = +this.mixinPay[forI].balance;
                            }

                        }
                    }

                    if (Math.abs(value) > 0) {
                        this.mixinFree = false;
                        Toast('混合支付无法分配');
                    } else {
                        this.mixinFree = true;
                        Toast('分配成功');
                    }
                } else {
                    this.mixinFree = true;
                }
            }, 0),
            /**
             * 选择支付方式
             * */
            selectPay: async function (i) {
                if (i === 3 && this.active !== 3) {
                    if (!this.mixinFree) { // 自由分配过了 就不需要计算分配了
                        this.distribution();// 计算分配
                    }
                    this.$refs.alert.show = true;
                    await new Promise((resolve, reject) => {
                        this.mixinResolve = resolve;
                        this.mixinReject = reject;
                    });
                    for (let i = 0; i < this.mixinPay.length; i++) {
                        if (isNaN(this.mixinPay[i].money)) {
                            Toast('请输入正确的金额');
                            return;
                        }
                    }
                    if (this.mixinNotEnough) {
                        return;
                    }
                }
                this.active = i;
            },
            /**
             * 混合支付方式  -点击 使用全部
             * */
            useThis: function (index) {
                // 旧版 利用余额分配算法  会调换位置
                //   const {[index]: indexItem} = this.mixinPay;
                //   indexItem.use = true;
                //   this.mixinPay.splice(index, 1);
                //  this.mixinPay.unshift(indexItem);
                // this.distribution();
                // 新版 利用自由分配算法， 不会调换位置
                this.mixinPay[index].money = this.allprice;
                this.realTimeComputing(index);

            },

            pswInput: async function (payPsw) {

                switch (this.active) {
                    case 0:
                        payByLocalCurrency({
                            uCurrency: this.allprice,
                            load: true, successMsg: '支付成功',
                            payPassword: hex_md5(payPsw),
                            id: this.orderId,
                            payType: 1
                        }).then(
                            res => {
                                if (res.status === '0') {
                                    //      this.inputPswShow = false;
                                    setTimeout(() => {
                                        if(this.isDF){
                                            this.$router.replace('/');
                                        } else {
                                            this.$router.replace({name: 'result', params: {orderType: 0}})
                                        }
                                    }, 2000);
                                } else if (res.status === '1' && res.msg === '请先设置您的支付密码！') {
                                    this.notPayPsw();
                                }
                            }
                        );
                        break;
                    case 1:
                        payByLocalCurrency({
                            coffersCount: this.allprice,
                            load: true, successMsg: '支付成功',
                            payPassword: hex_md5(payPsw),
                            id: this.orderId,
                            payType: 3
                        }).then(
                            res => {
                                if (res.status === '0') {
                                    setTimeout(() => {
                                        if(this.isDF){
                                            this.$router.replace('/');
                                        } else {
                                            this.$router.replace({name: 'result', params: {orderType: 0}})
                                        }
                                    }, 2000);
                                } else if (res.status === '1' && res.msg === '请先设置您的支付密码！') {
                                    this.notPayPsw();
                                }
                            }
                        );
                        break;
                    case 3:
                        payByLocalCurrency({
                            uCurrency: this.mixinPay.find(i => {
                                return i.key === 'u'
                            }).money,
                            coffersCount: this.mixinPay.find(i => {
                                return i.key === 'vault'
                            }).money,
                            load: true, successMsg: '支付成功',
                            payPassword: hex_md5(payPsw),
                            id: this.orderId,
                            payType: 10
                        }).then(
                            res => {
                                if (res.status === '0') {
                                    setTimeout(() => {
                                        if(this.isDF){
                                            this.$router.replace('/');
                                        } else {
                                            this.$router.replace({name: 'result', params: {orderType: 0}})
                                        }
                                    }, 2000);
                                } else if (res.status === '1' && res.msg === '请先设置您的支付密码！') {
                                    this.notPayPsw();
                                }
                            }
                        );
                        break;
                    case 5:
                    case 4: // 微信支付 支付宝支付
                        const res = await getPaySignature({
                            payType: this.active === 4 ? 'WXP' : 'ALP',
                            paymentsId: this.orderId,
                            load: true
                        });
                        if (res.status === '0') {
                            location.replace(res.data);
                        }
                        break;

                }

            },
            /**
             * 点击了支付按钮
             */
            payClick: async function () {
                if (this.active === 4 || this.active === 5) {
                    this.pswInput();
                    return;
                }
                // 代付
                if(this.active === 6){
                    this.$router.push({name: 'otherPay', params: {id: this.orderId}});
                    return;
                }
                const psw = await this.$refs.psw.getPayPsw();
                this.pswInput(psw);

            },
            /**
             * 未设置支付密码
             */
            notPayPsw: async function () {
                await this.confirm('是否现在设置', '还未设置您的支付密码', {confirmButtonText: '现在设置'});
                this.$refs.setPsw.setPayPsw()
            }
        }

    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .icon-u {
        width: rem(18);
        height: rem(18);
    }

    .icon-v {
        width: rem(18);
        height: rem(18);
    }

    .icon-i {
        width: rem(18);
        height: rem(18);
    }

    .mixin-pay {
        padding: 0 rem(10);
        .mixin-pay-title {
            height: rem(60);
            line-height: rem(60);
            font-size: rem(18);
            color: #333333;
        }
        .mixin-pay-type {
            padding: rem(10) 0;
            border-bottom: 1px solid lighten(gainsboro, 5%);
            @extend %flex;
            .mixin-check {
                width: rem(66);
            }
            .mixin-content {
                box-sizing: border-box;
                padding-right: rem(6);
                flex: 1;
                color: #333333;
                & > div {
                    @extend %flex;
                    @extend %justify-content-space-between;
                    input {
                        height: rem(25);
                        line-height: rem(25);
                        width: rem(110);
                        border: 1px solid #979797;
                    }
                    label {
                        margin: 0 rem(16) 0 rem(6);
                        font-size: rem(14);
                        white-space: nowrap;
                    }
                }
                & > div:last-of-type {
                    margin-top: rem(15);
                    font-size: rem(9);
                    color: #666666;
                }
            }
        }
        .mixin-pay-type:nth-of-type(1) {
            border-bottom: 1px solid lighten(gainsboro, 5%);
        }
    }

    .title {
        padding: rem(30) rem(20);
        color: #333333;
        font-size: rem(25);
        font-weight: bold;
    }

    .other {
        padding: rem(30) rem(20) rem(10);
        color: #333333;
        font-size: rem(15);
        font-weight: bold;
    }

    .button {
        width: 90%;
        margin: 15% auto 0;
        line-height: 50px;
        background: $them;
        color: white;
        text-align: center;
        border-radius: 25px;
        font-size: rem(16);
    }

    .pay {
        margin: 2px rem(15);
        padding: 0 rem(10);
        background-color: white;
        border-radius: 5px;
        height: rem(50);
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .iconfont {
            font-size: rem(20);
            color: #00aaef;
        }

        .type {
            * {
                vertical-align: middle;
            }
            img {
                width: rem(20);
                height: rem(20);
            }
            span {
                font-size: rem(13);
                margin-left: rem(8);
            }
        }
        .select {
            img {
                width: rem(20);
                height: rem(20);
            }
        }
    }
</style>