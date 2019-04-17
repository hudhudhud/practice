<template>
    <el-form-item :label="itemData.label">
        <el-switch v-model="formData[itemData.key]"
                   :active-value="itemData.trueValue"
                   :inactive-value="itemData.falseValue" v-if="isEdit"></el-switch>
        <label v-else>{{formData[itemData.key]===itemData.trueValue?'是':'否'}}</label>
    </el-form-item>
</template>

<script>
    export default {
        name: "sSwitch",
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
