<template >
   <div :class="selectClass">
        <el-select 
            v-model="selectZbIn"
            filterable
            remote
            reserve-keyword
            :placeholder="placeholder"
            :remote-method="searchZb"
            :loading="loading"
            :popper-class="popperClass"
            @change="change">
            <el-option
            v-for="item in autoList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
                <slot :item="item">
                    <!-- 回退的内容 -->
                {{item.label}}
                </slot>
              
            </el-option>
        </el-select>
   </div>

</template>
<script>
import myaxios from "../assets/js/myaxios";
import {
  Select,
  Option
} from "element-ui";
export default {
    components: {
        elSelect: Select,
        elOption: Option,
    },
    props:{
        popperClass:String,
        placeholder:"",
        forPk:{
            type:Boolean,
            default:false,
        },
        selectClass:{
            type:String,
            default:"SelectZb"
        }
    },
    data(){
        return {
            selectZbIn: "",
            loading: false,
            autoList: [],
        }
    },
    methods:{
        searchZb(query) {
            if (query !== "") {
                this.loading = true;
                var option={"name":query}
                if(this.forPk)option["flag"]=1
                myaxios.post("/web/queryAnchor",option).then(res=>{
                        var res=res.data.data.List
                        this.loading = false;
                        this.autoList = res;
                })
            } else {
                this.autoList = [];
            }
        },
        change(){
            this.$emit("cb",{id:this.selectZbIn})
        }
    }
}
</script>
<style lang="less" scoped>

</style>
<style lang="less">
.SelectZb{
    display: inline-block;
}
.auto-search-list {
    li.el-select-dropdown__item {
        padding: 0 10px;
        margin-top: 10px;
        xtransition: background-color 0.01s linear;
        .auto-type {
            background-color:@mainColor;
            border-radius: 20%;
            padding: 0px 8px;
        }
        &.highlighted,
        &:hover {
            background-color: @mainColor !important;
            color:#fff !important;
            a{
                background-color: @mainColor !important;
                color:#fff !important;
            }
        }
        .zbtx{
            img{
                width:20px;
                height: 20px;;
            } 
        }
    }
    li.el-select-dropdown__item.hover, li.el-select-dropdown__item:hover{
        background-color: @mainColor;
        color:#fff;
        a{
            background-color: @mainColor;
            color:#fff;
        }
    }
}
</style>

