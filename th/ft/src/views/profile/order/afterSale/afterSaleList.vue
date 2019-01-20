<template>
    <div>
        <div class="item" v-for="item in list" v-if="item.typeName">
            <div class="title">
                <span>{{item.typeName}}</span>
                <span>{{item.createDate}}</span>
            </div>
            <div class="info" v-if="item.reasonName">
                <span>退款原因：</span>
                <span>{{item.reasonName}}</span>
            </div>

            <div class="info" v-if="item.remark">
                <span>备注：</span>
                <span>{{item.remark}}</span>
            </div>
            <div class="info" v-if="item.sumMoney">
                <span>退款：</span>
                <span>{{item.sumMoney}}</span>
            </div>
            <div class="info" v-if="item.returnPath1">
                <span>退款路径：</span>
                <span>{{item.returnPath1}}</span>
            </div>
            <div class="info" v-if="item.returnPath2">
                <span>其他退还：</span>
                <span>{{item.returnPath2}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {findAfterSaleFlow} from "../../../../service/profile/refund.service";

    export default {
        name: "afterSaleList",
        data: function () {
            return {
                id: '',
                list: []
            }
        },
        activated: function () {
            this.id = this.$route.query.id;
            this.getList();
            this.setTitle('售后记录');
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getList: async function () {
                const res = await findAfterSaleFlow({id: this.id});
                if (res.status === '0') {
                    this.list = res.data;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../../assets/public";

    .item {
        margin-bottom: rem(10);
        color: #333333;
        background-color: #ffffff;
        .title {
            margin: 0 rem(15);
            @extend %flex;
            @extend %justify-content-space-between;
            line-height: rem(50);
            height: rem(50);
            font-size: rem(15);
            border-bottom: 1px solid $border;
            span:last-of-type {
                font-size: rem(14);
            }
        }
        .info {
            margin: 0 rem(15);
            font-size: rem(14);
            line-height: rem(35);
            span:nth-of-type(2) {
                color: #BBB;
            }
        }
    }
</style>