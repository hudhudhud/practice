<template>
    <div>
        <div class="content">
            <mt-cell title="提现银行卡" is-link @click.native="bankCardClick">
                <span v-if="bankCard">{{bankCard.bankName}}</span>
                <span v-else style="color: red">请添加银行卡</span>
            </mt-cell>
            <p class="tip">提现金额</p>
            <div class="input">
                <i class="iconfont icon-money"></i>
                <input type="number" placeholder="输入提现金额" v-model="money">
            </div>
            <p class="tx-title">实际到账金额： ￥{{actualMoney.toFixed(2)}}&nbsp;&nbsp;&nbsp;(已扣除{{rate}}%税金)</p>
            <p class="info">
                <span>账户可提现金额：¥{{balance}}</span>
                <span @click="allWithdrawal">全部提现</span>
            </p>

            <div class="btn" @click="applyWithdrawal">提现</div>
        </div>
        <div class="content-title">
            <h3>提现说明:</h3>
            <p>1、为了保证您的账户安全，提现银行卡必须为本人名下银行卡，否则无法正常提现；</p>
            <p>2、提现将收{{rate}}%的税费,税费组成为: 公司代扣缴服务费类税费7%，综合费率3%，打款手续费1%由公司承担</p>
            <p>3、最低起提金额为100元。</p>
        </div>
        <PswInput ref="psw"></PswInput>
    </div>
</template>

<script>
    import { getDefaultBankCard, applyWithdrawal } from '@/service/balance.service'
    import {getAccount,getWithdrawalServiceRate} from '../../../service/pay/pay.service'
    import PswInput from '@/components/commodity/inputPsw'
    import { Toast } from 'mint-ui';

    export default {
        name: "withdrawal",
        components: {
            PswInput
        },
        data: function () {
            return {
                bankCard: null,
                money: '',
                balance: '',
                rate:0
            }
        },
        activated: function () {
            this.getDefaultBankCard();
            this.getAccount();
            this.getWithdrawalServiceRate()
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            /**
             * 获取余额
             */
            getAccount:async function () {
                const res = await getAccount();
                if(res.status === '0'){
                    this.balance = res.data.coffers;
                }
            },
            getDefaultBankCard: function () {
                if(localStorage.pitchOnCard){
                    this.bankCard = JSON.parse(localStorage.pitchOnCard)
                    return;
                }
                getDefaultBankCard().then(
                    res => {
                        if (res.status === '0') {
                            this.bankCard = res.data;
                        }
                    }
                );
            },
            allWithdrawal: function () {
                this.money = this.balance;
            },
            bankCardClick: function () {
                this.$router.push({name: 'bankInfo'})
            },
            applyWithdrawal: async function () {
                if (!this.money || Number(this.money) <= 0) {
                    Toast('请输入金额');
                    return;
                }
                if(Number(this.money) < 100){
                    Toast('最低提现100元');
                    return;
                }
                if(Number(this.money) > Number(this.balance)){
                    Toast('输入金额超过可提现金额！');
                    return;
                }
                if (!this.bankCard) {
                    Toast('请添加银行卡');
                    return;
                }


                const psw = await this.$refs.psw.getPayPsw();
                const res = await applyWithdrawal({
                    load: true,
                    successMsg: '操作成功',
                    applyAmount: Number(this.money),
                    bankCardId: this.bankCard.id,
                    payPassword: hex_md5(psw)
                });
                if(res.status === '0'){
                    setTimeout(() => {
                        this.$router.back();
                    }, 2000)
                }
            },
            getWithdrawalServiceRate:async function (){
                const res = await getWithdrawalServiceRate();
                if(res.status === '0'){
                    this.rate=res.data
                }
            }
        },
        computed:{
            actualMoney:function () {
                if(Number(this.rate)){
                    return Number(this.money-this.money/this.rate)||0
                }else{
                    return +this.money;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .content {
        padding-bottom: rem(30);
        background-color: #ffffff;
        margin: rem(10);
        .tip {
            padding: rem(15);
            color: #333333;
            font-size: rem(15);
        }
        .input {
            padding: rem(9) rem(15) rem(25);
            .iconfont {
                vertical-align: middle;
                font-size: rem(17);
                color: #333333;
            }
            input {
                vertical-align: middle;
                padding: 5px rem(10);
                margin-left: rem(10);
                font-size: rem(22);
            }

        }
        .tx-title{
            margin-left: rem(15);
        }
        .info {
            border-top: 1px solid $border;
            padding-top: rem(10);
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-space-between;
            margin-left: rem(15);
            margin-right: rem(15);
            margin-top: rem(10);
            color: #999999;
            font-size: rem(13);
            span:nth-of-type(2){
                color: #000;
            }
        }
        .btn {
            margin: rem(50) rem(15) 0;
            height: rem(40);
            line-height: rem(40);
            text-align: center;
            font-size: rem(15);
            color: #ffffff;
            background-color: $them;
            border-radius: rem(20);
        }
    }
    .content-title{
        margin: rem(10);
        &>h3{
            color: #000;
            margin-bottom: rem(10);
        }
        &>p{
            font-size: rem(14);
        }
    }
</style>