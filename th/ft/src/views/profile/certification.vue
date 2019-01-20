<template>
    <div>

        <div class="tip">
            <span class="red">*</span>请上传真实的证件照片信息<span class="sub">(请保证证件信息清晰可见)</span>
        </div>
        <div class="IDcard-box">
            <div class="IDcard">
                <div>
                    <div class="border">
                        <i class="iconfont icon-iconfont56"></i>
                    </div>
                    <p class="text">证件正面照</p>
                </div>
                <input type="file" :disabled="disabled" @change="getIDcardUrl($event.target.files, 'image1')">
                <img v-if="info.image1" :src="info.image1" alt="">
            </div>
            <div class="IDcard">
                <div>
                    <div class="border">
                        <i class="iconfont icon-iconfont56"></i>
                    </div>
                    <p class="text">证件反面照</p>
                </div>
                <input type="file" :disabled="disabled" @change="getIDcardUrl($event.target.files, 'image2')">
                <img v-if="info.image2" :src="info.image2" alt="">
            </div>
        </div>
        <div class="ID-info">
            <div class="tip bor-bottom">
                <span class="red">*</span> 请真实填写身份信息
            </div>
            <div class="item">
                <label>真实姓名：</label>
                <input type="text" v-model="info.realname" :disabled="disabled">
            </div>
            <div class="item">
                <label>性别：</label>
                <div class="sex" :class="{active: info.gender === 0}" @click="info.gender=disabled?info.gender:0">男
                </div>
                <div class="sex" :class="{active: info.gender === 1}" @click="info.gender=disabled?info.gender:1">女
                </div>
            </div>
            <div class="item">
                <label>证件类别：</label>
                <div>
                    <select v-model="info.type" :disabled="disabled">
                        <option :value="item.value" v-for="item in typeList">{{item.name}}</option>
                    </select>
                </div>
            </div>
            <div class="item">
                <label>证件号码：</label>
                <input type="string" class="long" v-model.lazy="info.idCardNumber" @input="inputTypeOnlyNumber" :disabled="disabled">
            </div>
            <div class="item">
                <label>证件有效期：</label>
                <input type="date" v-model="info.expirationDate" :disabled="disabled" >
            </div>
            <div class="item" v-if="info.type != '1'">
                <label>生日：</label>
                <input type="date" v-model="info.birthday" :disabled="disabled" >
            </div>
            <span class="sub" style="padding-left: 10px">户籍地址</span>
            <div class="item" @click="getArea">
                <label>省市区：</label>
                <span class="select-border">{{select}}</span>

            </div>
            <!--<div class="item">-->
                <!--<label>具体地址：</label>-->
                <!--<input type="text" style="flex: 1" v-model="info.address" :disabled="disabled">-->
            <!--</div>-->

        </div>

        <div class="btn" @click="submit" :class="disabled?'disabled':''">
            提交
        </div>
        <p class="status">{{text[info.confirmStatus]}}</p>
        <AreaAlert :disabled="disabled" ref="area"/>
    </div>
</template>

