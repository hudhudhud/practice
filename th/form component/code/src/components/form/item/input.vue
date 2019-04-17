<template>
    <el-form-item :label="itemData.label" :prop="itemData.key">
        <el-input v-if="isEdit" v-model="formData[itemData.key]" :type="itemData.inputType" :placeholder="itemData.placeholder" :rows="itemData.rows" :disabled="itemData.disabled"></el-input>
        <label v-else for="">{{formData[itemData.key]?formData[itemData.key]:'无'}}</label>
    </el-form-item>
</template>

<script>
    export default {
        name: "elm-input",
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
       methods: {

       }
    }
</script>

<style scoped>

</style>
