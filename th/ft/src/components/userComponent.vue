<template>
    <div class="user-body">
        <img class="imgs" :src="userImgUrl"></img>
        <span>{{rankName}}</span>
        <p>{{username}}</p>
    </div>
</template>

<script>
    import {getCustomer,findCustomerRank} from '../service/profile.service'
    export default {
        name: "userComponent",
        data:function () {
            return {
                userImgUrl:'',
                username:'',
                rankName:''
            }
        },
        activated:function () {
            this.getCustomer()
            this.findCustomerRank()
        },
        methods:{
            getCustomer:async function () {
                const res = await getCustomer();
                if(res.status === '0'){
                    this.userImgUrl = res.avatar;
                    this.username = res.nickname;
                }
            },
            findCustomerRank:async function () {
                const res = await findCustomerRank();
                if(res.status === '0'){
                    this.rankName = res.data.rankName
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";
.user-body{
    height: rem(133);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    .imgs{
        height: rem(49);
        width: rem(49);
        border-radius: 50%;
    }
    span{
        margin: rem(7) 0;
        display: block;
        padding: 0 rem(10);
        height: rem(17);
        line-height: rem(17);
        border: 1px solid red;
        text-align: center;
        font-size: rem(12);
        color: red;
        border-radius: rem(9);
    }
    p{
        font-size: rem(16);
        font-weight: 900;
        color: #333333;
        text-align: center;
    }
}
</style>