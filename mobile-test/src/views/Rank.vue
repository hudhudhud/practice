<template>
     <Page>
        <h1>{{ msg }}</h1>
        <div class="block">
            <el-date-picker
              v-model="value1"
              type="datetime"
              placeholder="选择日期时间"
              align="left"
              :picker-options="pickerOptions1"
              @change="dateChange">
            </el-date-picker>
        </div>
        <div class="block">
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="left">
            </el-date-picker>
        </div>
        <input type="button" name="" value="查询" @click="search">
     </Page>
</template>
<script>
import Page from '@/components/Page.vue';
import {DatePicker} from 'element-ui';
import moment from 'moment'
export default {
    components: {
        Page,
        elDatePicker:DatePicker,
    },
    data: function() {
        return {
            msg: '主播排行',
            pickerOptions1: {
              shortcuts: [{
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick',new Date());
                }
              }, {
                text: '昨天',
                onClick(picker) {
                  picker.$emit('pick',moment().subtract(1, 'day'));
                }
              }, {
                text: '一周前',
                onClick(picker) {
                  // const date = new Date();
                  // date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick',moment().subtract(7, 'day'));
                }
              }]
            },
            pickerOptions2: {
              shortcuts: [{
                text: '最近一周',
                 onClick(picker) {
                  picker.$emit('pick', [moment().subtract(7, 'day'), moment()]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  picker.$emit('pick', [moment().subtract(30, 'day'),  moment()]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  picker.$emit('pick', [moment().subtract(90, 'day'),  moment()]);
                }
              }]
            },
            value1: '',
            value2:''
        }
    },
    methods:{
        dateChange(v){
            v=moment(v).format('YYYY-MM-DD HH:mm:ss')
            console.log(v)
        },
        search(){
            var v1=moment(this.value1).format('YYYY-MM-DD HH:mm:ss')

            //value2是数组
            var v2=moment(this.value2[0]).format('YYYY-MM-DD HH:mm:ss')
            var v3=moment(this.value2[1]).format('YYYY-MM-DD HH:mm:ss')
            console.log(v1,v2,v3)
        }
    }

}
</script>
<style scoped lang="less">
</style>