<template>
    <el-scrollbar style='height:100%;'>
        <el-menu
                :default-active="indexPath"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                :router="true"
                @close="handleClose"

                background-color="#304156"
                text-color="#bfcbd9"
                active-text-color="#409EFF"
        >
            <!--<el-menu-item index="/" >首页</el-menu-item>-->
            <!--<el-submenu index="00">-->
                <!--<template slot="title">-->
                    <!--<i class="el-icon-location"></i>-->
                    <!--<span>demo</span>-->
                <!--</template>-->
                <!--<el-menu-item index="/" >首页</el-menu-item>-->
                <!--<el-menu-item index="/demo/ElmTable" >表格</el-menu-item>-->
                <!--<el-menu-item index="/demo/ElmForm" >表单</el-menu-item>-->
                <!--<el-menu-item index="/demo/ElmAlertForm" >弹出表单</el-menu-item>-->
            <!--</el-submenu>-->
            <sidebar-item v-for="(menu) in menus" :key="menu.id" :item='menu'></sidebar-item>
        </el-menu>
    </el-scrollbar>
</template>

<script>
    import sidebarItem from './SidebarItem'
    //import {menus} from '../../../assets/const.js'
    import {listByUser} from '@/service/module/menu.js'
    export default {
        name: "navMenu",
        components:{
            sidebarItem,
        },
        data(){
            return{
                //menus,
                menus:[],
            }
        },
       async created(){
           this.menus=await listByUser()
        },
        computed: {
            indexPath: function () {
                //console.log(this.$route)
                if(this.$route.matched.length>2&&this.$route.matched[this.$route.matched.length-1].path.indexOf(':')>-1){
                    return this.$route.matched[this.$route.matched.length-2].path
                }
                return this.$route.fullPath
            },
        },
        mounted(){
        },
        methods: {
            handleOpen(key, keyPath) {
               // console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                //console.log(key, keyPath);
            }
        }
    }
</script>
