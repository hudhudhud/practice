<template>
    <div>
        <div class="head">
            请汇款至以下账户：
        </div>
        <div class="company-account">
            <div class="item">
                <p>
                    <span class="label">户&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
                    <input readonly type="text" class="value" id="copy1" :value="account.realname">
                </p>
                <button class="copy" data-clipboard-action="copy" data-clipboard-target="#copy1">复制</button>
            </div>
            <div class="item">
                <p>
                    <span class="label">开户行：</span>
                    <input readonly type="text" class="value" id="copy2" :value="account.bankBranchName">

                </p>
                <button class="copy" data-clipboard-action="copy" data-clipboard-target="#copy2">复制</button>
            </div>
            <div class="item">
                <p>
                    <span class="label">银行账号：</span>
                    <input readonly type="text" class="value" id="copy3" :value="account.cardNumber">
                </p>
                <button class="copy"  data-clipboard-action="copy" data-clipboard-target="#copy3">复制</button>
            </div>

        </div>
        <div class="recharge">
            <p class="tip">充值金额</p>
            <div class="input">
                <i class="iconfont icon-money"></i>
                <input type="number" placeholder="输入充值金额" v-model="money">
            </div>
        </div>
        <div class="head">
            *上传汇款凭证
        </div>
        <UploadImgs @change="imgs=$event"/>
        <div class="head">
            备注
        </div>
        <div class="remark">
            <textarea placeholder="请填写需要注意的事项…" v-model="remark"></textarea>
        </div>
        <p class="tip">注意事项：</p>
        <p class="tip them">办理银行转账时，请您务必核对好收款银行账户和转账金额</p>
        <div class="submit" @click="submit">
            提交
        </div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui'
    import UploadImgs from '@/components/uploadImgs'
    import { getSystemBankCard, depositByOffline } from '@/service/balance.service'

    export default {
        name: "recharge-offline",
        components: {
            UploadImgs
        },
        data: function () {
            return {
                money: '',
                imgs: [],
                account: {},
                remark: ''
            }
        },
        mounted: function () {
            let clipboard = new Clipboard('.copy');
            clipboard.on('success', function(e) {
                Toast('复制成功');
            });

            clipboard.on('error', function(e) {
                Toast('复制失败，请手动复制');
            });
        },
        activated: function () {
            this.getCompanyAccount();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getCompanyAccount: async function () {
                const res = await getSystemBankCard();
                if (res.status === '0') {
                    this.account = res.data;
                }
            },
            submit: function () {
                if (!this.money) {
                    Toast('请输入金额');
                    return;
                }
                if (!this.imgs.length) {
                    Toast('请上传凭证');
                    return;
                }
                depositByOffline({amount: this.money, depositImages: this.imgs, offlineMemo: this.remark, load: true,successMsg: '上传成功'}).then(
                    res => {
                        if (res.status === '0') {
                            setTimeout(() => {
                                this.$router.back();
                            }, 2000)

                        }
                    }
                );

            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .head {
        padding-left: rem(15);
        font-weight: bold;
        background-color: #ffffff;
        line-height: rem(40);
        font-size: rem(15);
        color: #333333;
    }

    .company-account {
        margin: rem(10) 0;
        background-color: #ffffff;
        font-size: rem(15);
        color: #333333;
        .item {
            @extend %flex-align-center;
            @extend %flex;
            @extend %justify-content-space-between;
            margin: 0 rem(10);
            height: rem(40);
            & > p{
                flex: 1;
                @extend %flex;
            }
            .label {
                width: rem(80);
                display: inline-block;
                text-align: right;
            }
            .value {
                display: inline-block;
                color: #999999;
                font-size: rem(13);
                flex: 1;
            }
            .copy {
                margin-right: rem(24);
                padding: 0 rem(10);
                font-size: rem(12);
                height: rem(24);
                line-height: rem(24);
                color: #ffffff;
                background-color: $them;
            }
        }
    }

    .recharge {
        margin-bottom: rem(10);
        background-color: #ffffff;
        .tip {
            padding: rem(15);
            color: #333333;
            font-size: rem(15);
        }
        .input {
            padding: rem(9) rem(15) rem(25);
            .iconfont {
                vertical-align: middle;
                font-size: rem(17);
                color: #333333;
            }
            input {
                vertical-align: middle;
                padding: 5px rem(10);
                margin-left: rem(10);
                font-size: rem(22);
            }

        }
    }

    .remark {
        overflow: hidden;
        background-color: #ffffff;
        height: rem(90);
        margin-bottom: rem(5);
        border-top: 1px solid $border;
        textarea {
            display: block;
            margin: rem(15) auto;
            width: rem(325);
            height: rem(60);
            box-sizing: content-box;

        }
    }

    .tip {
        margin-top: rem(5);
        padding-left: rem(10);
        font-size: rem(13);
        color: #333333;
    }

    .submit {
        width: rem(325);
        margin: rem(15) auto;
        line-height: rem(40);
        text-align: center;
        font-size: rem(15);
        color: #ffffff;
        background-color: $them;
        border-radius: 3px;
    }
</style>