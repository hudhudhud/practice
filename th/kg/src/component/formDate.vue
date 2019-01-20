<template>
    <div :name="option.key" class="formDate">
       <label v-if="option.label" class="tit"><span v-if="option.required" class="req">*</span>{{option.label}}</label> 
       <div class="select" v-if="option.type!='range'">
            <el-date-picker v-model="value" :type="option.datetime?'datetime':'date'" :placeholder="option.placeholder?option.placeholder:'选择日期'"
            @change="change" ></el-date-picker>
            <span v-if="emptyMsg" class="errorMsg req">{{emptyMsg}}</span>
       </div>
       <div class="select" v-else>
            <!-- <el-date-picker
               @change="change"
                v-model="value"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker> -->
            <el-date-picker v-model="start" :type="option.datetime?'datetime':'date'"  placeholder="选择日期" @change="changeStart">
            </el-date-picker>
            ~
            <el-date-picker v-model="end" :type="option.datetime?'datetime':'date'" placeholder="选择日期" @change="changeEnd">
            </el-date-picker>
            <span v-if="emptyMsg" class="errorMsg req">{{emptyMsg}}</span>
       </div>
    </div>
</template>
<script>
export default {
    props:{
        option:{},
        model:"",
        startDate:"",
        endDate:""
    },
    data(){
        return{
            emptyMsg:"",
            value:this.model,
            start:this.startDate,
            end:this.endDate
        }
    },
    watch:{
        model(val){
          this.value=val
        },
        startDate(val){
            this.start=val
        },
        endDate(val){
            this.end=val
        }
    },
    methods:{
        check(){
            if(this.option.required){
                if((this.option.type!='range'&&!this.value)||(this.option.type=='range'&&(!this.start||!this.end))){
                    this.emptyMsg=this.option.emptyMsg?this.option.emptyMsg:`${this.option.label}不能为空！`
                    return false
                }
                else{
                    this.emptyMsg=""
                }

                if(this.option.type=='range'&&this.end<this.start){
                    this.emptyMsg='开始时间不能大于结束时间'
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
            if(val){
                this.emptyMsg=""
            }
        },
        changeStart(val){
            this.$emit('update:startDate', val)
            if(this.start&&this.end){
                this.emptyMsg=""
            }
        },
        changeEnd(val){
            this.$emit('update:endDate', val)
            if(this.start&&this.end){
                this.emptyMsg=""
            }
        }
    }
}
</script>
<style lang="less" scoped>
.formDate{
    padding:10px 0;
    .select{
        position:relative;
        display: inline-block;
    }
    
}
label{
    display: inline-block;
    width:120px;
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
.formDate{
    .el-date-editor{
        .el-input--prefix .el-input__inner{
            border-color:#f56c6c;
        }
    }
}
</style>


