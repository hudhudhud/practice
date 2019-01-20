<template>
    <el-menu
            :default-openeds="['1']"
            :default-active="indexPath"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            :router="true"
            @close="handleClose">
        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
            </template>
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/demo/ElmTable">表格</el-menu-item>
            <el-menu-item index="/demo/ElmForm">表单</el-menu-item>
            <el-menu-item index="/demo/ElmAlertForm">弹出表单</el-menu-item>
        </el-submenu>

    </el-menu>
</template>

<script>
    export default {
        name: "navMenu",
        computed: {
            indexPath: function () {
                return this.$route.fullPath
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<style scoped>

</style>
