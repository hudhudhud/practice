<template>
    <section class="select-in" >
        <div v-if="show" class="hidePanel" @click="show=false"></div>
        <div :style="show?'z-index:9999':''">
            <div class="show-btn" @click="show=!show">
                <input type="button" :placeholder="placeholder" :value="value"  :class="{active:show,'show-input':true}"/>
                <i :class="{'is-reverse':show,'el-select__caret':true,'el-input__icon':true,'el-icon-arrow-down':true}"></i>
                <!--<i class="fa fa-chevron-circle-down" aria-hidden="true" v-if="!show"></i>-->
                <!--<i class="fa fa-chevron-circle-up" aria-hidden="true" v-else></i>-->
            </div>
            <div :class="{show:show,'drop-down':true}">
                <el-input type="text" :placeholder="inPlaceholder"   v-model="queryStr" @input="search"  class="search-input"></el-input>
                <ul class="list">
                    <li  :class="{active:activeItem==i,item:true}" v-if="item"  v-for="(item,i) in bindOptions" :value="item[optionKey.value]" :key="i"  @click="activeItem=i;search(i)">{{item[optionKey.label]}}</li>
                </ul>
            </div>
        </div>
    </section>
</template>
<script>
import {
  Input
} from "element-ui";
export default {
    components:{
        elInput:Input,
    },
    props:{
        placeholder:String,
        inPlaceholder:String,
        options:Array,
        optionKey:{
            type:Object,
            default:function(){
                return {label:"label",value:"value"}
            }
        },
        defaultValue:""
    },
    data:function(){
        return {
            queryStr:"",
            value:this.defaultValue?this.defaultValue:"请选择",
            show:false,
            activeItem:-1,
        }
    },
    watch:{
        defaultValue(newValue){
            this.value=newValue?newValue:"请选择"
        }
    },
    computed:{
        bindOptions(){
            if(this.queryStr){
                return this.options.filter(item=>{
                    return item&&item[this.optionKey.label].toLocaleLowerCase().indexOf(this.queryStr.toLocaleLowerCase())>-1
                })
            }
            else {
                return this.options
            }
        }
    },
    methods:{
        change(value){
            this.search()
        }, 
        search(i){
            if(typeof i == "number"){
                 this.value=this.bindOptions[i][this.optionKey.label]
                 this.show=false
                 
                 var cbValue=this.bindOptions[i][this.optionKey.value]
                 if(cbValue=="全部")cbValue=""
                 this.$emit('update:defaultValue', cbValue?cbValue:"全部")
                 this.$emit("cb",{value:cbValue})
            }
        }
    }
}
</script>
<style lang="less" scoped>
.select-in{
     display: inline-block;
     width:200px;
     height:40px;
     box-sizing: border-box;
      position:relative;
     .show-btn{
         width: 100px;
        position:relative;
        cursor: pointer;
        .show-input{
            width:90px;
            border:none;
            cursor: pointer;
            background-color: transparent;
            vertical-align: bottom;
            padding:0;
            color: #c0c4cc;
            &.active{
                position:relative;
                z-index: 9999
            }
        }
        i{
            cursor: pointer;
            position:absolute;
            right:0;
            top:-5px;
            /*7px的为有大箭头的样式,然后放开下面的宽高*/
            /*top:7px;*/
            transition: all .2s linear;
            color: #c0c4cc;
            &.is-reverse{
                transform: rotate(-180deg);
            }
            &.el-input__icon{
                height: 40px;
                /*width:16px;*/
            }
        }
     }
    .drop-down{
        user-select: none;
        height: 0;
        opacity: 0;
        transition: all .1s linear;
        overflow: hidden;
        &.show{
            opacity: 1;
            height: 200px;
        }
        position:absolute;
        top:40px;
        left:0;
        box-sizing: border-box;
        width:130px;
        background-color: #fff;
        text-align:center;
        border: 1px solid #e4e7ed;
        border-radius: 2px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        z-index: 99999;
        .search-input{
            margin:10px 0;
            width:90%;
        }
        .list{
            height: 150px;
            width:100%;
            overflow-y: scroll;
            text-align: left;
            li{
                padding:10px;
                line-height: 15px;
                font-size: 14px;
                box-sizing: border-box;
                text-align: center;
                &.item{
                    cursor: pointer;
                    xtransition: background-color .1s linear; 
                    &:hover{
                        background-color:@mainColor;
                        color:#fff;                        
                    }
                    &.active{
                        background-color:@mainColor;
                        color:#fff;                        
                    }
                }
            }
        }
       
        
    }
}
</style>

<style lang="less">
 
</style>