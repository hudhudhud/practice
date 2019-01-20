<template>
    <div :name="option.key" class="formSelect">
       <label v-if="option.label" class="tit"><span v-if="option.required" class="req">*</span>{{option.label}}</label> 
       <div class="select">
            <el-select v-model="value" filterable :placeholder="option.placeholder?option.placeholder:'请选择'" @change="change" 
            :class="{error:emptyMsg}"
            :disabled="option.disabled"
            :multiple="option.multiple" clearable>
                    <el-option v-for="item in option.list" :key="item.value" :label="item[kv.k]" :value="item[kv.v]">
                    </el-option>
            </el-select>
            <span v-if="emptyMsg" class="errorMsg req">{{emptyMsg}}</span>
       </div>
      
    </div>
</template>
<script>
export default {
    props:{
        option:{},
        kv:{
            type:Object,
            default(){
                return {
                    k:"label",
                    v:"value",
                }
            }
        },
        model:""
    },
    data(){
        return{
            emptyMsg:"",
            value:this.model
        }
    },
    watch:{
        model(val){
           this.value=val
        }
    },
    methods:{
        check(){
            if(this.option.required){
                if(!this.value||(Array.isArray(this.value)&&!this.value.length)){
                    this.emptyMsg=this.option.emptyMsg?this.option.emptyMsg:`${this.option.label}不能为空！`
                    return false
                }
                else{
                    this.emptyMsg=""
                }
            }
            return true
        },
        getValue(){
            return this.value
        },
        change(val){
            this.$emit('update:model', val)
            if(val){
                this.emptyMsg=""
            }
        }
    }
}
</script>
<style lang="less" scoped>
.formSelect{
    padding:10px 0;
    .select{
        position:relative;
        display: inline-block;
    }
    
}
label{
    display: inline-block;
    width:80px;
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.req{
    color:red;
}
.el-input{
    display: inline;
    .el-input__inner{
        width:118px;
    }
}
.errorMsg {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
}
</style>
<style lang="less">
.formSelect{
    .el-select.error{
        .el-input .el-input__inner{
            border-color:#f56c6c;
        }
    }
}
</style>


