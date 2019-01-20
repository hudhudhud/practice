<template>
    <div class="alert" v-show="show">
        <div class="content">
            <div class="scroll">
                <slot></slot>
            </div>
            <div class="btns">
                <div class="btn" @click="handleClick('cancel')">取消</div>
                <div class="btn" @click="handleClick('ok')" :class="{disabled: okDisabled}">

                    <span v-if="!load">确定</span>
                    <mt-spinner v-else :type="3" color="#ED1B24"></mt-spinner>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "alert",
        props: ['okDisabled', 'isTime'],
        data: function () {
            return {
                show: false,
                load: false
            }
        },
        methods: {
            handleClick: function (eventName) {
               setTimeout(() => {
                   if (eventName === 'ok') {
                       if (this.okDisabled) {
                           return;
                       }
                       if (this.isTime) {
                           this.load = true;
                           setTimeout(() => {
                               this.load = false;
                               this.output(eventName);
                           }, 1500);
                           return;
                       }
                   }
                   this.output(eventName);
               })

            },
            output: function (eventName) {
                this.show = false;
                this.$emit(eventName);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";
    @import "../assets/animation";

    .scroll {
        max-height: rem(350);
        overflow-y: auto;
    }

    .alert {
        z-index: 99999;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
        .content {
            animation: alert-show .3s ease-out;
            position: absolute;
            width: 80%;
            top: 50%;
            left: 50%;
            @include translate(-50%, -50%);
            background-color: white;
        }
    }

    .btns {
        text-align: center;

        height: rem(50);
        line-height: rem(50);
        font-size: rem(15);
        @extend %flex;
        .btn {
            border-top: 1px solid lighten(gainsboro, 7%);
            width: 50%;
            height: 100%;
            color: $them;
            @extend %flex;
            @extend %justify-content-center;
            @extend %flex-align-center;
        }
        .btn:first-of-type {
            border-right: 1px solid lighten(gainsboro, 7%);
            color: #333333;
        }
        .btn.disabled {
            background-color: gray;
            color: #ffffff;
        }

    }
</style>