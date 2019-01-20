<template>
    <section class="lunch-page">
        <div class="search form-search">
            <label>年级</label>
            <formSelect  :option="{list:select.grades}" :kv="{k:'name',v:'id'}" :model.sync="search.classId" style="display:inline-block;"/>
            <el-input v-model="search.lunchContent" placeholder="请输入菜谱名称" style="width:150px;"></el-input>
            <el-button icon="el-icon-search" @click="show">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" @click="dialogVisible=true" class="fr">添加</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list" class="table-row-elli" @edit="edit" >
        </base-table>
        <el-dialog :title="lunch.id?'修改午餐':'添加午餐'" :visible.sync="dialogVisible" class="lunch-dialog" @closed="lunchInit">
            <!--<formSelect  :option="{label:'供应商',list:select.suppliers,required:true}" :kv="{k:'name',v:'id'}" :model.sync="lunch.supplierId" style="display:inline-block;"-->
            <!--ref="supplier"/>-->
            <formSelectRemote  :option="{label:'供应商',placeholder:'请输入供应商名称',required:true,clearable:true}"
                               :remote="supplierRemoteSearch"  :model.sync="lunch.supplierId"
                               :kv="{k:'name',v:'id'}"  style="display:inline-block;"
                               ref="supplier" :modelText="lunch.name"
            />
            <div class="bills">
                <p class="clearfix"><span class="fl">菜谱信息</span><a @click="lunchBillList.push({})" class="fr" v-if="!lunch.id">添加</a></p>
                <el-collapse v-model="activeLunchBill" >
                    <el-collapse-item :title="'菜谱'+(i+1)" :name="'菜谱'+(i+1)"  v-for="(item,i) in lunchBillList" :key="i">
                        <a @click="lunchBillList.splice(i,1)" class="del-bill" v-if="i>0">删除</a>
                        <lunchBill   :item.sync="item"  />
                    </el-collapse-item>
                </el-collapse>
            </div>
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
import formSelect from '../../component/formSelect'
import lunchBill from '../../component/lunchBill'
import pageMix from '../../mixins/pagerList'
import formSelectRemote from '../../component/formSelectRemote'
export default {
    mixins:[pageMix],
    components: {
        formSelect,
        lunchBill,
        formSelectRemote,
    },
    data(){
        return {
            select:{},
            search:{
                classId:"",
                keywords:"",
                lunchContent:""
            },
            dialogVisible:false,
            lunchBillList:[{}],
            activeLunchBill:"菜谱1",
            lunch:{},
            supplierRemoteSearch:'',
            columns:[
                    { key: 'gradeName', title: '年级名称',width:'180px' },
                    { key:'name',title: '供应商名称',width:'180px'},
                    { key:'lunchContent',title: '菜谱'},
                    { key:'consumeDay',title: '消费日',width:'100px'},
                    { key:'price',title: '单价',width:'100px'},
                    {
                        title: '操作', type: 'operate',width:'180px',
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
        // services.supplier_list().then(res=>{
        //     this.select.suppliers=res.data.data.list
        // })
        this.supplierRemoteSearch={
          func:'supplier_list',
          key:'supplierName'
        }
        this.lunchInit()
    },
    methods:{
        lunchInit(){
            this.lunch={
                id:"",
                supplierId:"",
                name:""
            }
            this.lunchBillList=[{}]
            this.activeLunchBill="菜谱1"
        },
        show(pageNo){
            this.beforeShow(pageNo)
            let params=this.search
            params.pageNo=this.pageNo
            params.pageSize=this.pageSize
            services.schoolLunch_list(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        resetSearch(){
            this.search={}
            this.show()
        },
        handleSubmit(){
            let complete = Object.keys(this.lunch).every(key=>{
                if(this.$refs[key]&&this.$refs[key].item){
                    return this.$refs[key].check()
                }
                return true
            })
            complete=complete&&this.$refs['supplier'].check()
            if(!complete){
                this.$message({
                    type: 'warning',
                    message: '请填写完整信息'
                });
                return
            }

            this.dialogVisible=true
            let params=JSON.parse(JSON.stringify(this.lunch))
            let billList=this.lunchBillList.filter(item=>{
                let list=Object.keys(item).filter(key=>item[key])
                return list.length
            })
            params.lunchJson=JSON.stringify(billList)

            if(!params.id){
                services.schoolLunch_add(params).then(data=>{
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
                services.schoolLunch_update(params).then(data=>{
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
        edit(item){
            this.dialogVisible=true
            Object.keys(this.lunch).forEach(key=>{
                this.lunch[key]=item[key]
            })
            this.lunchBillList=[{
                startTime:item.startTime,
                endTime:item.endTime,
                lunchContent:item.lunchContent,
                price:item.price,
                classId:item.classId,
                consumeDay:item.consumeDay,
            }]
        },
    }
    
}
</script>
<style lang="less">
.lunch-dialog{
    .el-dialog{
        height: 600px;
        overflow-y:scroll;
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
                width:200px;
            }
        }
    }
    .imgs{
        label{
            width:100px;
            vertical-align: top;
        }
        .imgUpload{
             display: inline-block;
             .btn .txt{
                 font-size:14px;
             }
        }
    }
    .bills{
        margin-top:10px;
        padding:10px;
        >p{
            padding:10px;
        }
        .el-collapse{
            padding:0 10px;
            .el-collapse-item{
                position: relative;
                .del-bill{
                    position:absolute;
                    right:30px;
                    top:10px;
                }
            } 
        }
    }
}
.lunch-page{
    .search{
        label{
            width:50px;
        }
    }
}
</style>
