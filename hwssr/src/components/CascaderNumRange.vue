<template>
    <section class="cascader-num-range" >
        <div v-if="show" class="hidePanel" @click="show=false;focusOne=false;focusTwo=false;if(!minRes&&!maxRes)activePar=-1"></div>
        <div :style="show?'z-index:9999':''"> 
            <div class="show-btn" @click="show=!show">
                <input type="button" :value="valueIn"  :class="{active:show,'show-input':true}"/>
                <i :class="{'is-reverse':show,'el-select__caret':true,'el-input__icon':true,'el-icon-arrow-down':true}"></i>
                <!--<i class="fa fa-chevron-circle-down" aria-hidden="true" v-if="!show"></i>-->
                <!--<i class="fa fa-chevron-circle-up" aria-hidden="true" v-else></i>-->
            </div>
            <div :class="{show:show,'drop-down':true}"> 
                <ul :class="{active:activePar>0,one:true}" v-if="show">
                    <li :class="{active:activePar==i,item:true,clearfix:true}" v-for="(item,i) in bindOptions" :value="item.value" :key="i"  @click="activePar=i;activeChild=-1;parClick(i)">
                        <span class="fl">{{item.label}}</span> 
                        <span class="fr" v-if="item.children&&item.children.length>0">
                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </span>
                    </li>
                </ul>
                <ul v-if="show&&activePar!=-1&&bindOptions[activePar].children" class="two">
                    <li v-for='(item,i) in bindOptions[activePar].children' :key="i" :class="{active:activeChild==i,item:true}"  @click="search(i);activeChild=i">{{item.label}}</li>
                    <li :class="{active:focusOne||focusTwo,customer:true}">
                        <input type="text" placeholder="min" @keyup.enter="enterSearch" v-model="min"  @input="min=min.replace(/[^0-9-]+/,'')" @click.stop="focusOne=true">-<input type="text" placeholder="max" @keyup.enter="enterSearch" v-model="max" @input="max=max.replace(/[^0-9-]+/,'')" @click.stop="focusTwo=true">
                        <p class="btns">
                            <input type="button" value="重置" v-show="focusOne||focusTwo" @click="min='';max=''" class="reset"/>
                            <input type="button" value="确定" v-show="focusOne||focusTwo" @click="enterSearch" />
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    props:{
        value:String,
        options:Array,
    },
    data:function(){
        return {
            show:false,
            activePar:-1,
            activeChild:-1,
            valueIn:this.value?this.value:"请选择",
            min:"",
            max:"",
            minRes:"",
            maxRes:"",
            focusOne: false,
            focusTwo: false,
        }
    },
    computed:{
        bindOptions:function(){
            return this.options
        }
    },
    watch:{
        value(newValue){
            this.valueIn=newValue?newValue:"请选择"
        }
    },
    methods:{
        parClick(){
            //没有范围的直接返回id
            var item=this.bindOptions[this.activePar]
            if(!item.children||!item.children.length){
                this.valueIn=item.label
                this.show=false
                this.focusOne=false
                this.focusTwo=false

                var cbValue=item.value
                if(item.label=="全部"){
                    cbValue=""
                    //this.activePar=0
                }
                this.$emit('update:value', cbValue?cbValue:"全部")
                this.$emit("cb",{shop:cbValue})
            }
        },
        enterSearch(){
            this.activeChild=-1
            this.minRes=this.min
            this.maxRes=this.max
            this.search()
        },
        search(i){
            let item=this.bindOptions[this.activePar]
            let shopid=item.value
            if(typeof i == 'number'&&i>-1){
                let children=this.bindOptions[this.activePar].children[i]
                this.minRes=children.min
                this.maxRes=children.max
                this.valueIn=item.label+":"+children.label
                this.min=""
                this.max=""
            }
            else{
                 this.valueIn=item.label+":"+this.minRes+'-'+this.maxRes
            }

            this.show=false
            this.focusOne=false
            this.focusTwo=false
            this.$emit('update:value', this.valueIn)
            this.$emit("cb",{shop:shopid,min:this.minRes,max:this.maxRes,value:this.valueIn})
        }
    }
}
</script>
<style lang="less" scoped>
.cascader-num-range{
     display: inline-block;
     width:100px;
     height:40px;
     box-sizing: border-box;
      position:relative;
     .show-btn{
        position:relative;
        cursor: pointer;
        .show-input{
            width:90px;
            border:none;
            cursor: pointer;
            background-color: transparent;
            vertical-align: bottom;
            padding:0;
            color: #c0c4cc;
            &.active{
                position:relative;
                z-index: 9999
            }
        }
        i{
            cursor: pointer;
            position:absolute;
            top:-5px;
            /*7px的为有大箭头的样式,然后放开下面的宽高*/
            /*top:7px;*/
            transition: all .2s linear;
            color: #c0c4cc;
            &.is-reverse{
                transform: rotate(-180deg);
            }
            &.el-input__icon{
                height: 40px;
                /*width:16px;*/
            }
        }
     }
    .drop-down{
        height: 0;
        opacity: 0;
        transition: all .1s linear;
        &.show{
            opacity: 1;
            height: 200px;
        }
        position:absolute;
        top:40px;
        left:0;
        box-sizing: border-box;
        text-align:center;
        border: 1px solid #e4e7ed;
        border-radius: 2px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        z-index: 99999;
        ul{
            overflow-y: scroll;
            width:150px;
            height: 200px;
            position:absolute;
            background-color: #fff;
        }
        ul.one{
            left:-75px;
            top:0;
            li{
                position:relative;
                i{
                    font-size: 14px;
                    color: #bfcbd9;
                    position: absolute;
                    right: 15px;
                }
            }
            &.active{
                left:-150px;
            }
        }
        ul.two{
            left:0;
            top:0;
            .customer{
                width:110px;
                margin:auto;
                padding:5px;
                box-sizing: border-box;
                text-align: center;
                input[type=text]{
                    width:44px;
                    height: 24px;
                    border:1px solid #e2e2e2;
                    border-radius:4px;
                    text-align: center;
                }
                .btns{
                    margin-top:5px;
                }
                &.active {
                    box-shadow: 1px 1px 6px #aaa;
                    background-color: #fff;
                }
                input[type=button] {
                    background-color: @mainColor;
                    color: #fff;
                    border: none;
                    height: 24px;
                    line-height: 1.6;
                    width: 40px;
                    border-radius: 4px;
                    &.reset{
                        margin-right:5px;
                        color:@mainColor;
                        border:1px solid @mainColor;
                        background-color: #fff;
                    }
                }
            }
        }
        li{
            padding:10px;
            line-height: 15px;
            font-size: 14px;
            box-sizing: border-box;
            &.item{
                cursor: pointer;
                xtransition: background-color .1s linear; 
                &:hover{
                    color:#fff;
                    background-color: @mainColor;
                }
                &.active{
                    color:#fff;
                    background-color: @mainColor;
                }
            }
        }
    }
}
</style>
