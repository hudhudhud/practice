<template>
    <div class="mask" v-if="show" @click="close">
        <div class="box" :class="show ===1?'show': 'hide'" @click.stop="">
            <div class="title">
                <div @click="close">取消</div>
                <div class="ok" @click="ok">确定</div>
            </div>
            <mt-picker ref="pick" :slots="slots" valueKey="name" @change="onValuesChange"></mt-picker>
        </div>
    </div>

</template>

<script>
    /**
     * 选择地区 弹出框
     */
    import { getAreaList } from "../service/util";

    export default {
        name: "area-alert",
        props: ['disabled'],
        data: function () {
            return {
                show: 0, // 0初始化 1显示动画， 2隐藏动画
                slots: [
                    {
                        flex: 1,
                        values: [],
                        className: '',
                        textAlign: 'right',
                        defaultIndex: 0
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: [],
                        className: '',
                        textAlign: '',
                        defaultIndex: 0
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: [],
                        className: '',
                        textAlign: 'left',
                        defaultIndex: 0
                    }
                ],
                reject: null,
                resolve: null,
                provinceId: undefined,//辅助 当前选择的省
                cityId: undefined, //辅助 当前选择的市
                values: []
            }
        },
        methods: {
            getArea: function (defaults = []) {
                if (this.disabled) {
                    return Promise.reject();
                }
                // Init
                this.show = 1;
                // 获得 省列表
                this.slots[0].values = getAreaList();
                //  this.provinceId ;
                if (defaults[0]) {
                    // 如果有传入的 默认省 id  找寻 列表中的对应项的index ，
                    this.provinceId = defaults[0]+'';
                    for (let i = 0; i < this.slots[0].values.length; i++) {
                        if (this.provinceId === this.slots[0].values[i].id) {
                            this.slots[0].defaultIndex = i;
                            break;
                        }
                    }
                }
                // 获取对应的  市列表
                this.slots[2].values = getAreaList(this.provinceId || this.slots[0].values[0].id);
                if (defaults[1]) {// 如果有传入的 默认省 id  找寻 列表中的对应项的index ，
                    // 如果市和省相同
                    if(defaults[0] === defaults[1]){
                        this.cityId = defaults[0] ;
                    } else {
                        this.cityId = defaults[0] + '_' + defaults[1];
                    }
                    for (let i = 0; i < this.slots[2].values.length; i++) {
                        if (this.cityId === this.slots[2].values[i].id) {
                            this.slots[2].defaultIndex = i;
                            break;
                        }
                    }
                }
                this.slots[4].values = getAreaList(this.cityId || this.slots[2].values[0].id);
                if (defaults[2]) {
                    let dis = [...new Set(defaults)].join('_');
                    for (let i = 0; i < this.slots[4].values.length; i++) {
                        if (dis === this.slots[4].values[i].id) {
                            this.slots[4].defaultIndex = i;
                            break;
                        }
                    }
                }

                return new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                })
            },
            onValuesChange: function (picker, values) {
                this.values = values;
                let provinceId = (picker.getSlotValue(0) || {}).id;
                let cityId = (picker.getSlotValue(1) || {}).id;
                if (provinceId !== this.provinceId && provinceId) {
                    this.provinceId = provinceId;
                    let citys = getAreaList(provinceId);
                    picker.setSlotValues(1, citys);
                    picker.setSlotValue(1, citys[0]);
                } else if (cityId !== this.cityId && cityId) {
                    this.cityId = cityId;
                    let districts = getAreaList(cityId);
                    picker.setSlotValues(2, districts);
                    picker.setSlotValue(2, districts[0]);
                }
            },
            ok: function () {
                this.resolve(this.values.map(i => {
                    let list = String(i.id).split('_');
                    i.id = list[list.length-1];
                    return i;
                }));
                this.closeAnimation();
            },
            close: function () {
                this.reject();
                this.closeAnimation();
            },
            closeAnimation: function () {
                this.show = 2;// 隐藏动画
                setTimeout(() => {
                    if (this.show === 2) {
                        this.show = 0;
                    }
                }, 300)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";
    @import "../assets/animation";

    .show {
        animation: upShow .3s ease-out;
    }

    .hide {
        animation: downHide .3s ease-out;
        animation-fill-mode: forwards;
    }
    .mask{
        position: absolute;
        width: 100%;
        height: 100%;
        bottom: 0;
        left: 0;
    }

    .box {
        padding-top: rem(40);
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: lighten(gainsboro, 10%);
        .title {
            @extend %flex;
            @extend %justify-content-space-between;
            @extend %flex-align-center;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: rem(40);
            border-bottom: 1px solid $border;
            border-top: 1px solid $border;
            div {
                height: 100%;
                line-height: rem(40);
                padding: 0 rem(20);
            }
            .ok {
                color: $them;
            }
        }
    }
</style>