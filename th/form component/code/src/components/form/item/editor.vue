<template>
    <el-form-item :label="itemData.label" :prop="itemData.key">
        <vue-editor v-model="formData[itemData.key]" id="vue-editor"
                    useCustomImageHandler
                    @imageAdded="handleImageAdded" v-if="isEdit">
        </vue-editor>
       <div v-else v-html="formData[itemData.key]" class="editor-show-html"></div>
    </el-form-item>
</template>

<script>
    import {generateUUID} from "../../../service/util";
    import { VueEditor,Quill } from "vue2-editor";
    import {uploadImg} from "../../../service/util";
    // import { ImageDrop } from 'quill-image-drop-module'
    // import ImageResize from 'quill-image-resize-module'
    //
    // Quill.register('/node_modules/imageDrop', ImageDrop)
    // Quill.register('/node_modules/imageResize', ImageResize)
    export default {
        name: "editor",
        components: {
            VueEditor
        },
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
        data: function () {
            return {
                id: generateUUID(),
                // customModulesForEditor: [
                //     { alias: 'imageDrop', module: ImageDrop },
                //     { alias: 'imageResize', module: ImageResize }
                // ],
                // editorSettings: {
                //     modules: {
                //         imageDrop: true,
                //         imageResize: {}
                //     }
                // }
            }
        },
        mounted: function () {

        },
        methods: {
            handleImageAdded:async function(file, Editor, cursorLocation, resetUploader) {
                // An example of using FormData
                // NOTE: Your key could be different such as:
                // formData.append('file', file)

                const res = await uploadImg(file, this.itemData.url,this.itemData.fileKey);
                let url = res.url // Get url from response
                Editor.insertEmbed(cursorLocation, 'image', url);
                resetUploader();
            }
        }
    }
</script>

<style  lang="scss">
#vue-editor{
    height:400px
}
.editor-show-html{
    width:375px;
    max-height:500px;
    overflow-y:scroll;
    overflow-x:hidden;
    img{
        width:100%;
    }
    border:1px solid #dcdfe6;
}
</style>
