<template>
    <section>
        <div class="nav">
            <Nav></Nav>
        </div>
        <TopNav></TopNav>
        <div class="content">
            <transition name="fade-transform" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </section>
</template>
<script>
    import Nav from './components/NavMenu'
    import TopNav from './components/TopNav'
    export default {
        components: {
            Nav,
            TopNav,
        }
    }
</script>
<style lang="scss" scoped>
    @import '../../utils/transition';
    .nav{
        position: fixed;
        width: $leftWidth;
        left: 0;
        z-index: 10;
        top:0;
        height: 100%;
        background-color:#304156;
        overflow: hidden;
    }
    .content{
        margin-top:$topHeight;
        margin-left: $leftWidth;
        min-height: 100%;
        padding:10px;
    }

</style>
<style  lang="scss">
    .nav{
        .el-menu{
            height: 100%;
            width: 100%;
            z-index: 10;
            border:none;
        }
         .nest-menu .el-submenu>.el-submenu__title,
         .el-submenu .el-menu-item,
         .el-submenu.is-opened .el-menu .el-submenu__title{
            min-width: $leftWidth !important;
            background-color: #1f2d3d !important;
            &:hover {
                background-color: #001528 !important;
            }
        }
    }
</style>
