<template>
    <!--输入密码弹窗-->
    <div class="input-psw-box" v-show="inputPswShow" @click="hide">
        <div class="content" @click.stop="">
            <div class="input-group">
                <div v-for="item in 6">
                    {{getNum(item-1)}}
                </div>
                <input ref="pswInput" type="number" v-model="payPsw" @input="pswInput">
            </div>
            <p class="forgot-psw" @click="$router.push({name: 'forgetPsw'})">忘记密码?</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "input-psw",
        data: function () {
            return {
                inputPswShow: false,
                payPsw: '',
                resolve: null,
                reject: null
            }
        },
        activated: function () {
            this.inputPswShow = false;
        },
        methods: {
            getPayPsw: function () {
                this.inputPswShow = true;
                this.payPsw = '';
                return new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                    this.$nextTick(() => {
                        this.$refs.pswInput.focus();
                    })
                })
            },
            getNum: function (n) {
                const {[n]: num} = this.payPsw;
                return num?'*':'';
            },
            pswInput: function () {
                if (this.payPsw.length === 6) {
                    this.resolve(this.payPsw);
                    this.inputPswShow = false;
                }
            },
            hide: function () {
                this.inputPswShow = false;
                this.reject();
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    .input-psw-box {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .7);
    .content {
        position: absolute;
        width: 100%;
        height: rem(117);
        background-color: #F2F2F2;
        opacity: .7;
        top: 50%;
    @include translate(0, -50%);

    }
    .input-group {
        overflow: hidden;
        position: relative;
    @extend %flex;
    @extend %justify-content-center;
        margin: rem(40) 0 0;
        height: rem(35);
    div {
        box-sizing: border-box;
        width: rem(45);
        height: rem(35);
        line-height: rem(35);
        border: 1px solid #979797;
        text-align: center;
        font-size: rem(18);
        background-color: white;
    }
    div:nth-of-type(n+2) {
        border-left: none;
    }
    input {
        position: absolute;
        left: -20%;
        top: 0;
        width: 120%;
        height: 100%;
        opacity: 0;
    }
    }
    .forgot-psw {
        text-align: right;
        padding: rem(5) rem(52);
        font-size: rem(10);
        color: #333333;
    }
    }
</style>