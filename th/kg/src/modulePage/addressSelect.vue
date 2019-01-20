<!-- 地址选择 -->
<!-- @handelChoose = ''
addOptions: {
    size: 'small',
    address: [1,2,3]
} -->
<template>
    <div :class="{addressSelect:true,req:item&&item.required}">
        <label v-if='item&&item.required' class="required">{{item.label}}</label>
        <div class="select">
            <el-select
                style='width:100px;'
                name='province'
                :disabled="disabled"
                clearable
                filterable
                placeholder="选择省"
                v-model="detail.province"
                @change="proChange">
                <el-option
                    v-for="(item,index) in options.province"
                    :key="index"
                    :label="item.provinceName"
                    :value="item.provinceId">
                </el-option>
            </el-select>
            <el-select
                style='width:100px;'
                name='city'
                :disabled="disabled"
                clearable
                filterable
                placeholder="选择市"
                v-model="detail.city"
                @change="cityChange">
                <el-option
                    v-for="(item,index) in options.city"
                    :key="index"
                    :label="item.cityName"
                    :value="item.cityId">
                </el-option>
            </el-select>
            <el-select
                style='width:100px;'
                name='countyHide'
                :disabled="disabled"
                clearable
                filterable
                placeholder="选择区"
                v-model="detail.county"
                @change="countyChange">
                <el-option
                    v-for="(item,index) in options.county"
                    :key="index"
                    :label="item.countyName"
                    :value="item.countyId">
                </el-option>
            </el-select>
            <span v-if="emptyMsg" class="errorMsg req">{{emptyMsg}}</span> 
        </div>
    </div>
</template>
<script>
    import qs from 'qs'
    import axios from 'axios'
    import cfg from '../config/config'
    import common from '../assets/js/common'

    export default {
        data() {
            return {
                api: {
                    province: "zone/listProvince",
                    cities: "zone/listCities",
                    counties: "zone/listCounties"
                },
                options: {
                    province: [],
                    city: [],
                    county: [],
                },
                detail:{
                    province: "",
                    city: "",
                    county: "",
                },
                countyHide: false,
                emptyMsg:"",
            }
        },
        props:{
            addOptions:Object,
            disabled:{
                type:Boolean,
                default:false
            },
            item:Object,
            province:[Number,String],
            city:[Number,String],
            county:[Number,String],
        },
        watch:{
            addOptions:{
                handler(newValue){
                    if(newValue && newValue.address){
                        let len = newValue.address.length;
                        if(len == 0){
                            this.detail={province: "",city: "",county: "",}
                            return;
                        }
                        this.detail.province = newValue.address[0]==0?"":newValue.address[0];
                        common.getmsg(this, 'getCitys', this.api.cities, {provinceId: this.detail.province});
                        if(len == 1){
                            return;
                        }
                        this.detail.city = newValue.address[1]==0?"":newValue.address[1];
                        common.getmsg(this, 'getCounty', this.api.counties, {cityId: this.detail.city});
                        if(len == 2){
                            return;
                        }
                        this.detail.county = newValue.address[2]==0?"":newValue.address[2];
                    }
                    else{
                        this.detail={province: "",city: "",county: "",}
                    }
                },
                deep:true,
                immediate: true
            },
            province(val){
                this.detail.province=val
                common.getmsg(this, 'getCitys', this.api.cities, {provinceId: this.detail.province});
            },
            city(val){
                this.detail.city=val
                common.getmsg(this, 'getCounty', this.api.counties, {cityId: this.detail.city});
            },
            county(val){
                this.detail.county=val
            },
        },
        created(){
            common.getmsg(this, 'getProvince', this.api.province);
        },
        methods: {
            getProvince: function(msg){
                this.options.province = msg;
            },
            getCitys: function(msg){
                this.options.city = msg;
            },
            getCounty: function(msg){
                if(msg.length != 0){
                    this.options.county = msg;
                }else{
                    this.options.county = [];
                    this.$emit('handelChoose', this.detail);
                }
            },
            proChange: function(val){      //获取city列表
                this.detail.city = '';
                this.detail.county = '';
                common.getmsg(this, 'getCitys', this.api.cities, {provinceId: this.detail.province});
                this.$emit('handelChoose', this.detail);
                this.$emit('update:province', val)
            },
            cityChange: function(val){     //获取county列表
                this.detail.county = '';
                common.getmsg(this, 'getCounty', this.api.counties, {cityId: this.detail.city});
                this.$emit('handelChoose', this.detail);
                this.$emit('update:city', val)
            },
            countyChange: function(val){
                this.$emit('handelChoose', this.detail);
                this.$emit('update:county', val)
            },
            check(){
                if(this.item.required){
                    if(!this.detail.city&&!this.detail.county&&!this.detail.province){
                        this.emptyMsg=this.item.emptyMsg?this.item.emptyMsg:`${this.item.label}不能为空！`
                        return false
                    }
                    else{
                        this.emptyMsg=""
                    }
                }
                return true
            },
        }
    }
</script>
<style lang="less" scoped>
   .color_list{width:93%;overflow: hidden;}
   .newTag{width: 40%}
   .checkbox{min-width: 22.5%;float: left;margin-left: 15px;}
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
    .addressSelect{
        display: inline-block;
        .select{
            position:relative;
            display: inline-block;
        }
        &.req{
            margin-bottom:22px;
            display: block
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