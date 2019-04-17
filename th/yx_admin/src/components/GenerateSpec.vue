<template>
    <section class="spec-table">
        <div v-show="isEdit">
            <!--规格表-->
            <base-table :columns="specTableColumns" :list="specList"  @deleteSpecLine="deleteSpecLine" :span-method="objectSpanMethod" border v-if="specList.length">
                <template slot-scope="{scope}" slot='fileId'>
                    <ImgUpload :url.sync="scope.row.fileUrl"  :id.sync="scope.row.fileId" />
                    <!--<img :src="scope.row.fileId" alt="" class="spec-img">-->
                </template>
                <template slot-scope="{scope}" slot='supplyPrice'>
                    <div class="req">
                        <el-input-number v-model="scope.row.supplyPrice" :precision="1" :step="0.1" controls-position="right" ></el-input-number>
                        <!--<el-input type="text" v-model="scope.row.supplyPrice"/>-->
                    </div>
                </template>
                <template slot-scope="{scope}" slot='price'>
                    <div class="req">
                        <el-input-number v-model="scope.row.price" :precision="1" :step="0.1" controls-position="right"></el-input-number>
                    </div>
                </template>
                <template slot-scope="{scope}" slot='retailPrice'>
                    <div class="req">
                        <el-input-number v-model="scope.row.retailPrice" :precision="1" :step="0.1" controls-position="right"></el-input-number>
                    </div>
                </template>
                <template slot-scope="{scope}" slot='quantity'>
                    <div class="req">
                        <el-input-number v-model="scope.row.quantity"  controls-position="right"></el-input-number>
                    </div>
                </template>
                <template slot-scope="{scope}" slot='standardSn'>
                    <el-input type="text" v-model="scope.row.standardSn"/>
                </template>
            </base-table>
            <!--批量操作行-->
            <base-table :columns="batchTableColumns" :list="batchList" :show-header="false" v-if="specList.length">
                <template slot-scope="{scope}" slot='supplyPrice'>
                    <el-input type="text" v-model="scope.row.supplyPrice" />
                </template>
                <template slot-scope="{scope}" slot='price'>
                    <el-input type="text" v-model="scope.row.price" />
                </template>
                <template slot-scope="{scope}" slot='retailPrice'>
                    <el-input type="text" v-model="scope.row.retailPrice" />
                </template>
                <template slot-scope="{scope}" slot='quantity'>
                    <el-input type="text" v-model="scope.row.quantity" />
                </template>
                <template slot-scope="{scope}" slot='standardSn'>
                    <el-input type="text" v-model="scope.row.standardSn"/>
                </template>
            </base-table>
        </div>
        <div v-show="!isEdit">
            <base-table :columns="specTableColumns" :list="specList"  @deleteSpecLine="deleteSpecLine" :span-method="objectSpanMethod" border v-if="specList.length">
                <template slot-scope="{scope}" slot='fileId'>
                    <img :src="scope.row.fileUrl" alt="" class="spec-img" v-if="scope.row.fileUrl">
                    <i class="fa fa-picture-o fl" aria-hidden="true"  v-else title="无图片"></i>
                </template>
                <template slot-scope="{scope}" slot='supplyPrice'>
                    <span>{{scope.row.supplyPrice}}</span>
                </template>
                <template slot-scope="{scope}" slot='price'>
                    <span>{{scope.row.price}}</span>
                </template>
                <template slot-scope="{scope}" slot='retailPrice'>
                    <span>{{scope.row.retailPrice}}</span>
                </template>
                <template slot-scope="{scope}" slot='quantity'>
                    <span>{{scope.row.quantity}}</span>
                </template>
                <template slot-scope="{scope}" slot='standardSn'>
                    <span>{{scope.row.standardSn}}</span>
                </template>
            </base-table>
        </div>
        <p  v-if="!specList||!specList.length" >无数据 <span style="color:#f56c6c">（请先添加商品型号，添加规格后点击【生成商品规格】按钮）</span></p>
    </section>

