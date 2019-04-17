<template>
    <el-form-item :label="itemData.label" :prop="itemData.key">
        <el-radio-group v-model="formData[itemData.key]" v-if="isEdit">
            <el-radio :label="item.value"
                      v-for="(item,index) in itemData.options" :key="index">{{item.label}}</el-radio>
        </el-radio-group>
        <span v-else>{{itemData.options.find(item=>item.value===formData[itemData.key]).label}}</span>
    </el-form-item>
</template>

<script>
    export default {
        name: "radio",
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
    }
</script>

