<template>
    <section class="courseConfig-page">
        <div class="search form-search">
            <label>课程类型</label>
            <formSelect  :option="{list:selectDown.classroomTypes.sch,clearable:true}"  :model.sync="courseType" style='display:inline-block' v-if='!isComm'/>
            <formSelect  :option="{list:selectDown.classroomTypes.comm,clearable:true}"  :model.sync="courseType" style='display:inline-block' v-else/>
            <el-button icon="el-icon-search" @click="show">搜索</el-button>
            <el-button @click="cancelSearch">重置</el-button>
            <el-button type="primary" @click="dialogVisible=true" class="fr">添加</el-button>
        </div>
        <el-table :data="list" style="width: 100%"  highlight-current-row  v-loading='loading'>
            <el-table-column  prop="courseType" label="课堂分类" width="180">
                <template slot-scope="scope">
                    <span v-if='!isComm'>{{selectDown.getLabel(selectDown.classroomTypes.sch,scope.row.courseType)}}</span>
                    <span v-else>{{selectDown.getLabel(selectDown.classroomTypes.comm,scope.row.courseType)}}</span>
                </template>
            </el-table-column>
            <el-table-column  prop="yearTermName" label="适用学年"  v-if='!isComm'> </el-table-column>
            <el-table-column  prop="gradeNames" label="适用班级"  v-if='!isComm'> </el-table-column>
            <el-table-column  prop="startDate" label="选课开始时间"  > </el-table-column>
            <el-table-column  prop="endDate" label="选课结束时间"  > </el-table-column>
            <el-table-column  prop="courseLimit" label="每人最大选课数"  > </el-table-column>
            <el-table-column  label="操作" width="180"> 
                <template slot-scope="scope">
                    <a @click="edit(scope.row.id)">编辑</a>
                </template>
            </el-table-column>
        </el-table>

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

        <el-dialog :title="courseConfig.id?'修改选课配置':'添加选课配置'" :visible.sync="dialogVisible" @closed="courseConfigInit" width="600px" style='config-dialog'>
            <formSelect :option="{label:'课堂分类',list:selectDown.classroomTypes.sch,required:true}"  :model.sync='courseConfig.courseType' ref='courseType' v-if='!isComm'/>
            <formSelect :option="{label:'课堂分类',list:selectDown.classroomTypes.comm,required:true}"  :model.sync='courseConfig.courseType' ref='courseType' v-else/>
            <formInput  v-if='!isComm' :item="{label:'适用学年',key:'name',disabled:true,required:true}" :model="currentYearTermName" />
            <formSelect v-if='!isComm' :option="{label:'适用年级',key:'name',list:select.grades,multiple:true,required:true}" :model.sync="courseConfig.grades" :kv="{k:'name',v:'id'}" ref='grades'/>
            <formDate   :option="{label:'选课开始时间',key:'startDate',required:true,datetime:true}"  :model.sync="courseConfig.startDate" ref="startDate"/>
            <formDate  :option="{label:'选课结束时间',key:'endDate',required:true,datetime:true}"  :model.sync="courseConfig.endDate" ref="endDate"/>
            <formInput :item="{label:'每人最大选课数',key:'courseLimit',type:'number',required:true}" :model.sync="courseConfig.courseLimit" ref='courseLimit'/>
            <div class="sub-btns-left">
                <el-button type="text" @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import cfg from '../../config/config'
import services from '../../services'
import formDate from '../../component/formDate'
import formInput from '../../component/formInput'
import formSelect from '../../component/formSelect'
import pageMix from '../../mixins/pagerList'
import {orgTypeRole,selectDown} from '../../assets/js/const.js'
export default {
    mixins: [pageMix],
    components: {
        formInput,
        formSelect,
        formDate,
    },
    data(){
        return {
            dialogVisible:false,
            courseConfig:{},
            select: {
                classroomTypes: [
                    {label: '社团课', value: 1,},
                    {label: '拓展课', value: 2,},
                    {label: '安心班', value: 3,}
                ],
                grades:[]
            },
            currentYearTermName:'',
            courseType:'',
            isComm:false,
            orgType:'',
            selectDown,
        }
    },
    created(){
        this.orgType = JSON.parse(localStorage.getItem("info")).orgType;
        this.isComm= this.orgType==orgTypeRole.comm
        services.yearterm_currentdetail().then((res) => {
            if(res.data.status==0&&res.data.data){
                this.currentYearTermName = res.data.data.name;
                this.courseConfig.yearTermId=res.data.data.id
            }
        });
        services.grade_list().then((res) => {
            if(res.data.status==0&&res.data.data){
              this.select.grades = res.data.data.list;
            }
        });
        this.courseConfigInit()
    },
    methods:{
         courseConfigInit(){
            this.courseConfig={
                id:"",
                courseType:"",
                grades:[],
                startDate:'',
                endDate:'',
                courseLimit:'',
                yearTermId:''
            }
        },
        show(pageNo){
            this.beforeShow(pageNo)
            let params={
                courseType:this.courseType,
                pageSize:this.pageSize,
                pageNo:this.pageNo
            }
            services.courseConfig_list(params)
            .then((res) => {
                this.listSuccessCb(res)
            })
            .catch((err) => {
                this.listExceptionCb(err)
            })
        },
        handleSubmit(){
            let complete = Object.keys(this.courseConfig).every(key=>{
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
            //直接把对象给params会有问题，需要深复制！！
            let params={}
            Object.keys(this.courseConfig).forEach(key=>{
                params[key]=this.courseConfig[key]
            })
            if(this.courseConfig.startDate)
                params.startDate=Date.parse(this.courseConfig.startDate)
            if(this.courseConfig.endDate)
                params.endDate=Date.parse(this.courseConfig.endDate)
            if(params.endDate&&params.startDate&&params.endDate<params.startDate){
                this.$message({
                    type: 'warning',
                    message: '选课结束时间不得早于开始时间'
                });
                return
            }
            if(this.courseConfig.grades&&this.courseConfig.grades.length)
                params.grades = this.courseConfig.grades.join(',')
            if(!this.courseConfig.id){
                services.courseConfig_add(params)
                .then(data=>{
                    if(data.data.status==0){
                        this.dialogVisible=false
                        this.show()
                    }
                })
            }
            else{
                services.courseConfig_update(params)
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
        edit(id){
            this.dialogVisible=true
            services.courseConfig_detail({id})
            .then(data=>{
                let res=data.data
                if(res){
                    this.courseConfig=res.data
                    if(!res.data.grades){
                        this.courseConfig.grades=[]
                    }else{
                        this.courseConfig.grades=res.data.grades.split(',').map(item=>{item=item-'';return item})
                    }
                }
            })
        },
        cancelSearch(){
            this.courseType=''
            this.show()
        }
       
    }
}
</script>


<style lang="less" >
.courseConfig-page{
    .el-dialog {
        .formInput{
            label{
                width:120px;
            }
            .el-input{
                width:217px;
            }
        }
        .form-line{
            label{
                width:120px;
            }
        }
        .formSelect{
            label{
                width:120px;
            }
        }
    }
}
</style>
