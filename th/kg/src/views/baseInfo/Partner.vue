<template>
    <section class="partner-page">
        <div class="search form-search">
            <label >运营情况</label>
            <formSelect :option="{list:selectDown.operationFlag,label:''}" style="display:inline-block;" :model.sync="search.operationFlag"/>
            <label v-if='isAdmin'>省市区</label>
            <addressSel  
                v-if='isAdmin'
                :province.sync="address.province"
                :city.sync="address.city"
                :county.sync='address.county'>
            </addressSel>
            <el-input v-model="search.name" style="width:150px;" placeholder="请输入检索名称"></el-input>
            <el-button icon="el-icon-search" @click.native="show">搜索</el-button>
            <el-button @click="cancelSearch">重置</el-button>
            <el-button type="primary" @click="dialogVisible=true" class="fr">添加</el-button>
        </div>
        <base-table v-loading="loading" :columns="columns" :list="list" @handleEdit='edit'>
            <template slot-scope="{scope}" slot="operationFlag">
                <span>
                   {{selectDown.getLabel(selectDown.operationFlag,scope.row.operationFlag)}}
                </span>
            </template>
            <template slot-scope="{scope}" slot="address">
                <span>
                    <span v-if="scope.row.provinceName">{{scope.row.provinceName}}</span>
                    <span v-if="scope.row.cityName">{{scope.row.cityName}}</span>
                    <span v-if="scope.row.countyName">{{scope.row.countyName}}</span>
                </span>
            </template>
        </base-table>

        <el-dialog :visible.sync="dialogVisible" @closed="partnerInit" width="600px">
            <formInput :item="{label:'合伙人名称',key:'name',required:true}" :model.sync="partner.name" ref='name'/>
            <div class="form-line">
                <label class="form-label" style="width:100px;">入驻时间</label>
                <el-date-picker v-model="partner.registerDate" type="date"></el-date-picker>
            </div>
            <formInput :item="{label:'负责人',key:'contact',}" :model.sync="partner.contact" />
            <formInput :item="{label:'联系电话',key:'phone',type:'phone'}" :model.sync="partner.phone"  ref='phone' />
            <div class="form-line">
                <!-- <label class="form-label required" style="width:100px;">负责区域</label> -->
                <addressSel 
                 :province.sync="partner.province"
                :city.sync="partner.city"
                :county.sync='partner.county'
                :item="{label:'负责区域',required:true}" ref='address'></addressSel>
            </div>
            <div class="form-line">
                <label class="form-label" style="width:100px;">运营情况</label>
                <el-radio-group v-model="partner.operationFlag">
                    <el-radio :label="0">启用</el-radio>
                    <el-radio :label="1">禁用</el-radio>
                </el-radio-group>
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
import cfg from '../../config/config'
import services from '../../services'
import formInput from '../../component/formInput'
import formTextarea from '../../component/formTextarea'
import imgUpload from '../../component/imgUpload'
import addressSel from '../../modulePage/addressSelect.vue'
import formSelect from '../../component/formSelect'
import pageMix from '../../mixins/pagerList'
import {selectDown,orgTypeRole} from '../../assets/js/const.js'
export default {
    mixins:[pageMix],
    components: {
        formInput,
        formTextarea,
        imgUpload,
        addressSel,
        formSelect
    },
    data(){
        return {
            dialogVisible:false,
            partner:{},
            search:{
                operationFlag:"",
                name:"",
            },
            selectDown,
            address:{},
            isAdmin:false,
            orgType:"",
            columns:[
                { key: 'name', title: '合伙人名称',width:"180"},
                { key:'operationFlag',title: '运营情况',slot:'operationFlag',width:"100"},
                { key:'contact',title: '负责人',width:"180"},
                { key:'phone',title: '联系电话',width:"180"},
                { key:'',title: '负责教育片区',slot:'address'},
                { key:'registerDate',title: '入驻时间',width:"180"},
                {
                    title: '操作', type: 'operate',width:"100",
                    operates: [
                        {name: '编辑',emitKey: 'handleEdit'}
                    ]
                }
            ]
        }
    },
    created(){
        this.orgType = JSON.parse(localStorage.getItem("info")).orgType;
        this.isAdmin=this.orgType==orgTypeRole.admin
        this.partnerInit()
        this.show()
    },
    methods:{
         partnerInit(){
            this.partner={
                id:"",
                name:"",
                contact:"",
                phone:"",
                province:"",
                city:"",
                county:"",
                registerDate:"",
                operationFlag:1
            }
        },
        show(pageNo){
            this.beforeShow(pageNo)
            let params={
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }
            params={...params,...this.search,...this.address}
            services.partner_list(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        handleSubmit(){
            let complete = Object.keys(this.partner).every(key=>{
                if(this.$refs[key]&&this.$refs[key].item){
                    return this.$refs[key].check()
                }
                return true
            })
            complete=complete&this.$refs['address'].check()
            if(!complete){
                this.$message({
                    type: 'warning',
                    message: '请填写完整信息'
                });
                return
            }
            
            let params=JSON.parse(JSON.stringify(this.partner))
            //params.registerDate=null
            if(this.partner.registerDate){
                params.registerDate = Date.parse(this.partner.registerDate);
            }
            if(!this.partner.id){
                services.partner_add(params)
                .then(data=>{
                    if(data.data.status==0){
                        this.dialogVisible=false
                        this.show()
                    }
                })
            }
            else{
                services.partner_update(params)
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
        edit({id}){
            this.dialogVisible=true
            services.partner_detail({id}).then(data=>{
                let res=data.data.data
                Object.keys(this.partner).forEach(key=>{
                    this.partner[key]=res[key]
                })
            })
        },  
        cancelSearch (){
            this.search = {
                operationFlag:"",
                name:"",
            }
            this.address={}
            this.show();
        },     
    }
}
</script>


<style lang="less" >
.partner-page{
    .el-dialog {
        .formInput{
            label{
                width:100px;
            }
            .el-input{
                width:220px;
            }
        }
    }
    .addressSelect{
        &.req{
            margin-bottom:0 !important;
        }
        label{
            width:100px;
        }
    }
}
</style>
