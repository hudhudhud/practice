<template>
    <div :name="item.key" class="formInput" >
       <label :style="`${item.label?'':'display:inline'}`" v-if="item.label"><span v-if="item.required" class="red">*</span>{{item.label}}</label> 
       <div class="el-input" :style="item.style">
            <input type="text" v-model="value"  @focus="focus" :ref="item.key" :class="{'el-input__inner':true,disabled:item.disabled,error:emptyMsg||errorMsg}" 
                :placeholder="item.placeholder" :disabled="item.disabled"  v-if="item.type!='password'"
                :readonly="item.readonly"
            />
            <input type="password" v-model="value"  @focus="focus" :ref="item.key" :class="{'el-input__inner':true,disabled:item.disabled,error:emptyMsg||errorMsg}" 
                :placeholder="item.placeholder" :disabled="item.disabled"  v-if="item.type=='password'"
                :readonly="item.readonly"
            />
            <i class="fa fa-times-circle close" aria-hidden="true" @click="clearValue" title="删除" v-if="item.clearable&&value"></i>
            <p v-if="emptyMsg" class="errorMsg">{{emptyMsg}}</p>
            <p v-if="errorMsg" class="errorMsg">{{errorMsg}}</p>
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
            value:this.model,
            emptyMsg:"",
            errorMsg:"",
            events:{},
        }
    },
    watch:{
        model(val){
            this.value=val
        }
    },
    mounted(){
        if(this.item.type=="number"&&this.item.key){
            this.$refs[this.item.key].addEventListener("input",this.checkNumber)
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
            if(this.value&&typeof this.value=='string')
                this.value=this.value.trim()
            if(this.item.required){
                if(!this.value){
                    this.emptyMsg=this.item.emptyMsg?this.item.emptyMsg:`${this.item.label}不能为空！`
                    this.$emit('update:model', this.value)
                    return false
                    //this.$refs[this.item.key].focus()
                }
                else{
                    this.emptyMsg=""
                }
            }
            if(this.item.type=="decimal"&&this.value){
               if(!this.checkDecimal.bind(this)()) {
                  this.errorMsg="请输入数字！"
                  this.$emit('update:model', this.value)
                  return false
               }
               else{
                   this.errorMsg=""
               }                        
            }
            if(this.item.type=="phone"&&this.value){
                if(!this.checkPhone.bind(this)()) {
                    this.errorMsg="手机号格式输入有误！"
                    this.$emit('update:model', this.value)
                    return false
                }
                else{
                    this.errorMsg=""
                }         
            }
            if(this.item.rule){
                let reg=new RegExp(this.item.rule) //传入的字符串需要是转义之后的，或String.raw ``
                let res=reg.test(this.value)
                if(!res){
                    this.errorMsg=this.item.errorMsg
                    this.$emit('update:model', this.value)
                    return false
                }
                else{
                    this.errorMsg=""
                }
            }
            //必须设key值才会更新数据给父组件！
            this.$emit('update:model', this.value)
            return true
        },
        checkNumber(){
            this.value=this.value.replace(/[^0-9-]+/,'').trim()
        },
        checkDecimal(){
            if(this.value&&typeof this.value=='string')
                this.value=this.value.trim()
            return /^([1-9]\d*|0)(\.\d+)?$/.test(this.value)
        },
        checkPhone(){
            if(this.value&&typeof this.value=='string')
                this.value=this.value.trim()
            return /^1(3|4|5|7|8|9)\d{9}$/.test(this.value)
        },
        getValue(){
             if(this.value&&typeof this.value=='string')
                this.value=this.value.trim()
            return this.value
        },
        resetMsg(){
            this.errorMsg=""
            this.emptyMsg=""
        },
        clearValue(){
            this.value=''
            this.$emit('update:model', this.value)
        }
    }
}
</script>
<style lang="less" scoped>
.formInput{
    padding:10px 0;
    &:hover{
        .close{
            opacity: 1;
        }
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
.el-input{
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 118px;
    min-width: 118px;
    .el-input__inner{
        width:100%;
    }
    .error{
        border-color:#f56c6c;
    }
}
.red{
    color:red;
}
.disabled{
    background-color: #f5f7fa
}
.errorMsg{
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
    white-space: nowrap;
}
.close{
    position:absolute;
    top:12.5px;
    right:5px;
    cursor: pointer;
    font-size:15px;
    opacity: 0;
    transition: opacity .2s linear;
    color:gray;
}
</style>

