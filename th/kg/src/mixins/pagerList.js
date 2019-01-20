const pagerList = {
    data () {
      return {
        loading: false, 
        loadingOptions:{
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        },
        pageNo: 1, 
        pageSize:10, 
        pageTotal: 0, 
        pageLayout: 'total,prev, pager, next,jumper', // 分页布局
        list: [], //列表数据
        isShow:true
      }
    },
    methods: {
      // 分页回调事件
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange (val) {
        this.show(val)
      },

      beforeShow(pageNo){
        this.pageNo=1
        if(typeof pageNo =="number"){
            this.pageNo=pageNo
        }
        this.loading=true
      },
      /**
       * 表格数据请求成功的回调 处理完公共的部分（分页，loading取消）之后把控制权交给页面
       * @param {*} apiResult
       * @returns {*} promise
       */
      
      listSuccessCb (apiResult = {}) {
        return new Promise((reslove, reject) => {
          this.loading=false
          try {
            let res=apiResult.data
            if(res.status==0&&res.data){
              this.list=res.data.list
              this.pageTotal = res.data.totalNum || 0;
            }
            else{
              this.pageTotal=0
            }
            reslove(this.list)
          }
          catch (error) {
            reject(error)
            console.error(error)
          }
        })
      },
      /**
       * 处理异常情况
       * ==> 简单处理 仅仅是对表格处理为空以及取消loading
       */
      listExceptionCb (error) {
        this.loading=false
        console.error(error)
      }
    },
    created() {
      if(this.isShow){//利用mix和组件的数据发生冲突时以组件数据优先，来确定要不要show
        this.show()
      }
      // this.$loading(this.loadingOptions)
    }
  }
  export default pagerList