<template>
    <div class="info" v-if="show">
        <div class="box">
            <header>邮寄信息</header>
            <section>
                <div class="input">
                    <span class="label">物流单号：</span>
                    <input type="tel" v-model="num">
                </div>
                <div class="input">
                    <span class="label">物流公司：</span>
                    <select v-model="nameId">
                        <option :value="item.logisticsSn" v-for="item in list" :key="item.logisticsSn">
                            {{item.logisticsName}}
                        </option>
                    </select>
                </div>

                <div class="btn">
                    <div @click="cancel">取消</div>
                    <div @click="ok">提交</div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import {getLogisticsName} from "../../service/profile/refund.service";

    export default {
        name: "fillLogisticsInfo",
        data: function () {
            return {
                show: 0,
                list: [],
                nameId: '',
                num: '',
                resolve: null,
                reject: null
            }
        },
        created: function () {
            this.getLogisticsName();
        },
        methods: {
            getInfo: function () {
                this.show = 1;
                return new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                });
            },
            getLogisticsName: async function () {
                const res = await getLogisticsName();
                if (res.status === '0') {
                    this.list = res.data;
                }
            },
            ok: function () {
                if(!this.nameId){
                    this.$toast('请选择快递公司');
                    return;
                }
                if(!this.num){
                    this.$toast('请输入物流单号');
                    return;
                }
                this.show = 0;
                this.resolve({
                    nameId: this.nameId,
                    num: this.num
                });
            },
            cancel: function () {
                this.show = 0;
                this.nameId = '';
                this.num = '';
                this.reject();
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    .btn {
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        div {
            text-align: center;
            width: rem(100);
            height: rem(30);
            font-size: rem(16);
            line-height: rem(30);
            color: #ffffff;
            background-color: #999999;
            border-radius: rem(16);
        }
        div:last-of-type {
            background-color: $them;
            margin-left: rem(34);
        }
    }

    .info {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .3);
    }

    .box {
        position: absolute;
        left: 50%;
        top: 50%;
        @include translate(-50%, -50%);
        header {
            width: rem(325);
            height: rem(53);
            line-height: rem(53);
            font-size: rem(18);
            text-align: center;
            color: #ffffff;
            background-color: $them;
        }
        section {
            background-color: #ffffff;
            width: rem(325);
            padding: rem(40) 0;
        }
        .input {
            padding: 0 rem(15);
            margin-bottom: rem(20);
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-center;
            span {
                font-size: rem(14);
                color: #999999;
            }
            input, select {
                flex: 1;
                height: rem(30);
                background-color: #F1F4F3;
            }
        }
    }
</style>