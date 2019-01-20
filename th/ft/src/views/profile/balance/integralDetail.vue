<template>
    <div>
        <div class="integral-img"></div>
        <div class="card">
            <div class="title">
                <span class="text-left">积分</span>
            </div>
            <div class="table">
                <div @click="linkTo('usableIntegral')">
                    <div class="table-left">消费积分</div>
                    <div class="table-right">
                        <span>{{mineInfo.consumeIntegral}}</span>
                        <i class="iconfont icon-right"></i>
                    </div>
                </div>
                <div @click="linkTo('withdrawIntegral')">
                    <div class="table-left">提现积分</div>
                    <div class="table-right">
                        <span>{{mineInfo.integral}}</span>
                        <i class="iconfont icon-right"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getIntegral} from '../../../service/pay/pay.service'
    export default {
        name: "integralDetail",
        data:function(){
            return{
                mineInfo:''
            }
        },
        activated:function () {
            this.getIntegral()
        },
        methods:{
            linkTo(name) {
                this.$router.push({name: name});
            },
            getIntegral:async function () {
                const res = await getIntegral();
                if(res.status === '0'){
                    this.mineInfo = res.data;
                    console.log(res.data)
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";
.integral-img{
    height: rem(101);
    margin: rem(10) rem(15);
    background: url("../../../assets/images2/integralDetail-img.png") no-repeat center/cover;
}
    .card {
        margin: 0 rem(10) rem(15);
        border-radius: 5px;
        background-color: #ffffff;
        .title {
            height: rem(41);
            border-bottom: 1px solid $border;
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-space-between;
        }
        .text-left {
            height: rem(19);
            line-height: rem(19);
            color: #333333;
            font-weight: bold;
            text-indent: rem(16);
            font-size: rem(15);
            border-left: 4px solid #ffff00;
        }
        .table {
            & > div {
                @extend %flex;
                @extend %flex-align-center;
                @extend %justify-content-space-between;
                margin-left:rem(20) ;
                height: rem(45);
                line-height: rem(45);
                &>.table-right{
                    margin-right: rem(10);
                    span{
                        margin-right: rem(10);
                    }
                }
            }
        }
    }
</style>