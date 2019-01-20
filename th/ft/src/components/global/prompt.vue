<template>
    <div class="prompt" v-if="show" @click="option.handleClose&&close()">
        <div class="content" @click.stop="">
            <div class="title">{{option.title}}</div>
            <div class="input">
                <p class="info" v-if="option.text">{{option.text}}</p>

                <input v-if="option.showInput" ref="promptInput" v-focus :type="option.inputType"
                       :placeholder="option.placeholder" v-model="option.inputValue">
            </div>
            <div class="slot">
                <slot></slot>
            </div>
            <div class="btns">
                <div class="btn cancel" @click="close" v-if="option.showCancelBtn">{{option.cancelButtonText}}</div>
                <div class="btn" @click="ok">{{option.confirmButtonText}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "prompt",
        data: function () {
            return {
                show: false,
                resolve: null,
                reject: null,
                option: {
                    title: '请输入信息',
                    inputValue: '',
                    showInput: false,
                    handleClose: true,
                    inputType: 'text',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showCancelBtn: true,
                    //  showInput: true,
                    select: false, // 输入框的内容被全选
                }
            }
        },
        methods: {
            clear: function () {
                Object.assign(this.$data, this.$options.data());
            },
            getPrompt: function (placeholder, title, option = {}) {
                this.option = Object.assign(this.option, {showInput: true}, {
                    placeholder: placeholder,
                    title: title, ...option
                });
                this.show = true;
                if (this.option.select) {
                    this.$nextTick(() => {
                        this.$refs.promptInput.select();
                    })
                }
                return new Promise((resolve, reject) => {
                    this.reject = reject;
                    this.resolve = resolve;
                })
            },
            ok: function () {
                this.show = false;
                this.resolve({value: this.option.inputValue, action: 'confirm'});
                this.clear();
            },
            close: function () {
                this.show = false;
                this.reject();
                this.clear();
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    @import "../../assets/animation";

    .prompt {
        z-index: 100;
        background-color: rgba(0, 0, 0, .5);
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        .content {
            animation: alert-show .3s ease-out;
            width: rem(325);
            background-color: #ffffff;
            position: absolute;
            top: 50%;
            left: 50%;
            @include translate(-50%, -50%);
            .slot{
                text-align: center;
            }
        }
        .title {
            height: rem(53);
            line-height: rem(53);
            text-align: center;
            font-size: rem(18);
            color: #ffffff;
            background-color: $them;
        }
        .input {
            min-height: rem(90);
            padding: rem(10) 0;
            text-align: center;
            @extend %flex;
            @extend %flex-align-center;
            @extend %justify-content-center;
            flex-wrap: wrap;
            input {
                font-size: rem(16);
                margin: rem(10) 0;
                padding: 0 rem(10);
                border-bottom: 2px solid $border;
                width: rem(273);
                height: rem(25);
            }
            .info {
                margin: rem(10) 0;
                width: rem(256);
                white-space: pre-wrap;
                color: #666666;
                font-size: rem(15);
            }
        }
        .btns {
            height: rem(65);
            @extend %flex;
            @extend %justify-content-center;
            .btn {
                border-radius: rem(16);
                width: rem(100);
                height: rem(30);
                line-height: rem(30);
                text-align: center;
                background-color: $them;
                font-size: rem(16);
                color: #ffffff;
            }
            .cancel {
                margin-right: rem(34);
                background-color: rgba(153, 153, 153, 1);
            }

        }
    }

</style>