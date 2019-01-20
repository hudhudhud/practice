<template>
    <div :name="item.key" class="imgUpload">
        <div v-if="item.type=='form-url'" class="form-url">
            <!-- 单张照片直接传string url -->
            <label :class="{required:item.required}">{{item.label}}</label>
            <div :class="{btn:true,disabled:item.disabled}" :title="item.label" >
                <i class="fa fa-plus" aria-hidden="true" v-if="!img"></i>
                <input type="file"  @change="upload"  v-if='!item.disabled'/>
                <div class="pictures cover-img" v-if="img"> 
                    <i class="fa fa-times-circle close" aria-hidden="true" @click="close()" title="删除" v-if='!item.disabled'></i>
                    <img :src="imgSrc(img)">
                </div>
            </div>
        </div>
        <div v-else-if="item.type=='url'">
            <!-- 单张照片直接传string url -->
            <div :class="{btn:true,disabled:item.disabled}" :title="item.label">
                <i class="fa fa-plus" aria-hidden="true" v-if="!img"></i>
                <p class="txt" v-if="!img">{{item.label}}</p>
                <input type="file"  @change="upload"  v-if='!item.disabled'/>
                <div class="pictures cover-img" v-if="img"> 
                    <i class="fa fa-times-circle close" aria-hidden="true" @click="close()" title="删除" v-if='!item.disabled'></i>
                    <img :src="imgSrc(img)">
                </div>
            </div>
        </div>
        <div v-else-if="item.type=='one'">
            <!-- 单张照片传对象 -->
            <div :class="{btn:true,disabled:item.disabled}" :title="item.label">
                <i class="fa fa-plus" aria-hidden="true" v-if="!imgs.imageUrl"></i>
                <p class="txt" v-if="!imgs.imageUrl">{{item.label}}</p>
                <input type="file"  @change="upload"  v-if='!item.disabled'/>
                <div class="pictures cover-img" v-if="imgs.imageUrl"> 
                    <i class="fa fa-times-circle close" aria-hidden="true" @click="close()" title="删除" v-if='!item.disabled'></i>
                    <img :src="imgSrc(imgs.imageUrl)">
                </div>
            </div>
        </div>
        <div v-else class="multiple">
            <!-- 多张照片传数组 -->
            <label :class="{required:item.required}">{{item.label}}</label>
            <ul class="coll_list"  >
                <li>
                    <p :class="{btn:true,disabled:item.disabled}" >
                        <input type="file"  @change="uploadMultiple" multiple v-if='!item.disabled'/>
                        <i class="fa fa-plus" aria-hidden="true"></i>
                    </p>
                </li>
                <li  class="pictures" :key="imgs.imageUrl" v-if="!Array.isArray(imgs)&&imgs.imageUrl">
                    <i class="fa fa-times-circle close" aria-hidden="true" @click="close()" title="删除" v-if='!item.disabled'></i>
                    <img :src="imgSrc(imgs.imageUrl)">
                </li>
                <li v-for="(it,i) in imgs" class="pictures" :key="i" v-else >
                    <i class="fa fa-times-circle close" aria-hidden="true" @click="close(i)" title="删除" v-if='!item.disabled'></i>
                    <img :src="imgSrc(it.imageUrl)">
                </li>
            </ul>
        </div>
        <p v-if="emptyMsg" class="errorMsg req">{{emptyMsg}}</p>
    </div>