</template>
<script>
    import ImgUpload from '@/components/ImgUpload'
    export default {
        props:{
            isNeedInit:{//是否是父组件传的specList，是的话就不重新生成sepecList
                type:Boolean,
                default:false,
            },
            isEdit:{
                type:Boolean,
                default:true,
            },
            choosedSpec:{//[{key:'颜色',value:['红']}],//已经选择的规格数据
                type:Array,
                default(){
                    return []
                }
            },
            specListRes:{
                type:Array,
                default(){
                    return []
                }
            },
        },
        components:{
            ImgUpload,
        },
        data(){
            return {
                spec:{},//{'颜色':['红',"绿"],'数量':['四袋装'],'尺寸':['L','M','S']},
                specList:[],
                specKeys:[],//['颜色','数量']
                specTableColumns:[],//表列头
                batchTableColumns:[],//批量的表头
                inputTableColumns:[ //固定输入列
                    { key:'fileId',title: '图片',slot:'fileId'},
                    { key:'fileUrl',title: '图片',hidden:true},
                    { key:'supplyPrice',title: '成本价',slot:'supplyPrice',width:'170px'},
                    { key:'price',title: '售价',slot:'price',width:'170px'},
                    { key:'retailPrice',title: '市场价',slot:'retailPrice',width:'170px'},
                    { key:'quantity',title: '库存',slot:'quantity',width:'170px'},
                    { key:'standardSn',title: '规格码',slot:'standardSn'},],
                batch:{
                    supplyPrice:null,
                    price:null,
                    retailPrice:null,
                    quantity:null,
                    standardSn:'',
                },
                batchList:[],
                isInit:this.isNeedInit,
            }
        },
        watch:{
            "batch.supplyPrice":{
                handler(val){
                    this.specList.forEach(item=>{
                        item.supplyPrice=val
                    })
                },
            },
            "batch.price":{
                handler(val){
                    this.specList.forEach(item => {
                        item.price = val
                    })
                },
            },
            "batch.retailPrice":{
                handler(val) {
                    this.specList.forEach(item => {
                        item.retailPrice = val
                    })
                },
            },
            "batch.quantity":{
                handler(val){
                    this.specList.forEach(item => {
                        item.quantity = val
                    })
                },
            },
            "batch.standardSn":{
                handler(val){
                    this.specList.forEach(item=>{
                        item.standardSn=val
                    })
                },
            },
            choosedSpec:{
                handler(){
                    this.generateSpec()
                },
                deep:true,
            },
            specListRes:{
                handler(val){
                    this.specList=val
                    //this.generateSpec(true)
                },
                deep:true
            },
            specList:{
                handler(val){
                    this.$emit('update:specListRes',  val)
                },
                deep:true
            },
            isEdit(val){
                if(this.specTableColumns&&this.specTableColumns.length){
                    if(val){
                        this.$set(this.specTableColumns[this.specTableColumns.length-1],"operates",[
                            {name:'删除',emitKey:'deleteSpecLine'}
                        ])
                    }
                    else{
                        this.$set(this.specTableColumns[this.specTableColumns.length-1],"operates",[
                            {name:'',emitKey:''}
                        ])
                    }
                }
            },
        },
        mounted(){
            // this.generateSpec()
        },
        methods:{
            //生成规格表,
            generateSpec(){
                if(!this.choosedSpec.length){return}
                this.spec={}
                this.choosedSpec.forEach(item=>{
                    if(item.value&&item.value.length){
                        this.spec[item.key]=item.value
                    }
                })
                this.specKeys=Object.keys(this.spec)
                //生成table头
                this.specTableColumns=[]
                this.batchTableColumns=[]
                this.$nextTick(()=>{
                    this.specKeys.forEach(key=>{
                        this.specTableColumns.push({key,title:key})
                        this.batchTableColumns.push({key,title:key})
                    })
                    //生成规格表列头
                    this.specTableColumns=this.specTableColumns.concat(this.inputTableColumns)
                    if(this.isEdit){
                        this.specTableColumns.push({
                            title: '操作', type: 'operate',
                            operates: [
                                {name:'删除',emitKey:'deleteSpecLine'}
                            ]
                        })
                    }else{
                        this.specTableColumns.push({
                            title: '操作', type: 'operate',
                            operates: [
                                {name:'',emitKey:''}
                            ]
                        })
                    }

                    //生成规格表,//是否是父组件传的specList，是的话就不重新生成sepecList
                    if(!this.isInit){
                        let newList=this.cartesianProductOf(...Object.values(this.spec)).map((item)=>{
                            let obj={}
                            this.specTableColumns.forEach(item=>{
                                if(item.key){
                                    obj[item.key]=undefined
                                }
                            })
                            this.specKeys.forEach((key,i)=>{
                                obj[key]=item[i]
                            })
                            return obj
                        })

                        //判断是否只是新增了一个属性的值，如果是，则依次重新赋值之前有的值，
                        let isEqual=true
                        let newKeys=newList.length?Object.keys(newList[0]):[]
                        let oldKeys=this.specList.length?Object.keys(this.specList[0]):[]
                        if(newKeys.length===oldKeys.length){
                            for(let key of newKeys){
                                if(oldKeys.indexOf(key)===-1){
                                    isEqual=false
                                    break;
                                }
                            }
                        }
                        else{
                            isEqual=false
                        }
                        if(isEqual){
                            this.specList.forEach(item=>{
                                let newItem = newList.find(item1=>{
                                    return this.specKeys.every((key,i)=>{
                                        return item[key]===item1[key]
                                    })
                                })
                                if(newItem){
                                    Object.assign(newItem,item)
                                }
                            })
                        }
                        this.specList= newList
                        this.$emit('update:specListRes',  this.specList)
                    }
                    this.isInit=false //重置

                    //生成批量操作列头
                    this.batchTableColumns=this.batchTableColumns.concat(this.inputTableColumns,
                        [{
                            title: '操作', type: 'operate',
                        }]
                    )
                    this.batch[this.batchTableColumns[0].key]='批量操作'
                    this.batchList=[this.batch]

                    this.$emit('update:choosedSpec',  this.choosedSpec)
                })
            },
            //删除单行
            deleteSpecLine(row){
                let index=this.specList.indexOf(row)
                if(index>-1){
                    this.specList.splice(index,1)
                }
                this.$emit('update:specListRes',  this.specList)
            },
            //笛卡儿积
            cartesianProductOf() {
                return Array.prototype.reduce.call(arguments,function(a, b) {
                    let ret = [];
                    a.forEach(function(a) {
                        b.forEach(function(b) {
                            ret.push(a.concat([b]));
                        });
                    });
                    return ret;
                }, [[]]);
            },
            //合并属性行单元格
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {//如果删除某一行之后合并又得重新设！！所以暂时注释
                // let key=column.label
                // let keyIndex=this.specKeys.indexOf(key)
                // if(keyIndex==-1||(keyIndex===this.specKeys.length-1)){//最后一个属性不用合并
                //     return
                // }
                // let rowspan=this.specList.length/this.spec[key].length
                // if(keyIndex==1){//第二列的合并单元格的数量为总数除以前两列的值的数量
                //     rowspan=rowspan/(this.spec[this.specKeys[0]].length)
                // }
                // if (columnIndex === keyIndex) {
                //     if (rowIndex % rowspan === 0) {
                //         return {
                //             rowspan: rowspan,
                //             colspan: 1
                //         };
                //     }
                //     else{
                //         return {
                //             rowspan: 0,
                //             colspan: 0
                //         };
                //     }
                // }
            },
        }
    }
</script>
<style lang="scss" scoped>
    .spec-img{
        width:50px;
        height: 50px;
    }

</style>
<style lang="scss">
    .spec-table{
        .req{
            &:before{
                content:'*';
                color:#f56c6c;
                display:inline-block;
            }
        }
        .el-input-number{
            width:120px;
            margin:0 10px;
        }
    }
</style>
