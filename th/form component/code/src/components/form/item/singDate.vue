<template>
    <el-form-item :label="itemData.label" >
        <el-date-picker
                v-model="formData[itemData.key]"
                :type="itemData.dateType"
                :placeholder="itemData.placeholder"
                :format="itemData.format"
                :value-format="itemData.valueFormat" v-if="isEdit">
        </el-date-picker>
        <label v-else>{{formData[itemData.key]}}</label>
    </el-form-item>
</template>

<script>
    export default {
        name: "singDate",
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

<style scoped>

</style>
