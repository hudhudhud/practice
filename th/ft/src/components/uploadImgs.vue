<template>
    <div class="group">
        <div class="img" v-for="(item, index) of imgs" :key="item">
            <img :src="item" alt="">
            <div class="close" @click="close(index)">
                <i class="iconfont icon-guanbi"></i>
            </div>
        </div>
        <div class="img">
            <i class="iconfont icon-iconfont56"></i>
            <input type="file" @change="uploadImg" multiple>
        </div>
    </div>
</template>

<script>
    import { uploadImg } from '../service/util'
    import { Toast, Indicator } from 'mint-ui'

    export default {
        name: "upload-imgs",
        data: function () {
            return {
                imgs: []
            }
        },
        activated: function () {
            this.imgs = [];
        },
        methods: {
            uploadImg: async function (e) {
                const files = e.target.files;
                Indicator.open('正在处理');
                for (let i = 0; i < files.length; i++) {
                    let type = files[i].type.split('/')[0];//按照惯例，不应该由前端判断格式，因为这里是根据后缀名判断的，修改后缀名仍旧可以上传，理应由后端根据文件格式来判断。
                    if (type !== 'image') {
                        Toast('不是图片格式');
                        break;
                    }
                    let size = Math.round(files[i].size / 1024 / 1024);
                    if (size > 3) {
                        Toast('图片超过3M');
                        break;
                    }
                    let url = await uploadImg(files[i], '002');
                    this.imgs.push(url);
                }
                Indicator.close();
                this.$emit('change', this.imgs);
            },
            close: function (index) {
                this.imgs.splice(index, 1);
                this.$emit('change', this.imgs);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/public";

    .group {
        padding: rem(15) 0 0 rem(30);
        background-color: #ffffff;
        @extend %flex;
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .img {
        position: relative;
        width: rem(70);
        height: rem(70);
        line-height: rem(70);
        background: #EEEEEE;
        border: 1px dashed rgba(187, 187, 187, 1);
        margin-right: rem(10);
        margin-bottom: rem(10);
        color: #999999;
        text-align: center;
        .iconfont {
            font-size: rem(24);
        }
        img {
            width: 100%;
            height: 100%;
            display: block;
        }
        input {
            opacity: 0;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: absolute;
        }

        .close {
            display: block;
            z-index: 100;
            position: absolute;
            right: 0;
            top: 0;
            width: rem(20);
            height: rem(20);
            .iconfont {
                font-size: rem(12);
                line-height: rem(12);
                position: absolute;
                top: 0;
                right: 0;
            }
        }
    }

</style>