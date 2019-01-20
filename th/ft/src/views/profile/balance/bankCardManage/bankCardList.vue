<template>
    <div>
        <div id='yinhangka' class="yinhangka">

            <div v-show='mineInfo.length'>

                <div class="bankCard" v-for='item in mineInfo' @click='pitchOnClick(item)' :style="{'background-color': item.style.back||'rgba(237, 27, 36, .7)'}">
                    <div class="close" @click='delClick(item.id)'>
                        <i class="iconfont icon-guanbi"></i>
                    </div>
                    <div class="logo">
                        <!--<img src="../../../../assets/img/order/bank/timg.jpg" alt="">-->
                        <div class="img" :class="[(item.style.icon||'DEFAULT')+'-icon']"></div>
                    </div>
                    <div class="content">
                        <p class="bank-name">
                            <span>{{item.bankName}}</span>
                            <!--<span class="default">默认</span>-->
                        </p>
                        <!--<p class="type">{{item.realname}}</p>-->
                        <p class="number">****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;{{item.EndcardNumber}}</p>
                    </div>
                </div>

                <div style=" bottom: 10px;">

                    <div @click='addBankCardClick' class='addBankCard'
                         style=" width: 92%;font-size: 19px;background: #FFFFFF;color: #D4BE46; margin: auto; margin-top:20px; align-items: center;text-align: center; border-radius: 4px;padding: 10px 0;">
                        添加银行卡
                    </div>

                </div>
            </div>

            <div v-show='mineInfo.length==0'>

                <div class="hint">
                    <img class="cardImg" src="../../../../assets/images/bank_card2.png" style="width: 180px"/>
                    <p class="text">还没有银行卡，快去添加一张吧~~</p>
                </div>

                <input @click='addBankCardClick' type="submit" class="submit" value="添加银行卡"/>

            </div>

        </div>
        <div class="dibuliubai"></div>
    </div>
</template>

