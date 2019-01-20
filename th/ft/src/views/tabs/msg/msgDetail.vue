<template>
    <div class="page">
        <div class="title">{{info.title}}</div>
        <div id="msgDetail" class="content" v-html="info.content"></div>
        <div id="detailShow" class="show" v-show="src" @click="src=null">
            <img :src="src" alt="" @click.stop="">
        </div>
    </div>
</template>

<script>
    import {noticeDetail} from "../../../service/msg.service";

    export default {
        name: "msgDetail",
        data: function () {
            return {
                id: '',
                info: {},
                src: ''
            }
        },
        created: function(){
          setTimeout(() => {
              new RTP.PinchZoom($('#detailShow img'), {});
          }, 0)
        },
        computed: {
            msgCount: function() {
                return this.$store.state.msgCount;
            }
        },
        activated: function () {
            this.setTitle('详情');
            this.id = this.$route.params.id;
            this.getDetail();
            // 保存 已读
                let list = JSON.parse(localStorage.msgList||JSON.stringify([]));
                list.push(this.id);
                let set = [...new Set(list)];
                if(list.length === set.length){
                    if(this.msgCount>0){
                        this.$store.dispatch('computeMsgCount', this.msgCount-1)
                    }
                }
                localStorage.setItem('msgList',JSON.stringify(set));
        },
        deactivated: function () {
            Object.assign(this.$data, this.$options.data());
            this.addClick(false);
        },
        methods: {
            getDetail: function () {
                noticeDetail({id: this.id}).then(
                    res => {
                        if (res.status === '0') {
                            this.info = res.data;
                            this.$nextTick(this.addClick);
                        }
                    }
                );
            },
            addClick: function (init = true) {
                let self = this;
                let dom = document.querySelector('#msgDetail').querySelectorAll('img');
                for (let i = 0, length = dom.length; i < length; i++) {
                    if (init) {
                        dom.item(i).onclick = function () {
                            self.src = this.src;
                        }
                    } else {
                        dom.item(i).onclick = null;
                    }

                }
                dom = null;
            }
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/public";
    #msgDetail img {
        width: 100%;
    }
    .pinch-zoom-container{
        position: fixed!important;
        width: 100%;
        height: 100%!important;
        top: 0;
        left: 0;
        @extend %flex;
        @extend %flex-align-center;
        @extend %justify-content-center;
    }
</style>
<style scoped lang="scss">
    @import "../../../assets/public";

    .title {
        line-height: rem(50);
        font-size: rem(16);
        color: #333333;
        text-indent: rem(10);
    }

    .content {
        padding: rem(10);
    }

    .show {
        z-index: 10;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .8);
        img {
            width: 100%;
        }
    }
</style>