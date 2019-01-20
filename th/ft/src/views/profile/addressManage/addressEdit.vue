<template>
    <div id='newAddress' class="newAddress">
        <!--1.-->
        <div class="newAddress-one">
            <!--1.1-->
            <div class="newAddress-one-name">
                <div class="newAddress-one-name-left">
                    <span>收货人：</span>
                </div>
                <div class="newAddress-one-name-right">
                    <input class="newAddress-one-name-right-ipt" v-model='realname' type="text"/>
                </div>
            </div>
            <!--1.2-->
            <div class="newAddress-one-phone">
                <div class="newAddress-one-phone-left">
                    <span>联系方式：</span>
                </div>
                <div class="newAddress-one-phone-right">
                    <input class="newAddress-one-phone-right-ipt" v-model='phone' type="text"/>
                </div>
            </div>
            <!--1.3-->
            <div class="newAddress-one-area" @click="selectAddress">
                <div class="newAddress-one-area-left">
                    <span>所在地区：</span>
                </div>
                <div class="newAddress-one-area-center" >
                    {{addressText}}
                </div>
                <div class="newAddress-one-area-right">
                    <img class="newAddress-one-area-right-img" src="../../../assets/images/enter.png"/>
                </div>
            </div>
            <!--1.4-->
            <div class="newAddress-one-detail">
                <div class="newAddress-one-detail-left">
                    <span>详细地址：</span>
                </div>
                <div class="newAddress-one-detail-right">
                    <input class="newAddress-one-detail-right-ipt" v-model='address' type="text"
                           placeholder="街道/楼号/单元号/门牌号"/>
                </div>
            </div>
        </div>
        <!--2.-->
        <div class="newAddress-two">
            <div class="newAddress-two-conten">
                <div class="newAddress-two-conten-left">
                    <span>设置为默认地址：</span>
                </div>
                <div class="newAddress-two-conten-right">
                    <img v-if="isDefault=='1'" @click='setDefaultClick' class="newAddress-two-conten-right-img"
                         src="../../../assets/images/closed.png"/>
                    <img v-else @click='setDefaultClick' class="newAddress-two-conten-right-img"
                         src="../../../assets/images/open.png"/>
                </div>
            </div>
        </div>
        <!--3.-->
        <div class="newAddress-three">
            <div class="newAddress-three-content" @click='setAddClick'>
                <span class="newAddress-three-content-text">确认收货地址</span>
            </div>
        </div>
        <AreaAlert ref="addressEdit"/>
    </div>

</template>