<script>
    import { findOneCustomerInfo, createCustomerInfo, getCardTypeList } from "../../service/profile.service";
    import { uploadImg } from "../../service/util";
    import { Indicator, Toast } from 'mint-ui';
    import AreaAlert from '@/components/areaAlert';
    import { utilMixin } from "../../main";
    export default {
        name: "certification",
        components: {
            AreaAlert
        },
        mixins: [utilMixin],
        // beforeRouteEnter: function (to, {name}, next) {
        //    Toast('实名认证功能升级中,敬请期待！');
        // },
        data: function () {
            return {
                text : {
                    0: '您的申请已提交，等待审核中…',
                    2: '您的申请未通过审核，请查验后重新提交',
                    1: '您的申请已通过审核！'
                },
                typeList: [],
                info: {
                    gender: 1,
                    image1: '',
                    image2: '',
                    type: 1,
                    expirationDate: '', // 有限期
                    idCardNumber: '', // 证件号码
                    realname: '', // 证件名字
                    districtId: '',
                    districtName: '',
                    cityId: '',
                    cityName: '',
                    provinceId: '',
                    provinceName: '',
                    address: '',

                }
            }
        },
        computed: {
            disabled: function () {
                return this.info.confirmStatus === 0 || this.info.confirmStatus === 1;
            },
            select: function () {
                let list = [...new Set([this.info.provinceName, this.info.cityName, this.info.districtName])];
                return list.join('/');
            }
        },
        activated: function () {
            this.getInfo();
            this.getCardList();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getInfo: async function () {
                const {data: info} = await findOneCustomerInfo({load: true});
                if (info.confirmStatus !== -1) {
                    this.info = info;
                }
            },
            getCardList:async function () {
                const res = await getCardTypeList();
                if(res.status === '0'){
                    this.typeList = res.data;
                }
            },
            getArea: async function () {
                [{id: this.info.provinceId, name: this.info.provinceName},
                    {id: this.info.cityId, name: this.info.cityName},
                    {id: this.info.districtId, name: this.info.districtName}
                ] = await this.$refs.area.getArea([this.info.provinceId, this.info.cityId, this.info.districtId]);
            },
            getIDcardUrl: async function (files, key) {
                Indicator.open();
                this.info[key] = await uploadImg(files[0]);
                Indicator.close();
            },
            submit: async function () {
                if(this.disabled){
                    return;
                }
                if (!this.info.image1) {
                    Toast('请上传证件正面照');
                    return;
                }if (!this.info.image2) {
                    Toast('请上传证件反面照');
                    return;
                }
                if (this.info.realname) {
                    this.info.realname = this.info.realname.replace(/\s/g, '');
                    if(!this.info.realname){
                        Toast('请输入真实姓名');
                        return;
                    }
                }else{
                    Toast('请输入真实姓名');
                    return;
                }
                if (isNaN(this.info.gender)) {
                    Toast('请选择性别');
                    return;
                }
                if (!this.info.type) {
                    Toast('请选择证件类型');
                    return;
                }
                if (!this.info.idCardNumber) {
                    Toast('请输入证件号码');
                    return;
                }
                if (!this.info.expirationDate) {
                    Toast('请选择证件有效期');
                    return;
                }
                if (!this.info.districtId || !this.info.cityId || !this.info.provinceId) {
                    Toast('请选择省市区');
                    return;
                }
                if(this.info.type.toString() === '1'){
                    delete this.info.birthday;
                } else {
                    if(!this.info.birthday){
                        Toast('请选择生日');
                        return;
                    }
                }

                // if (!this.info.address) {
                //     Toast('请输入具体地址');
                //     return;
                // }

                await createCustomerInfo({
                    load: true, successMsg: '提交成功',
                    ...this.info
                });
                this.getInfo();

            }
        }

    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";

    input[type='date']{
        width: rem(150);
    }
    input,select{
        background-color: #ffffff;
    }
    .tip {
        line-height: rem(41);
        height: rem(41);
        text-indent: rem(10);
        background-color: #ffffff;
        font-size: rem(15);
        color: #333333;
        font-weight: bold;

    }

    .sub {
        font-size: rem(11);
        color: #999999;
        font-weight: 100;
    }

    .red {
        color: red;
        font-weight: 100;
    }

    .IDcard-box {
        overflow: hidden;
        height: rem(120);
        margin: rem(10) 0 rem(20);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-space-between;
    }
    .select-border{
        min-width: rem(150);
        display: inline-block;
        border: 1px solid $border;
        line-height: rem(32);
        height: rem(32);
        padding: 0 rem(10);
    }
    .IDcard {
        position: relative;
        overflow: hidden;
        background-color: #ffffff;
        width: rem(182);
        height: rem(120);
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
        img {
            position: absolute;
            z-index: 8;
            height: 100%;
            width: 100%;
            left: 0;
            top: 0;
        }
        .text {
            margin-top: rem(10);
            color: #bbbbbb;
            font-size: rem(13);
        }
        .iconfont {
            font-size: rem(20);
        }
        .border {
            margin: 0 auto;
            border-radius: 50%;
            width: rem(60);
            height: rem(60);
            line-height: rem(60);
            text-align: center;
            border: 1px dashed #bbbbbb;
        }
        input {
            position: absolute;
            opacity: 0;
            z-index: 10;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
    }

    .ID-info {
        background-color: #ffffff;
        input, select {
            border: 1px solid $border;
            height: rem(30);
            line-height: rem(30);
            text-indent: rem(10);
        }
    }

    .item {
        height: rem(40);
        padding: 0 rem(10);
        font-size: rem(15);
        color: #999999;
        @extend %flex;
        @extend %flex-align-center;
        label {
            text-align: right;
            min-width: rem(75);
        }
        select {
            margin-right: 6px;
            width: rem(90);
        }
        .sex {
            margin-right: rem(20);
            @include btn($color: #999, $size: rem(13));
        }
        .sex.active {
            border-color: $them;
            color: #ffffff;
            background-color: $them;
        }
        .long {
            width: rem(230);
        }
    }

    .btn {
        margin: rem(40) auto rem(5);
        @include btn($color: #fff, $height: rem(40));
        width: rem(325);
        background-color: $them;
        border-radius: rem(20);
    }
    .btn.disabled{
        background-color: #dddddd;
    }

    .status {
        text-align: center;
        color: #999999;
        font-size: rem(13);
    }

</style>