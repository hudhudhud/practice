// components/prompt/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        placeholder: {
            type: String,
            value: '请输入'
        },
        show: {
            type: Boolean,
            value: false
        },
        title: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        input: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleInput: function (e) {
            this.data.input = e.detail.value;
        },
        confirm: function () {
            if (!this.data.input) {
                wx.showToast({
                    title: '请输入内容',
                    icon: 'none'
                })
                return;
            }
            this.triggerEvent('confirm', {content: this.data.input});
        },
        cancel: function () {
            this.triggerEvent('cancel');
        }
    }
})
