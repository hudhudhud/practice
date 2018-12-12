<template>
    <div class="CascaderCatg">
        	<el-cascader
                expand-trigger="hover"
                :placeholder="placeholder"
				v-model="selectCatgIn"
				:options="bindCatgList"
				:props="props"
				:filterable="true"
				:clearable="true"
				:debounce="500"
				:before-filter="inputCatgChange"
				@active-item-change="selectedCatgChange"
				@change="change"
                @focus="focus"
                @blur="blur"
				popper-class="searchBar-cas"
        		separator=","
                :selectAllLevels="true"
                :filterInLevel="true"
		   ></el-cascader>
    </div>
</template>
<script>
import {
  Cascader
} from "element-ui";
import myaxios from "../assets/js/myaxios";
export default {
    props:{
        model:Array,
        placeholder:{
            type:String,
            default:"请选择类目"
        },
    },
    components: {
        elCascader:Cascader//ElCascader
    },
    data(){
        return{
            catgList:[],
            selectCatgIn:this.model,
            bindCatgList:[],
            lmExpansions: {},
            props: {
                value: "id",
                label: "label",
                children: "children",
                disableSelect:"disableSelect"
            },
            dataChange:false, //用于select change之后会触发focus事件而导致重新绑定对象的标记，为true则不需要重新绑定
        }
    },
    watch:{
        // 深度 watcher
        model:{
            handler(newValue,oldValue){
                if(!this.$route.query.fromHead)return
                if(newValue&&newValue.length){
                    this.selectCatgIn=newValue.map(item=>{return item-''})
                    if(!this.isEqualArray(newValue,oldValue)){
                        console.log("reload lm")
                        this.init(true)
                    }
                }
            },
            deep:true,
        }
    },
    mounted() {
      this.init(true)
    },
    methods:{
        async init(load){
            var self=this
            let startIndex=-1
            if(self.selectCatgIn&&self.selectCatgIn.length){
                for(let i=0;i<self.selectCatgIn.length;i++){
                    let id=self.selectCatgIn[i]
                    if(self.lmExpansions&&self.lmExpansions[id]){
                        startIndex++
                    }else{
                        break
                    }
                }
            }
            
            //if(self.catgList.length==0){
                for(let i=startIndex;i<(self.selectCatgIn?self.selectCatgIn.length:0);i++){
                    let id=0
                    if(i>-1){
                        id=self.selectCatgIn[i]
                    }
                    if(i==4)return//最后一级不用获取子集
                    let option=(i==-1?{}:{isId:0,"Condition":id,"level":i})
                    await myaxios.post("/web/quertTypeByCondition",option).then(res=>{
                        var res=res.data.data.List
                        if(res&&res.length>0){
                            res.forEach(item => {
                                if(item.childNum){
                                    //Vue 不允许在已经创建的实例上动态添加新的根级响应式属性 (root-level reactive property)。然而它可以使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上：
                                    self.$set(item,'children',[])
                                    //item.children=[]
                                }
                                if(i==-1)item.disableSelect=true
                                self.lmExpansions[item.id] = item;
                            })
                            if(i==-1){
                                self.catgList=res
                                self.bindCatgList=res
                            }
                            else if(self.lmExpansions[id]&&res){
                                self.lmExpansions[id].children = res;
                                //self.lmExpansions[id].children.unshift({id:'-'+id,label:"选择"+self.lmExpansions[id].label,childNum:0,level:self.lmExpansions[id].level})	
                            }
                        }
                    })
                }
            //}
            if(typeof load == 'boolean' && load)this.change()
        },
        focus(e){
            let val=e.target.getAttribute("value")
            if(!this.selectCatgIn
                ||(!val&&!this.dataChange) //未选择任何类目时
                ||(this.selectCatgIn&&this.selectCatgIn.length==0)
              ){
                if(this.catgList.length>0){
                   this.bindCatgList=this.catgList
                }
                else{
                    this.init()
                }
            }
        },
        blur(){
            this.dataChange=false
        },
        //输入变化时触发的事件
        inputCatgChange(value) {
            if (!value) {
                this.bindCatgList = this.catgList;
            }
            else {
                //获取模糊查询数据
                myaxios.post("/web/quertTypeByCondition",{isId:1,"Condition":value}).then(res=>{
                    var res=res.data.data.List
                    this.bindCatgList=res.map(item => {
                        if(!this.lmExpansions[item.id]){
							this.lmExpansions[item.id]={}
							this.lmExpansions[item.id].level=item.label.length
						}
                        item.label = item.label.join(" , ");
                        return item;
                    });
                })
            }
            return false
        },
        //当父级选项变化时触发的事件
        selectedCatgChange(valList) {
            if (valList==0) {
                this.bindCatgList = this.catgList
                return
            }
            let id = valList[valList.length - 1];
            var len = valList.length;

            if (!this.lmExpansions[id].children || this.lmExpansions[id].children.length == 0) {//已经有children就不需要再发请求了
                    myaxios.post("/web/quertTypeByCondition",{isId:0,"Condition":id,"level":this.lmExpansions[id].level}).then(res=>{
                        var res=res.data.data.List
                        this.lmExpansions[id].children = res;
                        //this.lmExpansions[id].children.unshift({id:'-'+id,label:"选择"+this.lmExpansions[id].label,childNum:0,level:this.lmExpansions[id].level})
                        //this.$set(this.lmExpansions[id],"children",res)
                        res.forEach(item => {
                            if(item.childNum){
                                //Vue 不允许在已经创建的实例上动态添加新的根级响应式属性 (root-level reactive property)。然而它可以使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上：
                                this.$set(item,'children',[])
                                //item.children=[]
                            }
                            this.lmExpansions[item.id] = item;
                        })
                    })
            }
        },
        change(){
            var id='',label='';
            var ls=this.selectCatgIn
            if(ls&&ls.length>0){
                this.dataChange=true
                if(Array.isArray(ls[0])){
                    ls=ls[0]
                }
				if((ls[ls.length-1]+'').indexOf('-')>-1){
					ls.pop()
                }
                if(ls.length>0){
                    id=ls[ls.length-1]
                    if(this.lmExpansions[id]){
                        label=this.lmExpansions[id].label
                    }
                    this.$emit('cb',{catgs:ls,label})
                }
            }
            else{
                this.dataChange=false
            }
        },
        isEqualArray(ary1,ary2){
            if(ary1.length!=ary2.length)return false
            ary1=ary1.map(item=>{return item-''})
            ary2=ary2.map(item=>{return item-''})
            for(let i=0;i<ary1.length;i++){
                if(ary2.indexOf(ary1[i])==-1){
                    return false
                }
            }
            for(let i=0;i<ary2.length;i++){
                if(ary1.indexOf(ary2[i])==-1){
                    return false
                }
            }
            return true
        },
    }
}
</script>
<style scoped lang="less">
// .searchBar-cas{
// 	ul:nth-child(n+3){
// 		li{
// 			&:first-child{
// 				background-color:rgba(0,0,0,0.1);
// 			}

// 		}
// 	}
// }
.CascaderCatg{
    display: inline;
}
</style>
<style lang="less">
.searchBar-cas{
    .el-cascader-menu__item.is-active{
        color:@mainColor;
    }
    .el-cascader-menu__item:focus:not(:active), .el-cascader-menu__item:hover {
        color:#fff;
        background-color:@mainColor;
    }
}
.el-cascader-menu .level-filter{
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 30px;
    line-height: 30px;
    outline: 0;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width:80%;
    margin-left:10%;
}
</style>



