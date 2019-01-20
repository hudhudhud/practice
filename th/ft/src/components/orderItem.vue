<template>
   <div>
       <div class="newsNotice-one" @click="detail(item.id)">
           <div class="newsNotice-one-content">
               <div class="point" v-if="!item.read"></div>
               <div class="newsNotice-one-content-page">
                   <div class="newsNotice-one-content-page-one">
                       <div class="newsNotice-one-content-page-one-left">
                           <span class="newsNotice-one-content-page-one-left-spanOne">{{item.title}}</span>
                       </div>
                       <div class="newsNotice-one-content-page-one-right">
                           <span class="newsNotice-one-content-page-one-right-spanTwo">{{item.releasedTime||item.createDate}}</span>
                       </div>
                   </div>
                   <div class="newsNotice-one-content-page-two">
                       <div class="newsNotice-one-content-page-two-left">
                           <img class="newsNotice-one-content-page-two-left-img" :src="item.image"/>
                       </div>
                       <div class="newsNotice-one-content-page-two-right">
                           {{item.brief||item.content}}
                       </div>
                   </div>
                   <div class="express-info" v-if="item.logisticsName">
                       <div>{{item.logisticsName}}</div>
                       <div>{{item.logisticsSn}}</div>
                   </div>
               </div>
           </div>
       </div>
   </div>
</template>

<script>
    export default {
        name: "order-item",
        props: ['item', 'type'],
        methods: {
            detail: function (id) {
                this.$router.push({name: 'msgDetail',params:{id: id}});
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";
    .express-info{
        margin-bottom: rem(10);
        font-size: rem(13);
        color: #333333;
        letter-spacing: 0;
    }
    .newsNotice-one{
        width: 100%;
    // height: 150px;
        margin-top: 3%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .newsNotice-one-content{
        width: 96%;
        height: 100%;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        position: relative;
        .point{
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: $them;
            right: 5px;
            top: 5px;
            border-radius: 50%;
        }
    }
    .newsNotice-one-content-page{
        border-radius: 4px;
        padding: 0 rem(15);
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .newsNotice-one-content-page-one{
        width: 100%;
        height: rem(40);
      //  border-bottom: 1px solid #DDDDDD;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .newsNotice-one-content-page-one-left{
        white-space:nowrap;

       flex: 1;
        height: 100%;
        display: flex;
        justify-content: left;
        align-items: center;
    }
    .newsNotice-one-content-page-one-left-spanOne{
        text-overflow:ellipsis;overflow:hidden;
        color: #333333;
        font-weight: 600;
        font: normal rem(15) " PMingLiU";
    }
    .newsNotice-one-content-page-one-right{
        /*width: 35%;*/
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .newsNotice-one-content-page-one-right-spanTwo{
        font: normal 13px " PMingLiU";
        color: #ACACAC;
    }
    .newsNotice-one-content-page-two{
        border-radius: 5px;
        overflow: hidden;
        width: 100%;
        min-height: rem(57);
        background-color: #F8F8F8;
     //   height: rem(100);
        display: flex;
    //  justify-content: space-between;
      //  align-items: center;
        flex-direction: row;
        margin-bottom: rem(15);
    }
    .newsNotice-one-content-page-two-left{
        height: 100%;
        margin-right: rem(10);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .newsNotice-one-content-page-two-left-img{
        width: rem(56);
        height: rem(56);
    }
    .newsNotice-one-content-page-two-right{
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        line-height: rem(20);
        font-size: rem(13);
        color: #333333;
        width: 100%;
        overflow: hidden;
        font-weight: 600;
    }
    .newsNotice-one-content-page-two-right-one{

    }
    .newsNotice-one-content-page-two-right-two{
        width: 100%;
        height: 25%;
    }
    .newsNotice-one-content-page-two-right-two-spanTwo{
        font: normal 14px " PMingLiU";
        font-weight: 300;
        color: #C1C1C1;
    }
    .newsNotice-one-content-page-two-right-three{
        width: 100%;
        height: 25%;
        display: flex;
        flex-direction: row;
    }
    .newsNotice-one-content-page-two-right-three-left{
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .newsNotice-one-content-page-two-right-three-left-spanThree{
        font: normal 15px " PMingLiU";
        color: #FF6B6B;
        font-weight: 800;
    }
    .newsNotice-one-content-page-two-right-three-right{
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .newsNotice-one-content-page-two-right-three-right-sapnFOur{
        font: normal 14px " PMingLiU";
        color: #BBBBBB;
        font-weight: 300;
        text-decoration: line-through;
        margin-left: 12%;
    }

</style>