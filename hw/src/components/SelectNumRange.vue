<template>
    <el-select
        :ref="selectRef"
        v-model="value"
        :placeholder="placeholder"
        @change="change"
        class="select-num-range"
        popper-class="select-pop"
        @click.native="focusOne=false;focusTwo=false"
        >
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <span>{{item.label}}</span>
        </el-option>
        <div :class="{active:focusOne||focusTwo,customer:true}" @mouseover="removeHover">
            <input type="text" placeholder="min" v-model="min" @keyup.enter="enterSearch"  @input="min=min.replace(/[^0-9-]+/,'')"  @click.stop="focusOne=true">-<input type="text" placeholder="max" v-model="max" @keyup.enter="enterSearch"  @input="max=max.replace(/[^0-9-]+/,'')"  @click.stop="focusOne=true">
            <p class="btns">
                <input type="button" value="重置" v-show="focusOne||focusTwo" @click="min='';max=''" class="reset"/>
                <input type="button" value="确定" v-show="focusOne||focusTwo" @click="enterSearch" />
            </p>
        </div>
    </el-select>
</template>
<script>
import {
  Select,
  Option
} from "element-ui";
export default {
    components:{
        elSelect:Select,
        elOption:Option,
    },
    props:{
        selectRef:String,
        placeholder:{
            type:String,
            default:"请选择"
        },
        options:Array,
        defaultNumRange:""
    },
    computed:{
        // model:function(){
        //     return (this.min?this.min:0)+(this.max?"-"+this.max:"+")
        // }
    },
    data:function(){
        return {
            min:"",
            max:"",
            minRes:"",
            maxRes:"",
            value:this.defaultNumRange,
            focusOne: false,
            focusTwo: false,
        }
    },
    watch:{
        defaultNumRange(newValue){
            this.value=newValue
        },
    },
    methods:{
        change(value){
            if(value!=-1){
                let vals=value.split('-')
                this.minRes=vals[0]?vals[0]:0
                this.maxRes=vals[1]?vals[1]:''
            }
            else{
                this.minRes=""
                this.maxRes=""
            }
            this.max=""
            this.min=""
            this.search()
        },
        enterSearch(){
            this.minRes=this.min?this.min:0
            this.maxRes=this.max

            this.value=(this.min?this.min:0)+(this.max?"-"+this.max:"+")
            this.$refs[this.selectRef].blur()
            this.search()
        },
        search(){
            if(this.value=="全部"){
                this.$emit('update:defaultNumRange', "全部")
                this.$emit("cb",{min:"",max:"",value:""})
            }
            else{  
                this.$emit('update:defaultNumRange',this.value) 
                this.$emit("cb",{min:this.minRes,max:this.maxRes,value:this.value})
            }
        },
        removeHover(e){
            var el=e.target.parentElement.parentElement.children
            if(el.length>0){
                Array.from(el).forEach(item=>{
                    if(item.classList.length>0&&item.classList.contains('hover')){
                        item.classList.remove('hover')
                    }
                })
            }
        }
    }
}
</script>

<style lang="less" >
.select-num-range{
    &.el-select{
        input{
            border:none;
            padding:0;
            padding-right:25px;
            box-sizing: border-box;
        }
    }
}
.select-pop{
    .el-scrollbar{
        width:130px;
        .customer{
            width:110px;
            margin:auto;
            padding:5px;
            box-sizing: border-box;
            text-align: center;
            .btns{
                margin-top:5px;
            }
            input[type=text]{
                width:44px;
                height: 24px;
                border:1px solid #e2e2e2;
                border-radius:4px;
                text-align: center;
            }
            &.active {
                box-shadow: 1px 1px 6px #aaa;
                xwidth: 200px;
                background-color: #fff;
            }
            input[type=button] {
                background-color: @mainColor;
                color: #fff;
                border: none;
                height: 24px;
                line-height: 1.6;
                width: 40px;
                border-radius: 4px;
                &.reset{
                    margin-right:5px;
                    color:@mainColor;
                    border:1px solid @mainColor;
                    background-color: #fff;
                }
            }
        }
        .el-select-dropdown__item{
            text-align:center;
        }
        .el-select-dropdown__item.selected{
            color:#fff;
            font-weight: 700;
            background-color: @mainColor;
        }
        .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
            color:#fff;
            background-color:@mainColor;
        }
    }
}

</style>