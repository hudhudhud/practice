<template>
  <!--  <div id='newsNotice' class="newsNotice">
        <OrderItem v-bind:item="item" v-for="item in newsList" :key="item.id"></OrderItem>
        <div style="height: 90px;"></div>
    </div>-->

    <div>
        <div class="newsAffiche" v-for='(item,ide) in newsList' :key="item.id" @click="detail(item.id)">
            <div class="point" v-if="!item.read"></div>
            <div class="newsAffiche-title">
                <div v-if="ide==0"><span class="zd_top">置顶</span>{{item.title}}</div>
                <div v-else>{{item.title}}</div>
                <!--<div>{{item.releasedTime}}</div>-->
            </div>

            <div class="newsAffiche-content">
                <span>{{item.brief}}</span>
                <!--<p class="date">{{item.releasedTime.substring(0,10)}}</p>-->
                <img :src="item.image" alt="">
            </div>

        </div>
    </div>
</template>

<script>
    import OrderItem from '@/components/orderItem'
    import {systemNotice} from "../../../service/msg.service";
    // 通知
    export default {
        name: "notice",
        components: {
            OrderItem
        },
        data: function () {
            return {
                newsList: [],//通知
                page: 1,
                size: 10
            }
        },
        activated: function () {
            this.getList();
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            getList: function (num) {
                systemNotice({"noticeType": "1", "pageNo": this.page, "pageSize": this.size}).then(
                    res => {
                        if (res.status === '0') {
                            this.newsList = res.data.list||[];
                            let msgList = JSON.parse(localStorage.msgList||JSON.stringify([]));
                            this.newsList.map(i=> {
                                i.read = msgList.includes(i.id);
                                return i;
                            })
                        }
                    }
                );
            },
            detail: function (id) {
                this.$router.push({name: 'msgDetail',params:{id: id},query: {type: 'msg'}});
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/public";

    .point{
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: $them;
        left: 5px;
        top: 5px;
        border-radius: 50%;
    }
    .newsAffiche {
        position: relative;
        margin: rem(10);
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px gainsboro;
    }
    .newsAffiche-title{
        position: relative;
        height: rem(40);
        padding: 0 rem(15);
        display: flex;
        justify-content: space-between;
        align-items: center;
        // 时间
        font-size: 15px;
        color: #999999;
        div{
            white-space: nowrap;
            font-size: rem(12);
        }
        div:first-of-type{
            font-size: rem(15);
            color: #333333;
            letter-spacing: 0;
            font-weight: bold;
        }
        &::after{
            content: '';
            position: absolute;
            border-bottom: 1px solid #eeeeee;
            width: calc(100% - 20px);
            bottom: 0;
            left: 10px;
        }
        .zd_top{
            color:#fff;
            background-color: #f00;
            display: inline-block;
            padding:0  rem(5);
            margin-right: rem(5);
            font-size: rem(12);
        }
    }
    .newsAffiche-content{
        padding: rem(10);
        font-size: rem(13);
        color: #999999;
        img{
            display: block;
            width: rem(335);
        }
        .date{
            text-align: right;
            font-size: rem(15);
            color: #999999;
        }
    }
</style>