<script>
    import { addBankCardCheck } from '@/service/profile.service'
    import { MessageBox } from 'mint-ui';
    import { getUserBankCardList,deleteBankCard } from '@/service/profile/bank.service'

    var bankStyle = {
        '1': {back:'rgba(237, 27, 36, .7)', icon: 'ICBC'},
        '2': {back:'rgba(0,55,122, .7)', icon: 'CCB'},
        '3': {back:'rgba(49,136,111, .7)', icon: 'ABC'},
        '4': {back:'rgba(237, 27, 36, 0.7)', icon: 'BOC'},
        '5': {back:'rgba(237, 27, 36, 0.7)', icon: 'CMB'},
        '6': {back:'rgba(0,55,122, .7)', icon: 'SPDB'},
        '8': {back:'rgba(237, 27, 36, 0.7)', icon: 'CGB'},
        '9': {back:'rgba(0,55,122, .7)', icon: 'BCM'},
        '11': {back:'rgba(237, 27, 36, 0.7)', icon: 'CMBC'},
        '12': {back:'rgba(237, 27, 36, 0.7)', icon: 'CEB'},
        '13': {back:'rgba(237, 27, 36, 0.7)', icon: 'ECITIC'},
    }
    export default {
        name: "bank-info",
        data: function () {
            return {
                mineInfo: [],//我的信息员
                name: '',// 上个页面的名字 withdrawal
            }
        },
        beforeRouteEnter: function (to, {name}, next) {
            next(vm => {
                vm.name = name;
            });
        },
        activated: function () {
            this.getList();
         //   this.getBankList();
            localStorage.pitchOnCard = '';
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            setDefaultBank: function () {

            },
            GetRequest: function () {
                return this.$route.query;
            },


            ServicerClick: function () {
                const that = this;

                location.href = '../mineServicer/mineServicer.html';
            },

            delClick: async function (id) {
                const res = await deleteBankCard({"id": id});
                if (res.status == 0) {
                    location.reload();
                    layer.msg('删除成功')
                }

            },

            addBankCardClick: async function () {
                const {status,data} = await addBankCardCheck({load: true, errorMsg: false});
                if (status === '0'&&data&&data.status=== '0') {
                    this.$router.push({name: 'bandCard'})
                } else {
                    // 需要实名认证
                    await this.confirm('是否立即去实名认证', '还未实名认证');
                    this.$router.push({name: 'certification'})
                }
            },

            getList: async function () {
                const res = await getUserBankCardList({load: true});
                if (res.status === '0') {
                    this.mineInfo = res.data.map(i => {
                        return {
                            id: i.id,
                            realname: i.realname,
                            cardNumber: i.cardNumber,
                            bankName: i.bankName,
                            EndcardNumber: i.cardNumber.substring(i.cardNumber.length - 4, i.cardNumber.length),
                            style: bankStyle[i.bankId]||{}
                        }
                    });
                }

            },
            pitchOnClick: function (item) {
                if (this.name === 'withdrawal') {
                    localStorage.pitchOnCard = JSON.stringify(item);
                    this.$router.back();
                }

            },

        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../../assets/public";

    @each $bank in ICBC, CCB, ABC, BOC,CMB,SPDB,CGB,BCM,CMBC,CEB,ECITIC,DEFAULT {
        .#{$bank}-icon {
            background: url('../../../../assets/img/order/bank/#{$bank}.png') no-repeat center;
            background-size: 100% 100%;
        }
    }
    .bankCard {
        position: relative;
        box-sizing: border-box;
        margin: rem(15) auto;
        border-radius: 6px;
        width: rem(345);
        height: rem(135);
        padding: rem(23) rem(20);
        background-color: rgba(237, 27, 36, .7);
        font-size: 0;
        .close {
            position: absolute;
            right: rem(10);
            top: rem(10);
            height: rem(20);
            width: rem(20);
            line-height: rem(20);
            border-radius: 50%;
            background-color: #ffffff;
            .iconfont {
                font-size: rem(10);
                color: $them;
            }
            text-align: center;
        }
        .logo {
            vertical-align: middle;
            height: 100%;
            display: inline-block;
            .img {
                border-radius: 50%;
                margin-top: rem(5);
                width: rem(40);
                height: rem(40);
            }
        }
        .content {
            position: relative;
            margin-left: rem(10);
            vertical-align: middle;
            height: 100%;
            font-size: rem(18);
            display: inline-block;
            color: #ffffff;
            .type {
                font-size: rem(13);
            }
            .number {
                white-space: nowrap;
                width: 100%;
                position: absolute;
                font-size: rem(22);
                bottom: 0;
                left: 0;
            }
            .default {
                height: rem(17);
                line-height: rem(17);
                font-size: rem(13);
                padding: 0 rem(5);
                border: 1px solid #ffffff;
                margin-left: rem(7);
                box-sizing: border-box;
                border-radius: 5px;
            }
        }
    }

    .yinhangka {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .yinhangka-one {
        width: 100%;
        height: 140px;
        margin-top: 2%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .yinhangka-one-content {
        width: 92%;
        height: 100%;
        background: #FF7A6E;
        border-radius: 3%;
        display: flex;
        flex-direction: row;
    }

    .yinhangka-content {
        width: 20%;
        height: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 21%;
    }

    .accountSecurity-two04-img {
        width: 39%;
        height: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .yinhangka-two {
        width: 70%;
        height: 100%;
        flex-direction: column;
    }

    .yinhangka-three {
        height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .yinhangka-three01 {
        font-size: 18px;
        color: #FFFDFC;
    }

    .yinhangka-three02 {
        color: #FFFDFC;
        font-size: 14px;
        margin-top: 6%;
    }

    .yinhangka-fore {
        height: 40%;
        flex-direction: row;
        display: flex;
        align-items: center;
    }

    .yinhangka-fore-first {
        width: 68%;
        display: flex;
        align-items: center;
    }

    .yinhangka-fore01 {
        font-size: 24px;
        color: #FFFDFC;

    }

    .yinhangka-fore00 {
        width: 20%;
        margin-bottom: 4%;
    }

    .yinhangka-fore02 {
        font-size: 24px;
        color: #FFFDFC;
        display: flex;
    }

    .yinhangka-five {
        width: 10%;
        margin-top: 4%;
    }

    .yinhangka-five-img {
        width: 62%;
    }

    .hint {
        text-align: center;
    }

    .cardImg {
        margin-top: 100px;
    }

    .text {
        color: #BABABA;
        font-size: 14px;
        margin-top: 30px;
    }

    .submit {
        width: 80%;
        height: 35px;
        background: #FFFFFF;
        border: 1px solid #FFFFFF;
        text-align: center;
        margin: 80px 0 0 10%;
        color: #DDCB6B;
        font-family: "Microsoft YaHei";
        font-size: 15px;
        border-radius: 3px;
        cursor: pointer;
    }

    .dibuliubai {
        width: 100%;
        height: 66px;
    }
</style>