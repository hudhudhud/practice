<template>
    <section>
        <div class="search form-search">
            <!-- <formSelect  :option="{label:'年级',list:select.grades}" :kv="{k:'name',v:'id'}" :model.sync="search.classId" style="display:inline-block;"/> -->
            <el-input v-model="supplierName" placeholder="请输入供应商名称" style="width:150px;"></el-input>
            <el-button icon="el-icon-search" @click="show">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" @click="dialogVisible=true" class="fr">添加</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list" class="table-row-elli" @edit="edit" >
        </base-table>
        <el-dialog :title="lunch.id?'修改供应商':'添加供应商'" :visible.sync="dialogVisible" class="supplier-dialog" @closed="lunchInit">
            <formInput :item="{label:'供应商名称',key:'name',required:true}"  :model.sync="lunch.name" ref="name"/>
            <formInput :item="{label:'负责人',key:'contact',required:true}"  :model.sync="lunch.contact" ref="contact"/>
            <formInput :item="{label:'联系电话',key:'phone',required:true,type:'phone'}"  :model.sync="lunch.phone" ref="phone"/>
            <formTextarea :item="{label:'供应商介绍',key:'desc',required:true}"  :model.sync="lunch.desc" ref="desc"/>
            <div class="form-line imgs">
                <label class="form-label">供应商资质</label>
                <imgUpload  :item="{label:'上传营业执照',key:'yyzz',type:'url'}"   :url.sync="lunch.businessLicenseImg"/>
                <imgUpload  :item="{label:'上传卫生许可证',key:'wsxkz',type:'url'}" :url.sync="lunch.healthLicenseImg" />
            </div>
            <!-- <formInput :item="{label:'供应商账户',key:'account',required:true}" :model.sync="lunch.account" ref="account"/> -->
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
import services from '../../services'
import formInput from '../../component/formInput'
import formTextarea from '../../component/formTextarea'
import formSelect from '../../component/formSelect'
import imgUpload from '../../component/imgUpload'
import pageMix from '../../mixins/pagerList'
export default {
    mixins:[pageMix],
    components: {
        formInput,
        formTextarea,
        formSelect,
        imgUpload,
    },
    data(){
        return {
            select:{},
            supplierName:"",
            dialogVisible:false,
            lunch:{},
            columns:[
                { key: 'name', title: '供应商名称',width:'180px' },
                { key:'contact',title: '负责人',width:'180px'},
                { key:'phone',title: '联系电话',width:'200px'},
                { key:'desc',title: '供应商介绍'},
                { key:'createdAt',title: '创建时间',width:'180px'},
                {
                    title: '操作', type: 'operate',width:'100px',
                    operates: [
                        {name: '编辑',emitKey: 'edit'}
                    ]
                }
            ]
        }
    },
    created(){
        services.grade_list().then((res) => {
            this.select.grades = res.data.data.list;
        })
        this.lunchInit()
    },
    methods:{
        lunchInit(){
            this.lunch={
                name:"",
                desc:"",
                account:"",
                id:"",
                businessLicenseImg:"",
                healthLicenseImg:"",
                phone:'',
                contact:'',
            }
        },
        show(pageNo){
            this.beforeShow(pageNo)
            let params={
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                supplierName:this.supplierName,
            }
            services.supplier_list(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        resetSearch(){
            this.supplierName=''
            this.show()
        },
        handleSubmit(){
            let complete = Object.keys(this.lunch).every(key=>{
                if(this.$refs[key]&&this.$refs[key].item){
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
            //深复制
            let params=JSON.parse(JSON.stringify(this.lunch))

            if(!params.id){
                services.supplier_add(params).then(data=>{
                    if(data.data.status==0){
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.dialogVisible=false
                        this.show()
                    }
                })
            }
            else{
                services.supplier_update(params).then(data=>{
                    if(data.data.status==0){
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.dialogVisible=false
                        this.show(this.pageNo)
                    }
                })
            }
        },
        handleCancel(){
            this.dialogVisible=false
        },
        edit({id}){
            this.dialogVisible=true
            services.supplier_detail({id}).then(data=>{
                let item=data.data.data
                Object.keys(this.lunch).forEach(key=>{
                    this.lunch[key]=item[key]
                })
                this.lunch.businessLicenseImg=item.businessLicense
                this.lunch.healthLicenseImg=item.healthLicense
            })
        }
    }
    
}
</script>

<style lang="less" >
.supplier-dialog{
    .el-dialog{
        .el-dialog__body{
            &>.formInput,&>.formTextarea{
            label{
                    width:100px;
                }
            }
        }
        .formTextarea{
            .el-textarea__inner{
                width:300px;
                height: 200px;
            }
        }
        .formInput{
            .el-input{
                width:300px;
            }
        }
    }
    .imgs{
        label{
            width:100px;
            vertical-align: top;
        }
        .imgUpload{
             vertical-align: top;
             display: inline-block;
             .btn .txt{
                 font-size:14px;
             }
        }
    }
}
</style>
