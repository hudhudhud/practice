<!-- 品种选择 -->
<!-- @handelChoose = '' -->

<template>
    <div style="display:inline;">
        <el-select
            style='width:118px;'
            name='columnone'
            clearable
            filterable
            placeholder="一级品种"
            v-model="detail.columnone"
            @change="columnOneChange">
            <el-option
                v-for="(item,index) in options.columnones"
                :key="index"
                :label="item.termName"
                :value="item.id">
            </el-option>
        </el-select>
        <el-select
            style='width:118px;'
            name='columntwo'
            clearable
            filterable
            placeholder="二级品种"
            v-model="detail.columntwo"
            @change="columnTwoChange">
            <el-option
                v-for="(item,index) in options.columntwos"
                :key="index"
                :label="item.termName"
                :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    import qs from 'qs'
    import axios from 'axios'
    import cfg from '../config/config'
    import common from '../assets/js/common'

    export default {
        name: 'coursecolumn',
        props:{
            model:Array,
        },
        // 深度 watcher
        watch:{
           model:{
                handler(newValue){
                    if(newValue&&newValue.length){
                        if(newValue.length==1){
                            this.detail.columnone=newValue[0]
                        }
                        else{
                            this.detail.columnone=newValue[0]
                            common.getmsg(this, 'getColumnTwos', this.api.columntwos, {parentId: this.detail.columnone, queryAll: true});
                            this.detail.columntwo=newValue[1]
                        }
                    }
                    else{
                        this.detail.columnone=""
                        this.detail.columntwo=""
                    }
                },
                deep:true,
            },
        },
        data() {
            return {
                api: {
                    columnones: "courseColumn/listFirst",
                    columntwos: "courseColumn/listSecond"
                },
                options: {
                    columnones: [],
                    columntwos: [],
                },
                detail:{
                    columnone: "",
                    columntwo: ""
                }
            }
        },
        created(){
            common.getmsg(this, 'getColumnOnes', this.api.columnones, {queryAll: true});
        },
        methods: {
            getColumnOnes: function(msg){
                this.options.columnones = msg.list;
            },
            getColumnTwos: function(msg){
                this.options.columntwos = msg.list;
            },
            columnOneChange: function(){      //获取二级品种列表
                this.detail.columntwo = '';
                common.getmsg(this, 'getColumnTwos', this.api.columntwos, {parentId: this.detail.columnone, queryAll: true});
                this.$emit('handelChoose', this.detail);
            },
            columnTwoChange: function(){
                this.$emit('handelChoose', this.detail);
            }
        }
    }
</script>
<style lang="css" scoped>
   .color_list{width:93%;overflow: hidden;}
   .newTag{width: 40%}
   .checkbox{min-width: 22.5%;float: left;margin-left: 15px;}
</style>