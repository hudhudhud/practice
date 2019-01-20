<template>
    <div>

        <template v-for="item in 12" v-if="comboMap.length">
            <div class="item" @click="handleSelect(item)">
                <span>{{item}}月份销售额</span>
                <div>
                    <span>{{Number(comboMap[item-1])+Number(singleItemMap[item-1])}}</span>
                    <i class="iconfont icon-down" ></i>
                </div>
            </div>
           <div v-show="select === item" >
               <div class="item child">
                   <span>套餐销售额</span>
                   <span>{{comboMap[item-1]}}</span>
               </div>
               <div class="item child">
                   <span>单品销售额</span>
                   <span>{{singleItemMap[item-1]}}</span>
               </div>
           </div>
        </template>
    </div>

</template>

<script>
    import { getData } from '@/service/sale.service';

    function iterator() {
        let index = 0;
        return {
            next: () => {
                index++;
                return this[index] ? {
                    value: this[index],
                    done: false
                } : {done: true};
            }
        }
    }

    export default {
        name: "sales",
        data: function () {
            return {
                comboMap: [],
                singleItemMap: [],
                select: 0
            }
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        activated: function () {
            this.getList();
        },
        methods: {
            getList: async function () {
                const res = await getData();
                if (res.status === '0') {
                    this.comboMap = Array.from({...res.data.comboMap, [Symbol.iterator]: iterator});
                    this.singleItemMap = Array.from({...res.data.singleItemMap, [Symbol.iterator]: iterator});
                }
            },
            handleSelect: function (index) {
                this.select = this.select===index?'':index;
            }

        }

    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    .item {
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
        border-bottom: 2px solid $border;
        padding: 0 rem(10) 0 rem(15);
        height: rem(40);
        background-color: #ffffff;
        color: #333333;
        font-size: rem(15);
        .iconfont{
            margin-left: 5px;
        }
    }
    .item.child{
        padding-left: rem(20);
        padding-right: rem(35);
        font-size: 80%;
    }

</style>