<template>
    <section>
        <div v-show="isEdit">
            <el-button @click="addChoosedSpec">添加商品型号</el-button>
            <div  v-for="(item,i) in choosedSpec" :key="i" class="choosed-spec">
                <div class="clearfix">
                    <el-select  v-model="item.key" placeholder="请选择" @change="specSelectChange($event,i)"  class="fl">
                        <el-option
                                v-for="item in specTemplateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <a href="javascript:void(0)" @click="deleteChoosedSpec(i)"  class="fr">删除</a>
                </div>
                <div>
                    <my-tag :options.sync="item.value" :showBtn="false"></my-tag>
                    <a href="javascript:void(0)" @click="chooseSpecDetail(i)" >添加规格</a>
                </div>
            </div>
            <el-dialog
                    title="添加型号"
                    :visible.sync="chooseSpecDialogVisible"
                    width="30%">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllSpecChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedSpecVals" @change="handleCheckedSpecChange">
                    <el-checkbox v-for="spec in currentSpecList" :label="spec" :key="spec">{{spec}}</el-checkbox>
                </el-checkbox-group>
                <div>
                    <my-tag :options="tempAddSpecVal" :btnTxt="'添加型号'" :addCb="addSku" :removeCb="removeSku"></my-tag>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="chooseSpecDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editChoosedSpec()">确 定</el-button>
            </span>
            </el-dialog>
            <el-button @click="generateSpec" v-if="choosedSpec.length&&choosedSpec[0].value.length">生成商品规格</el-button>
        </div>
        <div v-show="!isEdit">
            <div  v-for="(item,i) in choosedSpec" :key="i" class="choosed-spec">
                <span>{{item.key}}</span>
                <my-tag :options="item.value" :showBtn="false" :closable="false"></my-tag>
            </div>
        </div>
    </section>
</template>
<script>
    import {list as list_spec,add as add_spec,del as del_spec} from '@/service/module/spec'
    import Tag from '@/components/Tag'
    export default{
        props:{
            isEdit:{
                type:Boolean,
                default:false,
            },
            choosedSpecProp:{//[{key:'颜色',value:['红','黄']},{key:'数量',value:['四袋装','六袋装']}]
                type:Array,
                default(){
                    return []
                }
            },
        },
        components:{
          "myTag":Tag
        },
        created(){
            this.getSpecTemplateData()
        },
        data(){
            return {
                specTemplateList: [],
                //     [{//规格下拉数据源
                //     value: '颜色',
                //     label: '颜色',
                //     list:['红',"绿","黄"],
                // }, {
                //     value: '数量',
                //     label: '数量',
                //     list:['四袋装',"六袋装"],
                // }, {
                //     value: '尺寸',
                //     label: '尺寸',
                //     list:['L','M','S'],
                // }],
                chooseSpecDialogVisible:false,
                checkAll: false,
                isIndeterminate: true,
                editSpecIndex:0,//当前修改的规格组序号
                currentSpecItem:{},//当前修改的规格模板
                currentSpecList:[],//['红','绿']当前弹窗中所有规格值
                checkedSpecVals:[],//['红','绿']当前弹窗中选择的规格值
                tempAddSpecVal:[],//['红','绿']弹框中自定义的规格数据
                choosedSpec:this.choosedSpecProp,//[{key:'颜色',value:['红']}]//
                tempAddSpecValIds:[],
            }
        },
        watch:{
            choosedSpec: {
                  handler(val){
                      this.$emit('update:choosedSpecProp',val)
                  },
                  deep:true
            },
            choosedSpecProp:{
                handler(val){
                   this.choosedSpec=val
                },
                deep:true
            }
        },
        methods:{
            //获取所有规格数据
            async getSpecTemplateData(){
                let {records} = await  list_spec({current:1,size:100})
                this.specTemplateList=records.map(item=>{
                    return {
                        id:item.id,
                        value:item.name,
                        label:item.name,
                        list:item.value.split(',')
                    }
                })
            },
            //规格下拉变化
            specSelectChange(val,index){
                this.choosedSpec[index]["key"]=val
                this.choosedSpec[index].value=[]
            },
            addChoosedSpec(){
                if(this.choosedSpec.length<3){
                    this.choosedSpec.push({key:'',value:[]})
                }
            },
            deleteChoosedSpec(i){
                this.choosedSpec.splice(i,1)
            },
            //弹框选择规格值
            chooseSpecDetail(i){
                //检查当前规格是否已经选择
                let item=this.choosedSpec.find(item=>item.key===this.choosedSpec[i].key)
                if(item){
                    let hasIndex=this.choosedSpec.indexOf(item)
                    if(hasIndex!=i){
                        this.$message.error('已存在相同的规格，请选择其他规格')
                        return
                    }
                }
                this.tempAddSpecVal=[]//重置自定义的规格值
                this.tempAddSpecValIds=[]//重置自定义的规格值Id
                this.chooseSpecDialogVisible=true
                this.editSpecIndex=i
                this.checkedSpecVals=this.choosedSpec[i].value
                let currentItem=this.specTemplateList.find(item=>item.value===this.choosedSpec[i].key)
                if(currentItem){
                    this.currentSpecList=currentItem.list
                    this.currentSpecItem=currentItem
                }
                //复选框样式重置
                let checkedLength=this.choosedSpec[i].value.length
                this.checkAll = checkedLength === this.currentSpecList.length;
                this.isIndeterminate = checkedLength > 0 && checkedLength < this.currentSpecList.length;
            },
            //全选
            handleCheckAllSpecChange(val) {
                this.checkedSpecVals = val ? this.currentSpecList : [];
                this.isIndeterminate = false;
            },
            //选择状态变化
            handleCheckedSpecChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.currentSpecList.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.currentSpecList.length;
            },
            //提交弹框的规格值
            async editChoosedSpec(){
                let current=this.choosedSpec[this.editSpecIndex]
                current.value=this.checkedSpecVals
                this.chooseSpecDialogVisible=false
                if(this.tempAddSpecVal.length>0){
                    current.value=current.value.concat(this.tempAddSpecVal)
                    //重新获取specTemplateList
                    this.getSpecTemplateData()
                }
            },
            //生成规格表
            generateSpec(){
                this.$emit('generateSpec')
                //this.generateData=JSON.parse(JSON.stringify(this.choosedSpec))
            },
            async addSku(val){
                return  new Promise((reslove,rej)=>{
                    if(this.currentSpecItem) {
                        add_spec({parentId: this.currentSpecItem.id, name: val})
                            .then((res) => {
                                this.tempAddSpecValIds.push({id: res, name: val})
                            })
                            .catch(e => reslove(e))
                    }
                })
            },
            async removeSku(val){
                let item=this.tempAddSpecValIds.find(item=>item.name===val)
                if(item){
                    await del_spec({id:item.id})//健康标签
                    this.tempAddSpecValIds.splice(this.tempAddSpecValIds.indexOf(item),1)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .choosed-spec{
        xbackground-color:rgba(0,0,0,0.1);
        margin: 10px 0;
        border:1px solid $borderColor;
        padding:5px;
    }
</style>