</template>
<script>
import ImageUplod from '../assets/js/ImageUplod'
import cfg from '../config/config'
export default {
    props:{
        item:{
            type:Object,
            default:function(){
               return  {
                    key:"imgUpload",
                    label:"图片上传",
                    multiple:false,
                    maxLen:10,
                }
            }
        },
        model:{
            type:[Array,Object],
        },
        url:""
    },
    data(){
        return{
            imgs:this.model?this.model:[],
            img:this.url,
            emptyMsg:"",
        }
    },
    watch:{
        // 深度 watcher
        model:{
            handler(newValue){
              this.imgs=newValue?newValue:[]
            },
            deep:true,
        },
        url(val){
            this.img=val
        }
    },
    computed:{
        remainCount(){
            this.item.maxLen=(this.item.maxLen==undefined?10:this.item.maxLen)
            return this.item.maxLen-this.imgs.length
        }
    },
    methods:{
        check(){
            if(this.item.required){
                let img=this.getImg()
                if(!img||(Array.isArray(img)&&!img.length)){
                    this.emptyMsg=this.item.emptyMsg?this.item.emptyMsg:`${this.item.label}不能为空！`
                    return false
                }
                else{
                    this.emptyMsg=""
                }
            }
            return true
        },
        upload(e){
            let files = e.target.files;
            ImageUplod({
                files,
                size: 20,
                method: 'post',
                url: cfg.baseUrl + 'file/upload',
                progressCb: (percent) => {
                    //this.progressBarWidth = `${percent * 100}%`
                },
                successCb: (res) => {
                    const resData = res.data
                    //this.progressBarWidth = 0
                    if (res.status === 0) {
                        //this.$set(this.courselibrary, 'logo', resData.qiniuName)
                        
                        if(Array.isArray(this.imgs)){
                            this.imgs=[{imageUrl: resData.qiniuName, imageName: resData.qiniuName}]
                        }
                        else{
                            this.imgs={imageUrl: resData.qiniuName, imageName: resData.qiniuName}
                        }
                        this.img=resData.qiniuName
                        this.$emit('update:model', this.imgs)
                        this.$emit('update:url', this.img)
                    } else {
                        this.$message.warning(res.msg)
                    }
                },
                errorCb: (err) => {
                    console.log('err---', err)
                }
            })
        },
        uploadMultiple(e){
            var self = this;
            var j = 1;
            var i = 0, files = e.target.files, len = files.length, notSupport = false;
            if (this.remainCount >= len) {
                ImageUplod({
                    files,
                    size: 200,
                    method: 'post',
                    url: cfg.baseUrl + 'file/upload',
                    progressCb: (percent) => {
                        //this.progressBarWidth = `${percent * 100}%`
                    },
                    successCb: (res) => {
                        const resData = res.data;
                        //this.progressBarWidth = 0;
                        if (res.status === 0) {
                            self.imgs.push({imageUrl: resData.qiniuName, fileName: resData.fileName, imageName: resData.qiniuName, fileHash: resData.qiniuName});
                            this.$emit('update:model', self.imgs)
                        } else {
                            self.$message.warning(res.msg)
                        }
                    },
                    errorCb: (err) => {
                        console.log('err---', err)
                    }
                })
            }
            else {
                self.$message({
                    type: 'warning',
                    message: "图片已达上限"
                });
            }
        },
        imgSrc (qiniuName) {
            if(!qiniuName)return
            if (qiniuName.indexOf('http://') > -1) {
                return qiniuName.replace('imageslim', 'imageView2/2/w/100')
            }
            return cfg.baseDomain + qiniuName + '?imageView2/2/w/100'
        },
        getImg(){
            if(this.item.type=='url'||this.item.type=='form-url')
                return this.url
            return this.imgs
        },
        close(i){
            if(!this.item.type){
                if(Array.isArray(this.imgs)){
                    this.imgs.splice(i,1)
                }
                else{
                    this.imgs={}
                }
            }
            else{
                 this.imgs={}
                 this.img=""
            }
            this.$emit('update:model', this.imgs)
            this.$emit('update:url', this.img)
        }
    }
}
</script>
<style lang="less" scoped>
label{
    display: inline-block;
    width:80px;
    vertical-align: top;
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 1em;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.btn{
    margin:0;
    display: inline-block;
    width:160px;
    height: 160px;
    background-color:rgba(239,241,245,1);
    text-align: center;
    position: relative;
    cursor: pointer;
    i.fa-plus{
        font-size:30px;
        line-height: 160px;
    }
    input[type='file']{
        position:absolute;
        top:0;
        left:0;
        border:none;
        width:100%;
        height: 100%;
        display: inline-block;
        opacity:0;
        cursor:pointer;
    }
    .txt{
        text-align: center;
        position:absolute;
        left:0;
        right:0;
        top:116px;
        font-size:18px;
    }
    .cover-img{
        position:absolute;
        top:0;
        left:0;
    }
    &.disabled{
        cursor:not-allowed;
    }
}
 .coll_list {
    margin:0;
    display: inline-block;
    overflow: auto;
    padding:0;
    width:514px;
  }

  .coll_list li {
    list-style-type: none;
    float: left;
    margin-right:10px;
    text-align: center;
    &:nth-child(n+4){
        margin-top:10px;
    }
  }

  .pictures {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 160px;
    border: 1px solid #c0ccda;
    box-sizing: border-box;
    > img {
        overflow: hidden;
        max-width: 118px;
        max-height: 118px;
    }
    .close{
        position:absolute;
        top:0;
        right:0;
        cursor: pointer;
        font-size:20px;
        opacity: 0;
        transition: opacity .2s linear;
    }
    &:hover{
        .close{
            opacity: 1;
        }
    }
  }
  .form-url{
      margin:10px 0;
  }
  .multiple{
      margin:10px 0;
  }
  .imgUpload{
      xpadding-bottom:10px;
  }
  .errorMsg {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    height: 20px;
    margin-left:120px;
}
</style>

