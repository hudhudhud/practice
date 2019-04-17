// components/inputPayPsw/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            observer(newVal, oldVal, changedPath) {
                this.setData({
                    psw: ''
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        psw: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handInput: function (e) {
            switch (e.currentTarget.dataset.type) {
                case 'x':
                    if (this.data.psw.length) {
                        this.setData({
                            psw: this.data.psw.substr(0, this.data.psw.length - 1)
                        })
                    }
                    break;
                default:
                    if (this.data.psw.length < 6) {
                        this.setData({
                            psw: this.data.psw + e.currentTarget.dataset.type
                        })
                        if(this.data.psw.length === 6){
                            this.confirm();
                        }
                    }
                    break;
            }

        },
        confirm: function(){
            this.triggerEvent('confirm', {psw: this.data.psw});
        },
        cancal: function () {
            this.triggerEvent('cancel',{});
        },
        forgetPayPsw: function () {
            this.triggerEvent('cancel', {forget: true});
        }
    }
})
