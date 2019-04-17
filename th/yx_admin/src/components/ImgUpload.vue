<template>
    <section class="img-upload">
        <!--在表格里面用el-upload会弹出两次，没找到原因-->
        <!--<el-upload-->
                <!--class="avatar-uploader"-->
                <!--action="https://jsonplaceholder.typicode.com/posts/"-->
                <!--:show-file-list="false"-->
                <!--:before-upload="beforeAvatarUpload"-->
                <!--:http-request="myUploadImg"-->
                <!--@click.native="stopFun">-->
            <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
        <!--</el-upload>-->
        <div class="avatar-uploader">
            <div  class="el-upload el-upload--text">
                <input type="file"  name="file" class="el-upload__input input_btn" @change="myUploadImg">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
        </div>
    </section>
</template>
<script>
    import {uploadImg} from "@/assets/util";
    import {fileUploadUrl} from "@/assets/const";
    export default {
        props:{
            id:{
                type:[String,Number]
            },
            url:{
                type:String,
            },
            limitSize:{
                type:Number
            }
        },
        data() {
            return {
                imageId:this.id,
                imageUrl:this.url
            };
        },
        methods: {
            beforeAvatarUpload(file) {
                if(this.limitSize===undefined)
                    return true
                // const isJPG = file.type === 'image/jpeg';
                // const isLt2M = file.size / 1024 / 1024 < 2;

                const limitSize = this.limitSize&&(file.size / 1024  > this.limitSize);


                if (limitSize) {
                    this.$message.error('上传图片大小不能超过'+this.limitSize+'KB!');
                }
                return  !(limitSize);
            },
            myUploadImg:async function (e) {
                let file=e.target.files[0]
                const res = await uploadImg(file, fileUploadUrl);
                this.imageUrl = res.url
                this.imageId=res.id
                this.$emit("update:url",this.imageUrl)
                this.$emit("update:id",this.imageId)
            },
        }
    }
</script>
<style lang="scss" >
    .img-upload{
        .input_btn{
            display: block;
            position:absolute;
            let:0;
            right:0;
            top:0;
            bottom:0;
            opacity:0;
            xborder:1px solid;
            cursor:pointer;
        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width:40px;
            height:40px;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
        }
        .avatar {
            padding:2px;
            width: 38px;
            height: 38px;
            display: block;
        }
    }

</style>