<script>
    import AreaAlert from '@/components/areaAlert'
    import { isPhone } from "../../../service/util";
    import {getAddressDetail,updateAddress,addAddress} from '../../../service/address.service'
    import {Toast} from 'mint-ui';

    export default {
        name: "address-edit",
        data: function () {
            return {
                isDefault: '0',
                realname: '',
                phone: '',
                address: '',
                provinceId: null,
                provinceName: '',
                cityId: null,
                cityName: '',
                districtId: null,
                districtName: '',
                cardid: 1,
                isSubmit: false
            }
        },
        components: {
            AreaAlert
        },
        computed: {
            addressText() {
                return [...new Set([this.provinceName, this.cityName, this.districtName])].join('/');
            },
            UserInfo() {
                return this.$store.state.userInfo;
            }
        },
        activated: function () {
            this.onReady();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            selectAddress: async function () {
                [{id: this.provinceId, name: this.provinceName},
                    {id: this.cityId, name: this.cityName},
                    {id: this.districtId, name: this.districtName}
                ] = await this.$refs.addressEdit.getArea([this.provinceId, this.cityId, this.districtId]);
            },
            GetRequest: function () {
                return this.$route.query;
            },
            onReady: function (num) {
                const that = this;
                if (that.GetRequest().id) {
                    this.getAddressDetail()
                }
            },
            getAddressDetail:async function () {
                const that = this;
                const res = await getAddressDetail({"id": that.GetRequest().id});

                if(res.status == 0){
                    that.isDefault = res.data.isDefault;
                    that.realname = res.data.realname;
                    that.phone = res.data.phone;
                    that.provinceName = res.data.provinceName;
                    that.provinceId = res.data.provinceId;
                    that.cityName = res.data.cityName;
                    that.cityId = res.data.cityId;
                    that.districtName = res.data.districtName;
                    that.districtId = res.data.districtId;
                    that.address = res.data.address;
                }
            },

            setAddClick: function () {
                if (this.isSubmit) {
                    return;
                }
                if(!this.realname){
                    Toast('请输入收货人姓名');
                    return;
                }
                if(!isPhone(this.phone)){
                    Toast('请输入正确的手机号');
                    return;
                }
                const that = this;
                let body = {};
                if (that.GetRequest().id) {
                    body = {
                        "id": that.GetRequest().id,
                        "phone": that.phone,
                        "realname": that.realname.replace(/\s/g, ''),
                        "provinceId": that.provinceId,
                        "cityId": that.cityId,
                        "districtId": that.districtId,
                        "address": that.address,
                        "isDefault": that.isDefault
                    }
                } else {
                    body = {
                        "phone": that.phone,
                        "realname": that.realname,
                        "provinceId": that.provinceId,
                        "cityId": that.cityId,
                        "districtId": that.districtId,
                        "address": that.address,
                        "isDefault": that.isDefault
                    }
                }
                this.isSubmit = true;
                this.updateAddress(body)
            },
            updateAddress:async function (body) {
                const that = this;
                const res =that.GetRequest().id?await updateAddress(body):await addAddress(body);

                if (res.status === '0') {
                    if (that.GetRequest().id) {
                        layer.msg('修改成功')
                        setTimeout(function () {
                            that.$router.back();
                            that.isSubmit = false;
                        }, 1000)
                    } else {
                        layer.msg('添加成功')
                        setTimeout(function () {
                            that.$router.back();
                            that.isSubmit = false;
                        }, 1000)
                    }
                } else if (res.status === '-1') {
                    that.$router.push({name: 'login'})
                } else {
                    that.isSubmit = false;
                }
            },

            setDefaultClick: function () {
                const that = this;

                if (that.isDefault == '0') {

                    that.isDefault = '1';
                } else {
                    that.isDefault = '0';
                }

            },

        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .newAddress {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    /*1.*/
    .newAddress-one {
        width: 100%;
        height: rem(213);
        background: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    input:focus {
        outline: none;
    }

    /*1.1*/
    .newAddress-one-name {
        width: 92%;
        height: 25%;
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        flex-direction: row;
    }

    .newAddress-one-name-left {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-one-name-right {
        width: 70%;
        height: 100%;
    }

    .newAddress-one-name-right-ipt {
        width: 100%;
        height: 100%;
        font-size: 16px;
    }

    /*1.2*/
    .newAddress-one-phone {
        width: 92%;
        height: 25%;
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        flex-direction: row;
    }

    .newAddress-one-phone-left {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-one-phone-right {
        width: 70%;
        height: 100%;
    }

    .newAddress-one-phone-right-ipt {
        width: 100%;
        height: 100%;
        font-size: 16px;
    }

    /*1.3*/
    .newAddress-one-area {
        width: 92%;
        height: 25%;
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .newAddress-one-area-left {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-one-area-center {
        width: 60%;
        height: 100%;
        font-size: rem(16);
        @extend %flex;
        @extend %flex-align-center;
    }

    .list-item {
        width: 33.33%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .list-text {
        width: 92%;
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #province {
        width: 100%;
        height: 80%;
    }

    #city {
        width: 100%;
        height: 80%;
    }

    #district {
        width: 100%;
        height: 80%;
    }

    .newAddress-one-area-right {
        width: 10%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-one-area-right-img {
        width: 30%;
        height: 25%;
    }

    /*1.4*/
    .newAddress-one-detail {
        width: 92%;
        height: 25%;
        display: flex;
        flex-direction: row;
    }

    .newAddress-one-detail-left {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-one-detail-right {
        width: 70%;
        height: 100%;
    }

    .newAddress-one-detail-right-ipt {
        width: 100%;
        height: 100%;
        font-size: 16px;
    }

    input::-moz-placeholder {
        color: #BBBBBB;
    }

    input::-webkit-input-placeholder {
        color: #BBBBBB;
    }

    input::-moz-placeholder {
        color: #BBBBBB;
    }

    input:-ms-input-placeholder {
        color: #BBBBBB;
    }

    /*2.*/
    .newAddress-two {
        width: 100%;
        height: rem(53);
        background: #ffffff;
        margin-top: 3%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-two-conten {
        width: 92%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .newAddress-two-conten-left {
        width: 40%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-two-conten-right {
        width: 20%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-two-conten-right-img {
        width: 70%;
        height: 51%;
    }

    /*3.*/
    .newAddress-three {
        width: 100%;
        height: rem(66);
        margin-top: rem(30);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-three-content {
        width: 92%;
        height: 72%;
        background: #FF6161;
        border-radius: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .newAddress-three-content-text {
        font-size: 20px;
        color: #ffffff;
    }
</style>