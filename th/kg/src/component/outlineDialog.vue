<template>
    <el-dialog title="" :visible.sync="show"  width="1000px" @closed="closed" class="outline-dialog">
        <form>
            <h3>修改大纲</h3>
            <div class="nlts">
                <div v-for="(item,i) in outline.improvement" :key="i" class="item">
                    <formInput  :item="{label:'能力提升',key:'improvement_0',style:'width:100px',required:true}" :model.sync="outline.improvement[i]"  v-if="i==0"/> 
                    <formInput  :item="{label:' ',key:'improvement_'+i,style:'width:100px',emptyMsg:'能力提升'}" :model.sync="outline.improvement[i]" :ref="'improvement_'+i"  v-if="i>0"/> 
                    <a  @click="outline.improvement.push('')" v-if="i==0">添加</a>
                    <a  @click="outline.improvement.splice(i,1)" v-if="i>0">删除</a>
                </div>
            </div>
            <formTextarea  :item="{key:'achievements',label:'教学成果',}" :model.sync="outline.achievements" ref="achievements"/>
            <div class="form-line lines">
                <label class="form-label" style="vertical-align: top;">详细内容</label>
                <table>
                    <tr><th>内容</th><th>课时</th><th>教学目标</th><th>备注</th></tr>
                    <tr v-for="(item,i) in outline.lines" :key="i">
                        <td><formInput  :item="{key:'content_'+i,placeholder:'内容'}" :model.sync="outline.lines[i].content" /></td>
                        <td><formInput  :item="{key:'section_'+i,placeholder:'课时'}" :model.sync="outline.lines[i].section" /></td>
                        <td><formInput  :item="{key:'aim_'+i,placeholder:'教学目标'}" :model.sync="outline.lines[i].aim" /></td>
                        <td><formInput  :item="{key:'remark_'+i,placeholder:'备注'}" :model.sync="outline.lines[i].remark" /></td>
                        <td v-if="i>0"><a  @click="outline.lines.splice(i,1)" >删除</a></td>
                        <td v-if="i==0"><a  @click='outline.lines.push({content:"",section:"",aim:"",remark:""})' >添加</a></td>
                    </tr>
                </table>
            </div>
            <hr>
            <h3>课程介绍</h3>
            <formTextarea  :item="{key:'feature',label:'课程特点'}" :model.sync="outline.feature" ref="feature"/>
            <formTextarea :item="{key:'goal',label:'课程目标',}"  :model.sync="outline.goal" ref="goal"/>
            <formTextarea :item="{key:'promotion',label:'课程提升'}" :model.sync="outline.promotion" ref="promotion"/>
            <div class="sub-btns">
                <el-button type="text" @click="handleCancelOutline">取消</el-button>
                <el-button type="primary" @click="handleSubmitOutline">确定</el-button>
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
    },
    components: {
      formInput,
      formSelect,
      formTextarea,
    },
    data(){
        return {
            show:this.visible,
            outline:{},
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
                goal:"",
                promotion:"",
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
                   Object.keys(this.outline).forEach(key=>{
                       this.outline[key]=res.data[key]
                   })
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
            let complete=true
            complete = Object.keys(this.outline).every(key=>{
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
            
            //能力提升至少一条
            if(this.outline.improvement.every(item=>!item)){
                this.$message({
                    type: 'warning',
                    message: '至少填写一条能力提升'
                });
                return
            }
            //大纲内容信息至少一条
            let resLines=this.outline.lines.filter(item=>!(!item.content&&!item.section&&!item.aim&&!item.remark))
            if(resLines.length==0){
                this.$message({
                    type: 'warning',
                    message: '至少填写一条大纲内容信息'
                });
                return
            }

            let params={}
            params.courseId=this.courseId
            params.feature=this.outline.feature
            params.achievements=this.outline.achievements
            params.goal=this.outline.goal
            params.promotion=this.outline.promotion
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
.outline-dialog{
    .lines{
        .formInput{
            .el-input{
                width:175px;
            }
        }
    }
    .formTextarea{
        .el-textarea{
            width:400px;
            .el-textarea__inner{
                height: 100px;
            }
        }
        
    }
}

</style>
