<template>
        <div :name="option.key" class="formSelectOrg">
            <label v-if="option.label" class="tit"><span v-if="option.required" class="req">*</span>{{option.label}}</label><div class="select">
                <el-select v-model="value"  
                    filterable
                    remote 
                    :clearable='option.clearable'
                    :placeholder="option.placeholder?option.placeholder:'请输入关键词'"
                    :remote-method="remoteMethod"
                    @change="change" 
                    :multiple="option.multiple"
                    :disabled='option.disabled'>
                        <el-option v-for="item in list" :key="item.orgId" :label="item.name" :value="item.orgId">
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
        model:"",
        changeCb:Function,
        modelText:""
    },
    data(){
        return {
            value:this.model,
            emptyMsg:"",
            list:[]
        }
    },
    watch:{
        model(val){
           this.value=val
           if(!this.value){//没有值的时候重新获取数据源
               this.remoteMethod()
           }
        },
        // value(val){
        //     this.$emit('update:model', val)
        // },
        modelText(val){
            if(val){
                this.remoteMethod(val)
            }
        }
    },
    created(){
      this.remoteMethod()
    },
    methods:{
        check(){
            if(this.option.required){
                if(!this.value){
                    this.emptyMsg=this.option.emptyMsg?this.option.emptyMsg:`${this.option.label}不能为空！`
                    return false
                }
                else{
                    this.emptyMsg=""
                }
            }
            return true
        },
        change(val){
            this.$emit('update:model', val)
            if(this.changeCb && typeof this.changeCb == 'function'){
                this.changeCb()
            }
        },
        remoteMethod(val){
            let orgId = JSON.parse(localStorage.getItem("info")).orgId;
            let orgType = JSON.parse(localStorage.getItem("info")).orgType;
            let params={}
            if(orgType=='edu_bureau'){//教育局需要加参数
                params={belongId:orgId}
            }
            params={...params,name:val,from:'search'}
            if(this.option.params){
                Object.assign(params,this.option.params)
            }
            services.mechanism_list(params).then((res) => {
                this.list = res.data.data.list;
            })
        }
    }
}
</script>

<style lang="less" scoped>
.formSelectOrg{
    padding:10px 0;
    display: inline-block;
    .el-select{
        width:200px;
    }
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
.formSelectOrg{
    .el-select.error{
        .el-input .el-input__inner{
            border-color:#f56c6c;
        }
    }
}
</style>
