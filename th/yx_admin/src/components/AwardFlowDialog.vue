<template>
    <el-dialog  :visible.sync="show" custom-class="award-dialog" @closed="cancel">
        <section class="clearfix">
            <div class="left fl">
                <div class="line">
                    <span>上级</span>
                </div>
                <i class="fa fa-chevron-right one" aria-hidden="true"></i>
                <div class="line one">
                    <span>上级</span>
                </div>
                <i class="fa fa-chevron-right two" aria-hidden="true"></i>
            </div>
            <div class="middle fl">
                <div class="mod">
                    普通会员
                </div>
                <div class="line down">
                    <span>上级</span>
                </div>
                <div class="mod">
                    店主
                </div>
                <div class="line down">
                    <span>上级</span>
                </div>
                <div class="mod">
                    一星店主
                </div>
                <div class="line up">
                    <span> 推荐</span>
                </div>
                <div class="mod">
                    一星店主
                </div>
                <div class="line down">
                    <span>上级</span>
                </div>
                <div class="mod">
                    二星店主
                </div>
                <div class="line up">
                    <span>推荐</span>
                </div>
                <div class="mod">
                    二星店主
                </div>
                <div class="line down">
                    <span>上级</span>
                </div>
                <div class="mod">
                    三星店主
                </div>
            </div>
            <div class="right fl">
                <div class="con">
                    <div class="line"></div>
                    <div class="mod">
                        直接邀请奖励：<br>
                        <el-input-number v-model="detail[0].number"  controls-position="right" size="mini" :precision="1" :step="0.1"></el-input-number>元
                    </div>
                </div>
                <div class="con">
                    <div class="line"></div>
                    <div class="mod">
                        团队新增会员：<br>
                        <el-input-number v-model="detail[1].number"  controls-position="right" size="mini" :precision="1" :step="0.1"></el-input-number>元
                    </div>
                </div>
                <div class="con">
                    <div class="line"></div>
                    <div class="mod">
                        直属育成团队新增会员：<br>
                        <el-input-number v-model="detail[2].number"  controls-position="right" size="mini" :precision="1" :step="0.1"></el-input-number>元
                    </div>
                </div>
                <div class="con">
                    <div class="line"></div>
                    <div class="mod">
                        下属团队新增会员：<br>
                        <el-input-number v-model="detail[3].number"  controls-position="right" size="mini" :precision="1" :step="0.1"></el-input-number>元
                    </div>
                </div>
                <div class="con">
                    <div class="line"></div>
                    <div class="mod">
                        直接育成资深经理团队新增会员：<br>
                        <el-input-number v-model="detail[4].number"  controls-position="right" size="mini" :precision="1" :step="0.1"></el-input-number>元
                    </div>
                </div>
                <div class="con">
                    <div class="line"></div>
                    <div class="mod">
                        礼包均分金额：<br>
                        <el-input-number v-model="detail[5].number"  controls-position="right" size="mini" :precision="1" :step="0.1"></el-input-number>元
                    </div>
                </div>
            </div>
        </section>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="awardSubmit">保 存</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {award_view,award_save,award_update} from '@/service/module/product'
    export default{
        props:{
            skuId:Number,
            productId:Number,
            visible:Boolean
        },
        watch:{
            visible:{
              handler(val){
                  this.show=val
                  if(val){
                      this.init()
                  }
              },
              immediate:true,
            }
        },
        data(){
            return {
                detail:[
                    {type:1,},
                    {type:2,},
                    {type:3,},
                    {type:4,},
                    {type:5,},
                    {type:6,},
                ],
                show:this.visible,
                isEdit:false,
            }
        },
        methods:{
            //奖励设置
            async init(){
                this.isEdit=false
                this.detail=[
                    {type:1,},
                    {type:2,},
                    {type:3,},
                    {type:4,},
                    {type:5,},
                    {type:6,},
                ]
                let res=await award_view({productId:this.productId,skuId:this.skuId})
                if(res&&res.length){
                    this.detail=res
                    this.isEdit=true
                }
                this.detail.productId=this.productId
                this.detail.skuId=this.skuId
            },
            awardSubmit(){
                if(this.detail.productId&&this.detail.skuId){
                    console.log(this.detail)
                    let params={bonusJson:JSON.stringify(this.detail),productId:this.productId,skuId:this.skuId}
                    if(this.isEdit){
                        award_update(params,{successMsg:'保存成功！'})
                    }
                    else{
                        award_save(params,{successMsg:'保存成功！'})
                    }
                    this.show=false
                    this.$emit('update:visible',this.show)
                }
            },
            cancel(){
                this.show=false
                this.$emit('update:visible',this.show)
            }
        }
    }
</script>
<style lang="scss" scoped>
 section{
     padding-left:100px;
 }
.left{
    position:relative;
    margin-top:145px;
    color:#09c;
    .line{
        width:100px;
        height:250px;
        border:2px solid;
        border-right:none;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        position:relative;
        span{
            position:absolute;
            left:-40px;
            top:120px;
        }
        &.one{
            border-top:none;
        }
    }
    .fa-chevron-right.one{
        position:absolute;
        right:-3px;
        top:243px;
        font-size:14px;
    }
    .fa-chevron-right.two{
        position:absolute;
        right:-3px;
        top:493px;
        font-size:14px;
    }
}

@mixin fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.middle{
    width:100px;
    position:relative;
    height: 800px;
    .mod{
        width:100px;
        height:50px;
        line-height: 50px;
        border:1px solid;
        text-align:center;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .line{
        height:70px;
        width:2px;
        border-left:2px solid;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        position:relative;
        left:48%;
        span{
            position:absolute;
            left:5px;
            top:25px;
        }
        @include fa;
        color:#09c;
        &.up:before{
            content:"\f106";
            top:-8px;
            left: -8px;
            font-size:21px;
            position:absolute;
        }
        &.down:after{
            content:'\f107';
            bottom: -8px;
            left: -8px;
            font-size:21px;
            position:absolute;
        }

    }
}
.right{
    margin-top:110px;
    .con{
        position:relative;
        width:500px;
        height:123px;
        .mod{
            width:250px;
            height:80px;
            padding-top:20px;
            border:1px solid;
            text-align: center;
            margin-bottom:43px;
            position:absolute;
            margin-left:100px;
        }
        .line{
            position:absolute;
            top: 43px;
            width: 100px;
            height:2px;
            border-top:2px solid;
            @include fa;
            color:#09c;
            &:before{
                content: "\F053";
                top: -7px;
                left: -3px;
                font-size: 14px;
                position: absolute;
            }
        }
    }
}

</style>
<style lang="scss">
    .award-dialog{
        min-width:1000px;
        .el-input-number{
            width:100px;
        }
    }
</style>
