<template>
    <div>
        <el-submenu :index="String(item.id)"  v-if="item.children&&item.children.length">
            <template slot="title">
                <span>{{item.name}}</span>
            </template>
            <div v-for="cmenu in item.children" :key="cmenu.id"  >
                <sidebar-item :item='cmenu'></sidebar-item>
            </div>
        </el-submenu>
        <el-menu-item :index="item.href?item.href:''"  v-else>
            {{item.name}}
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'sidebarItem',
    props:{
        "item":Object
    }
}
</script>

