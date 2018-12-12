<template>
    <section>
        <div>
            <p class="nc"><i class="fa fa-user" aria-hidden="true"></i><span  class="title">昵称：</span><span>{{$store.state.userInfo.nickname}}</span><el-button type="text" @click="click" class="btn">修改昵称</el-button></p>
            <div class="clearfix msg">
                <div  class="phone fl"><p class="title">手机号：{{$store.state.userInfo.phone}}<router-link to="/userCenter/phone" class="btn">更改绑定手机</router-link></p></div>
                <div  class="email fr" v-if="$store.state.userInfo.email"><p><span class="title">邮箱：</span>您尚未绑定邮箱<router-link to="/userCenter/email" class="btn">更改绑定邮箱</router-link></p></div>
                <div  class="email fr" v-else><p><span class="title">邮箱：</span>您已经绑定邮箱<router-link to="/userCenter/email" class="btn">更改绑定邮箱</router-link></p></div>
            </div>
        </div>
    </section>
</template>
<script>
import {
    Button,
    MessageBox,
    Message
} from "element-ui"
import myaxios from "../../assets/js/myaxios";

export default {
    components: {
        elButton: Button,
    },
    data: function () {
        return {

        }
    },
    mounted() {
        console.log(this.$store.state.userInfo)
    },
    methods: {
        click() {
            MessageBox.prompt('昵称', '修改昵称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern:/.+/,
                inputErrorMessage:'昵称不能为空'
            }).then(({value}) => {
                console.log('1')
                myaxios.post('/web/user/changeNickName', {
                    nickName: value
                }).then(data => {
                    console.log(data)
                    if (data.data.code == 0) {
                        Message({
                            type: 'success',
                            message: '修改成功'
                        });
                        var obj=this.$store.state.userInfo
                        obj.nickname=value
                        this.$store.commit('setUserInfo',obj)

                    }
                })

            }).catch(() => {
                Message({
                    type: 'info',
                    message: '取消修改'
                });
            });
        }
    }
}
</script>
<style lang="less" scoped>
    p,span,a{
        font-size:14px;
        opacity: 0.78;
    }
    .nc{
        margin-top:40px;
        text-align: center;
        font-size:14px;
        i{
            width:100px;
            height: 100px;
            border-radius: 50%;
            background-color: @mainColor;
            color:#fff;
            font-size:50px;
            line-height: 100px;
            margin-right: 10px;
        }
    }
    .title{
        font-weight: bold;
    }
    .msg{
        padding:0 83px;
        margin-top:50px;
    }
    .btn{
        margin-left:19px;
        border:1px solid @mainColor;
        padding:3px 11px;
        color:@mainColor;
        border-radius: 10px;
    }
</style>

