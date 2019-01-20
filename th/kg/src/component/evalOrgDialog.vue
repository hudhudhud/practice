<template>
    <el-dialog :visible.sync="show" :title="!eval.id?'添加评价':'修改评价'"  width="50%"  class="evalDialog"  @closed="closed"> 
        <form>
            <formInput :item='{label:"点评对象",key:"orgName",required:true,disabled:true,style:"width:250px"}' ref='orgId'  :model.sync='eval.orgName'/>
            <formInput v-if='eval.id' :item='{label:"点评时间",key:"createdAt",required:true,disabled:true,style:"width:250px"}' ref='createdAt' :model.sync='eval.createdAt'/>
            <div class="form-line">
                <label class="form-label" >打分</label>
                <el-radio-group v-model="eval.commentStar">
                    <el-radio  :label="1">1</el-radio>
                    <el-radio  :label="2">2</el-radio>
                    <el-radio  :label="3">3</el-radio>
                    <el-radio  :label="4">4</el-radio>
                    <el-radio  :label="5">5</el-radio>
                </el-radio-group>
            </div>
            <formTextarea  :item='{label:"评价内容",required:true,key:"content",maxlength:50,minlength:15}' ref='content' :model.sync='eval.content'/>
            <div class="sub-btns-left">
                <el-button type="text" @click="handleCancelEval">取消</el-button>
                <el-button type="primary" @click="handleSubmitEval">确定</el-button>
            </div>
        </form>
    </el-dialog>
</template>

<script>
import services from '../services'
import formInput from './formInput.vue'
import formTextarea from './formTextarea.vue'
export default {
    components:{
      formInput,
      formTextarea
    },
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        option:Object,
        cb:Function,
    },
    watch:{
        visible(v){
            this.show=v
        },
        show(v){
            if(v){
                services.comment_detailOrgComment(this.option)
                .then(res=>{
                    res=res.data.data
                    if(res){
                        Object.keys(this.eval).forEach(key=>{
                            this.eval[key]=res[key]
                        })
                    }
                    this.eval.orgId=this.option.orgId
                    this.eval.orgName=this.option.orgName
                })
            }
            this.$emit('update:visible', v)
        }
    },
    created(){
        this.evalInit()
    },
    data(){
        return{
            show:this.visible,
            eval:{}
        }
    },
    methods:{
        closed(){
            this.show=false
            this.evalInit()
        },
        evalInit(){
          this.eval={
            id:'',
            orgId:'',
            orgName:'',
            orgType:'',
            commentStar:0,
            content:'',
            createdAt:''
          }
        },
        handleSubmitEval(){
            let complete = Object.keys(this.eval).every(key=>{
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
            let params=JSON.parse(JSON.stringify(this.eval))
            services.comment_saveOrgComment(params)
            .then(res=>{
                if(res.data.status==0){
                    this.show=false
                    if(typeof this.cb == 'function'){
                        this.cb()
                    }
                }
            })
        },
        handleCancelEval(){
            this.show=false
        }
    }
}
</script>

