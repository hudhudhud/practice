<template>
    <div class="Ucurrency" id='Ucurrency' >
        <!--1.-->
        <div class="Ucurrency-one">
            <div class="Ucurrency-one-content">
                <div class="Ucurrency-one-content-left">
                    <span class="Ucurrency-one-content-left-textOne">积分</span>
                    <span class="Ucurrency-one-content-left-textTwo">{{uCurrency}}</span>
                </div>
                <!--                 <div class="Ucurrency-one-content-right">
                                    <div class="Ucurrency-one-content-right-con">
                                        <span class="Ucurrency-one-content-right-con-text">充值</span>
                                    </div>
                                </div> -->
            </div>
        </div>
        <!--2.-->
        <div class="Ucurrency-two">
            <div class="Ucurrency-two-content">
                <span class="Ucurrency-two-content-text">U币明细</span>
            </div>
        </div>
        <!--3.-->
        <div class="Ucurrency-three">
            <div class="Ucurrency-three-content">
                <div @click='selClick(0)' :class="selChoose==0?'Ucurrency-three-content-left':'Ucurrency-three-content-center'" >
                    <span>全部</span>
                </div>
                <div @click='selClick(1)' :class="selChoose==1?'Ucurrency-three-content-left':'Ucurrency-three-content-center'">
                    <span>收入</span>
                </div>
                <div @click='selClick(2)' :class="selChoose==2?'Ucurrency-three-content-left':'Ucurrency-three-content-right'">
                    <span>支出</span>
                </div>
            </div>
        </div>
        <!--4.-->
        <div class="Ucurrency-four">
            <div class="Ucurrency-four-content">
                <!--4.1-->
                <div class="Ucurrency-four-content-one" v-for='item in WaterSingle' style="background: #fff" >
                    <div class="Ucurrency-four-content-one-left">
                        <div class="Ucurrency-four-content-one-left-one">
                            <span class="Ucurrency-four-content-one-left-one-text">{{item.remark}}</span>
                        </div>
                        <div class="Ucurrency-four-content-one-left-two">
                            <!-- <span class="Ucurrency-four-content-one-left-two-textOne">2014-06-25</span> -->
                            <span class="Ucurrency-four-content-one-left-two-textTwo">{{item.createDate}}</span>
                        </div>
                    </div>
                    <div class="Ucurrency-four-content-one-right">
                        <span>{{item.inOrOut==1?'+':'-'}}{{item.transamount}}</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {getAccountLogList} from '../../../service/profile/integral.service'
    import {getAccount} from '../../../service/pay/pay.service'
    export default {
        name: "integral",
        data: function () {
            return {
                UserInfo:[],//用户信息
                WaterSingle:[],
                uCurrency:'',
                selChoose:0,
            }
        },
        activated: function () {
            this.onReady();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods:{


            GetRequest :function () {
                return this.$route.query;
            },


            selClick:function(id){
                const that=this;
                if(id==0){
                    that.selChoose=0;
                }else if (id==1) {
                    that.selChoose=1;
                }else if (id==2) {
                    that.selChoose=2;
                }
                if(id==0){
                    var body = {"pageNo":1,"pageSize":10,"currencyType":2};
                }else {
                    var body = {"pageNo":1,"pageSize":10,"currencyType":2,"inOrOut":id};
                }
                this.getAccountLogList(body)
            },
            getAccountLogList:async function(body){
                const that=this;
                const res = await getAccountLogList(body);
                if (res.status==0) {
                    that.WaterSingle=res.data.list;
                }
            },
            onReady:function(){
                var body = {"pageNo":1,"pageSize":10,"currencyType":2}
                this.getAccountLogList(body)

                this.getAccount()
            },
            getAccount:async function(){
                const that=this;
                const res = await getAccount();
                if (res.status==0) {
                    that.uCurrency=res.data.integral;
                }
            },

        },
    }
</script>

<style scoped>

    .Ucurrency{
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
    }
    /*1.*/
    .Ucurrency-one{
        width: 100%;
        height: 170px;
        background-image: url(../../../assets/images/background2.png);
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .Ucurrency-one-content{
        width: 75%;
        height: 50%;
        display: flex;
        flex-direction: row;
    }
    .Ucurrency-one-content-left{
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .Ucurrency-one-content-left-textOne{
        font-size: 20px;
        color: #FFFFFF;
    }
    .Ucurrency-one-content-left-textTwo{
        font-size: 28px;
        color: #FFFFFF;
        margin-top: 3%;
    }
    .Ucurrency-one-content-right{
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .Ucurrency-one-content-right-con{
        width: 100%;
        height: 50%;
        background: #07B978;
        border-radius: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .Ucurrency-one-content-right-con-text{
        color: #FFFFFF;
        font-size: 18px;
    }
    /*2.*/
    .Ucurrency-two{
        width: 100%;
        height: 50px;
        margin-top: 3%;
        display: flex;
        justify-content: center;
    }
    .Ucurrency-two-content{
        width: 92%;
        height: 100%;
        font-weight: 400;
        display: flex;
        align-items: center;
    }
    .Ucurrency-two-content-text{
        font-size: 18px;
    }
    /*3.*/
    .Ucurrency-three{
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .Ucurrency-three-content{
        width: 92%;
        height: 80%;
        background: #ffffff;
        border-radius: 36px;
        display: flex;
        flex-direction: row;
        overflow: hidden;
    }
    /*3.1*/
    .Ucurrency-three-content-left{
        width: 33%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #07B978;
        color: #ffffff;
    }
    /*3.2*/
    .Ucurrency-three-content-center{
        width: 34%;
        height: 100%;
        border-right: 1px solid #DDDDDD;
        border-left: 1px solid #DDDDDD;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /*3.3*/
    .Ucurrency-three-content-right{
        width: 33%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /*4.*/
    .Ucurrency-four{
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #ffffff;
        margin-top: 4%;
    }
    .Ucurrency-four-content{
        width: 92%;
        height: auto;
    }
    .Ucurrency-four-content-one{
        width: 100%;
        height: 80px;
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        flex-direction: row;
    }
    .Ucurrency-four-content-one-left{
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .Ucurrency-four-content-one-right{
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .Ucurrency-four-content-one-left-one{
        width: 100%;
        height: 50%;
        display: flex;
        align-items: center;
    }
    .Ucurrency-four-content-one-left-one-text{
        font-weight: 600;
        font-size: 18px;
    }
    .Ucurrency-four-content-one-left-two{
        width: 100%;
        height: 50%;
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .Ucurrency-four-content-one-left-two-textOne{
        font-weight: 400;
        color: #BBBBBB;
    }
    .Ucurrency-four-content-one-left-two-textTwo{
        font-weight: 400;
        color: #BBBBBB;
    }
</style>