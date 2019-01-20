<template>
    <div :name="option.key" class="formSelect">
       <label v-if="option.label" class="tit"><span v-if="option.required" class="req">*</span>{{option.label}}</label> 
       <div class="select">
            <el-select v-model="value"  
                filterable
                remote 
                clearable
                :placeholder="option.placeholder?option.placeholder:'请输入关键词'"
                :remote-method="remoteMethod"
                @change="change" 
                :class="{error:emptyMsg}"
            :multiple="option.multiple">
                    <el-option v-for="item in list" :key="item.value" :label="item[kv.k]" :value="item[kv.v]">
                    </el-option>
            </el-select>
            <span v-if="emptyMsg" class="errorMsg req">{{emptyMsg}}</span>
       </div>
    </div>
</template>
<script>
import cfg from '../config/config'
import services from '../services'
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
        model:"",
        modelText:"",
        remote:{
            type:Object,
            default(){
                return {
                    func:"",
                    params:{}
                }
            }
        },
        changeCb:Function
    },
    data(){
        return{
            emptyMsg:"",
            value:this.model,
            list:[]
        }
    },
    watch:{
        model(val){
           this.value=val
           if(!this.value){
               this.remoteMethod()
           }
        },
        modelText(val){
            if(val)
                this.remoteMethod(val)
        }
    },
    created(){
        this.remoteMethod()
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
            this.value=val
            this.$emit('update:model', this.value)
            if(this.changeCb && typeof this.changeCb == 'function'){
                this.changeCb()
            }
            if(val){
                this.emptyMsg=""
            }
        },
        remoteMethod(val){
            let serviceMethod=services[this.remote.func]
            if(serviceMethod&&typeof serviceMethod=="function"){
                let prams={...this.remote.params,from:'search'}
                if(this.remote.key){
                    prams[this.remote.key]=val
                }
                else{
                     prams['name']=val
                }
                serviceMethod(prams).then((res) => {
                    this.list = res.data.data.list;
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.formSelect{
    padding:5px 0;
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

