<template>
    <div class="content">
        <div class="buttons-tab">
            <span :class="{active: show===3}" class="tab-link button" @click="show=3">公告</span>
            <span :class="{active: show===1}"  class="tab-link button" @click="show=1">通知</span>
            <!--<span :class="{active: show===2}" class="tab-link button" @click="show=2">物流信息</span>-->
        </div>
        <div class="tabs">
            <div id="tab1" class="tab" v-show="show===1">
                <Notice></Notice>
            </div>
          <!--  <div id="tab2" class="tab" v-show="show===2">
                <Logistics></Logistics>
            </div>-->
            <div id="tab3" class="tab" v-show="show===3">
                <Affiche></Affiche>
            </div>
        </div>
    </div>
</template>

<script>
    import Notice from './msg/notice'
    import Logistics from './msg/logistics'
    import Affiche from './msg/affiche'

    export default {
        name: "msg",
        components: {
            Notice,
            Logistics,
            Affiche
        },
        data: function () {
            return {
                show: 3
            }
        },
        watch: {
          show: function (n) {
              localStorage.setItem('msg_show', n);
          }
        },
        activated: function () {
            this.setTitle('消息');
            this.show = +localStorage.getItem('msg_show')||1;
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/public";
    .content{
        position: absolute;
        width: 100%;
    }
    .buttons-tab {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: rem(40);
        text-align: center;
        background-color: white;
        font-size: rem(15);
    }
    .active {
        border-bottom: 3px solid $them;
    }
    .tab-link{
       // flex: 1;
     //   height:  rem(40);
      //  padding: 0 rem(20);
        margin: 0 rem(40);
        line-height: rem(40);
    }
    .tabs {
        margin-top:rem(51);
        padding-bottom: rem(60);
    }
    .buttons-tab .button.active {
        color: $them;
        border-color: $them;
    }


</style>