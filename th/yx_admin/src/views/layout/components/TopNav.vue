<template>
    <div class="topNav">
        <Breadcrumb/>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <span class="login-name">hello,{{userInfo.nickName}}</span>
                <img :src="userInfo.avatar" class="user-avatar" v-if="userInfo.avatar">
                <i class="fa fa-user-circle" aria-hidden="true" v-else title="用户未上传头像"></i>
                <i class="el-icon-caret-bottom"/>
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <router-link class="inlineBlock" to="/">
                    <el-dropdown-item>
                        首页
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided>
                    <span style="display:block;" @click="logout">登出</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
    import Breadcrumb from '@/components/Breadcrumb'
    import {mapState,mapGetters} from 'vuex';
    export default {
        components: {
            Breadcrumb
        },
        mounted(){
            this.$store.dispatch('isLogin')
        },
        computed:{
            ...mapGetters([
                'userInfo'
            ]),
        },
        methods: {
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    this.$router.push('/login')
                })
            }
        }
    }
</script>
<style lang="scss">
    .topNav{
        height: $topHeight;
        position:fixed;
        top:0;
        left: $leftWidth;
        right:0;
        background-color:#fff;
        box-sizing:border-box;
        border-bottom:solid 1px #e6e6e6;
        z-index:1000;
        xbox-shadow:0px 10px 46px 0px rgba(22,64,128,0.06);
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                line-height: initial;
                .login-name{
                    line-height: 40px;
                    padding:5px;
                }
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    vertical-align: middle;
                }
                .fa.fa-user-circle{
                    font-size:40px;
                    vertical-align: top;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>
