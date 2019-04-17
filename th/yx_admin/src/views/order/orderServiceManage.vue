<template>
    <section>
        <OrderList  />
    </section>
</template>
<script>
    import OrderList from '@/components/OrderList'
    export default{
        components:{
            OrderList,
        },
        created(){

        },
        beforeRouteUpdate(to, from, next) {
            //console.log(this.$route.params)
        }
    }
</script>
