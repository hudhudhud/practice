import services from '../services'
const coursePublish = {
    data () {
      return {
        multipleSelection: [],
      }
    },
    methods: {
        publish(id){
            this.$confirm('是否确认上架该课程?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                services.course_publish({id,status:'published'})
                .then((res) => {
                    let resData = res.data;
                    if(resData.status == 0){
                        this.$message({
                            type: 'success',
                            message: '上架成功!'
                        });
                        this.show(this.pageNo);
                    }
                })
                .catch(function(error){
                  console.log('error值：', error)
                })
            });
        },
        unPublish(id){
            this.$confirm('是否确认下架该课程?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                services.course_publish({id,status:'unpublished'})
                .then((res) => {
                    let resData = res.data;
                    if(resData.status == 0){
                        this.$message({
                            type: 'success',
                            message: '下架成功!'
                        });
                        this.show(this.pageNo);
                    }
                })
                .catch(function(error){
                    console.log('error值：', error)
                })
            })
        },
        changeFun(val){
            this.multipleSelection = val.map(each => {
                return each.id;
            });
        },
        batchPublish(){
            if (this.multipleSelection.length == 0) {
              this.$alert('请先选择要操作的数据！', {
                confirmButtonText: '确定'
              });
            } else {
                this.$confirm('是否确认上架这些课程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    services.course_batchpublish({ids: this.multipleSelection.join(',')})
                    .then((res) => {
                        let resData = res.data;
                        if(resData.status == 0){
                            this.$message({
                                type: 'success',
                                message: '批量上架成功!'
                            });
                            this.show(this.pageNo);
                        }
                    })
                    .catch(function(error){
                        console.log('error值：', error)
                    })
                })
            }
        },
        batchUnpublish(){
            if (this.multipleSelection.length == 0) {
                this.$alert('请先选择要操作的数据！', {
                    confirmButtonText: '确定'
                });
            } else {
                this.$confirm('是否确认下架这些课程?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    services.course_batchunpublish({ids: this.multipleSelection.join(',')})
                    .then((res) => {
                        let resData = res.data;
                        if(resData.status == 0){
                            this.$message({
                                type: 'success',
                                message: '批量下架成功!'
                            });
                            this.show(this.pageNo);
                        }
                    })
                    .catch(function(error){
                        console.log('error值：', error)
                    })
                })
            }
        },
    },
  }
  export default coursePublish