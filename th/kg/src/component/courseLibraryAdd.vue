<template>
    <el-form :model="courselibrary" :rules="rules" ref="courselibrary" label-width="120px" label-position="right" class="courselibrary">
        <el-row :gutter="24">
            <el-col :span="30">
                <el-form-item label="课程名称" prop="name">
                    <el-input v-model="courselibrary.name" style="width:240px;" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="24" v-if="showAddress">
            <el-col :span="30">
                <el-form-item label="所属区域" prop="zone" >
                    <addressSel :addOptions="addOptions2Add" @handelChoose="handleChoose2Add"  ></addressSel>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="30">
                <el-form-item label="课程品种" prop="termTaxonomyId">
                    <courseColumnSel @handelChoose="handleCourseColumnChoose2Add"  :model="termTaxonomyIds"></courseColumnSel>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="30">
                <el-form-item label="课程介绍" prop="briefIntro">
                     <el-input type="textarea" style="width:400px;" :rows="10" v-model="courselibrary.briefIntro" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
            <el-row :gutter="24">
            <el-col :span="30">
                <el-form-item label="目标" prop="goal">
                    <el-input type="textarea" style="width:400px;" :rows="6" v-model="courselibrary.goal" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="30">
                <el-form-item label="提升" prop="promotion">
                    <el-input type="textarea" style="width:400px;" :rows="6" v-model="courselibrary.promotion" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="30">
                <el-form-item label="成果展示" prop="harvest">
                   <el-input style="width:240px;" v-model="courselibrary.harvest" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="30">
                <imgUpload  :item="{label:'课程图片',key:'envImg',multiple:true,maxLen:15,required:true}"   :model.sync="imgSrcList" ref="envImg"/>
            </el-col>
        </el-row>
        <el-form-item>
            <el-button type="text" @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import cfg from '../config/config'
import services from '../services'
import imgUpload from '../component/imgUpload.vue'
import addressSel from '../modulePage/addressSelect.vue'
import courseColumnSel from '../modulePage/courseColumnSelect.vue'
export default {
    components: {
        addressSel,
        courseColumnSel,
        imgUpload
    },
    props:{
        courseLibraryId:[Number,String],
        subCb:Function,
        canCb:Function,
        showAddress:{
           type: Boolean,
           default:true
        }
    },
    data(){
        return {
            courselibrary: {},
            rules: {
                name: [{ required: true, message: '请输入课程名称', trigger: 'blur' },],
                termTaxonomyId: [{ required: true, message: '请选择课程品种', trigger: 'blur' },],
                briefIntro: [{ required: true, message: '请输入课程介绍', trigger: 'blur' },],
                goal: [{ required: true, message: '请输入目标', trigger: 'blur' },],
                promotion: [{ required: true, message: '请输入提升', trigger: 'blur' },],
                harvest: [{ required: true, message: '请输入成果展示', trigger: 'blur' },],
            },
            termTaxonomyIds:[],
            imgSrcList:[],
            addOptions2Add: {
                size: '',
                address: ''
            },
        }
    },
    watch:{
        courseLibraryId:{
            handler(val,old){
                this.courseLibraryInit()
                if(val){
                    this.getDetail(val)  
                }
            },
            immediate: true
        }
    },
    methods:{
        getDetail(id){
            services.courselibrary_detail({id})
            .then(data=>{
                let res=data.data.data
                if(res){
                    Object.keys(this.courselibrary).forEach(key=>{
                        this.courselibrary[key]=res[key]
                    })
                    if(res.termTaxonomyId){
                        this.termTaxonomyIds=res.termTaxonomyPath?res.termTaxonomyPath.split('>').map(item=>item=item-''):[]
                    }
                    if(res.imgs&&res.imgs.length){
                        this.imgSrcList=res.imgs.map(item=>{item.imageUrl=item.fileHash;item.imageName=item.fileHash;return item})
                    }   
                    this.addOptions2Add.address=[res.province,res.city,res.county]
                }
            })
        },
        handleChoose2Add (value, status) {
            this.courselibrary.province = value.province;
            this.courselibrary.city = value.city;
            this.courselibrary.county = value.county;
        },
        handleSubmit (){
            if(!this.$refs['envImg'].check()){
                this.$message({
                    type: 'warning',
                    message: '请填写完整信息'
                });
                return
            }
            this.$refs.courselibrary.validate((valid) => {
                if (valid) {
                    let params = this.courselibrary;
                    if(this.imgSrcList&&this.imgSrcList.length){
                        params.imgJson = JSON.stringify(this.imgSrcList)
                    }
                    if(!this.courselibrary.id){
                        services.courselibrary_save(params)
                        .then((data) => {
                            if(typeof this.subCb == 'function'){
                                this.subCb({id:data.data.data,name:this.courselibrary.name})
                            }
                            this.courseLibraryInit()
                        })
                        .catch(function(error){
                            console.log('error值：', error)
                        })
                    }
                    else{
                        params.id=this.courselibrary.id
                        services.courselibrary_update(params)
                        .then((data) => {
                            if(typeof this.subCb == 'function'){
                                this.subCb({id:data.data.data,name:this.courselibrary.name})
                            }
                            this.courseLibraryInit()
                        })
                        .catch(function(error){
                            console.log('error值：', error)
                        })
                    }
                } else {
                    console.log('error submit!!');
                    this.$message({
                        type: 'warning',
                        message: '请填写完整信息'
                    });
                    return false;
                }
            });
        },
        handleCourseColumnChoose2Add (value, status) {
            if (value.columnone) {
                this.courselibrary.termTaxonomyId = value.columnone;
            }
            else{
                this.courselibrary.termTaxonomyId=''
            }
            if (value.columntwo) {
                this.courselibrary.termTaxonomyId = value.columntwo;
            }
        },
        courseLibraryInit(){
            this.courselibrary={
                name: '',
                province: '',
                city: '',
                county: '',
                briefIntro: '',
                detailIntro: '',
                termTaxonomyId: '',
                imgJson: '',
                id:"",
                promotion:"",
                harvest:"",
                goal:"",
            }
            this.termTaxonomyIds=[]
            this.imgSrcList=[]
            this.addOptions2Add.address=[]
        },
        handleCancel () {
            if(typeof this.canCb == 'function'){
                this.canCb()
            }
        },
    }
}
</script>

<style lang="less" >
.courselibrary{
    .imgUpload{
        label{
            width:120px;
        }
    }
    .addressSelect{
        label{
            width:120px;
        }
    }
}
</style>
