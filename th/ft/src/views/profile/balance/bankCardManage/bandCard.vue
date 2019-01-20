<template>
    <div id='bdyhk'>


        <!-- <form action="#" method="post"> -->
        <!-- 			<div class="bank_card1" @click='setClick' >
                        <p class="type">请选择银行卡类型</p>
                    </div> -->
        <div class="asdasds">
            <label style="margin-left: 2.5%">选择银行卡类型：</label>
            <select lass="bank_card1" name="province" @change='setClick' id="bankType"
                    style="appearance:none;margin-left: 2%;font-size: 15px;font-weight: 600;">
                <option>请选择</option>
                <option v-for='item in bankList' :value="item.id">{{item.name}}</option>
            </select>
        </div>
        <!-- <select lass="bank_card1" name="province" @change='setClick' id="bankType">
            <option v-for='item in bankList' :value="item.id">{{item.name}}</option>
        </select> -->

        <div class="bank_card2">
            <ul>
                <li class="option1">持卡人&nbsp;&nbsp;&nbsp;<input type="text" v-model='realName' placeholder="请输入持卡人姓名">
                </li>
                <!-- <li class="option2">开户支行&nbsp;&nbsp;&nbsp;<input type="text" v-model='bankBranchName' placeholder="中国工商银行"></li> -->
                <li class="option3">银行卡号&nbsp;&nbsp;&nbsp;<input type="number" v-model='CardNumber'
                                                                 placeholder="请输入持卡人的银行卡号"></li>
            </ul>
        </div>

        <div class="set">
            <p class="type">设置为默认银行卡</p>
            <img v-if="isDefault==1" @click='setDefaultClick' src="../../../../assets/images/closed.png"
                 style="width: 40px"/>
            <img v-else @click='setDefaultClick' src="../../../../assets/images/open.png" style="width: 40px"/>
        </div>

        <div class="agreement">
            <img src="../../../../assets/images/selected.png" style="width: 20px"/>
            <p class="title">同意并接受<span class="agreementTitle">	《火兔商城的用户协议》</span></p>
        </div>
        <input class="submit" @click='AddBankCardClick' type="button" value="同意并绑卡"/>
        <!-- </from> -->
        <SetPayPsw ref="setPsw"/>
    </div>
</template>

<script>
    import SetPayPsw from '@/components/commodity/setPayPsw'
    import {Toast} from 'mint-ui'
    import {addBankCard,getBankList} from '../../../../service/profile/bandCard.service'
    export default {
        name: "band-card",
        components: {
            SetPayPsw
        },
        // beforeRouteEnter: function (to, {name}, next) {
        //     Toast('实名认证功能升级中,敬请期待！');
        // },
        data: function () {
            return {
                UserInfo: [],//用户信息
                bankList: [],//银行列表
                bankname: '',//开户行名字
                bankid: null,//开户行id
                isDefault: 0,//是否默认
                realName: '',//持卡人姓名
                CardNumber: '',//卡号
                bankBranchName: '',//支行名称
            }
        },
        activated: function () {
            this.onRead();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {


            GetRequest: function () {
                return this.$route.query;
            },
            setPaySet: async function (res) {
                if (res.status === '1') {
                    try {
                        await this.confirm('是否现在设置', '还未设置您的支付密码', {confirmButtonText: '现在设置'});
                        await this.$refs.setPsw.setPayPsw();
                    }catch (e){}
                }
                this.$router.back();
            },

            setDefaultClick: function () {
                const that = this;

                if (that.isDefault == 0) {
                    that.isDefault = 1
                } else {
                    that.isDefault = 0
                }

            },

            AddBankCardClick: function () {
                const that = this;
                if (that.realName && that.bankid && that.CardNumber) {
                    this.addBankCard()
                } else {
                    layer.msg('请将信息填写完整')
                }
            },
            addBankCard: async function () {
                const that = this;
                const res = await addBankCard({
                    "realName": that.realName,
                    "bankId": that.bankid,
                    "cardNumber": that.CardNumber,
                    "bankBranchName": that.bankBranchName,
                    "isDefault": that.isDefault});
                if (res.status == 0) {
                    layer.msg('添加成功');

                    setTimeout(() => {
                        that.setPaySet(res);
                    }, 1500);
                }

            },

            // setClick:function(){
            //   const that=this;

            //   location.href='../mineServicer/mineServicer.html';

            // },

            onRead: function (num) {
                this.getBankList()
            },
            getBankList: async function () {
                const that = this;
                const res = await getBankList();
                if (res.status == 0) {
                    that.bankList = res.data;
                }
            },
            setClick: function () {
                const that = this;
                //
                that.bankname = ($("#bankType option:selected").text());
                that.bankid = ($("#bankType option:selected").val());

            },

        },
    }
</script>

<style scoped lang="scss">
    @import "../../../../assets/public";

    #bdyhk {
        margin-top: 2%;
    }

    .asdasds {
        margin-left: 2.5%;
        width: 95%;
        height: 36px;
        background: #fff;
        display: flex;
        align-items: center;
        select {
            padding: 5px 10px;
            border: 1px solid gainsboro;
        }
    }

    input {
        outline-color: invert;
        outline-style: none;
        outline-width: 0px;
        border: none;
        border-style: none;
        text-shadow: none;
        -webkit-appearance: none;
        -webkit-user-select: text;
        outline-color: transparent;
    }

    li {
        list-style: none;
        border-bottom: 1px solid #F1F4F3;
    }

    .bank_card1 {
        width: 95%;
        margin: auto;
        background: #FFFFFF;
        line-height: 50px;
        font-size: 15px;
        font-weight: bold;
        margin-top: 10px;
    }

    .bank_card2 {
        width: 95%;
        margin: auto;
        background: #FFFFFF;
        line-height: 60px;
        font-size: 15px;
    }

    .type {
        margin-left: 10px;
    }

    .option1 {
        border-bottom: 2px solid #F1F4F3;
        width: 95%;
        margin: auto;
    }

    .option2 {
        border-bottom: 2px solid #F1F4F3;
        width: 95%;
        margin: auto;
    }

    .option3 {
        width: 95%;
        margin: auto;
    }

    .set {
        width: 95%;
        margin: auto;
        background: #FFFFFF;
        line-height: 50px;
        font-size: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }

    .agreement {
        display: flex;
        align-items: center;
        margin-left: 10px;
        margin-top: 10px;
    }

    .title {
        margin-left: 10px;
        font-size: 13px;
    }

    .agreementTitle {
        font-size: 13px;
        color: #F34541;
    }

    .submit {
        width: 80%;
        height: 35px;
        background: #f34541;
        border: 1px solid #f34541;
        text-align: center;
        margin: 40px 0 0 10%;
        color: #fff;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        border-radius: 3px;
        cursor: pointer;

    }

</style>