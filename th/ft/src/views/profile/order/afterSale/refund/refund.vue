<template>
    <div class="page">
        <div class="top" style="background-color: #fff" v-for="(item, index) in detail.detailListVos" :key="index">
            <Shop :detail="shop" v-for="shop in item" :key="shop.id"/>
        </div>
        <div class="group">
            <div class="item" @click="resonShow=true">
                <span>退款原因：{{reason.name||''}}</span>
                <span><i class="iconfont icon-right"></i></span>
            </div>
            <div class="item" v-if="status===2">
                <span>退货数量：</span>
                <div class="quantity">
                    <img src="../../../../../assets/img/profile/other/jian.png" alt="">
                    <span>{{detail.quantity}}</span>
                    <img src="../../../../../assets/img/profile/other/add.png" alt="">
                </div>
            </div>
            <div class="item">
                <span>退款金额：￥{{detail.customerAmount||detail.price*detail.quantity}}</span>
            </div>
            <div class="item">
                <div>
                    <span>退款说明：</span>
                    <input type="text" placeholder="选填" v-model="remark">
                </div>
            </div>
        </div>
        <div class="group">
            <div class="title">上传凭证：</div>
            <div style="font-size: 0">
                <div class="upload" v-for="(item, index) in imgs" :key="item">
                    <img class="img" :src="item" alt="">
                    <div class="clear" @click="imgs.splice(index,1)">
                        <img src="../../../../../assets/img/profile/other/img_close.png" alt="">
                    </div>
                </div>
                <div class="upload" v-if="imgs.length<6">
                    <img class="camera-icon" src="../../../../../assets/img/profile/other/camera.png" alt="">
                    <p>上传凭证</p>
                    <p>（最多6张）</p>
                    <input v-if="inputShow" class="file" type="file" multiple="multiple" @change="uploadImg($event.target.files)">
                </div>
            </div>
        </div>
        <div class="btn" @click="submit">提交</div>

        <mt-actionsheet
                :actions="resonActions"
                v-model="resonShow">
        </mt-actionsheet>
    </div>
</template>

<script>
    import Shop from '@/components/profile/shopDetail'
    import {uploadImg} from "../../../../../service/util";
    import {applyRefund, getLogisticsNameReason, returnedGoods} from "../../../../../service/profile/refund.service";
    import { Indicator } from 'mint-ui';
    export default {
        name: "refund",
        components: {
            Shop
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        data: function () {
            return {
                imgs: [],
                resonShow: false,
                resonActions: [],
                reason: {},
                status: 1, // 1退款  2退货退款
                detail: {},
                remark: '',
                inputShow: false
            }
        },
        activated: function () {
            this.inputShow = true;
            this.status = +this.$route.query.status;
            this.detail = JSON.parse(localStorage.getItem('refund-data'));
            console.log(this.detail);
            this.getReasonList();
        },
        methods: {
            getReasonList: async function () {
                const res = await getLogisticsNameReason();
                if (res.status === '0') {
                    this.resonActions = res.data.map((i, index) => {
                        return {
                            name: i.name,
                            method: () => this.reasonChange(index),
                            num: i.value
                        }
                    });
                }
            },
            /**
             * 退款 退货  确定提交
             */
            submit: async function () {
                if (!this.reason.name) {
                    this.$toast('请选择退款原因');
                    return;
                }
                if (this.status === 1) {
                    const res = await applyRefund({
                        orderId: this.detail.id,
                        reason: this.reason.num,
                        applyRemark: this.remark,
                        images: this.imgs.join(','),
                        load: true,
                        successMsg: '提交成功'
                    });
                    if (res.status === '0') {
                        setTimeout(() => {
                            this.$router.replace({name: 'afterSaleInfo', query: {id: res.id}})
                        }, 1500);
                    }
                } else {
                    const res = await returnedGoods({
                        orderId: this.detail.id,
                        reason: this.reason.num,
                        applyRemark: this.remark,
                        images: this.imgs.join(','),
                        load: true,
                        successMsg: '提交成功'
                    });
                    if (res.status === '0') {
                        setTimeout(() => {
                            this.$router.replace({name: 'afterSaleInfo', query: {id: res.id}})
                        }, 1500);
                    }
                }
            },
            reasonChange: function (i) {
                this.reason = {
                    name: this.resonActions[i].name,
                    num: this.resonActions[i].num
                };
            },
            uploadImg: async function (files) {
                Indicator.open();
                for (let i = 0; i < files.length; i++) {
                    if (this.imgs.length < 6) {
                        const url = await uploadImg(files[i]);
                        this.imgs.push(url);
                    } else {
                        break;
                    }
                }
                Indicator.close();
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../../../assets/public";

    .page {
        background-color: #F1F4F3;
    }

    .btn {
        text-align: center;
        border-radius: rem(25);
        margin: rem(60) auto;
        width: rem(256);
        height: rem(43);
        line-height: rem(43);
        font-size: rem(18);
        color: #ffffff;
        background-color: $them;
    }

    .quantity {
        > * {
            vertical-align: middle;
        }
        span {
            margin: 0 rem(15);
            font-size: rem(11);
            color: #333333;
        }
        img {
            width: rem(20);
            height: rem(20);
        }
    }

    .group {
        margin-top: rem(10);
        background-color: #ffffff;
        .item {
            padding: 0 rem(15);
            height: rem(40);
            font-size: rem(14);
            color: #333333;
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-space-between;
        }
        .title {
            height: rem(40);
            line-height: rem(40);
            font-size: rem(14);
            color: #333333;
            text-indent: rem(15);
        }

        .upload {
            position: relative;
            vertical-align: middle;
            box-sizing: border-box;
            margin: 0 rem(15) rem(10);
            display: inline-block;
            border: 1px dashed #999;
            width: rem(90);
            height: rem(90);
            font-size: rem(12);
            color: #999999;
            text-align: center;
            .camera-icon {
                width: rem(26);
                height: rem(23);
                display: block;
                margin: rem(11) auto rem(9);
            }
            .clear {
                z-index: 10;
                position: absolute;
                right: rem(-10);
                top: rem(-10);
                width: rem(20);
                height: rem(20);
                background-color: #ffffff;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .file {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                opacity: 0;
            }
            .img {
                @extend .file;
                opacity: 1;
            }
        }
        .upload:nth-of-type(3n+2) {
            margin-left: rem(20);
            margin-right: rem(20);
        }
    }
</style>