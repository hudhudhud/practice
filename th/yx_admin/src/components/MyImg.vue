<template>
    <div class="my-img">

        <img :src="src" :alt="alt" class="thumb" title="点击看大图" @click="imgClick" >

        <el-dialog :visible.sync="picPreviewDialogVisible" width="30%"   :append-to-body="isNest">
            <img :src="src" alt="" style="width:100%">
        </el-dialog>

        <!--el-dialog在商品编辑的表格中失效，所以自己写吧,不过那边暂时不需要放大，所以先注释-->
        <!--<transition name="fade">-->
            <!--<div  class="my-dialog"  append-to-body="isNest" v-show="picPreviewDialogVisible" @click="close">-->
                <!--<div class="contain">-->
                    <!--<i class="el-message-box__close el-icon-close close" @click="close" title="关闭"></i>-->
                    <!--<img :src="src" alt="" style="width:100%">-->
                <!--</div>-->
            <!--</div>-->
        <!--</transition>-->
    </div>
</template>
<script>
    export default{
        props:{
            src:String,
            alt:String,
            isNest:{//是否嵌套dialog
                type:Boolean,
                default:false
            }
        },
        data(){
            return {
                picPreviewDialogVisible:false,
            }
        },
        methods:{
            imgClick(){
                this.picPreviewDialogVisible=true
                document.body.style.overflow='hidden';
            },
            close() {
                this.picPreviewDialogVisible = false
                document.body.style.overflow = 'scroll'
            }
        }
    }
</script>
<style lang="scss" scoped>
    .my-img{
        img{
            cursor:pointer;
        }
        .thumb{
            width:100%;
            height:100%;
       }
        .my-dialog{
            position:fixed;
            top:0;
            left:0;
            right:0;
            bottom:0;
            z-index:9999;
            background-color:rgba(0,0,0,0.5);
            overflow-y:scroll;
            .contain{
                width:50%;
                position:absolute;
                margin-top:15vh;
                left:50%;
                transform:translateX(-50%);
                padding:50px 20px 30px 20px;
                box-sizing:border-box;
                background-color:#fff;
                border-radius: 2px;
                -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
                box-shadow: 0 1px 3px rgba(0,0,0,.3);
                img{
                   xwidth:100%;
                }
                .close{
                    position:absolute;
                    right:10px;
                    top:10px;
                    cursor:pointer;
                }
            }
        }
        .fade-enter-active, .fade-leave-active {
            transition: opacity .5s;
        }
        .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
            opacity: 0;
        }
    }
</style>
