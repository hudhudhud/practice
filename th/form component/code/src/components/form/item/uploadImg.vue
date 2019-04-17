<template>
    <el-form-item :label="itemData.label"  :prop="itemData.key">
        <div v-if="isEdit">
            <div v-if="itemData.one">
                <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :http-request="myUploadImg"
                        :before-upload="beforeAvatarUpload">
                    <div v-if="imageUrl" class="el-upload-list--picture-card">
                        <img  :src="imageUrl" class="avatar">
                        <span class="el-upload-list__item-actions">
                       <span class="el-upload-list__item-preview">
                           <i class="el-icon-zoom-in"  @click.stop="onePreview"></i>
                       </span>
                       <span class="el-upload-list__item-delete">
                           <i class="el-icon-delete" @click.stop="oneDelete"></i>
                       </span>
                   </span>
                    </div>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
            <div  v-else>
                <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        list-type="picture-card"
                        :file-list="fileList"
                        :limit="itemData.max"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :http-request="myUploadImg"
                        :before-upload="beforeAvatarUpload">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                <span v-if="itemData.max" style="color:blue">(最多上传{{itemData.max}}个图片)</span>
            </div>
        </div>
        <div v-else >
            <div v-if="itemData.one">
                <img  :src="imageUrl" class="img-show" v-if="imageUrl">
                <span v-else>无</span>
            </div>
           <div v-else>
               <img  :src="item.url" class="img-show"  v-for="item in formData[itemData.key]" v-if="formData[itemData.key]&&formData[itemData.key].length">
               <span v-else>无</span>
           </div>
       </div>

        <el-dialog :visible.sync="picPreviewDialogVisible" width="50%;">
            <img :src="imageUrl" alt="" style="width:100%">
        </el-dialog>
    </el-form-item>
</template>

<script>
    import {uploadImg} from "../../../service/util";

    export default {
        name: "upload-img",
        props: {
            itemData: {
                type: Object
            },
            formData: {
                type: Object
            },
            isEdit:{
                type:Boolean,
                default:true
            }
        },
        computed:{
            fileList(){
                if(this.formData[this.itemData.key]&&this.formData[this.itemData.key].length){
                    return this.formData[this.itemData.key].slice()
                }
                return []
            },
            imageUrl:{
                get(){
                    return this.formData[this.itemData.key]?this.formData[this.itemData.key].url:''
                },
                set(val){
                    //this.formData[this.itemData.key].url=val
                }
            }
        },
        created: function(){
        },
        data: function () {
            return {
                dialogVisible: false,
                dialogImageUrl: '',
               // fileList: [],
               // imageUrl:"",
                picPreviewDialogVisible:false,
            }
        },
        methods: {
            handleRemove(file, fileList) {
                let current=this.formData[this.itemData.key].find(item=>item.uid===file.uid)
                if(current){
                    this.$nextTick(()=>{
                        this.formData[this.itemData.key].splice(this.formData[this.itemData.key].indexOf(current),1)
                    })
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            beforeAvatarUpload(file) {
              //  const isJPG = file.type === 'image/jpeg';
                const limitSize = this.itemData.size&&(file.size / 1024  > this.itemData.size);


                if (limitSize) {
                    this.$message.error('上传头像图片大小不能超过'+this.itemData.size+'KB!');
                }
                return  !(limitSize);
            },
            myUploadImg:async function (file) {
                const res = await uploadImg(file.file, this.itemData.url,this.itemData.fileKey);
                res.uid=file.file.uid
                if(this.itemData.one){
                    this.imageUrl = res.url
                    this.formData[this.itemData.key]=res
                }
                else{
                    if(this.formData[this.itemData.key] instanceof Array){
                        this.formData[this.itemData.key].push(res);
                    }else{
                        this.formData[this.itemData.key] = [res];
                    }
                }
             },
            oneDelete(){
                this.imageUrl =''
                this.formData[this.itemData.key]=null
            },
            onePreview(){
              this.picPreviewDialogVisible=true
            }
        }
    }
</script>

<style lang="scss" >
    .avatar-uploader .el-upload {
        border: 2px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 148px;
        height: 148px;
        line-height: 148px;
        text-align: center;
    }

    .el-upload--picture-card {
        width: 148px;
        height: 148px;
    }
</style>
<style scoped lang="scss">
    .flex {
        flex-wrap: wrap;
    }

    .imgs {
        width: 148px;
        height: 148px;
        margin-right: 10px;
        margin-bottom: 10px;
        display: block;
    }

    .avatar {
        width: 148px;
        height: 148px;
        display: block;
    }
    .img-show{
        width: 148px;
        height: 148px;
        display: inline-block;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        margin: 0 8px 8px 0;
        box-sizing: border-box;
    }
</style>
