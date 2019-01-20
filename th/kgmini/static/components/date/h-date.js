// components/component-tag-name.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    initDate: {
      type: String,
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        this.init();
      }
    },
    minDate: {
      type: String,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          minTimeNum: Number(newVal.replace(/-/g, ''))
        });
      }
    },
    maxDate: {
      type: String,
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          maxTimeNum: Number(newVal.replace(/-/g, ''))
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    options: {
      weekText: ['一', '二', '三', '四', '五', '六', '日']
    },
    selectIndex: 0,
    selects: [],
    activeDate: '', // 当前选中的 日期 字符串
    showDate: '', // 显示的第一个页面 日期
    weekNumber: 0,
    minTimeNum: 0,
    maxTimeNum: 0
  },
  attached: function() {
    this.init();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init: function() {

      let count = 31;
      let outputDate ;
      if (this.data.initDate){
        outputDate = new Date(this.data.initDate);
      }else{
        outputDate = new Date();
      }

      this.data.showDate = outputDate.getFullYear() + '-' + (outputDate.getMonth() + 1).toString().padStart(2, '0') + '-' + outputDate.getDate().toString().padStart(2, '0');
      this.data.activeDate = this.data.initDate ? this.data.showDate:'';
      //  this.data.showDate = this.data.activeDate || new Date().toLocaleDateString().replace(/\//g, '-');
      //TODO

      this.data.weekNumber = outputDate.getDay();
      this.data.selects = [];
      for (let i = 0; i < count; i++) {
        let date = new Date(outputDate);
        date.setMonth(date.getMonth() + i - parseInt(count / 2));

        if (this.data.minTimeNum) {
          let timp = new Date(date);
          timp.setMonth(timp.getMonth() + 1);
          timp.setDate(0);
          timp = (timp.getFullYear() + (timp.getMonth() + 1).toString().padStart(2, '0') + timp.getDate().toString().padStart(2, '0'));
          if (this.data.minTimeNum > timp) {
            continue;
          }
        }
        if (this.data.maxTimeNum) {
          let timp = new Date(date);
          timp.setMonth(timp.getMonth());
          timp.setDate(1);
          timp = (timp.getFullYear() + (timp.getMonth() + 1).toString().padStart(2, '0') + timp.getDate().toString().padStart(2, '0'));
          if (this.data.maxTimeNum < timp) {
            continue;
          }
        }
        this.data.selects.push(this.getMonthData(date));
        if ((outputDate.getFullYear() === date.getFullYear() && outputDate.getMonth() === date.getMonth())) {
          this.data.selectIndex = this.data.selects.length - 1;
        }
      }

      this.setData({
        selects: this.data.selects,
        activeDate: this.data.activeDate,
        weekNumber: this.data.weekNumber,
        selectIndex: this.data.selectIndex,
        showDate: this.data.showDate
      });
    },
    /**
     * 触摸 滑动改变
     */
    indexChange: function(e) {

      // this.data.selectIndex = e.detail.current;

      // 
    },
    animationfinish: function(e) {
      if (e.detail.current !== this.data.selectIndex || e.detail.source !== 'touch') {
        switch (true) {
          case e.detail.current <= 2:
            this.utilUpdateReduce(e.detail.current);
            break;
          case e.detail.current > this.data.selects.length - 4:
            this.utilUpdateAdd(e.detail.current);
            break;
          default:
            this.data.selectIndex = e.detail.current;
            break;
        }
      }
    },

    /**
     * 点击 箭头 改变
     */
    indexChangeJT: function(e) {
      if (e.target.dataset.type === '1') {
        // 判断是否禁用
        // if (this.data.minTimeNum){
        //   // 判断下个月  的最后一天 是否比最小值大
        //   let day = this.data.selects[this.data.selectIndex - 1].id + this.data.selects[this.data.selectIndex - 1].days ; // 2018-1031
        //   if (this.data.minTimeNum > day.replace('-', '')){
        //     return;
        //   }
        // }
        if (this.data.selectIndex > 0) {
          this.setData({
            selectIndex: this.data.selectIndex - 1
          });
        }
      } else if (this.data.selectIndex < this.data.selects.length - 1) {
        this.setData({
          selectIndex: this.data.selectIndex + 1
        });
      }
    },
    /**
     * 选择的日期改变
     */
    dateChange: function(e) {
      let date = e.target.dataset.month + '-' + e.target.dataset.num.toString().padStart(2, '0');
      if (this.data.minTimeNum) {
        if (date.replace(/-/g, '') <= this.data.minTimeNum) {
          return;
        }
      }
      if (this.data.maxTimeNum) {
        if (date.replace(/-/g, '') >= this.data.maxTimeNum) {
          return;
        }
      }
      this.data.weekNumber = new Date(date).getDay();
      this.setData({
        activeDate: date,
        weekNumber: this.data.weekNumber
      });
      this.triggerEvent('change', date)
    },
    /**
     * 辅助函数  修正数据  往后
     */
    utilUpdateAdd: function(index) {
      let month = this.data.selects[this.data.selects.length - 1].date
      let array = [];
      for (let i = 0; i < 8; i++) {
        let time = new Date(month);
        time.setMonth(time.getMonth() + i + 1)
        // 判断 是否已经 超出最大值
        if (this.data.maxTimeNum) {
          let timp = new Date(time);
          timp.setMonth(timp.getMonth());
          timp.setDate(1);
          timp = (timp.getFullYear() + (timp.getMonth() + 1).toString().padStart(2, '0') + timp.getDate().toString().padStart(2, '0'));
          if (this.data.maxTimeNum < timp) {
            continue;
          }
        }
        array.push(this.getMonthData(time));
      }
      if(!array.length){
        return;
      }

      this.data.selects = this.data.selects.concat(array);
      setTimeout(() => {
        this.setData({
          selects: this.data.selects,
          selectIndex: index
        });
      });
    },
    /**
     * 辅助函数  修正数据  往前
     */
    utilUpdateReduce: function(index) {
      let month = this.data.selects[0].date
      let array = [];
      for (let i = 8; i >= 1; i--) {
        let time = new Date(month);
        time.setMonth(time.getMonth() - i)

        // 判断 是否小于最小值
        if (this.data.minTimeNum) {
          let timp = new Date(time);
          timp.setMonth(timp.getMonth() + 1);
          timp.setDate(0);
          timp = (timp.getFullYear() + (timp.getMonth() + 1).toString().padStart(2, '0') + timp.getDate().toString().padStart(2, '0'));
          if (this.data.minTimeNum > timp) {
            continue;
          }
        }
        array.push(this.getMonthData(time));
      }
      if (!array.length) {
        return;
      }
      this.data.selects = array.concat(this.data.selects);
      setTimeout(() => {
        this.setData({
          selects: this.data.selects,
          selectIndex: index + 8
        });
      });
      console.log('reduce')
      console.log(this.data.selects.length)
    },
    /**
     * 辅助函数
     */
    getMonthData: function(month) {
      let now = new Date(month);
      now.setMonth(now.getMonth() + 1);
      now.setDate(0);
      let days = now.getDate();
      now.setDate(1);
      let fillCount = now.getDay();
      return {
        id: now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, 0),
        num: now.getTime(),
        date: now,
        days: days,
        fillCount: fillCount
      }
    }
  },
})
