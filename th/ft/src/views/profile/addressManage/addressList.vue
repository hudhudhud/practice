<template>
    <div id='manageAddress' class="manageAddress">
        <!--1.-->
        <div class="manageAddress-top" v-for='(item,ind) in getAddressList' :key='ind' @click='upAddressClick(item)'>
            <div class="manageAddress-top-one">
                <div class="manageAddress-top-one-page">
                    <div class="manageAddress-top-one-page-top">
                        <div class="manageAddress-top-one-page-top-one">
                            <span class="manageAddress-top-one-page-top-one-textOne">{{item.realname}}</span>
                            <span class="manageAddress-top-one-page-top-one-textTwo">{{item.phone}}</span>
                        </div>
                        <div class="manageAddress-top-one-page-top-two">
                            <span class="manageAddress-top-one-page-top-two-text" v-if="item.isDefault==1">默认</span>
                            <span class="manageAddress-set-default" v-else @click.stop="updateAddress(item)">设为默认</span>
                        </div>
                    </div>
                    <div class="manageAddress-top-one-page-bottom">
                        <span>{{getAddressText(item)}}</span>
                    </div>
                </div>
            </div>
            <div class="manageAddress-top-two">
                <div class="manageAddress-top-two-content">
                    <div class="manageAddress-top-two-content-con">
                        <span @click.stop='updateClick(item.id)'>编 辑</span>
                        <span @click.stop='delClick(item.id)'>删 除</span>
                    </div>
                </div>
            </div>
        </div>
        <!--2.-->

        <!--3.-->
        <div class="manageAddress-bottom">
            <div class="manageAddress-bottom-content" @click="linkTo('addressEdit')">
                <span class="manageAddress-bottom-content-text">新增收货地址</span>
            </div>
        </div>
    </div>

</template>

<script>
    import { updateAddress ,deleteAddress,getAddressList} from '../../../service/address.service'
    import { MessageBox, Indicator  } from 'mint-ui'

    export default {
        name: "address-list",
        data: function () {
            return {
                UserInfo: [],//用户信息
                getAddressList: [],//我的信息
                action: ''
            }
        },
        activated: function () {
            this.onReady();
            this.action = this.$route.query.action || '';
            //  $(".manageAddress").css("height",window.screen.availHeight);
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getAddressText: function (item) {
                return [...new Set([item.provinceName, item.cityName, item.districtName, item.address])].join('/');
            },
            /**
             * 设置默认地址
             * @param index
             */
            updateAddress: async function (item) {
                const res = await  updateAddress({...item, isDefault: '1', load: true, successMsg: '修改默认地址成功'});
                if (res.status === '0') {
                    this.onReady();
                }
            },
            linkTo: function (name) {
                this.$router.push({name: name})
            },

            GetRequest: function () {
                return this.$route.query;
            },

            wdqbClick: function () {
                const that = this;

                location.href = '../wdqb/wdqb.html';

            },

            ServicerClick: function () {
                const that = this;

                location.href = '../mineServicer/mineServicer.html';

            },

            upAddressClick: function (item) {
                if (this.action === 'select') {
                    localStorage.upAddressList = JSON.stringify(item);
                    this.$router.replace({name: 'myOrder', query: {...this.$route.query}})
                } else {
                    this.updateClick(item.id);
                }

            },

            updateClick: function (id) {
                this.$router.push({name: 'addressEdit', query: {id: id}})

            },

            delClick:async function (id) {
                await this.confirm('是否删除该收货地址', '确认', {confirmButtonText: '删除'});
                this.deleteAddress(id)
            },
            deleteAddress: async function (id) {
                const res = await  deleteAddress({"id": id});
                if (res.status === '0') {
                    layer.msg('删除成功')
                    this.onReady();
                }
            },

            onReady: async function (num) {
                const that = this
                const res = await  getAddressList();
                if (res.status === '0') {
                    that.getAddressList = res.data;
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .manageAddress {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    /*1.*/
    .manageAddress-top {
        width: 100%;
        height: rem(150);
        background: #ffffff;
        display: flex;
        flex-direction: column;
        margin-top: 2%;
    }

    /*1.1*/
    .manageAddress-top-one {
        width: 100%;
        height: 75%;
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .manageAddress-top-one-page {
        width: 92%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .manageAddress-top-one-page-top {
        width: 100%;
        height: 40%;
        display: flex;
        flex-direction: row;
    }

    .manageAddress-top-one-page-top-one {
        width: 85%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .manageAddress-top-one-page-top-one-textOne {

    }

    .manageAddress-top-one-page-top-one-textTwo {
        margin-left: 3%;
    }

    .manageAddress-top-one-page-top-two {
        width: 15%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .manageAddress-top-one-page-top-two-text {
        width: 75%;
        height: 55%;
        background: #FF6666;
        font-size: 15px;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .manageAddress-set-default {
        white-space: nowrap;
    }

    .manageAddress-top-one-page-bottom {
        width: 100%;
        height: 60%;
        color: #BBBBBB;

    }

    /*1.2*/
    .manageAddress-top-two {
        width: 100%;
        height: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .manageAddress-top-two-content {
        width: 92%;
        height: 100%;
        display: flex;
        flex-direction: row-reverse;
    }

    .manageAddress-top-two-content-con {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        align-items: center;
    }

    /*3.*/
    .manageAddress-bottom {
        width: 100%;
        height: rem(50);
        margin-top: 6%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .manageAddress-bottom-content {
        width: 92%;
        height: 84%;
        background: #FF6161;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 30px;
    }

    .manageAddress-bottom-content-text {
        font-size: 20px;
        color: #ffffff;
    }
</style>