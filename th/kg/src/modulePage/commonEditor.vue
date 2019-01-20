<template>
    <div id="editor-container" class="container">
        <div id="commonEditor" v-html="inputContent" @input="outputContent">
        </div>
    </div>            
</template>
<script>
    import cfg from '../config/config'
    import common from '../assets/js/common'
    import WangEditor from 'wangeditor'
    import Qiniu from 'qiniu-js/dist/qiniu.min.js'
    import axios from 'axios'

    export default {
        data() {
            return {
                content: '',
                inputContent: ''
            }
        },
        props: ['strDetail'],
        watch: {
            strDetail(val){
                if(val.description)
                     this.inputContent = this.strDetail.description;
                else
                    this.inputContent=""
            }
        },
        created() {
            if(this.strDetail){
                this.inputContent = this.strDetail.description;
            }
            else{
                this.inputContent=""
            }
        },
        methods: {
            formatContent(content) {
                this.content = content;
                this.outputContent();
            },
            outputContent() {
                this.$emit('input', this.content);
            },
            createEditor() {
                const self = this;
                const editor = new WangEditor('commonEditor');
                self.getToken();
                editor.config.menus = ['source', '|', 'underline',  'strikethrough', 'eraser', 'forecolor', 'bgcolor', '|', 'quote',  'fontsize',  'alignleft', 'aligncenter', 'alignright',
                    '|', 'link', 'unlink', 'table', 'img', 'video', 'insertcode', '|', 'undo', 'redo', 'fullscreen'
                ];
                editor.config.customUpload = true;
                editor.config.customUploadInit = self.uploadInit;
                editor.config.hideLinkImg = true;
                editor.onchange = function() {
                    self.formatContent(this.$txt.html())
                }
                editor.create();
                self.myEditor = editor;
            },
            getToken: function(){
                let self=this;
                let uri = cfg.baseUrl + 'system/getUpToken';
                axios.get(uri, {})
                .then(function(res){
                    let resData = res.data;
                    if(res.data.status == 0) {
                        self.upToken = resData.data;
                    }
                })
                .catch(function(error){
                })
            },
            uploadInit: function(){
                let self = this;
                let editor = this.myEditor;
                let btnId = editor.customUploadBtnId;
                let containerId = editor.customUploadContainerId;
                let Qiniu = global.Qiniu;
                let uploader = Qiniu.uploader({
                    runtimes: 'html5,html4',    //上传模式,依次退化
                    browse_button: btnId,       //上传选择的点选按钮，**必需**
                    uptoken: self.upToken,
                    unique_names: true,
                    domain: cfg.baseDomain,
                    container: containerId,           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '100mb',           //最大文件体积限制
                    filters: {
                        mime_types: [
                            { title: "图片文件", extensions: "jpg,gif,png,bmp" }
                        ]
                    },
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: true,                   //开启可拖曳上传
                    drop_element: 'editor-container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                        'FilesAdded': function(up, files) {
                            plupload.each(files, function(file) {
                                // console.log('on FilesAdded');
                            });
                        },
                        'BeforeUpload': function(up, file) {
                            // console.log('on BeforeUpload');
                        },
                        'UploadProgress': function(up, file) {
                            editor.showUploadProgress(file.percent);
                        },
                        'FileUploaded': function(up, file, info) {
                            var res;
                            var domain = up.getOption('domain');
                            if (typeof info === 'string') {
                                res = JSON.parse(info);
                            } else {
                                res = JSON.parse(info.response);
                            };
                            var sourceLink = domain + res.key; //获取上传成功后的文件的Url
                            // console.log(sourceLink);
                            editor.command(null, 'insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
                        },
                        'Error': function(up, err, errTip) {
                            // console.log('on Error');
                        },
                        'UploadComplete': function() {
                            // console.log('on UploadComplete');
                            editor.hideUploadProgress();
                        },
                    }
                });
            },
        },
        mounted() {
            this.createEditor()
        },
        components:{

        },
    }
</script>
<style lang="css" scoped>
#commonEditor{height: 400px;}
.wangEditor-container{
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid #CCC;
}
.el-col-24{margin-left: 0;}
</style>