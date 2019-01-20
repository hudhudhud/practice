<template>
    <div>
        <Qrcode ref="qrcode" :detail="detail" v-if="detail"></Qrcode>
    </div>
</template>

<script>
    import Qrcode from '@/components/commodity/shareImg'
    import {getProductDetail} from "../../../service/commodityDetail";
    export default {
        name: "qrcode",
        components:{
            Qrcode
        },
        data: function () {
            return {
                id: '',
                detail: null,
            }
        },
        activated: async function () {
            this.id = this.$route.query.id;
            this.getDetail();
            // this.img = decodeURIComponent(this.$route.query.img);
            //  this.outputImg();
        },
        methods: {
            getDetail: async function () {
                const res = await getProductDetail({id: this.id, load: true});
                if (res.status === '0') {
                    this.detail = res.data;
                    this.detail.discountPrice = (res.data.v0MarketPrice * (res.data.discount || 10) / 10).toFixed(2);
                   setTimeout(async () => {
                       let code  = await this.$refs.qrcode.getImg();
                       console.log(code);
                   }, 1000)
                }
            },
        }
    }
</script>

<style scoped lang="scss">


</style>