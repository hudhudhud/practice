<template>
    <div :name="item.key" class="formTextarea">
       <label><span v-if="item.required" class="req">*</span>{{item.label}}</label> 
       <div class="el-textarea">
           <textarea  v-model="value" @focus="focus" :ref="item.key" :class="{'el-textarea__inner':true,error:emptyMsg}" :style="item.style" :maxlength="item.maxlength"></textarea>
           <span v-if="emptyMsg" class="errorMsg req">{{emptyMsg}}</span>
           <span v-if="lengthMsg" class="errorMsg req">{{lengthMsg}}</span>
       </div>
       
    </div>
</template>
<script>
export default {
    props:{
        item:{},
        model:""
    },
    data(){
        return{
            emptyMsg:"",
            value:this.model,
            events:{},
            lengthMsg:"",
        }
    },
    watch:{
        model(val){
            this.value=val
            this.lengthMsg=""
        }
    },
    mounted () {
        if(this.item.maxlength){
            this.$refs[this.item.key].addEventListener("input",this.checkLength)
        }
    },
    methods:{
        focus(){
            if(this.item.key&&!this.events[this.item.key]){
                this.$refs[this.item.key].addEventListener("blur",this.check)
                  this.events[this.item.key]=true
            }
        },
        check(){
            if(this.value)
                this.value=this.value.trim()
            if(this.item.required){
                if(!this.value){
                    this.emptyMsg=this.item.emptyMsg?this.item.emptyMsg:`${this.item.label}不能为空！`
                    //this.$refs[this.item.key].focus()
                    this.$emit('update:model', this.value)
                    return false
                }
                else{
                    this.emptyMsg=""
                }
            }
            if(this.item.minlength){
                if(this.value&&this.value.length<this.item.minlength){
                    this.emptyMsg=`至少输入${this.item.minlength}个字`
                    this.lengthMsg=''
                    this.$emit('update:model', this.value)
                    return false
                }
                else {
                    this.emptyMsg=''
                }
            }
            this.$emit('update:model', this.value)
            return true
        },
        checkLength(){
            if(this.item.maxlength&&this.value){
                this.lengthMsg=`还可以输入${this.item.maxlength-this.value.length}字`
                this.emptyMsg=''
            }
            else{
                this.lengthMsg=''
            }
        },
        getValue(){
             if(this.value)
                this.value=this.value.trim()
            return this.value
        }
    }
}
</script>
<style lang="less" scoped>
.formTextarea{
    padding:10px 0;
}
label{
    display: inline-block;
    width:80px;
    text-align: right;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.req{
    color:red;
}
.el-textarea {
    position:relative;
    display: inline-block;
    width: 250px;
    vertical-align: top;
    font-size: 14px;
    .el-textarea__inner {
        min-height: 35px;
        display: block;
        resize: vertical;
        padding: 5px 15px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        font-size: inherit;
        color: #606266;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        &.error{
            border-color:#f56c6c;
        }
    }
}
.errorMsg{
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
}
</style>

