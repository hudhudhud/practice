<template>
    <section>
        <template>
            <el-tag
                    :key="i"
                    v-for="(tag,i) in list"
                    :closable="closable"
                    :disable-transitions="false"
                    @close="proKeyTagClose(tag)">
                {{tag}}
            </el-tag>
        </template>
        <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="tagInputConfirm"
                @blur="tagInputConfirm"
        >
        </el-input>
        <el-button v-if="showBtn" class="button-new-tag" size="small" @click="showInput">{{btnTxt}}</el-button>
    </section>
</template>
<script>
    let i=0;
    export default {
        props:{
            options:{
                type:Array,
                default(){
                    return []
                }
            },
            btnTxt:{
                type:String,
                default:'添加关键字'
            },
            showBtn:{
                type:Boolean,
                default:true,
            },
            closable:{
                type:Boolean,
                default:true
            },
            //新增回调函数
            addCb:{
                type:Function,
                default:()=>{}
            },
            //删除回调函数
            removeCb:{
                type:Function,
                default:()=>{}
            }
        },
        data(){
            return {
                inputVisible: false,
                inputValue:'',
                list:this.options,
            }
        },
        watch:{
            options:{
                handler(val){
                    this.list=val
                },
                deep:true
            }
        },
        methods:{
            async proKeyTagClose(tag){
                let index=this.list.indexOf(tag)
                this.list.splice(index,1)
                this.$emit('update:options', this.list)
                if(this.removeCb && typeof this.removeCb==='function'){
                    this.removeCb(tag)
                }
            },
            async tagInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                   this.list.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
                this.$emit('update:options', this.list)

                if(inputValue && this.addCb && typeof this.addCb==='function'){
                    let res= await this.addCb(inputValue)
                    //如果添加失败，则移除最后一项
                    if(res&&res.status===1){
                        this.list.pop()
                        this.$emit('update:options', this.list)
                    }
                }
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
