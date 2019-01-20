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
        <el-menu-item :index="item.url?item.url:''" :class="{'active':(item.url&&item.url==$route.path)}" v-else>  
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
<style lang='less' scoped>
    .el-submenu{
         background-color:#525a8a;
    }
    .el-submenu__title:hover {
        background-color: #3f456d;
        color:#fff;
    }
    .el-menu-item{
        //background-color:#3c4d83;
        background-color:#525a8a;
        font-size: 14px;
        height: 50px;
        line-height: 50px;
        &:hover{
                background-color: #3f456d;
                color:#fff;
        }
    }
    .el-menu-item.active{
        color:#fff;
        background-color: #3f456d;
        position:relative;
        &:after{
            content:'';
            display: inline-block;
            width:10px;
            height: 10px;
            border-radius: 50%;
            background-color: #fff;
            position:absolute;
            right:10px;
            top:20px;
        }
    }
    .el-submenu__title:focus, .el-submenu__title:hover{
        background-color: #3f456d;
    }
  
</style>
<style>
  .el-menu-item-group__title {
        line-height: normal;
        font-size: 15px ;
        color:#a4b3d7;
        background-color:rgba(0,0,0,0.2);
        padding-left:0;
    }
</style>