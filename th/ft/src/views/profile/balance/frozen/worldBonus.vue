<template>
    <div>
        <header>
            <p>￥{{money}}</p>
            <p>总分红</p>
        </header>
        <section>
            <p class="balance-detail">
                全球分红明细
            </p>
            <ListComponent :type="6" />

        </section>
    </div>
</template>

<script>
    /**
     * 全球分红
     */
    import ListComponent from '../list-component';
    export default {
        name: "worldBonus",
        components: {
            ListComponent
        },
        data: function () {
            return {
                money: ''
            }
        },
        activated: function(){
          this.money = this.$route.query.money;
        },
        methods: {

        }
    }
</script>

<style scoped lang="scss">
    @import "../../../../assets/public";
    header{
        overflow: hidden;
        height: rem(114);
        color: #ffffff;
        font-size: rem(13);
        text-align: center;
        background-color: $them;
        p:first-of-type{
            margin: rem(27) 0 rem(5);
            font-size: rem(30);
        }
    }
    .balance-detail {
        font-weight: bold;
        padding: 0 rem(10);
        height: rem(57);
        line-height: rem(57);
        font-size: rem(15);
        color: #333333;
    }

</style>