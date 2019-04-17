<template>
    <el-form-item :label="itemData.label" :prop="itemData.key">
        <div v-if="isEdit">
            <el-checkbox-group v-model="formData[itemData.key]" :max="itemData.max" :min="itemData.min" v-if="!itemData.one">
                <el-checkbox :label="item" v-for="item in itemData.options" :key="item"></el-checkbox>
            </el-checkbox-group>
            <el-checkbox v-model="formData[itemData.key]" v-else @change="change">{{itemData.name}}</el-checkbox>
        </div>
        <div v-else>
            <span>{{typeof formData[itemData.key] !=='object' ?formData[itemData.key]:formData[itemData.key].join(',')}}</span>
        </div>
    </el-form-item>
</template>

<script>
    // 未完成
    export default {
        name: "elm-checkbox",
        props: {
            itemData: {
                type: Object
            },
            formData: {
                type: Object
            },
            isEdit:{
                type:Boolean,
                default:true
            }
        },
        methods:{
            change(val){
                if(this.itemData.cb&&typeof this.itemData.cb==='function'){
                    this.itemData.cb(val)
                }
            }
        }
    }
</script>

<style scoped>

</style>
