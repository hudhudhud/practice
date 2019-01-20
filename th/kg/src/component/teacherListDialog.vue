<template>
    <el-dialog title="修改上课老师" :visible.sync="show"  width="1000px" @closed="closed" class="teacher-dialog">
        <form>
            <formSelect  :option="{label:'上课老师',list:teachers,multiple:true,required:true}" :kv="{k:'realname',v:'userId'}" :model.sync="course.teacherIds"/>
            <div class="sub-btns">
                <el-button type="text" @click="handleCancelTeacher">取消</el-button>
                <el-button type="primary" @click="handleSubmitTeacher">确定</el-button>
            </div>
        </form>
    </el-dialog>
</template>

<script>
import cfg from '../config/config'
import services from '../services'
import formInput from './formInput.vue'
import formSelect from './formSelect.vue'
import formTextarea from './formTextarea.vue'
export default {
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        courseId:"",
        orgId:""
    },
    components: {
      formInput,
      formSelect,
      formTextarea,
    },
    data(){
        return {
            show:this.visible,
            teachers:[],
        }
    },
    watch:{
        visible(v){
            this.show=v
            if(this.show){
                this.outlineInit()
                this.getDetail()
            }
        }
    },
    created(){
        this.outlineInit()
    },
    methods:{
        closed(){
            this.show=false
            this.$emit('update:visible', this.show)
        },
        outlineInit(){
            this.outline={
                feature:"",
                achievements:"",
                improvement:["",],
                lines:[{content:"",section:"",aim:"",remark:""},],
            }
        },
        getDetail(){
            services.course_getoutline({id:this.courseId}) 
            .then((data) => {
                var res=data.data
                if(res.data){
                   this.outline.feature=res.data.feature
                   this.outline.achievements=res.data.achievements
                   this.outline.improvement=res.data.improvementList.length?res.data.improvementList:[""]
                   this.outline.lines=res.data.courseOutlineList.length?res.data.courseOutlineList:[{content:"",section:"",aim:"",remark:""}]
                }
                else{
                    this.outlineInit()
                }
            })
            .catch(function(error){
                console.log('error值：', error)
            })
        },
        handleSubmitOutline(){

            let params={}
            params.courseId=this.courseId
            params.feature=this.outline.feature
            params.achievements=this.outline.achievements
            params.improvementJsons=JSON.stringify(this.outline.improvement.filter(item=>item))
            params.outlineJsons=JSON.stringify(resLines)
            services.course_saveoutline(params) 
            .then((data) => {
                if(data.data.status==0){
                    this.closed()
                }
            })
            .catch(function(error){
                console.log('error值：', error)
            })
        },
        handleCancelOutline(){
            this.closed()
        },
        searchSchoolTeachers(){
            this.teachers = [];
            let params = {
            //orgId: self.orgId,
                orgType: 1,
                orgId:this.orgId
            };
            services.teacher_list(params)
            .then((res) => {
                let resData = res.data;
                if(resData.status == 0){
                    if(resData.data){
                      this.teachers = resData.data.list;
                    }
                }
            })
            .catch(function(error){
                console.log('error值：', error)
            })
        },
    }
}
</script>

<style lang="less" scoped>
.nlts{
    .item {
        &>*{
            display: inline-block;
        }
    }
}
.lines{
    table{
        display: inline-block;
    }
}
</style>
<style lang="less">
.lines{
    .formInput{
        .el-input{
            width:175px;
        }
    }
}
</style>
