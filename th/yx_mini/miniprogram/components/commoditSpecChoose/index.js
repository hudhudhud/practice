// components/commoditSpecChoose/index.js
import { getShopDetailSkuList } from "../../services/home/shop";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        detail: {
            type: Object,
            value: {}
        },
        show: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        initList: [], // 后端返回的原始数据， 用来最后获取sku
        select: {}, // 选中的数据 sku
        specList: [], // 处理过的数据，用来渲染页面
        // specList: [{
        //     title: '标题',
        //     list: ['红色', '黄色'],
        //     active: 0, // 选中
        //     unActiveAbleList: [], // 未选中的可用列表
        //     activeAbleList: [],  // 已选中的可用列表
        // }]
        skuAllStr: '', // 所有的sku数据字符串，用来查询可选选项
        count: 1
    },
    lifetimes: {
        attached() {
            this.getShopDetailSkuList();
        }
    },
    methods: {
        getShopDetailSkuList: function () {
            getShopDetailSkuList({id: this.properties.detail.id}).then(res => {
                this.data.initList = res;

                let result = this.conversionData(res.map(i => {
                    this.data.skuAllStr += i.skuStr;
                    return i.skuStr;
                }));
                this.setData({
                    specList: result.map(i => {
                        return {
                            title: i.title,
                            list: i.list,
                            active: i.list.length===1?0:-1,
                            unActiveAbleList: i.list,
                            activeAbleList: i.list
                        }
                    })
                });
                // 检查 规格
                this.checkAbleSpec();
            });
        },
        // 将后端传过来的数据 转化成二维数组
        conversionData: function (arry) {
            let map = new Map();
            for (let str of arry) {
                let sku = JSON.parse(str);
                let keys = Object.keys(sku);
                for (let i = 0; i < keys.length; i++) {
                    let set = map.get(keys[i]) || new Set();
                    set.add(sku[keys[i]])
                    map.set(keys[i], set)
                }
            }
            return [...map].map(i => {
                return {
                    title: i[0],
                    list: [...i[1]],
                }
            });
        },
        /**
         * 选中了某一规格  步骤1 将方框置成红色
         */
        selectedSpec: function (e) {
            if (e.currentTarget.dataset.disabled) {
                return;
            }
            let gIndex = e.currentTarget.dataset.gi;
            let index = e.currentTarget.dataset.i;
            if (this.data.specList[gIndex].active === index) {
                this.data.specList[gIndex].active = -1;
            } else {
                this.data.specList[gIndex].active = index;
            }
            this.checkAbleSpec();
        },
        /**
         * 检查  可用规格的列表  步骤2
         * 规则1 ，未选中的可选列表 按照已选中的数据去搜索
         * 规则2，已选中的可选列表 按照排除本身后的已选中数据去搜索
         */
        checkAbleSpec: function () {
            //规则1 获取未选中可用的规格
            let active = '[^{}]*';
            for (let i = 0; i < this.data.specList.length; i++) {
                if (this.data.specList[i].active >= 0) {
                    // active[this.data.specList[i].title] = this.data.specList[i].list[this.data.specList[i].active];
                    active = active + `"${this.data.specList[i].title}":"${this.data.specList[i].list[this.data.specList[i].active]}"` + '[^{}]*'
                }
            }
            let reg = new RegExp('\{' + active + '\}', 'g');
            let result = this.data.skuAllStr.match(reg);
            let unActiveList = this.conversionData(result); // [{list: []}]
            //规则2 获取 已选中 可用规格列表
            let activeList = [];
            // 取得所有选中的列表，封装成map
            let searchList = new Map(this.data.specList.filter(i => {
                return i.active !== -1;
            }).map(i => {
                return [i.title, i.list[i.active]]
            }));
            // 循环获取 每一个已选中列表的 可选列表
            for (let i = 0; i < this.data.specList.length; i++) {
                if (this.data.specList[i].active !== -1) {
                    // 复制一份选中的  数据
                    let searchCurrent = new Map(searchList);
                    // 删除自己当前选中的数据，剩下的就是其他选中的数据
                    searchCurrent.delete(this.data.specList[i].title);
                    // 拼装搜索规则2
                    let selectReg = '[^{}]*';
                    for (let [key, value] of searchCurrent.entries()) {
                        selectReg += `"${key}":"${value}"` + '[^{}]*';
                    }
                    let reg2 = new RegExp('\{' + selectReg + '\}', 'g');
                    let result2 = this.data.skuAllStr.match(reg2); // [{"颜色":"红色","数量":"4袋装","尺寸":"S"}]
                    // 提取数组中 当前规格的所有可用
                    let currentSet = new Set();
                    result2.forEach(item => {
                        let obj = JSON.parse(item);
                        currentSet.add(obj[this.data.specList[i].title])
                    })
                    activeList.push({list: [...currentSet]});


                } else {
                    // 如果是未选中，则占位即可。因为未选中，这里不定义，在规则1中定义
                    activeList.push({list: []})
                }
            }
            // 赋值，未选中/已选中   可用列表
            for (let i = 0; i < this.data.specList.length; i++) {
                this.data.specList[i].unActiveAbleList = unActiveList[i].list;
                this.data.specList[i].activeAbleList = activeList[i].list;
            }

            // 如果可用sku 只有一条
            if (result.length === 1) {
                this.data.select = this.data.initList.find(i => {
                    return i.skuStr === result[0]
                })
                if(this.data.count > this.data.select.quantity){
                    this.data.count = this.data.select.quantity;
                }
            } else {
                this.data.select = {};
            }
            this.setData({
                specList: this.data.specList,
                select: this.data.select,
                count: this.data.count
            })
        },

        countChange: function (e) {
            let count = (this.data.count + e.currentTarget.dataset.num) || 1;
            if(count > (this.data.select.quantity||this.data.detail.quantity)){
                count = (this.data.select.quantity||this.data.detail.quantity);
            }
            this.setData({
                count: count
            })
        },

        confirm: function () {
            let all = this.data.specList.every(i => {
                return i.active !== -1;
            })
            if (all) {
                this.triggerEvent('confirm', {sku: this.data.select, count: this.data.count})
            } else {
                wx.showToast({
                    title: '请选择商品规格',
                    icon: 'none'
                })
            }
        },
        cancel: function () {
            this.triggerEvent('cancel')
        }
    },
})
