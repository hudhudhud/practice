<template>
    <div class="lunchBill">
        <formInput :item='{label:"消费日",key:"consumeDay"}'  :model.sync="item.consumeDay"/>
        <formInput :item='{label:"单价",key:"price",type:"decimal"}'  :model.sync="item.price"/>
        <div class="form-line">
            <label class="form-label">服务时间</label>
            <el-date-picker
                v-model="timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <formSelect  :option="{label:'年级',key:'classId',list:grades}" :kv="{k:'name',v:'id'}" :model.sync="item.classId"/>
        <formTextarea :item='{label:"午餐内容",key:"lunchContent"}' :model.sync="item.lunchContent"/>
    </div>
</template>

<script>
import cfg from '../config/config'
import services from '../services'
import formInput from './formInput.vue'
import formSelect from './formSelect.vue'
import formTextarea from './formTextarea.vue'
export default {
    components: {
        formInput,
        formSelect,
        formTextarea,
    },
    props:{
        item:{
            type:Object,
            default(){
                return {
                    consumeDay:"",
                    price:"",
                    startTime:"",
                    endTime:"",
                    classId:"",
                    lunchContent:""
                }
            }
        },
    },
    created(){
        services.grade_list().then((res) => {
            this.grades = res.data.data.list;
        })
    },
    data(){
        return {
            grades:[],
            timeRange:'',
            model:this.item?this.item:{}
        }
    },
    watch:{
        item:{
            handler(val){
                this.model=val
                this.timeRange=[new Date(this.model.startTime),new Date(this.model.endTime)]
            },
            deep:true
        },
        model:{
            handler(val){
                this.$emit('update:item', val)
            },
            deep:true     
        },
        timeRange:{
            handler(val){
                if(val&&val.length){
                    this.model.startTime=Date.parse(val[0])
                    this.model.endTime=Date.parse(val[1])
                }
                else{
                    this.model.startTime=""
                    this.model.endTime=""
                }
            },
            deep:true
        }
    },
    methods:{

    }
}
</script>

<style>

</style>
