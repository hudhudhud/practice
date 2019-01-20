<template>
    <section class="banner-page">
        <div class="head fr form-search">
            <el-button type="primary" @click="dialogVisible=true" class="fr">添加</el-button>
        </div>
        <el-table :data="list" style="width: 100%"  highlight-current-row v-loading='loading'>
            <el-table-column prop="name" label="Banner标题" width="180"> </el-table-column>
            <el-table-column  prop="img" label="图片"  > 
                 <template slot-scope="scope">
                   <img :src="imgSrc(scope.row.img)" alt="" style="width:50px;height:50px">
                </template>
            </el-table-column>
            <el-table-column  prop="url" label="链接地址"  > </el-table-column>
            <el-table-column  prop="sort" label="顺序"  > </el-table-column>
            <el-table-column label="操作" width="180"> 
                <template slot-scope="scope">
                    <a @click="edit(scope.row)">编辑</a>
                    <a @click="del(scope.row.id)">删除</a>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" @closed="bannerInit" width="600px">
            <formInput :item="{label:'banner名称',key:'name',}" :model.sync="banner.name"/>
            <formInput :item="{label:'banner链接',key:'url',}"  :model.sync="banner.url"/>
            <formInput :item="{label:'banner权重',key:'sort',required:true,type:'number'}" :model.sync="banner.sort" ref="sort"/>
            <imgUpload  :item="{label:'banner图',key:'img',type:'form-url',required:true}" :url.sync="banner.img" ref='img' />
            <div class="sub-btns-left">
                <el-button type="text" @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </el-dialog>
         <!--分页-->
        <div class="pagination" v-if="list&&list.length">
            <el-pagination
                :current-page='pageNo'
                @current-change="show"
                class="pages"
                :page-size="pageSize"
                :layout="pageLayout"
                :total="pageTotal">
            </el-pagination>
        </div>
    </section>
</template>

<script>
import cfg from '../../config/config'
import services from '../../services'
import formInput from '../../component/formInput'
import formTextarea from '../../component/formTextarea'
import imgUpload from '../../component/imgUpload'
import pageMix from '../../mixins/pagerList'
export default {
    mixins: [pageMix],
    components: {
        formInput,
        formTextarea,
        imgUpload
    },
    data(){
        return {
            dialogVisible:false,
            banner:{},
        }
    },
    created(){
        this.bannerInit()
        this.show()
    },
    methods:{
         bannerInit(){
            this.banner={
                id:"",
                name:"",
                url:"",
                sort:"",
                img:''
            }
        },
        show(pageNo){
            this.beforeShow(pageNo)
            let params={
                pageNo:this.pageNo,
                pageSize:this.pageSize,
            }
            services.banner_list(params)
             .then((res) => {
                this.listSuccessCb(res)
                this.list=this.list.map(item=>{
                    item.imageUrl=item.img
                    return item
                })
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        handleSubmit(){
            let complete = Object.keys(this.banner).every(key=>{
                if(this.$refs[key]&&(this.$refs[key].item||this.$refs[key].option)){
                    return this.$refs[key].check()
                }
                return true
            })
            if(!complete){
                this.$message({
                    type: 'warning',
                    message: '请填写完整信息'
                });
                return
            }
            let params= JSON.parse(JSON.stringify(this.banner))
            if(!this.banner.id){
                services.banner_add(params)
                .then(data=>{
                    if(data.data.status==0){
                        this.dialogVisible=false
                        this.show()
                    }
                })
            }
            else{
                services.banner_update(params)
                .then(data=>{
                    if(data.data.status==0){
                        this.dialogVisible=false
                        this.show(this.pageNo)
                    }
                })
            }
        },
        handleCancel(){
            this.dialogVisible=false
        },
        edit(obj){
            this.dialogVisible=true
            this.banner=obj
        },
        del(id){
            this.$confirm('确定删除该轮播图?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                services.banner_del({id})
                .then(data=>{
                    if(data.data.status==0){
                    this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.show()
                    }
                })
            })
        },
        imgSrc (qiniuName) {
            if(!qiniuName)return
            if (qiniuName.indexOf('http://') > -1) {
                return qiniuName.replace('imageslim', 'imageView2/2/w/100')
            }
            return cfg.baseDomain + qiniuName + '?imageView2/2/w/100'
        },
       
    }
}
</script>


<style lang="less" >
.banner-page{
    .el-dialog {
        .formInput{
            label{
                width:100px;
            }
            .el-input{
                width:300px;
            }
        }
        .imgUpload{
            label{
                width:100px
            }
        }
    }
}
</style>
